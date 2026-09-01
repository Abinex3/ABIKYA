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
  createCategorySchema,
  updateCategorySchema,
  updateCategoryStatusSchema,
} from "../validators/adminCategory.js";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL!,
});

const prisma = new PrismaClient({
  adapter,
});


/* ======================================================
   GET CATEGORIES
====================================================== */

export async function getCategories(
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
        ? req.query.status.trim().toUpperCase()
        : "";

    const validStatuses =
      new Set([
        "ACTIVE",
        "INACTIVE",
      ]);

    if (
      status &&
      !validStatuses.has(status)
    ) {
      return res.status(400).json({
        message:
          "Invalid category status.",
      });
    }

    const where:
      Prisma.CategoryWhereInput = {
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
                  slug: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),

        ...(status === "ACTIVE"
          ? {
              isActive: true,
            }
          : {}),

        ...(status === "INACTIVE"
          ? {
              isActive: false,
            }
          : {}),
      };

    const [
      categories,
      filteredTotal,
      totalCategories,
      activeCategories,
      inactiveCategories,
    ] = await Promise.all([
      prisma.category.findMany({
        where,

        skip,
        take: limit,

        orderBy: {
          updatedAt: "desc",
        },

        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,

          _count: {
            select: {
              products: true,
              promotions: true,
            },
          },
        },
      }),

      prisma.category.count({
        where,
      }),

      prisma.category.count(),

      prisma.category.count({
        where: {
          isActive: true,
        },
      }),

      prisma.category.count({
        where: {
          isActive: false,
        },
      }),
    ]);

    const totalPages =
      Math.max(
        1,
        Math.ceil(
          filteredTotal / limit
        )
      );

    return res.status(200).json({
      categories:
        categories.map(
          (category) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            description:
              category.description,
            isActive:
              category.isActive,

            productCount:
              category._count.products,

            promotionCount:
              category._count.promotions,

            createdAt:
              category.createdAt,

            updatedAt:
              category.updatedAt,
          })
        ),

      pagination: {
        page,
        limit,
        total: filteredTotal,
        totalPages,

        hasNextPage:
          page < totalPages,

        hasPreviousPage:
          page > 1,
      },

      stats: {
        totalCategories,
        activeCategories,
        inactiveCategories,
      },
    });
  } catch (error) {
    console.error(
      "Failed to fetch categories:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to load categories.",
    });
  }
}


/* ======================================================
   GET CATEGORY BY ID
====================================================== */

export async function getCategoryById(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const category =
      await prisma.category.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,

          _count: {
            select: {
              products: true,
              promotions: true,
            },
          },
        },
      });

    if (!category) {
      return res.status(404).json({
        message:
          "Category not found.",
      });
    }

    return res.status(200).json({
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,

        description:
          category.description,

        isActive:
          category.isActive,

        productCount:
          category._count.products,

        promotionCount:
          category._count.promotions,

        createdAt:
          category.createdAt,

        updatedAt:
          category.updatedAt,
      },
    });
  } catch (error) {
    console.error(
      "Failed to fetch category:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to load category.",
    });
  }
}


/* ======================================================
   CREATE CATEGORY
====================================================== */

export async function createCategory(
  req: Request,
  res: Response
) {
  const parsed =
    createCategorySchema.safeParse(
      req.body
    );

  if (!parsed.success) {
    return res.status(400).json({
      message:
        "Invalid category data.",

      errors:
        parsed.error.flatten(),
    });
  }

  const data = parsed.data;

  try {
    const category =
      await prisma.category.create({
        data: {
          name: data.name,
          slug: data.slug,

          description:
            data.description || null,

          isActive:
            data.isActive,
        },

        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    return res.status(201).json({
      message:
        "Category created successfully.",

      category,
    });
  } catch (error) {
    if (
      error instanceof
        Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        message:
          "A category with this name or slug already exists.",
      });
    }

    console.error(
      "Failed to create category:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to create category.",
    });
  }
}


/* ======================================================
   UPDATE CATEGORY
====================================================== */

export async function updateCategory(
  req: Request<{ id: string }>,
  res: Response
) {
  const { id } = req.params;

  const parsed =
    updateCategorySchema.safeParse(
      req.body
    );

  if (!parsed.success) {
    return res.status(400).json({
      message:
        "Invalid category data.",

      errors:
        parsed.error.flatten(),
    });
  }

  const data = parsed.data;

  try {
    const existingCategory =
      await prisma.category.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
        },
      });

    if (!existingCategory) {
      return res.status(404).json({
        message:
          "Category not found.",
      });
    }

    const category =
      await prisma.category.update({
        where: {
          id,
        },

        data: {
          name: data.name,
          slug: data.slug,

          description:
            data.description || null,

          isActive:
            data.isActive,
        },

        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,

          _count: {
            select: {
              products: true,
              promotions: true,
            },
          },
        },
      });

    return res.status(200).json({
      message:
        "Category updated successfully.",

      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,

        description:
          category.description,

        isActive:
          category.isActive,

        productCount:
          category._count.products,

        promotionCount:
          category._count.promotions,

        createdAt:
          category.createdAt,

        updatedAt:
          category.updatedAt,
      },
    });
  } catch (error) {
    if (
      error instanceof
        Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        message:
          "A category with this name or slug already exists.",
      });
    }

    console.error(
      "Failed to update category:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to update category.",
    });
  }
}


/* ======================================================
   UPDATE CATEGORY STATUS
====================================================== */

export async function updateCategoryStatus(
  req: Request<{ id: string }>,
  res: Response
) {
  const { id } = req.params;

  const parsed =
    updateCategoryStatusSchema.safeParse(
      req.body
    );

  if (!parsed.success) {
    return res.status(400).json({
      message:
        "Invalid category status.",

      errors:
        parsed.error.flatten(),
    });
  }

  try {
    const existingCategory =
      await prisma.category.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
        },
      });

    if (!existingCategory) {
      return res.status(404).json({
        message:
          "Category not found.",
      });
    }

    const category =
      await prisma.category.update({
        where: {
          id,
        },

        data: {
          isActive:
            parsed.data.isActive,
        },

        select: {
          id: true,
          name: true,
          slug: true,
          isActive: true,
          updatedAt: true,
        },
      });

    return res.status(200).json({
      message:
        category.isActive
          ? "Category enabled successfully."
          : "Category disabled successfully.",

      category,
    });
  } catch (error) {
    console.error(
      "Failed to update category status:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to update category status.",
    });
  }
}