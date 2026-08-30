import type {
  Request,
  Response,
} from "express";

import {
  PrismaClient,
} from "../generated/prisma/client.js";

import { PrismaPg } from "@prisma/adapter-pg";

import {
  createAdminPromotionSchema,
} from "../validators/adminPromotion.js";

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

class PromotionValidationError
  extends Error {
  constructor(message: string) {
    super(message);

    this.name =
      "PromotionValidationError";
  }
}

/* =========================
   CREATE PROMOTION
========================= */

export async function createPromotion(
  req: Request,
  res: Response
) {
  const parsed =
    createAdminPromotionSchema.safeParse(
      req.body
    );

  if (!parsed.success) {
    return res.status(400).json({
      message:
        "Invalid promotion data.",

      errors:
        parsed.error.flatten(),
    });
  }

  const data = parsed.data;

  try {
    const uniqueProductIds = [
      ...new Set(
        data.productIds
      ),
    ];

    const uniqueCategoryIds = [
      ...new Set(
        data.categoryIds
      ),
    ];

    const uniqueCollectionIds = [
      ...new Set(
        data.collectionIds
      ),
    ];

    const [
      validProducts,
      validCategories,
      validCollections,
    ] = await Promise.all([
      uniqueProductIds.length > 0
        ? prisma.product.findMany({
            where: {
              id: {
                in:
                  uniqueProductIds,
              },

              status: {
                not: "ARCHIVED",
              },
            },

            select: {
              id: true,
            },
          })
        : Promise.resolve([]),

      uniqueCategoryIds.length > 0
        ? prisma.category.findMany({
            where: {
              id: {
                in:
                  uniqueCategoryIds,
              },

              isActive: true,
            },

            select: {
              id: true,
            },
          })
        : Promise.resolve([]),

      uniqueCollectionIds.length > 0
        ? prisma.collection.findMany({
            where: {
              id: {
                in:
                  uniqueCollectionIds,
              },

              isActive: true,
            },

            select: {
              id: true,
            },
          })
        : Promise.resolve([]),
    ]);

    if (
      data.scope ===
        "SELECTED_PRODUCTS" &&
      validProducts.length !==
        uniqueProductIds.length
    ) {
      throw new PromotionValidationError(
        "One or more selected products are invalid."
      );
    }

    if (
      data.scope ===
        "CATEGORIES" &&
      validCategories.length !==
        uniqueCategoryIds.length
    ) {
      throw new PromotionValidationError(
        "One or more selected categories are invalid."
      );
    }

    if (
      data.scope ===
        "COLLECTIONS" &&
      validCollections.length !==
        uniqueCollectionIds.length
    ) {
      throw new PromotionValidationError(
        "One or more selected collections are invalid."
      );
    }

    const promotion =
      await prisma.promotion.create({
        data: {
          name:
            data.name,

          type:
            data.type,

          discountType:
            data.discountType,

          discountValue:
            data.discountValue,

          scope:
            data.scope,

          startAt:
            data.startAt,

          endAt:
            data.endAt,

          isActive:
            data.isActive,

          products:
            data.scope ===
              "SELECTED_PRODUCTS"
              ? {
                  create:
                    uniqueProductIds.map(
                      (productId) => ({
                        productId,
                      })
                    ),
                }
              : undefined,

          categories:
            data.scope ===
              "CATEGORIES"
              ? {
                  create:
                    uniqueCategoryIds.map(
                      (categoryId) => ({
                        categoryId,
                      })
                    ),
                }
              : undefined,

          collections:
            data.scope ===
              "COLLECTIONS"
              ? {
                  create:
                    uniqueCollectionIds.map(
                      (
                        collectionId
                      ) => ({
                        collectionId,
                      })
                    ),
                }
              : undefined,
        },

        include: {
          products: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                },
              },
            },
          },

          categories: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },

          collections: {
            include: {
              collection: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      });

    return res.status(201).json({
      message:
        "Promotion created successfully.",

      promotion: {
        id:
          promotion.id,

        name:
          promotion.name,

        type:
          promotion.type,

        discountType:
          promotion.discountType,

        discountValue:
          promotion.discountValue.toString(),

        scope:
          promotion.scope,

        startAt:
          promotion.startAt,

        endAt:
          promotion.endAt,

        isActive:
          promotion.isActive,

        products:
          promotion.products.map(
            (item) =>
              item.product
          ),

        categories:
          promotion.categories.map(
            (item) =>
              item.category
          ),

        collections:
          promotion.collections.map(
            (item) =>
              item.collection
          ),

        createdAt:
          promotion.createdAt,

        updatedAt:
          promotion.updatedAt,
      },
    });
  } catch (error) {
    if (
      error instanceof
      PromotionValidationError
    ) {
      return res.status(400).json({
        message:
          error.message,
      });
    }

    console.error(
      "Failed to create promotion:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to create promotion.",
    });
  }
}

