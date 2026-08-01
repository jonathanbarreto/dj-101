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

    if (absoluteInputPath === avifPath) {
      throw new Error(`Input image must not be an output asset: ${absoluteInputPath}`);
    }

    await access(absoluteInputPath);
    const source = sharp(absoluteInputPath, {animated: false});
    const metadata = await source.metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error('The input image has no readable pixel dimensions.');
    }

    await mkdir(absoluteOutputDirectory, {recursive: true});

    await sharp(absoluteInputPath, {animated: false})
      .avif({quality: 70})
      .toFile(avifPath);

    console.log(`Optimized ${metadata.width}x${metadata.height} image:`);
    console.log(`- ${avifPath} (AVIF quality 70)`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Image optimization failed: ${message}`);
    process.exitCode = 1;
  }
}
