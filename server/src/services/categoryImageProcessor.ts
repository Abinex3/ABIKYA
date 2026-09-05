import sharp from "sharp";

type ProcessedImage = {
  buffer: Buffer;
  width: number;
  height: number;
  sizeBytes: number;
};

const MAX_WIDTH = 1600;
const WEBP_QUALITY = 82;

/**
 * Resizes and converts a category gallery image to webp.
 *
 * ASSUMPTION: this mirrors what productImageProcessor.ts likely
 * does (sharp, webp output). If your existing file differs — e.g.
 * different max dimensions, a thumbnail variant, EXIF handling —
 * share it and I'll match it exactly instead.
 */
export async function processCategoryImage(
  input: Buffer
): Promise<ProcessedImage> {
  const resized = sharp(input)
    .rotate() // respects EXIF orientation before stripping it
    .resize({
      width: MAX_WIDTH,
      withoutEnlargement: true,
    });

  const buffer = await resized
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  const metadata = await sharp(buffer).metadata();

  return {
    buffer,
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
    sizeBytes: buffer.byteLength,
  };
}