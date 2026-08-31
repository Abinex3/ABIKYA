import type {
  Request,
  Response,
} from "express";

import {
  PrismaClient,
  Prisma,
} from "../generated/prisma/client.js";

import { PrismaPg } from "@prisma/adapter-pg";

import {
  inventoryMovementSchema,
  updateLowStockThresholdSchema
} from "../validators/adminInventory.js";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

class InventoryValidationError
  extends Error {
  statusCode: number;

  constructor(
    message: string,
    statusCode = 400
  ) {
    super(message);

    this.name =
      "InventoryValidationError";

    this.statusCode =
      statusCode;
  }
}

export async function getInventory(
  req: Request,
  res: Response
) {
  try {
    const pageRaw =
      typeof req.query.page === "string"
        ? Number(req.query.page)
        : 1;

    const limitRaw =
      typeof req.query.limit === "string"
        ? Number(req.query.limit)
        : 20;

    const page =
      Number.isInteger(pageRaw) &&
      pageRaw > 0
        ? pageRaw
        : 1;

    const limit =
      Number.isInteger(limitRaw) &&
      limitRaw > 0
        ? Math.min(limitRaw, 100)
        : 20;

    const skip =
      (page - 1) * limit;

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const status =
      typeof req.query.status === "string"
        ? req.query.status.trim()
        : "";

    const stockStatus =
      typeof req.query.stockStatus === "string"
        ? req.query.stockStatus.trim()
        : "";

    const validStatuses = new Set([
      "DRAFT",
      "ACTIVE",
      "ARCHIVED",
    ]);

    const validStockStatuses = new Set([
      "LOW",
      "OUT",
      "IN_STOCK",
    ]);

    if (
      status &&
      !validStatuses.has(status)
    ) {
      return res.status(400).json({
        message: "Invalid product status.",
      });
    }

    if (
      stockStatus &&
      !validStockStatuses.has(stockStatus)
    ) {
      return res.status(400).json({
        message: "Invalid stock status.",
      });
    }

    /*
     * LOW stock requires comparing two columns:
     * stock <= lowStockThreshold
     *
     * Prisma scalar filters do not directly handle
     * this comparison cleanly, so fetch matching IDs
     * with a small read-only SQL query.
     *
     * Archived products are excluded from operational
     * low-stock alerts.
     */
    const lowStockRows =
      await prisma.$queryRaw<
        Array<{ id: string }>
      >(Prisma.sql`
        SELECT "id"
        FROM "Product"
        WHERE "productType" = 'SINGLE'
          AND "status" <> 'ARCHIVED'
          AND "stock" > 0
          AND "stock" <= "lowStockThreshold"
      `);

    const lowStockProductIds =
      lowStockRows.map(
        (product) => product.id
      );

    const where: Prisma.ProductWhereInput = {
      productType: "SINGLE",

      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                sku: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),

      ...(status
        ? {
            status:
              status as
                | "DRAFT"
                | "ACTIVE"
                | "ARCHIVED",
          }
        : {}),

      ...(stockStatus === "OUT"
        ? {
            stock: 0,
          }
        : {}),

      ...(stockStatus === "IN_STOCK"
        ? {
            stock: {
              gt: 0,
            },
          }
        : {}),

      ...(stockStatus === "LOW"
        ? {
            id: {
              in: lowStockProductIds,
            },
          }
        : {}),
    };

    const [
      products,
      filteredTotal,
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
    ] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,

        orderBy: {
          updatedAt: "desc",
        },

        select: {
          id: true,
          name: true,
          sku: true,
          stock: true,
          lowStockThreshold: true,
          status: true,
          jewelleryType: true,
          updatedAt: true,

          images: {
            where: {
              type: "PRODUCT",
            },
            select: {
              id: true,
              url: true,
            },
            take: 1,
          },
        },
      }),

      prisma.product.count({
        where,
      }),

      prisma.product.count({
        where: {
          productType: "SINGLE",
        },
      }),

      Promise.resolve(
        lowStockProductIds.length
      ),

      prisma.product.count({
        where: {
          productType: "SINGLE",
          stock: 0,
          status: {
            not: "ARCHIVED",
          },
        },
      }),
    ]);

    const formattedProducts =
      products.map((product) => {
        const stock =
          product.stock ?? 0;

        const derivedStockStatus =
          stock === 0
            ? "OUT"
            : stock <=
                product.lowStockThreshold
              ? "LOW"
              : "IN_STOCK";

        return {
          id: product.id,
          name: product.name,
          sku: product.sku,

          stock,

          lowStockThreshold:
            product.lowStockThreshold,

          status:
            product.status,

          jewelleryType:
            product.jewelleryType,

          stockStatus:
            derivedStockStatus,

          image:
            product.images[0] ?? null,

          updatedAt:
            product.updatedAt,
        };
      });

    const totalPages =
      Math.max(
        1,
        Math.ceil(
          filteredTotal / limit
        )
      );

    return res.status(200).json({
      products:
        formattedProducts,

      pagination: {
        page,
        limit,
        total:
          filteredTotal,
        totalPages,
        hasNextPage:
          page < totalPages,
        hasPreviousPage:
          page > 1,
      },

      stats: {
        totalProducts,
        lowStockProducts,
        outOfStockProducts,
      },
    });
  } catch (error) {
    console.error(
      "Failed to fetch inventory:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to load inventory.",
    });
  }
}


