import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgPath = path.join(__dirname, "../public/favicon.svg");
const publicDir = path.join(__dirname, "../public");

const sizes = [16, 32, 192, 512];

console.log("🎨 Generating favicon images...\n");

// Create favicon sizes
for (const size of sizes) {
  const outputPath = path.join(publicDir, `favicon-${size}x${size}.png`);

  sharp(svgPath)
    .resize(size, size, {
      fit: "cover",
      position: "center",
    })
    .png()
    .toFile(outputPath, (err, info) => {
      if (err) {
        console.error(`❌ Error generating ${size}x${size}:`, err);
      } else {
        console.log(`✅ Generated ${size}x${size}.png (${info.size} bytes)`);
      }
    });
}

// Create apple-touch-icon (180x180)
const appleIconPath = path.join(publicDir, "apple-touch-icon.png");
sharp(svgPath)
  .resize(180, 180, {
    fit: "cover",
    position: "center",
  })
  .png()
  .toFile(appleIconPath, (err, info) => {
    if (err) {
      console.error("❌ Error generating apple-touch-icon:", err);
    } else {
      console.log(`✅ Generated apple-touch-icon.png (${info.size} bytes)`);
    }
  });

// Create Android Chrome icons (192x192 and 512x512)
const androidSizes = [192, 512];
for (const size of androidSizes) {
  const outputPath = path.join(publicDir, `android-chrome-${size}x${size}.png`);

  sharp(svgPath)
    .resize(size, size, {
      fit: "cover",
      position: "center",
    })
    .png()
    .toFile(outputPath, (err, info) => {
      if (err) {
        console.error(
          `❌ Error generating android-chrome-${size}x${size}:`,
          err,
        );
      } else {
        console.log(
          `✅ Generated android-chrome-${size}x${size}.png (${info.size} bytes)`,
        );
      }
    });
}

// Create favicon.ico (16x16, 32x32)
const icoPath = path.join(publicDir, "favicon.ico");
sharp(svgPath)
  .resize(32, 32, {
    fit: "cover",
    position: "center",
  })
  .png()
  .toFile(icoPath, (err, info) => {
    if (err) {
      console.error("❌ Error generating favicon.ico:", err);
    } else {
      console.log(`✅ Generated favicon.ico (${info.size} bytes)`);
    }
  });

console.log("\n✨ Favicon generation complete!");