/* =========================
   GET PROMOTIONS
========================= */

export async function getPromotions(
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

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const type =
      typeof req.query.type === "string"
        ? req.query.type
        : "";

    const discountType =
      typeof req.query.discountType ===
      "string"
        ? req.query.discountType
        : "";

    const scope =
      typeof req.query.scope === "string"
        ? req.query.scope
        : "";

    const status =
      typeof req.query.status === "string"
        ? req.query.status
        : "";

    const now = new Date();

    /*
     * Build filters.
     *
     * Administrative isActive and
     * date-based status are intentionally
     * handled together here.
     */

    const where: any = {};

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (
      type === "WELCOME" ||
      type === "FESTIVAL"
    ) {
      where.type = type;
    }

    if (
      discountType === "PERCENTAGE" ||
      discountType === "FLAT"
    ) {
      where.discountType =
        discountType;
    }

    if (
      scope === "ALL_PRODUCTS" ||
      scope === "SELECTED_PRODUCTS" ||
      scope === "CATEGORIES" ||
      scope === "COLLECTIONS"
    ) {
      where.scope = scope;
    }

    /*
     * Effective promotion status:
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
      await prisma.promotion.count({
        where,
      });

    const totalPages = Math.max(
      Math.ceil(total / limit),
      1
    );

    /*
     * Protect against the same last-page
     * edge case handled in Products.
     */

    const safePage = Math.min(
      page,
      totalPages
    );

    const promotions =
      await prisma.promotion.findMany({
        where,

        skip:
          (safePage - 1) * limit,

        take: limit,

        orderBy: {
          createdAt: "desc",
        },

        include: {
          products: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                },
              },
            },
          },

          categories: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },

          collections: {
            include: {
              collection: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      });

    /*
     * Stats intentionally ignore the
     * current filters so the summary
     * cards describe the whole module.
     */

    const [
      totalPromotions,
      activePromotions,
      scheduledPromotions,
      inactivePromotions,
    ] = await Promise.all([
      prisma.promotion.count(),

      prisma.promotion.count({
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

      prisma.promotion.count({
        where: {
          isActive: true,

          startAt: {
            gt: now,
          },
        },
      }),

      prisma.promotion.count({
        where: {
          isActive: false,
        },
      }),
    ]);

    return res.status(200).json({
      promotions:
        promotions.map(
          (promotion) => ({
            id:
              promotion.id,

            name:
              promotion.name,

            type:
              promotion.type,

            discountType:
              promotion.discountType,

            discountValue:
              promotion.discountValue.toString(),

            scope:
              promotion.scope,

            startAt:
              promotion.startAt,

            endAt:
              promotion.endAt,

            isActive:
              promotion.isActive,

            products:
              promotion.products.map(
                (item) =>
                  item.product
              ),

            categories:
              promotion.categories.map(
                (item) =>
                  item.category
              ),

            collections:
              promotion.collections.map(
                (item) =>
                  item.collection
              ),

            createdAt:
              promotion.createdAt,

            updatedAt:
              promotion.updatedAt,
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
        totalPromotions,
        activePromotions,
        scheduledPromotions,
        inactivePromotions,
      },
    });
  } catch (error) {
    console.error(
      "Failed to fetch promotions:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to load promotions.",
    });
  }
}

export async function getPromotionById(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const promotion =
      await prisma.promotion.findUnique({
        where: {
          id,
        },

        include: {
          products: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                },
              },
            },
          },

          categories: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },

          collections: {
            include: {
              collection: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      });

    if (!promotion) {
      return res.status(404).json({
        message:
          "Promotion not found.",
      });
    }

    return res.status(200).json({
      promotion: {
        id:
          promotion.id,

        name:
          promotion.name,

        type:
          promotion.type,

        discountType:
          promotion.discountType,

        discountValue:
          promotion.discountValue.toString(),

        scope:
          promotion.scope,

        startAt:
          promotion.startAt,

        endAt:
          promotion.endAt,

        isActive:
          promotion.isActive,

        products:
          promotion.products.map(
            (item) =>
              item.product
          ),

        categories:
          promotion.categories.map(
            (item) =>
              item.category
          ),

        collections:
          promotion.collections.map(
            (item) =>
              item.collection
          ),

        createdAt:
          promotion.createdAt,

        updatedAt:
          promotion.updatedAt,
      },
    });
  } catch (error) {
    console.error(
      "Failed to fetch promotion:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to load promotion.",
    });
  }
}

