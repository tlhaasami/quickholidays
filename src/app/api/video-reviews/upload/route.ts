import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";

const execPromise = util.promisify(exec);

export async function POST(req: NextRequest) {
  const tmpDir = path.join(process.cwd(), "src", "tmp");
  let inputPath = "";
  let outputPath = "";

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No video file was uploaded." },
        { status: 400 }
      );
    }

    // 1. Ensure temp directory exists
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    // 2. Save uploaded buffer to a temporary file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    inputPath = path.join(tmpDir, `${fileId}_input.mp4`);
    outputPath = path.join(tmpDir, `${fileId}_optimized.mp4`);

    fs.writeFileSync(inputPath, buffer);

    // 3. Locate FFmpeg converter utility
    let ffmpegPath = "ffmpeg"; // Fallback to global path
    const localWindowsPath = path.join(process.cwd(), "scripts", "bin", "ffmpeg.exe");

    if (process.platform === "win32" && fs.existsSync(localWindowsPath)) {
      ffmpegPath = localWindowsPath;
    } else {
      // Check if global ffmpeg works
      try {
        await execPromise("ffmpeg -version");
      } catch (err) {
        return NextResponse.json(
          {
            success: false,
            error:
              "FFmpeg converter not found on system. Please run the local 'Compress-Video.bat' utility once to download it, or install FFmpeg globally.",
          },
          { status: 500 }
        );
      }
    }

    // 4. Run FFmpeg compression (Resize to 720p, compress bitrate, convert to H.264 MP4)
    // scale=720:-2 maintains aspect ratio and ensures height is divisible by 2 for H.264
    const cmd = `"${ffmpegPath}" -y -i "${inputPath}" -vf "scale=720:-2" -c:v libx264 -crf 24 -preset fast -c:a aac -b:a 128k "${outputPath}"`;
    await execPromise(cmd);

    if (!fs.existsSync(outputPath)) {
      throw new Error("FFmpeg completed but optimized output file was not generated.");
    }

    // 5. Initialize/create public Supabase Storage bucket 'video-reviews' if not exists
    try {
      const { data: buckets } = await supabaseAdmin.storage.listBuckets();
      const bucketExists = buckets?.some((b) => b.name === "video-reviews");
      if (!bucketExists) {
        await supabaseAdmin.storage.createBucket("video-reviews", {
          public: true,
          allowedMimeTypes: ["video/mp4", "video/webm", "video/quicktime"],
        });
      }
    } catch (bucketErr) {
      console.warn("Could not check/create bucket dynamically. Continuing upload...", bucketErr);
    }

    // 6. Upload optimized video buffer to Supabase Storage
    const uploadBuffer = fs.readFileSync(outputPath);
    const remoteFileName = `${fileId}_optimized.mp4`;

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("video-reviews")
      .upload(remoteFileName, uploadBuffer, {
        contentType: "video/mp4",
        cacheControl: "31536000",
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase storage upload error:", uploadError);
      return NextResponse.json(
        {
          success: false,
          error: `Supabase Storage upload failed: ${uploadError.message}. Make sure you set your SUPABASE_SERVICE_ROLE_KEY in .env.local.`,
        },
        { status: 500 }
      );
    }

    // 7. Get public URL of the uploaded file
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("video-reviews")
      .getPublicUrl(remoteFileName);

    const publicUrl = publicUrlData?.publicUrl;

    if (!publicUrl) {
      throw new Error("Failed to retrieve public URL from Supabase Storage.");
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
    });
  } catch (err: any) {
    console.error("Upload & optimize error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error during video compression." },
      { status: 500 }
    );
  } finally {
    // 8. Clean up temp files from local disk
    try {
      if (inputPath && fs.existsSync(inputPath)) {
        fs.unlinkSync(inputPath);
      }
      if (outputPath && fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
    } catch (cleanupErr) {
      console.error("Failed clearing temporary files:", cleanupErr);
    }
  }
}
