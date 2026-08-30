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