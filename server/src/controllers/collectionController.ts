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
  createCollectionSchema,
  updateCollectionSchema,
  updateCollectionStatusSchema,
} from "../validators/adminCollection.js";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL!,
});

const prisma = new PrismaClient({
  adapter,
});


/* ======================================================
   GET COLLECTIONS
====================================================== */

export async function getCollections(
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
          "Invalid collection status.",
      });
    }

    const where:
      Prisma.CollectionWhereInput = {
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
      collections,
      filteredTotal,
      totalCollections,
      activeCollections,
      inactiveCollections,
    ] = await Promise.all([
      prisma.collection.findMany({
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

      prisma.collection.count({
        where,
      }),

      prisma.collection.count(),

      prisma.collection.count({
        where: {
          isActive: true,
        },
      }),

      prisma.collection.count({
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
      collections:
        collections.map(
          (collection) => ({
            id: collection.id,
            name: collection.name,
            slug: collection.slug,

            description:
              collection.description,

            isActive:
              collection.isActive,

            productCount:
              collection._count.products,

            promotionCount:
              collection._count.promotions,

            createdAt:
              collection.createdAt,

            updatedAt:
              collection.updatedAt,
          })
        ),

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
        totalCollections,
        activeCollections,
        inactiveCollections,
      },
    });
  } catch (error) {
    console.error(
      "Failed to fetch collections:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to load collections.",
    });
  }
}


/* ======================================================
   GET COLLECTION BY ID
====================================================== */

export async function getCollectionById(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const collection =
      await prisma.collection.findUnique({
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

    if (!collection) {
      return res.status(404).json({
        message:
          "Collection not found.",
      });
    }

    return res.status(200).json({
      collection: {
        id: collection.id,
        name: collection.name,
        slug: collection.slug,

        description:
          collection.description,

        isActive:
          collection.isActive,

        productCount:
          collection._count.products,

        promotionCount:
          collection._count.promotions,

        createdAt:
          collection.createdAt,

        updatedAt:
          collection.updatedAt,
      },
    });
  } catch (error) {
    console.error(
      "Failed to fetch collection:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to load collection.",
    });
  }
}


/* ======================================================
   CREATE COLLECTION
====================================================== */

export async function createCollection(
  req: Request,
  res: Response
) {
  const parsed =
    createCollectionSchema.safeParse(
      req.body
    );

  if (!parsed.success) {
    return res.status(400).json({
      message:
        "Invalid collection data.",

      errors:
        parsed.error.flatten(),
    });
  }

  const data = parsed.data;

  try {
    const collection =
      await prisma.collection.create({
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
        "Collection created successfully.",

      collection,
    });
  } catch (error) {
    if (
      error instanceof
        Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        message:
          "A collection with this name or slug already exists.",
      });
    }

    console.error(
      "Failed to create collection:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to create collection.",
    });
  }
}


/* ======================================================
   UPDATE COLLECTION
====================================================== */

export async function updateCollection(
  req: Request<{ id: string }>,
  res: Response
) {
  const { id } = req.params;

  const parsed =
    updateCollectionSchema.safeParse(
      req.body
    );

  if (!parsed.success) {
    return res.status(400).json({
      message:
        "Invalid collection data.",

      errors:
        parsed.error.flatten(),
    });
  }

  const data = parsed.data;

  try {
    const existingCollection =
      await prisma.collection.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
        },
      });

    if (!existingCollection) {
      return res.status(404).json({
        message:
          "Collection not found.",
      });
    }

    const collection =
      await prisma.collection.update({
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
        "Collection updated successfully.",

      collection: {
        id: collection.id,
        name: collection.name,
        slug: collection.slug,

        description:
          collection.description,

        isActive:
          collection.isActive,

        productCount:
          collection._count.products,

        promotionCount:
          collection._count.promotions,

        createdAt:
          collection.createdAt,

        updatedAt:
          collection.updatedAt,
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
          "A collection with this name or slug already exists.",
      });
    }

    console.error(
      "Failed to update collection:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to update collection.",
    });
  }
}


/* ======================================================
   UPDATE COLLECTION STATUS
====================================================== */

export async function updateCollectionStatus(
  req: Request<{ id: string }>,
  res: Response
) {
  const { id } = req.params;

  const parsed =
    updateCollectionStatusSchema.safeParse(
      req.body
    );

  if (!parsed.success) {
    return res.status(400).json({
      message:
        "Invalid collection status.",

      errors:
        parsed.error.flatten(),
    });
  }

  try {
    const existingCollection =
      await prisma.collection.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
        },
      });

    if (!existingCollection) {
      return res.status(404).json({
        message:
          "Collection not found.",
      });
    }

    const collection =
      await prisma.collection.update({
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
        collection.isActive
          ? "Collection enabled successfully."
          : "Collection disabled successfully.",

      collection,
    });
  } catch (error) {
    console.error(
      "Failed to update collection status:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to update collection status.",
    });
  }
}