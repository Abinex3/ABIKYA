import type {
  NextFunction,
  Response,
} from "express";

import type { AuthenticatedAdminRequest } from "./requireAdmin.js";
import { hashToken } from "../utils/authTokens.js";

export function requireCsrf(
  req: AuthenticatedAdminRequest,
  res: Response,
  next: NextFunction
) {
  const csrfToken = req.header("x-csrf-token");

  if (!csrfToken || !req.adminSession?.csrfHash) {
    return res.status(403).json({
      message: "Invalid request.",
    });
  }

  const csrfHash = hashToken(csrfToken);

  if (csrfHash !== req.adminSession.csrfHash) {
    return res.status(403).json({
      message: "Invalid request.",
    });
  }

  next();
}