const { Jimp } = require("jimp");
const fs = require("fs");
const path = require("path");

const ASSETS_DIR = path.join(__dirname, "..", "src", "assets");

async function processFile({ src, dest, width, height, crop = true, quality = 80 }) {
  try {
    const image = await Jimp.read(src);
    if (width && height) {
      if (crop) {
        image.cover({ w: width, h: height });
      } else {
        image.resize({ w: width, h: height });
      }
    } else if (width) {
      image.resize({ w: width });
    } else if (height) {
      image.resize({ h: height });
    }
    
    const ext = path.extname(dest).toLowerCase();
    if (ext === ".jpg" || ext === ".jpeg") {
      if (typeof image.quality === "function") {
        image.quality(quality);
      }
    }
    
    await image.write(dest);
    console.log(`✓ Optimized: ${path.relative(ASSETS_DIR, src)} -> ${path.relative(ASSETS_DIR, dest)} (${fs.statSync(dest).size} bytes)`);
    return true;
  } catch (err) {
    console.error(`✗ Error processing ${src}:`, err.message);
    return false;
  }
}

async function run() {
  console.log("Running assets build-time optimization pipeline...");
  
  // 1. Optimize backgrounds to 1920x1080 JPEG
  const bgDir = path.join(ASSETS_DIR, "backgrounds");
  if (fs.existsSync(bgDir)) {
    const bgFiles = fs.readdirSync(bgDir).filter(f => /\.(png|jpg|jpeg)$/i.test(f));
    for (const file of bgFiles) {
      const src = path.join(bgDir, file);
      const dest = path.join(bgDir, file.replace(/\.(png|jpeg|jpg)$/i, ".jpg"));
      const tempDest = dest.replace(".jpg", "-temp.jpg");
      
      const success = await processFile({ src, dest: tempDest, width: 1920, height: 1080, crop: true, quality: 80 });
      if (success) {
        fs.unlinkSync(src);
        if (fs.existsSync(dest) && dest !== src) {
          try { fs.unlinkSync(dest); } catch (e) {}
        }
        fs.renameSync(tempDest, dest);
      }
    }
  }
  
  // 2. Optimize places-bg to 600x600 JPEG
  const placesDir = path.join(ASSETS_DIR, "places-bg");
  if (fs.existsSync(placesDir)) {
    const placesFiles = fs.readdirSync(placesDir).filter(f => /\.(png|jpg|jpeg)$/i.test(f));
    for (const file of placesFiles) {
      const src = path.join(placesDir, file);
      const dest = path.join(placesDir, file.replace(/\.(png|jpeg|jpg)$/i, ".jpg"));
      const tempDest = dest.replace(".jpg", "-temp.jpg");
      
      const success = await processFile({ src, dest: tempDest, width: 600, height: 600, crop: true, quality: 85 });
      if (success) {
        fs.unlinkSync(src);
        if (fs.existsSync(dest) && dest !== src) {
          try { fs.unlinkSync(dest); } catch (e) {}
        }
        fs.renameSync(tempDest, dest);
      }
    }
  }
  
  // 3. Optimize profile-icons to 120x120 JPEG
  const profileDir = path.join(ASSETS_DIR, "profile-icons");
  if (fs.existsSync(profileDir)) {
    const profileFiles = fs.readdirSync(profileDir).filter(f => /\.(png|jpg|jpeg)$/i.test(f) && !f.includes("-temp"));
    for (const file of profileFiles) {
      const src = path.join(profileDir, file);
      const dest = path.join(profileDir, file.replace(/\.(png|jpeg|jpg)$/i, ".jpg"));
      const tempDest = dest.replace(".jpg", "-temp.jpg");
      
      const success = await processFile({ src, dest: tempDest, width: 120, height: 120, crop: true, quality: 85 });
      if (success) {
        fs.unlinkSync(src);
        if (fs.existsSync(dest) && dest !== src) {
          try { fs.unlinkSync(dest); } catch (e) {}
        }
        fs.renameSync(tempDest, dest);
      }
    }
  }
  
  // 4. Optimize flags to 120x80 PNG
  const flagsDir = path.join(ASSETS_DIR, "flags");
  if (fs.existsSync(flagsDir)) {
    const flagFiles = fs.readdirSync(flagsDir).filter(f => f.endsWith(".png") && !f.includes("-temp"));
    for (const file of flagFiles) {
      const src = path.join(flagsDir, file);
      const tempDest = src.replace(".png", "-temp.png");
      const success = await processFile({ src, dest: tempDest, width: 120, height: 80, crop: true });
      if (success) {
        fs.unlinkSync(src);
        fs.renameSync(tempDest, src);
      }
    }
  }
  
  // 5. Optimize icons to max 128px PNG
  const iconsDir = path.join(ASSETS_DIR, "icons");
  if (fs.existsSync(iconsDir)) {
    const iconFiles = fs.readdirSync(iconsDir).filter(f => f.endsWith(".png") && !f.includes("-temp"));
    for (const file of iconFiles) {
      const src = path.join(iconsDir, file);
      const tempDest = src.replace(".png", "-temp.png");
      const success = await processFile({ src, dest: tempDest, width: 128, height: 128, crop: false });
      if (success) {
        fs.unlinkSync(src);
        fs.renameSync(tempDest, src);
      }
    }
  }
  
  // 6. Optimize logos to max 300px width PNG
  const logosDir = path.join(ASSETS_DIR, "logos");
  if (fs.existsSync(logosDir)) {
    const logoFiles = fs.readdirSync(logosDir).filter(f => f.endsWith(".png") && !f.includes("-temp"));
    for (const file of logoFiles) {
      const src = path.join(logosDir, file);
      const tempDest = src.replace(".png", "-temp.png");
      const success = await processFile({ src, dest: tempDest, width: 300, crop: false });
      if (success) {
        fs.unlinkSync(src);
        fs.renameSync(tempDest, src);
      }
    }
  }
  
  console.log("Build-time asset pipeline complete!");
}

run();
