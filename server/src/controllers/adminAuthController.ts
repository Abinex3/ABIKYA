import type { Request, Response } from "express";

import { PrismaClient } from "../../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

import { adminLoginSchema } from "../../src/validators/adminAuth.js";
import { verifyPassword } from "../../src/services/password.js";

import {
  generateSecureToken,
  hashToken,
} from "../utils/authTokens.js";

import type { AuthenticatedAdminRequest } from "../middleware/requireAdmin.js";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL!,
});

const prisma = new PrismaClient({ adapter });

export async function adminLogin(
  req: Request,
  res: Response
) {
  const parsed = adminLoginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid login details.",
    });
  }

  const { email, password } = parsed.data;

  const admin = await prisma.adminUser.findUnique({
    where: {
      email,
    },
  });

  if (!admin || !admin.isActive) {
    return res.status(401).json({
      message: "Invalid email or password.",
    });
  }

  const passwordValid = await verifyPassword(
    admin.passwordHash,
    password
  );

  if (!passwordValid) {
    return res.status(401).json({
      message: "Invalid email or password.",
    });
  }

  // Clean up expired and revoked sessions.
  const now = new Date();

  await prisma.adminSession.deleteMany({
    where: {
      OR: [
        {
          expiresAt: {
            lt: now,
          },
        },
        {
          revokedAt: {
            not: null,
          },
        },
      ],
    },
  });

  // Create fresh session + CSRF tokens.
  const sessionToken = generateSecureToken();
  const csrfToken = generateSecureToken();

  const sessionTokenHash = hashToken(sessionToken);
  const csrfHash = hashToken(csrfToken);

  const expiresAt = new Date(
    Date.now() + 8 * 60 * 60 * 1000
  );

  await prisma.adminSession.create({
    data: {
      adminId: admin.id,
      tokenHash: sessionTokenHash,
      csrfHash,
      expiresAt,
      userAgent: req.get("user-agent")?.slice(0, 500),
      ipAddress: req.ip?.slice(0, 100),
    },
  });

  res.cookie("abikya_admin", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 8 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    message: "Login successful.",
    admin: {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    },
    csrfToken,
  });
}

export async function adminMe(
  req: AuthenticatedAdminRequest,
  res: Response
) {
  return res.status(200).json({
    admin: req.admin,
  });
}

export async function adminLogout(
  req: AuthenticatedAdminRequest,
  res: Response
) {
  if (!req.adminSession?.id) {
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  await prisma.adminSession.update({
    where: {
      id: req.adminSession.id,
    },
    data: {
      revokedAt: new Date(),
    },
  });

  res.clearCookie("abikya_admin", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return res.status(200).json({
    message: "Logged out successfully.",
  });
}