export async function getInventoryHistory(
  req: Request<{ productId: string }>,
  res: Response
) {
  try {
    const { productId } = req.params;

    /* =========================
       QUERY PARAMS
    ========================= */

    const month =
      typeof req.query.month === "string"
        ? req.query.month.trim()
        : "";

    const date =
      typeof req.query.date === "string"
        ? req.query.date.trim()
        : "";

    const type =
      typeof req.query.type === "string"
        ? req.query.type.trim()
        : "";

    const source =
      typeof req.query.source === "string"
        ? req.query.source.trim()
        : "";

    const pageRaw =
      typeof req.query.page === "string"
        ? Number(req.query.page)
        : 1;

    const limitRaw =
      typeof req.query.limit === "string"
        ? Number(req.query.limit)
        : 50;

    const page =
      Number.isInteger(pageRaw) &&
      pageRaw > 0
        ? pageRaw
        : 1;

    const limit =
      Number.isInteger(limitRaw) &&
      limitRaw > 0
        ? Math.min(limitRaw, 100)
        : 50;

    const skip =
      (page - 1) * limit;

    /* =========================
       VALIDATE PRODUCT
    ========================= */

    const product =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },

        select: {
          id: true,
          name: true,
          sku: true,
          productType: true,
          stock: true,
          lowStockThreshold: true,
          status: true,
        },
      });

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    if (
      product.productType !== "SINGLE"
    ) {
      return res.status(400).json({
        message:
          "Inventory history is only available for single products.",
      });
    }

    /* =========================
       VALIDATE FILTERS
    ========================= */

    const validTypes = new Set([
      "RECEIVE",
      "DAMAGE_LOSS",
      "RETURN",
      "MANUAL_ADJUSTMENT",
      "SALE",
      "ORDER_CANCEL_RETURN",
    ]);

    const validSources = new Set([
      "ADMIN",
      "ORDER",
    ]);

    if (
      type &&
      !validTypes.has(type)
    ) {
      return res.status(400).json({
        message:
          "Invalid inventory movement type.",
      });
    }

    if (
      source &&
      !validSources.has(source)
    ) {
      return res.status(400).json({
        message:
          "Invalid inventory movement source.",
      });
    }

    if (
      month &&
      !/^\d{4}-\d{2}$/.test(month)
    ) {
      return res.status(400).json({
        message:
          "Month must use YYYY-MM format.",
      });
    }

    if (
      date &&
      !/^\d{4}-\d{2}-\d{2}$/.test(date)
    ) {
      return res.status(400).json({
        message:
          "Date must use YYYY-MM-DD format.",
      });
    }

    /*
     * Do not allow both date and month.
     * Date is already more specific.
     */
    if (
      month &&
      date
    ) {
      return res.status(400).json({
        message:
          "Use either month or date, not both.",
      });
    }

    /* =========================
       DATE RANGE
    ========================= */

    let createdAtFilter:
      Prisma.DateTimeFilter | undefined;

    if (date) {
      const [
        year,
        monthNumber,
        day,
      ] =
        date
          .split("-")
          .map(Number);

      const start =
        new Date(
          Date.UTC(
            year,
            monthNumber - 1,
            day,
            0,
            0,
            0,
            0
          )
        );

      const end =
        new Date(
          Date.UTC(
            year,
            monthNumber - 1,
            day + 1,
            0,
            0,
            0,
            0
          )
        );

      if (
        Number.isNaN(
          start.getTime()
        ) ||
        Number.isNaN(
          end.getTime()
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid history date.",
        });
      }

      createdAtFilter = {
        gte: start,
        lt: end,
      };
    }

    if (month) {
      const [
        year,
        monthNumber,
      ] =
        month
          .split("-")
          .map(Number);

      if (
        monthNumber < 1 ||
        monthNumber > 12
      ) {
        return res.status(400).json({
          message:
            "Invalid history month.",
        });
      }

      const start =
        new Date(
          Date.UTC(
            year,
            monthNumber - 1,
            1,
            0,
            0,
            0,
            0
          )
        );

      const end =
        new Date(
          Date.UTC(
            year,
            monthNumber,
            1,
            0,
            0,
            0,
            0
          )
        );

      createdAtFilter = {
        gte: start,
        lt: end,
      };
    }

    /* =========================
       MOVEMENT FILTER
    ========================= */

    const orderTypes = [
      "SALE",
      "ORDER_CANCEL_RETURN",
    ] as const;

    const adminTypes = [
      "RECEIVE",
      "DAMAGE_LOSS",
      "RETURN",
      "MANUAL_ADJUSTMENT",
    ] as const;

    const where:
      Prisma.InventoryMovementWhereInput =
      {
        productId,

        ...(createdAtFilter
          ? {
              createdAt:
                createdAtFilter,
            }
          : {}),

        ...(type
          ? {
              type:
                type as
                  | "RECEIVE"
                  | "DAMAGE_LOSS"
                  | "RETURN"
                  | "MANUAL_ADJUSTMENT"
                  | "SALE"
                  | "ORDER_CANCEL_RETURN",
            }
          : {}),

        ...(source === "ORDER"
          ? {
              type: {
                in: [
                  ...orderTypes,
                ],
              },
            }
          : {}),

        ...(source === "ADMIN"
          ? {
              type: {
                in: [
                  ...adminTypes,
                ],
              },
            }
          : {}),
      };

    /*
     * Prevent ambiguous filtering like:
     * ?type=SALE&source=ADMIN
     */
    if (
      type &&
      source === "ORDER" &&
      !orderTypes.includes(
        type as
          | "SALE"
          | "ORDER_CANCEL_RETURN"
      )
    ) {
      return res.status(400).json({
        message:
          "Selected movement type does not belong to the Order source.",
      });
    }

    if (
      type &&
      source === "ADMIN" &&
      !adminTypes.includes(
        type as
          | "RECEIVE"
          | "DAMAGE_LOSS"
          | "RETURN"
          | "MANUAL_ADJUSTMENT"
      )
    ) {
      return res.status(400).json({
        message:
          "Selected movement type does not belong to the Admin source.",
      });
    }

    /* =========================
       FETCH HISTORY
    ========================= */

    const [
      movements,
      filteredTotal,
    ] =
      await Promise.all([
        prisma.inventoryMovement.findMany({
          where,

          skip,
          take: limit,

          orderBy: {
            createdAt:
              "desc",
          },

          select: {
            id: true,

            type: true,

            quantityDelta:
              true,

            stockBefore:
              true,

            stockAfter:
              true,

            note: true,

            createdAt:
              true,

            admin: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        }),

        prisma.inventoryMovement.count({
          where,
        }),
      ]);

    /* =========================
       STATS
    ========================= */

    const [
      totalMovements,
      totalOrderMovements,
      totalAdminMovements,
    ] =
      await Promise.all([
        prisma.inventoryMovement.count({
          where: {
            productId,
          },
        }),

        prisma.inventoryMovement.count({
          where: {
            productId,

            type: {
              in: [
                "SALE",
                "ORDER_CANCEL_RETURN",
              ],
            },
          },
        }),

        prisma.inventoryMovement.count({
          where: {
            productId,

            type: {
              in: [
                "RECEIVE",
                "DAMAGE_LOSS",
                "RETURN",
                "MANUAL_ADJUSTMENT",
              ],
            },
          },
        }),
      ]);

    const totalPages =
      Math.max(
        1,
        Math.ceil(
          filteredTotal /
            limit
        )
      );

    /* =========================
       RESPONSE
    ========================= */

    return res.status(200).json({
      product: {
        id:
          product.id,

        name:
          product.name,

        sku:
          product.sku,

        stock:
          product.stock ??
          0,

        lowStockThreshold:
          product.lowStockThreshold,

        status:
          product.status,
      },

      movements,

      pagination: {
        page,
        limit,

        total:
          filteredTotal,

        totalPages,

        hasNextPage:
          page <
          totalPages,

        hasPreviousPage:
          page > 1,
      },

      stats: {
        totalMovements,
        totalOrderMovements,
        totalAdminMovements,
      },

      filters: {
        month:
          month || null,

        date:
          date || null,

        type:
          type || null,

        source:
          source || null,
      },
    });
  } catch (error) {
    console.error(
      "Failed to fetch inventory history:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to load inventory history.",
    });
  }
}

