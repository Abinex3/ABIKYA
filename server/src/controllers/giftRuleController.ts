import type {
  Request,
  Response,
} from "express";

import {
  PrismaClient,
} from "../generated/prisma/client.js";

import { PrismaPg } from "@prisma/adapter-pg";

import {
  createAdminGiftRuleSchema,
} from "../validators/adminGiftRule.js";

/* =========================
   PRISMA
========================= */

const adapter =
  new PrismaPg({
    connectionString:
      process.env.DIRECT_URL!,
  });

const prisma =
  new PrismaClient({
    adapter,
  });

/* =========================
   VALIDATION ERROR
========================= */

class GiftRuleValidationError
  extends Error {
  constructor(message: string) {
    super(message);

    this.name =
      "GiftRuleValidationError";
  }
}

/* =========================
   CREATE GIFT RULE
========================= */

export async function createGiftRule(
  req: Request,
  res: Response
) {
  const parsed =
    createAdminGiftRuleSchema.safeParse(
      req.body
    );

  if (!parsed.success) {
    return res.status(400).json({
      message:
        "Invalid gift rule data.",

      errors:
        parsed.error.flatten(),
    });
  }

  const data = parsed.data;

  try {
    const giftProduct =
      await prisma.product.findUnique({
        where: {
          id: data.giftProductId,
        },

        select: {
          id: true,
          name: true,
          sku: true,
          productType: true,
          status: true,
          stock: true,
        },
      });

    if (!giftProduct) {
      throw new GiftRuleValidationError(
        "Gift product not found."
      );
    }

    if (
      giftProduct.productType !==
      "SINGLE"
    ) {
      throw new GiftRuleValidationError(
        "Only SINGLE products can be used as gift products."
      );
    }

    if (
      giftProduct.status ===
      "ARCHIVED"
    ) {
      throw new GiftRuleValidationError(
        "Archived products cannot be used as gift products."
      );
    }

    const giftRule =
      await prisma.giftRule.create({
        data: {
          minimumOrderQuantity:
            data.minimumOrderQuantity,

          minimumOrderValue:
            data.minimumOrderValue ??
            null,

          giftProductId:
            data.giftProductId,

          giftQuantity:
            data.giftQuantity,

          isActive:
            data.isActive,

          startAt:
            data.startAt,

          endAt:
            data.endAt,
        },

        include: {
          giftProduct: {
            select: {
              id: true,
              name: true,
              sku: true,
              productType: true,
              status: true,
              stock: true,
            },
          },
        },
      });

    return res.status(201).json({
      message:
        "Gift rule created successfully.",

      giftRule: {
        id:
          giftRule.id,

        minimumOrderQuantity:
          giftRule.minimumOrderQuantity,

        minimumOrderValue:
          giftRule.minimumOrderValue
            ? giftRule.minimumOrderValue.toString()
            : null,

        giftQuantity:
          giftRule.giftQuantity,

        isActive:
          giftRule.isActive,

        startAt:
          giftRule.startAt,

        endAt:
          giftRule.endAt,

        giftProduct:
          giftRule.giftProduct,

        createdAt:
          giftRule.createdAt,

        updatedAt:
          giftRule.updatedAt,
      },
    });
  } catch (error) {
    if (
      error instanceof
      GiftRuleValidationError
    ) {
      return res.status(400).json({
        message:
          error.message,
      });
    }

    console.error(
      "Failed to create gift rule:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to create gift rule.",
    });
  }
}

/* =========================
   GET GIFT RULES
========================= */

