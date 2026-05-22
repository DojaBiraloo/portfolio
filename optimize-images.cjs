const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const images = [
  { file: 'img1.webp', w: 334, h: 250 },
  { file: 'img2.webp', w: 250, h: 468 },
  { file: 'img3.webp', w: 250, h: 250 },
  { file: 'img4.webp', w: 250, h: 334 },
  { file: 'img5.webp', w: 334, h: 250 },
  { file: 'img6.webp', w: 250, h: 512 },
];

const inputDir  = 'src/assets/about-pics';
const outputDir = 'src/assets/about-pics';

(async () => {
  for (const { file, w, h } of images) {
    const inputPath  = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);

    // Process into a buffer — no temp file, no rename needed
    const buffer = await sharp(inputPath)
      .resize(w, h, { fit: 'cover' })
      .webp({ quality: 80 })
      .toBuffer();

    fs.writeFileSync(outputPath, buffer);
    console.log(`✓ ${file} → ${w}x${h}`);
  }

  // Hero
  const heroBuffer = await sharp('public/Assets/hero.webp')
    .webp({ quality: 80 })
    .toBuffer();

  fs.writeFileSync('public/Assets/hero.webp', heroBuffer);
  console.log('✓ hero.webp recompressed');
})();
