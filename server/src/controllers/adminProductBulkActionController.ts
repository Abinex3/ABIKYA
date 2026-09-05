import type { Response } from "express";

import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { supabaseAdmin } from "../config/supabase.js";

 import { verifyPassword } from "../services/password.js";
import type { AuthenticatedAdminRequest } from "../middleware/requireAdmin.js";


import {
  bulkStatusUpdateSchema,
  bulkDeleteSchema,
} from "../validators/adminProductBulkAction.js";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL!,
});

const prisma = new PrismaClient({ adapter });

export async function bulkUpdateProductStatus(
  req: Request,
  res: Response
) {
  const parsed = bulkStatusUpdateSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid request.",
      errors: parsed.error.flatten(),
    });
  }

  const { productIds, status } = parsed.data;

  try {
    const updated: string[] = [];
    const skipped: { id: string; name: string; reason: string }[] = [];

    if (status === "ACTIVE") {
      // Same rule as the single-product flow: ACTIVE requires both
      // PRODUCT and WORN images already uploaded.
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: {
          id: true,
          name: true,
          images: { select: { type: true } },
        },
      });

      for (const product of products) {
        const hasProductImage = product.images.some(
          (img) => img.type === "PRODUCT"
        );
        const hasWornImage = product.images.some(
          (img) => img.type === "WORN"
        );

        if (!hasProductImage || !hasWornImage) {
          skipped.push({
            id: product.id,
            name: product.name,
            reason: "Missing product/worn images.",
          });
        } else {
          updated.push(product.id);
        }
      }
    } else {
      updated.push(...productIds);
    }

    if (updated.length > 0) {
      await prisma.product.updateMany({
        where: { id: { in: updated } },
        data: { status },
      });
    }

    return res.status(200).json({
      message:
        skipped.length === 0
          ? `Updated ${updated.length} product(s).`
          : `Updated ${updated.length} product(s). ${skipped.length} skipped.`,
      updatedCount: updated.length,
      skipped,
    });
  } catch (error) {
    console.error("Bulk status update failed:", error);

    return res.status(500).json({
      message: "Unable to update product status.",
    });
  }
}

export async function bulkDeleteProducts(
  req: AuthenticatedAdminRequest,
  res: Response
) {
  const parsed = bulkDeleteSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid request.",
      errors: parsed.error.flatten(),
    });
  }

  const { productIds, password } = parsed.data;

if (!req.admin?.id) {
    return res.status(401).json({
      message: "Not authenticated.",
    });
  }

  try {
    const admin = await prisma.adminUser.findUnique({
      where: { id: req.admin.id },
      select: { id: true, passwordHash: true },
    });

    if (!admin) {
      return res.status(401).json({
        message: "Not authenticated.",
      });
    }

    const passwordValid = await verifyPassword(
      admin.passwordHash,
      password,
    );

    if (!passwordValid) {
      return res.status(401).json({
        message: "Incorrect password.",
      });
    }

    // Products can't be hard-deleted if they're still referenced
    // elsewhere — ComboItem.itemProduct and InventoryMovement.product
    // both use onDelete: Restrict in your schema.
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        images: { select: { storagePath: true } },
        usedInCombos: { select: { comboProductId: true } },
        inventoryMovements: { select: { id: true }, take: 1 },
      },
    });

    const deletableIds: string[] = [];
    const skipped: { id: string; name: string; reason: string }[] = [];

    for (const product of products) {
      if (product.usedInCombos.length > 0) {
        skipped.push({
          id: product.id,
          name: product.name,
          reason: "Used as a component inside a combo product.",
        });
        continue;
      }

      if (product.inventoryMovements.length > 0) {
        skipped.push({
          id: product.id,
          name: product.name,
          reason: "Has inventory/order history and can't be hard-deleted.",
        });
        continue;
      }

      deletableIds.push(product.id);
    }

    if (deletableIds.length > 0) {
      const storagePaths = products
        .filter((p) => deletableIds.includes(p.id))
        .flatMap((p) =>
          p.images.map((img) => img.storagePath)
        );

      if (storagePaths.length > 0) {
        // Best-effort — a storage cleanup failure shouldn't block
        // the DB delete.
        await supabaseAdmin.storage
          .from("products")
          .remove(storagePaths)
          .catch((error) =>
            console.error(
              "Failed to remove product images from storage:",
              error
            )
          );
      }

      await prisma.product.deleteMany({
        where: { id: { in: deletableIds } },
      });
    }

    return res.status(200).json({
      message:
        skipped.length === 0
          ? `Deleted ${deletableIds.length} product(s).`
          : `Deleted ${deletableIds.length} product(s). ${skipped.length} could not be deleted.`,
      deletedCount: deletableIds.length,
      skipped,
    });
  } catch (error) {
    console.error("Bulk delete failed:", error);

    return res.status(500).json({
      message: "Unable to delete products.",
    });
  }
}