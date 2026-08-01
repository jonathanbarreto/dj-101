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
    const absoluteInputPath = path.resolve(inputPath);
    const absoluteOutputDirectory = path.resolve(outputDirectory);
    const avifPath = path.join(absoluteOutputDirectory, 'ddj1000-master.avif');
    const webpPath = path.join(absoluteOutputDirectory, 'ddj1000-master.webp');

    if (avifPath === webpPath) {
      throw new Error('Image optimization outputs must use distinct file paths.');
    }
    if (absoluteInputPath === avifPath || absoluteInputPath === webpPath) {
      throw new Error(`Input image must not be an output asset: ${absoluteInputPath}`);
    }

    await access(absoluteInputPath);
    const source = sharp(absoluteInputPath, {animated: false});
    const metadata = await source.metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error('The input image has no readable pixel dimensions.');
    }

    await mkdir(absoluteOutputDirectory, {recursive: true});

    await Promise.all([
      sharp(absoluteInputPath, {animated: false}).avif({quality: 70}).toFile(avifPath),
      sharp(absoluteInputPath, {animated: false}).webp({quality: 82}).toFile(webpPath),
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