export async function getGiftRules(
  req: Request,
  res: Response
) {
  try {
    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const requestedLimit =
      Number(req.query.limit) || 20;

    const limit = Math.min(
      Math.max(requestedLimit, 1),
      100
    );

    const status =
      typeof req.query.status === "string"
        ? req.query.status
        : "";

    const now = new Date();

    /*
     * Effective gift rule status:
     *
     * ACTIVE
     *   enabled + currently within dates
     *
     * SCHEDULED
     *   enabled + starts in future
     *
     * EXPIRED
     *   enabled + already ended
     *
     * INACTIVE
     *   manually disabled
     */

    const where: any = {};

    if (status === "ACTIVE") {
      where.isActive = true;

      where.startAt = {
        lte: now,
      };

      where.endAt = {
        gte: now,
      };
    }

    if (status === "SCHEDULED") {
      where.isActive = true;

      where.startAt = {
        gt: now,
      };
    }

    if (status === "EXPIRED") {
      where.isActive = true;

      where.endAt = {
        lt: now,
      };
    }

    if (status === "INACTIVE") {
      where.isActive = false;
    }

    const total =
      await prisma.giftRule.count({
        where,
      });

    const totalPages = Math.max(
      Math.ceil(total / limit),
      1
    );

    /*
     * Keep the requested page inside
     * the available page range.
     */

    const safePage = Math.min(
      page,
      totalPages
    );

    const giftRules =
      await prisma.giftRule.findMany({
        where,

        skip:
          (safePage - 1) * limit,

        take: limit,

        orderBy: {
          createdAt: "desc",
        },

        include: {
          giftProduct: {
            select: {
              id: true,
              name: true,
              sku: true,
              productType: true,
              status: true,
              stock: true,
            },
          },
        },
      });

    /*
     * Stats ignore the current status
     * filter and describe the whole module.
     */

    const [
      totalGiftRules,
      activeGiftRules,
      scheduledGiftRules,
      inactiveGiftRules,
    ] = await Promise.all([
      prisma.giftRule.count(),

      prisma.giftRule.count({
        where: {
          isActive: true,

          startAt: {
            lte: now,
          },

          endAt: {
            gte: now,
          },
        },
      }),

      prisma.giftRule.count({
        where: {
          isActive: true,

          startAt: {
            gt: now,
          },
        },
      }),

      prisma.giftRule.count({
        where: {
          isActive: false,
        },
      }),
    ]);

    return res.status(200).json({
      giftRules:
        giftRules.map(
          (giftRule) => ({
            id:
              giftRule.id,

            minimumOrderQuantity:
              giftRule.minimumOrderQuantity,

            minimumOrderValue:
              giftRule.minimumOrderValue
                ? giftRule.minimumOrderValue.toString()
                : null,

            giftQuantity:
              giftRule.giftQuantity,

            isActive:
              giftRule.isActive,

            startAt:
              giftRule.startAt,

            endAt:
              giftRule.endAt,

            giftProduct:
              giftRule.giftProduct,

            createdAt:
              giftRule.createdAt,

            updatedAt:
              giftRule.updatedAt,
          })
        ),

      pagination: {
        page:
          safePage,

        limit,

        total,

        totalPages,

        hasNextPage:
          safePage < totalPages,

        hasPreviousPage:
          safePage > 1,
      },

      stats: {
        totalGiftRules,
        activeGiftRules,
        scheduledGiftRules,
        inactiveGiftRules,
      },
    });
  } catch (error) {
    console.error(
      "Failed to fetch gift rules:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to load gift rules.",
    });
  }
}


/* =========================
   GET GIFT RULE BY ID
========================= */

export async function getGiftRuleById(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const giftRule =
      await prisma.giftRule.findUnique({
        where: {
          id,
        },

        include: {
          giftProduct: {
            select: {
              id: true,
              name: true,
              sku: true,
              productType: true,
              status: true,
              stock: true,
            },
          },
        },
      });

    if (!giftRule) {
      return res.status(404).json({
        message:
          "Gift rule not found.",
      });
    }

    return res.status(200).json({
      giftRule: {
        id:
          giftRule.id,

        minimumOrderQuantity:
          giftRule.minimumOrderQuantity,

        minimumOrderValue:
          giftRule.minimumOrderValue
            ? giftRule.minimumOrderValue.toString()
            : null,

        giftQuantity:
          giftRule.giftQuantity,

        isActive:
          giftRule.isActive,

        startAt:
          giftRule.startAt,

        endAt:
          giftRule.endAt,

        giftProduct:
          giftRule.giftProduct,

        createdAt:
          giftRule.createdAt,

        updatedAt:
          giftRule.updatedAt,
      },
    });
  } catch (error) {
    console.error(
      "Failed to fetch gift rule:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to load gift rule.",
    });
  }
}

/* =========================
   UPDATE GIFT RULE
========================= */

