import {
  Router,
} from "express";

import {
  createGiftRule,
  getGiftRuleById,
  getGiftRuleLookups,
  getGiftRules,
  updateGiftRule,
  updateGiftRuleStatus,
} from "../controllers/giftRuleController.js";


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
  getGiftRules
);

router.get(
  "/lookups",
  requireAdmin,
  getGiftRuleLookups
);

router.get(
  "/:id",
  requireAdmin,
  getGiftRuleById
);

router.post(
  "/",
  requireAdmin,
  requireCsrf,
  createGiftRule
);

router.patch(
  "/:id",
  requireAdmin,
  requireCsrf,
  updateGiftRule
);

router.patch(
  "/:id/status",
  requireAdmin,
  requireCsrf,
  updateGiftRuleStatus
);

export default router;