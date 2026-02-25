/**
 * Generate og-image.png from og-image.svg
 * 
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgPath = path.join(process.cwd(), 'public/og-image.svg');
const pngPath = path.join(process.cwd(), 'public/og-image.png');

async function generateOgImage() {
  try {
    console.log('📸 Generating OG image...');
    
    const svg = fs.readFileSync(svgPath);
    
    await sharp(svg)
      .png()
      .toFile(pngPath);
    
    console.log(`✅ OG image generated: ${pngPath}`);
    console.log('📐 Dimensions: 1200x630px');
  } catch (error) {
    console.error('❌ Error generating OG image:', error.message);
    process.exit(1);
  }
}

generateOgImage();
