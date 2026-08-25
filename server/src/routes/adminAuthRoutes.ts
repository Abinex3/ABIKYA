import { Router } from "express";
import {
  adminLogin,
  adminMe,
  adminLogout
} from "../controllers/adminAuthController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { requireCsrf } from "../middleware/requireCsrf.js";
import { adminLoginRateLimit } from "../middleware/adminLoginRateLimit.js";


const router = Router();

router.post(
  "/login",
  adminLoginRateLimit,
  adminLogin
);
router.get("/me", requireAdmin, adminMe);
router.post(
  "/logout",
  requireAdmin,
  requireCsrf,
  adminLogout
);

export default router;