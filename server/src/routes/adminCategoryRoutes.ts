import { Router } from "express";

import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  updateCategoryStatus,
} from "../controllers/categoryController.js";

import {
  requireAdmin,
} from "../middleware/requireAdmin.js";

import {
  requireCsrf,
} from "../middleware/requireCsrf.js";

const router = Router();

router.get(
  "/",
  requireAdmin,
  getCategories
);

router.get(
  "/:id",
  requireAdmin,
  getCategoryById
);

router.post(
  "/",
  requireAdmin,
  requireCsrf,
  createCategory
);

router.patch(
  "/:id",
  requireAdmin,
  requireCsrf,
  updateCategory
);

router.patch(
  "/:id/status",
  requireAdmin,
  requireCsrf,
  updateCategoryStatus
);

export default router;