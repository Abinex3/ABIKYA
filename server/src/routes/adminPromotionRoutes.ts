import {
  Router,
} from "express";

import {
  createPromotion,
  getPromotionById,
  getPromotionLookups,
  getPromotions,
  updatePromotion,
  updatePromotionStatus,
} from "../controllers/adminPromotionController.js";


import {
  requireAdmin,
} from "../middleware/requireAdmin.js";

import {
  requireCsrf,
} from "../middleware/requireCsrf.js";

const router =
  Router();

router.get(
  "/",
  requireAdmin,
  getPromotions
);

router.get(
  "/lookups",
  requireAdmin,
  getPromotionLookups
);

router.get(
  "/:id",
  requireAdmin,
  getPromotionById
);

router.post(
  "/",
  requireAdmin,
  requireCsrf,
  createPromotion
);

router.patch(
  "/:id",
  requireAdmin,
  requireCsrf,
  updatePromotion
);

router.patch(
  "/:id/status",
  requireAdmin,
  requireCsrf,
  updatePromotionStatus
);


export default router;