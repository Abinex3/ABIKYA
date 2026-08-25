import sharp from "sharp";

type ProcessedImage = {
  buffer: Buffer;
  width: number;
  height: number;
  sizeBytes: number;
};

export async function processProductImage(
  input: Buffer
): Promise<ProcessedImage> {
  const image = sharp(input, {
    failOn: "error",
  });

  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error(
      "Unable to read image dimensions."
    );
  }

  const buffer = await image
    .rotate()
    .resize({
      width: 1400,
      height: 1400,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality: 82,
      effort: 5,
    })
    .toBuffer();

  const processedMetadata =
    await sharp(buffer).metadata();

  if (
    !processedMetadata.width ||
    !processedMetadata.height
  ) {
    throw new Error(
      "Unable to read processed image dimensions."
    );
  }

  return {
    buffer,
    width: processedMetadata.width,
    height: processedMetadata.height,
    sizeBytes: buffer.length,
  };
}

export async function processProductThumbnail(
  input: Buffer
): Promise<ProcessedImage> {
  const buffer = await sharp(input)
    .rotate()
    .resize({
      width: 420,
      height: 420,
      fit: "cover",
      position: "centre",
      withoutEnlargement: true,
    })
    .webp({
      quality: 78,
      effort: 5,
    })
    .toBuffer();

  const metadata =
    await sharp(buffer).metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error(
      "Unable to read thumbnail dimensions."
    );
  }

  return {
    buffer,
    width: metadata.width,
    height: metadata.height,
    sizeBytes: buffer.length,
  };
}