/* =========================
   UPDATE PROMOTION
========================= */

export async function updatePromotion(
  req: Request<{ id: string }>,
  res: Response
) {
  const { id } = req.params;

  const parsed =
    createAdminPromotionSchema.safeParse(
      req.body
    );

  if (!parsed.success) {
    return res.status(400).json({
      message:
        "Invalid promotion data.",

      errors:
        parsed.error.flatten(),
    });
  }

  const data = parsed.data;

  try {
    const existingPromotion =
      await prisma.promotion.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
        },
      });

    if (!existingPromotion) {
      return res.status(404).json({
        message:
          "Promotion not found.",
      });
    }

    const uniqueProductIds = [
      ...new Set(data.productIds),
    ];

    const uniqueCategoryIds = [
      ...new Set(data.categoryIds),
    ];

    const uniqueCollectionIds = [
      ...new Set(data.collectionIds),
    ];

    /*
     * Only validate IDs belonging to
     * the currently selected scope.
     */

    if (
      data.scope ===
      "SELECTED_PRODUCTS"
    ) {
      const validProducts =
        await prisma.product.findMany({
          where: {
            id: {
              in: uniqueProductIds,
            },

            status: {
              not: "ARCHIVED",
            },
          },

          select: {
            id: true,
          },
        });

      if (
        validProducts.length !==
        uniqueProductIds.length
      ) {
        throw new PromotionValidationError(
          "One or more selected products are invalid."
        );
      }
    }

    if (
      data.scope ===
      "CATEGORIES"
    ) {
      const validCategories =
        await prisma.category.findMany({
          where: {
            id: {
              in: uniqueCategoryIds,
            },

            isActive: true,
          },

          select: {
            id: true,
          },
        });

      if (
        validCategories.length !==
        uniqueCategoryIds.length
      ) {
        throw new PromotionValidationError(
          "One or more selected categories are invalid."
        );
      }
    }

    if (
      data.scope ===
      "COLLECTIONS"
    ) {
      const validCollections =
        await prisma.collection.findMany({
          where: {
            id: {
              in: uniqueCollectionIds,
            },

            isActive: true,
          },

          select: {
            id: true,
          },
        });

      if (
        validCollections.length !==
        uniqueCollectionIds.length
      ) {
        throw new PromotionValidationError(
          "One or more selected collections are invalid."
        );
      }
    }

    /*
     * Replace the old applicability
     * mappings with the new scope.
     */

    const promotion =
      await prisma.$transaction(
        async (tx) => {
          await Promise.all([
            tx.promotionProduct.deleteMany({
              where: {
                promotionId: id,
              },
            }),

            tx.promotionCategory.deleteMany({
              where: {
                promotionId: id,
              },
            }),

            tx.promotionCollection.deleteMany({
              where: {
                promotionId: id,
              },
            }),
          ]);

          return tx.promotion.update({
            where: {
              id,
            },

            data: {
              name:
                data.name,

              type:
                data.type,

              discountType:
                data.discountType,

              discountValue:
                data.discountValue,

              scope:
                data.scope,

              startAt:
                data.startAt,

              endAt:
                data.endAt,

              isActive:
                data.isActive,

              products:
                data.scope ===
                "SELECTED_PRODUCTS"
                  ? {
                      create:
                        uniqueProductIds.map(
                          (productId) => ({
                            productId,
                          })
                        ),
                    }
                  : undefined,

              categories:
                data.scope ===
                "CATEGORIES"
                  ? {
                      create:
                        uniqueCategoryIds.map(
                          (categoryId) => ({
                            categoryId,
                          })
                        ),
                    }
                  : undefined,

              collections:
                data.scope ===
                "COLLECTIONS"
                  ? {
                      create:
                        uniqueCollectionIds.map(
                          (collectionId) => ({
                            collectionId,
                          })
                        ),
                    }
                  : undefined,
            },

            include: {
              products: {
                include: {
                  product: {
                    select: {
                      id: true,
                      name: true,
                      sku: true,
                    },
                  },
                },
              },

              categories: {
                include: {
                  category: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                    },
                  },
                },
              },

              collections: {
                include: {
                  collection: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          });
        },
        {
          // Your Product update already hit Prisma's
          // default 5-second transaction limit before.
          timeout: 15000,
        }
      );

    return res.status(200).json({
      message:
        "Promotion updated successfully.",

      promotion: {
        id:
          promotion.id,

        name:
          promotion.name,

        type:
          promotion.type,

        discountType:
          promotion.discountType,

        discountValue:
          promotion.discountValue.toString(),

        scope:
          promotion.scope,

        startAt:
          promotion.startAt,

        endAt:
          promotion.endAt,

        isActive:
          promotion.isActive,

        products:
          promotion.products.map(
            (item) =>
              item.product
          ),

        categories:
          promotion.categories.map(
            (item) =>
              item.category
          ),

        collections:
          promotion.collections.map(
            (item) =>
              item.collection
          ),

        createdAt:
          promotion.createdAt,

        updatedAt:
          promotion.updatedAt,
      },
    });
  } catch (error) {
    if (
      error instanceof
      PromotionValidationError
    ) {
      return res.status(400).json({
        message:
          error.message,
      });
    }

    console.error(
      "Failed to update promotion:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to update promotion.",
    });
  }
}