export async function createInventoryMovement(
  req: Request<{ productId: string }>,
  res: Response
) {
  const { productId } = req.params;

  const parsed =
    inventoryMovementSchema.safeParse(
      req.body
    );

  if (!parsed.success) {
    return res.status(400).json({
      message:
        "Invalid inventory movement data.",
      errors:
        parsed.error.flatten(),
    });
  }

  const data = parsed.data;

  try {
    /*
     * requireAdmin should attach the authenticated
     * admin to the request.
     *
     * We will verify the exact property name against
     * your middleware if TypeScript complains here.
     */
    const adminId =
      (req as Request & {
        admin?: { id: string };
      }).admin?.id;

    if (!adminId) {
      return res.status(401).json({
        message:
          "Admin authentication required.",
      });
    }

    let quantityDelta: number;

    switch (data.type) {
      case "RECEIVE":
      case "RETURN":
        quantityDelta =
          data.quantity;
        break;

      case "DAMAGE_LOSS":
        quantityDelta =
          -data.quantity;
        break;

      case "MANUAL_ADJUSTMENT":
        quantityDelta =
          data.quantity;
        break;
    }

    const result =
      await prisma.$transaction(
        async (tx) => {
          const product =
            await tx.product.findUnique({
              where: {
                id: productId,
              },

              select: {
                id: true,
                name: true,
                sku: true,
                productType: true,
                status: true,
                stock: true,
                lowStockThreshold: true,
              },
            });

          if (!product) {
            throw new InventoryValidationError(
              "Product not found.",
              404
            );
          }

          if (
            product.productType !==
            "SINGLE"
          ) {
            throw new InventoryValidationError(
              "Inventory movements are only allowed for single products.",
              400
            );
          }

          if (
            product.status ===
            "ARCHIVED"
          ) {
            throw new InventoryValidationError(
              "Archived products cannot receive inventory movements. Restore the product first.",
              400
            );
          }

          if (product.stock == null) {
            throw new InventoryValidationError(
              "Product stock is not available.",
              400
            );
          }

          const stockBefore =
            product.stock;

          const stockAfter =
            stockBefore +
            quantityDelta;

          if (stockAfter < 0) {
            throw new InventoryValidationError(
              "Inventory movement would result in negative stock.",
              400
            );
          }

          const updatedProduct =
            await tx.product.update({
              where: {
                id: productId,
              },

              data: {
                stock: stockAfter,
              },

              select: {
                id: true,
                name: true,
                sku: true,
                stock: true,
                lowStockThreshold: true,
                status: true,
                updatedAt: true,
              },
            });

          const movement =
            await tx.inventoryMovement.create({
              data: {
                productId,
                type: data.type,
                quantityDelta,
                stockBefore,
                stockAfter,
                note:
                  data.note || null,
                adminId,
              },

              select: {
                id: true,
                type: true,
                quantityDelta: true,
                stockBefore: true,
                stockAfter: true,
                note: true,
                createdAt: true,

                admin: {
                  select: {
                    id: true,
                    email: true,
                    role: true,
                  },
                },
              },
            });

          return {
            product:
              updatedProduct,
            movement,
          };
        }
      );

    return res.status(201).json({
      message:
        "Inventory updated successfully.",
      product:
        result.product,
      movement:
        result.movement,
    });
  } catch (error) {
    if (
      error instanceof
      InventoryValidationError
    ) {
      return res.status(
        error.statusCode
      ).json({
        message:
          error.message,
      });
    }

    console.error(
      "Failed to create inventory movement:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to update inventory.",
    });
  }
}

