import { Router } from "express";

import {
  getProducts,
  getProductLookups,
  getComboProductOptions,
  getNextProductSku,
  createProduct,
  uploadProductImage,
  updateProductStatus,
  getProductById,
  updateProduct,
  deleteProductImage
} from "../controllers/adminProductController.js";

import {
  bulkImportProductsHandler,
  downloadProductImportTemplate,
} from "../controllers/adminProductBulkImportController.js";
 
import {
   bulkUpdateProductStatus,
   bulkDeleteProducts,
} from "../controllers/adminProductBulkActionController.js";

import { productCsvUpload } from "../middleware/productCsvUpload.js";


import {
  productImageUpload,
} from "../middleware/productImageUpload.js";

import { requireCsrf } from "../middleware/requireCsrf.js";
import { requireAdmin } from "../middleware/requireAdmin.js";


const router = Router();

router.get(
  "/",
  requireAdmin,
  getProducts
);


router.get(
  "/lookups",
  requireAdmin,
  getProductLookups
);

router.get(
  "/bulk-import/template",
  requireAdmin,
  downloadProductImportTemplate
);


router.get(
  "/combo-options",
  requireAdmin,
  getComboProductOptions
);


router.get(
  "/next-sku",
  requireAdmin,
  getNextProductSku
);

router.post(
  "/",
  requireAdmin,
  requireCsrf,
  createProduct
);

router.post(
  "/bulk-import",
  requireAdmin,
  requireCsrf,
  productCsvUpload.single("file"),
  bulkImportProductsHandler
);
 // Keep bulk routes above any "/:id" routes for clarity, same as
 // your existing bulk-import routes.
 router.patch(
   "/bulk/status",
   requireAdmin,
   requireCsrf,
   bulkUpdateProductStatus
 );

 router.post(
   "/bulk/delete",
   requireAdmin,
   requireCsrf,
   bulkDeleteProducts
 );

router.delete(
  "/:id/images/:type",
  requireAdmin,
  deleteProductImage
);

router.patch(
  "/:id",
  requireAdmin,
  updateProduct
);


router.get(
  "/:id",
  requireAdmin,
  getProductById
);


router.patch(
  "/:id/status",
  requireAdmin,
  requireCsrf,
  updateProductStatus
);

router.post(
  "/:id/images/:type",
  requireAdmin,
  requireCsrf,
  productImageUpload.single("image"),
  uploadProductImage
);




export default router;