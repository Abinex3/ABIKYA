import multer from "multer";

const ALLOWED_MIME_TYPES = new Set([
  "text/csv",
  "application/vnd.ms-excel",
  "application/csv",
  "text/plain", // some browsers send CSV as text/plain
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
]);

const MAX_CSV_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB — generous for 500 rows

export const productCsvUpload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: MAX_CSV_SIZE_BYTES,
  },

  fileFilter: (_req, file, callback) => {
    const name = file.originalname.toLowerCase();

    const looksValid =
      ALLOWED_MIME_TYPES.has(file.mimetype) ||
      name.endsWith(".csv") ||
      name.endsWith(".xlsx");

    if (!looksValid) {
      callback(
        new Error(
          "Only .csv or .xlsx files are accepted."
        )
      );
      return;
    }

    callback(null, true);
  },
});