export async function updateLowStockThreshold(
  req: Request<{ productId: string }>,
  res: Response
) {
  const { productId } = req.params;

  const parsed =
    updateLowStockThresholdSchema.safeParse(
      req.body
    );

  if (!parsed.success) {
    return res.status(400).json({
      message:
        "Invalid low-stock threshold.",
      errors:
        parsed.error.flatten(),
    });
  }

  try {
    const product =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },

        select: {
          id: true,
          productType: true,
          status: true,
        },
      });

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    if (
      product.productType !== "SINGLE"
    ) {
      return res.status(400).json({
        message:
          "Low-stock thresholds are only available for single products.",
      });
    }

    if (
      product.status === "ARCHIVED"
    ) {
      return res.status(400).json({
        message:
          "Archived products cannot be updated. Restore the product first.",
      });
    }

    const updatedProduct =
      await prisma.product.update({
        where: {
          id: productId,
        },

        data: {
          lowStockThreshold:
            parsed.data.lowStockThreshold,
        },

        select: {
          id: true,
          name: true,
          sku: true,
          stock: true,
          lowStockThreshold: true,
          status: true,
          updatedAt: true,
        },
      });

    return res.status(200).json({
      message:
        "Low-stock threshold updated successfully.",
      product:
        updatedProduct,
    });
  } catch (error) {
    console.error(
      "Failed to update low-stock threshold:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to update low-stock threshold.",
    });
  }
}