export async function updateGiftRule(
  req: Request<{ id: string }>,
  res: Response
) {
  const { id } = req.params;

  const parsed =
    createAdminGiftRuleSchema.safeParse(
      req.body
    );

  if (!parsed.success) {
    return res.status(400).json({
      message:
        "Invalid gift rule data.",

      errors:
        parsed.error.flatten(),
    });
  }

  const data = parsed.data;

  try {
    const existingGiftRule =
      await prisma.giftRule.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
        },
      });

    if (!existingGiftRule) {
      return res.status(404).json({
        message:
          "Gift rule not found.",
      });
    }

    const giftProduct =
      await prisma.product.findUnique({
        where: {
          id: data.giftProductId,
        },

        select: {
          id: true,
          name: true,
          sku: true,
          productType: true,
          status: true,
          stock: true,
        },
      });

    if (!giftProduct) {
      throw new GiftRuleValidationError(
        "Gift product not found."
      );
    }

    if (
      giftProduct.productType !==
      "SINGLE"
    ) {
      throw new GiftRuleValidationError(
        "Only SINGLE products can be used as gift products."
      );
    }

    if (
      giftProduct.status ===
      "ARCHIVED"
    ) {
      throw new GiftRuleValidationError(
        "Archived products cannot be used as gift products."
      );
    }

    const giftRule =
      await prisma.giftRule.update({
        where: {
          id,
        },

        data: {
          minimumOrderQuantity:
            data.minimumOrderQuantity,

          minimumOrderValue:
            data.minimumOrderValue ??
            null,

          giftProductId:
            data.giftProductId,

          giftQuantity:
            data.giftQuantity,

          isActive:
            data.isActive,

          startAt:
            data.startAt,

          endAt:
            data.endAt,
        },

        include: {
          giftProduct: {
            select: {
              id: true,
              name: true,
              sku: true,
              productType: true,
              status: true,
              stock: true,
            },
          },
        },
      });

    return res.status(200).json({
      message:
        "Gift rule updated successfully.",

      giftRule: {
        id:
          giftRule.id,

        minimumOrderQuantity:
          giftRule.minimumOrderQuantity,

        minimumOrderValue:
          giftRule.minimumOrderValue
            ? giftRule.minimumOrderValue.toString()
            : null,

        giftQuantity:
          giftRule.giftQuantity,

        isActive:
          giftRule.isActive,

        startAt:
          giftRule.startAt,

        endAt:
          giftRule.endAt,

        giftProduct:
          giftRule.giftProduct,

        createdAt:
          giftRule.createdAt,

        updatedAt:
          giftRule.updatedAt,
      },
    });
  } catch (error) {
    if (
      error instanceof
      GiftRuleValidationError
    ) {
      return res.status(400).json({
        message:
          error.message,
      });
    }

    console.error(
      "Failed to update gift rule:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to update gift rule.",
    });
  }
}

/* =========================
   UPDATE GIFT RULE STATUS
========================= */

export async function updateGiftRuleStatus(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message:
          "isActive must be a boolean.",
      });
    }

    const giftRule =
      await prisma.giftRule.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
        },
      });

    if (!giftRule) {
      return res.status(404).json({
        message:
          "Gift rule not found.",
      });
    }

    const updatedGiftRule =
      await prisma.giftRule.update({
        where: {
          id,
        },

        data: {
          isActive,
        },

        select: {
          id: true,
          isActive: true,
          updatedAt: true,
        },
      });

    return res.status(200).json({
      message:
        "Gift rule status updated successfully.",

      giftRule:
        updatedGiftRule,
    });
  } catch (error) {
    console.error(
      "Failed to update gift rule status:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to update gift rule status.",
    });
  }
}

/* =========================
   GIFT RULE LOOKUPS
========================= */

export async function getGiftRuleLookups(
  req: Request,
  res: Response
) {
  try {
    const products =
      await prisma.product.findMany({
        where: {
          productType: "SINGLE",

          status: {
            not: "ARCHIVED",
          },
        },

        select: {
          id: true,
          name: true,
          sku: true,
          stock: true,
          status: true,
          productType: true,
        },

        orderBy: {
          name: "asc",
        },
      });

    return res.status(200).json({
      products,
    });
  } catch (error) {
    console.error(
      "Failed to load gift rule lookups:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to load gift rule options.",
    });
  }
}