export async function updatePromotionStatus(
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

    const promotion =
      await prisma.promotion.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
        },
      });

    if (!promotion) {
      return res.status(404).json({
        message:
          "Promotion not found.",
      });
    }

    const updatedPromotion =
      await prisma.promotion.update({
        where: {
          id,
        },

        data: {
          isActive,
        },

        select: {
          id: true,
          name: true,
          isActive: true,
          updatedAt: true,
        },
      });

    return res.status(200).json({
      message:
        "Promotion status updated successfully.",

      promotion:
        updatedPromotion,
    });
  } catch (error) {
    console.error(
      "Failed to update promotion status:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to update promotion status.",
    });
  }
}

/* =========================
   PROMOTION LOOKUPS
========================= */

export async function getPromotionLookups(
  req: Request,
  res: Response
) {
  try {
    const [
      products,
      categories,
      collections,
    ] = await Promise.all([
      prisma.product.findMany({
        where: {
          status: {
            not: "ARCHIVED",
          },
        },

        select: {
          id: true,
          name: true,
          sku: true,
          productType: true,
          status: true,
        },

        orderBy: {
          name: "asc",
        },
      }),

      prisma.category.findMany({
        where: {
          isActive: true,
        },

        select: {
          id: true,
          name: true,
          slug: true,
        },

        orderBy: {
          name: "asc",
        },
      }),

      prisma.collection.findMany({
        where: {
          isActive: true,
        },

        select: {
          id: true,
          name: true,
          slug: true,
        },

        orderBy: {
          name: "asc",
        },
      }),
    ]);

    return res.status(200).json({
      products,
      categories,
      collections,
    });
  } catch (error) {
    console.error(
      "Failed to load promotion lookups:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to load promotion options.",
    });
  }
}