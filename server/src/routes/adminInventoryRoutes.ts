import { Router } from "express";

import {
  getInventory,
  getInventoryHistory,
  createInventoryMovement,
  updateLowStockThreshold,
  createOrderInventoryMovement,
} from "../controllers/adminInventoryController.js";

import { requireAdmin } from "../middleware/requireAdmin.js";
import { requireCsrf } from "../middleware/requireCsrf.js";

const router = Router();

router.get(
  "/",
  requireAdmin,
  getInventory
);

router.get(
  "/:productId/history",
  requireAdmin,
  getInventoryHistory
);

router.post(
  "/:productId/movements",
  requireAdmin,
  requireCsrf,
  createInventoryMovement
);

router.post(
  "/:productId/order-movements",
  requireAdmin,
  requireCsrf,
  createOrderInventoryMovement
);

router.patch(
  "/:productId/threshold",
  requireAdmin,
  requireCsrf,
  updateLowStockThreshold
);

export default router;