export async function createOrderInventoryMovement(
  req: Request<{ productId: string }>,
  res: Response
) {
  const { productId } = req.params;

  const type =
    typeof req.body?.type === "string"
      ? req.body.type
      : "";

  const quantity =
    Number(req.body?.quantity);

  const note =
    typeof req.body?.note === "string"
      ? req.body.note.trim()
      : "";

  if (
    type !== "SALE" &&
    type !== "ORDER_CANCEL_RETURN"
  ) {
    return res.status(400).json({
      message:
        "Order movement type must be SALE or ORDER_CANCEL_RETURN.",
    });
  }

  if (
    !Number.isInteger(quantity) ||
    quantity <= 0
  ) {
    return res.status(400).json({
      message:
        "Quantity must be a whole number greater than 0.",
    });
  }

  if (note.length > 500) {
    return res.status(400).json({
      message:
        "Note must be 500 characters or less.",
    });
  }

  try {
    const adminId =
      (
        req as Request & {
          admin?: {
            id: string;
          };
        }
      ).admin?.id;

    if (!adminId) {
      return res.status(401).json({
        message:
          "Admin authentication required.",
      });
    }

    const quantityDelta =
      type === "SALE"
        ? -quantity
        : quantity;

    const result =
      await prisma.$transaction(
        async (tx) => {
          const product =
            await tx.product.findUnique({
              where: {
                id: productId,
              },

              select: {
                id: true,
                name: true,
                sku: true,
                productType: true,
                status: true,
                stock: true,
                lowStockThreshold: true,
              },
            });

          if (!product) {
            throw new InventoryValidationError(
              "Product not found.",
              404
            );
          }

          if (
            product.productType !==
            "SINGLE"
          ) {
            throw new InventoryValidationError(
              "Order inventory movements are only allowed for single products.",
              400
            );
          }

          if (
            product.status ===
            "ARCHIVED"
          ) {
            throw new InventoryValidationError(
              "Archived products cannot receive order inventory movements.",
              400
            );
          }

          if (
            product.stock == null
          ) {
            throw new InventoryValidationError(
              "Product stock is not available.",
              400
            );
          }

          const stockBefore =
            product.stock;

          const stockAfter =
            stockBefore +
            quantityDelta;

          if (stockAfter < 0) {
            throw new InventoryValidationError(
              "Order inventory movement would result in negative stock.",
              400
            );
          }

          const updatedProduct =
            await tx.product.update({
              where: {
                id: productId,
              },

              data: {
                stock:
                  stockAfter,
              },

              select: {
                id: true,
                name: true,
                sku: true,
                stock: true,
                lowStockThreshold: true,
                status: true,
                updatedAt: true,
              },
            });

          const movement =
            await tx.inventoryMovement.create({
              data: {
                productId,
                type,
                quantityDelta,
                stockBefore,
                stockAfter,
                note:
                  note || null,
                adminId,
              },

              select: {
                id: true,
                type: true,
                quantityDelta: true,
                stockBefore: true,
                stockAfter: true,
                note: true,
                createdAt: true,

                admin: {
                  select: {
                    id: true,
                    email: true,
                    role: true,
                  },
                },
              },
            });

          return {
            product:
              updatedProduct,
            movement,
          };
        }
      );

    return res.status(201).json({
      message:
        "Order inventory movement created successfully.",
      product:
        result.product,
      movement:
        result.movement,
    });
  } catch (error) {
    if (
      error instanceof
      InventoryValidationError
    ) {
      return res.status(
        error.statusCode
      ).json({
        message:
          error.message,
      });
    }

    console.error(
      "Failed to create order inventory movement:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to create order inventory movement.",
    });
  }
}