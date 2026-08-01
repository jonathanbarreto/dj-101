import {access, mkdir} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const [, , inputPath, outputDirectory = 'public/images'] = process.argv;

if (!inputPath) {
  console.error('Usage: node scripts/optimize-images.mjs <input-image> [output-directory]');
  process.exitCode = 1;
} else {
  try {
    await access(inputPath);
    const source = sharp(inputPath, {animated: false});
    const metadata = await source.metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error('The input image has no readable pixel dimensions.');
    }

    await mkdir(outputDirectory, {recursive: true});
    const avifPath = path.join(outputDirectory, 'ddj1000-master.avif');
    const webpPath = path.join(outputDirectory, 'ddj1000-master.webp');

    await Promise.all([
      sharp(inputPath, {animated: false}).avif({quality: 70}).toFile(avifPath),
      sharp(inputPath, {animated: false}).webp({quality: 82}).toFile(webpPath),
    ]);

    console.log(`Optimized ${metadata.width}x${metadata.height} image:`);
    console.log(`- ${avifPath} (AVIF quality 70)`);
    console.log(`- ${webpPath} (WebP quality 82)`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Image optimization failed: ${message}`);
    process.exitCode = 1;
  }
}
