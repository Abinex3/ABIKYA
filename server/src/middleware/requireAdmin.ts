import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashToken } from "../utils/authTokens.js";

const ADMIN_IDLE_MINUTES = 30;

// Only refresh lastUsedAt every 5 minutes
// to avoid a database write on every request.
const LAST_USED_REFRESH_MINUTES = 5;

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL!,
});

const prisma = new PrismaClient({ adapter });

export interface AuthenticatedAdminRequest extends Request {
  admin?: {
    id: string;
    email: string;
    role: string;
  };

  adminSession?: {
    id: string;
    csrfHash: string;
  };
}

export async function requireAdmin(
  req: AuthenticatedAdminRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const sessionToken = req.cookies?.abikya_admin;

    if (
      typeof sessionToken !== "string" ||
      sessionToken.length < 32
    ) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const tokenHash = hashToken(sessionToken);

    const session = await prisma.adminSession.findUnique({
      where: {
        tokenHash,
      },
      include: {
        admin: true,
      },
    });

    if (!session) {
      return res.status(401).json({
        message: "Session invalid or expired.",
      });
    }

    if (session.revokedAt) {
      return res.status(401).json({
        message: "Session invalid or expired.",
      });
    }

    const now = new Date();

    // Absolute session expiry
    if (session.expiresAt <= now) {
      return res.status(401).json({
        message: "Session expired.",
      });
    }

    // Disabled admin account
    if (!session.admin.isActive) {
      return res.status(401).json({
        message: "Session invalid or expired.",
      });
    }

    // Idle timeout
    const idleLimitMs =
      ADMIN_IDLE_MINUTES * 60 * 1000;

    const idleExpired =
      session.lastUsedAt.getTime() <
      now.getTime() - idleLimitMs;

    if (idleExpired) {
      await prisma.adminSession.update({
        where: {
          id: session.id,
        },
        data: {
          revokedAt: now,
        },
      });

      return res.status(401).json({
        message: "Session expired due to inactivity.",
      });
    }

    req.admin = {
      id: session.admin.id,
      email: session.admin.email,
      role: session.admin.role,
    };

    req.adminSession = {
      id: session.id,
      csrfHash: session.csrfHash,
    };

    // Refresh lastUsedAt only when it is older than 5 minutes.
    const refreshLimitMs =
      LAST_USED_REFRESH_MINUTES * 60 * 1000;

    const shouldRefreshLastUsed =
      session.lastUsedAt.getTime() <
      now.getTime() - refreshLimitMs;

    if (shouldRefreshLastUsed) {
      await prisma.adminSession.update({
        where: {
          id: session.id,
        },
        data: {
          lastUsedAt: now,
        },
      });
    }

    next();
  } catch (error) {
    next(error);
  }
} 