import multer from "multer";

const storage = multer.memoryStorage();

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const productImageUpload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },

  fileFilter: (
    _req,
    file,
    callback
  ) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(
        new Error(
          "Only JPG, PNG and WebP images are allowed."
        )
      );

      return;
    }

    callback(null, true);
  },
});