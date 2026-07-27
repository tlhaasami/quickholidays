import os
import re
import subprocess
import imageio_ffmpeg

# ==============================================================================
# 🎛️ CONFIGURATION VARIABLES
# ==============================================================================
INPUT_FILE = r"a:\Real-World-Projects\Quick-Holidays\public\videos\bg-video.mp4"
OUTPUT_FILE = r"a:\Real-World-Projects\Quick-Holidays\public\videos\bg-video.webm"

# 1. Target File Size (in Megabytes)
# - Set to a number (e.g., 5.0) to strictly target a file size.
# - Set to None to ignore size and use the QUALITY_CRF setting instead.
TARGET_SIZE_MB = 5.0  

# 2. Quality Control (Only used if TARGET_SIZE_MB is None)
# - 18-22: Ultra High Quality | 28-32: Compressed Web Quality
QUALITY_CRF = 22

# 3. Resolution
# - "2560x1440" (2K), "1920x1080" (1080p), "1280x720" (720p)
# - Set to None to keep the original resolution.
TARGET_RESOLUTION = "2560x1440" 

# 4. Playback Speed
# - 1.0 = Normal speed | 2.0 = 2x Faster | 0.5 = Half speed (Slow motion)
SPEED_FACTOR = 1.0

# 5. Audio Control
MUTE_AUDIO = True  

# ==============================================================================
# 🛠️ HELPER FUNCTIONS
# ==============================================================================
def get_video_duration(ffmpeg_exe, file_path):
    """Extracts duration of the video in seconds using ffmpeg."""
    cmd = [ffmpeg_exe, "-i", file_path]
    # ffmpeg writes metadata to stderr, not stdout
    result = subprocess.run(cmd, capture_output=True, text=True)
    match = re.search(r"Duration: (\d{2}):(\d{2}):(\d{2}\.\d+)", result.stderr)
    
    if match:
        h, m, s = match.groups()
        return int(h) * 3600 + int(m) * 60 + float(s)
    return None

# ==============================================================================
# 🚀 CONVERSION ENGINE
# ==============================================================================
ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
cmd = [ffmpeg_exe, "-y", "-i", INPUT_FILE]

# --- 1. Audio ---
if MUTE_AUDIO:
    cmd.append("-an")

# --- 2. Video Filters (Speed & Resolution) ---
filters = []

# Speed adjustment (Changes presentation timestamps)
if SPEED_FACTOR != 1.0:
    pts_modifier = 1.0 / SPEED_FACTOR
    filters.append(f"setpts={pts_modifier}*PTS")

# Resolution adjustment (Scales and pads to maintain aspect ratio)
if TARGET_RESOLUTION:
    w, h = TARGET_RESOLUTION.split('x')
    filters.append(f"scale={w}:{h}:force_original_aspect_ratio=decrease,pad={w}:{h}:(ow-iw)/2:(oh-ih)/2")

# Apply filters if any exist
if filters:
    cmd.extend(["-vf", ",".join(filters)])

# --- 3. Encoding & File Size Control ---
cmd.extend(["-c:v", "libvpx-vp9"])

if TARGET_SIZE_MB:
    # Calculate required bitrate to hit the target MB size
    original_duration = get_video_duration(ffmpeg_exe, INPUT_FILE)
    if not original_duration:
        print("❌ Error: Could not determine video duration. Required for target size.")
        exit(1)
        
    new_duration = original_duration / SPEED_FACTOR
    
    # Bitrate formula: (Target MB * 8192 kilobits) / Duration in seconds
    # We multiply by 0.95 to leave a 5% safety margin for container overhead
    bitrate_kbps = int(((TARGET_SIZE_MB * 8192) / new_duration) * 0.95)
    
    cmd.extend(["-b:v", f"{bitrate_kbps}k", "-minrate", f"{bitrate_kbps}k", "-maxrate", f"{bitrate_kbps}k"])
    print(f"🎯 Target Size: {TARGET_SIZE_MB}MB | Calculated Bitrate: {bitrate_kbps} kbps")
else:
    # Use CRF for variable bitrate based on visual quality
    cmd.extend(["-crf", str(QUALITY_CRF), "-b:v", "0"])
    print(f"🎯 Target Quality: CRF {QUALITY_CRF}")

cmd.append(OUTPUT_FILE)

# --- 4. Execution ---
print("🚀 Starting Video Conversion...\n")
res = subprocess.run(cmd, capture_output=True, text=True)

if res.returncode == 0:
    size_mb = os.path.getsize(OUTPUT_FILE) / (1024 * 1024)
    print(f"✅ SUCCESS: Conversion Complete!")
    print(f"📂 Output File: {OUTPUT_FILE}")
    print(f"⚖️ Final Size: {size_mb:.2f} MB")
else:
    print("❌ ERROR occurred during conversion:")
    print(res.stderr[-1000:]) # Show the last 1000 characters of the error log