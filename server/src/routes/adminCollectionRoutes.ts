import { Router } from "express";

import {
  createCollection,
  getCollectionById,
  getCollections,
  updateCollection,
  updateCollectionStatus,
} from "../controllers/collectionController.js";

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
  getCollections
);

router.get(
  "/:id",
  requireAdmin,
  getCollectionById
);

router.post(
  "/",
  requireAdmin,
  requireCsrf,
  createCollection
);

router.patch(
  "/:id",
  requireAdmin,
  requireCsrf,
  updateCollection
);

router.patch(
  "/:id/status",
  requireAdmin,
  requireCsrf,
  updateCollectionStatus
);

export default router;