import type {
  Request,
  Response,
} from "express";

import { supabaseAdmin } from "../config/supabase.js";

import {
  processProductImage,
  processProductThumbnail,
} from "../services/productImageProcessor.js";


import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

import { createAdminProductSchema } from "../validators/adminProduct.js";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

class ProductValidationError extends Error {
  constructor(message: string) {
    super(message);

    this.name =
      "ProductValidationError";
  }
}

export async function getProductLookups(
  _req: Request,
  res: Response
) {
  try {
    const [
      categories,
      collections,
      materials,
      colors,
    ] = await Promise.all([
      prisma.category.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      }),

      prisma.collection.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      }),

      prisma.material.findMany({
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
        },
      }),

      prisma.color.findMany({
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          hexCode: true,
        },
      }),
    ]);

    return res.status(200).json({
      categories,
      collections,
      materials,
      colors,
    });
  } catch (error) {
    console.error(
      "Failed to fetch product lookups:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to load product lookup data.",
    });
  }
}


export async function getComboProductOptions(
  req: Request,
  res: Response
) {
  try {
    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const products =
      await prisma.product.findMany({
        where: {
          productType: "SINGLE",

          status: {
            not: "ARCHIVED",
          },

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
        },

        select: {
          id: true,
          name: true,
          sku: true,
          stock: true,
        },

        orderBy: {
          name: "asc",
        },

        take: 20,
      });

    return res.status(200).json({
      products,
    });
  } catch (error) {
    console.error(
      "Failed to fetch combo product options:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to load combo product options.",
    });
  }
}

export async function getNextProductSku(
  req: Request,
  res: Response
) {
  try {
    const jewelleryType =
      typeof req.query.jewelleryType === "string"
        ? req.query.jewelleryType
        : "";

    const productType =
      typeof req.query.productType === "string"
        ? req.query.productType
        : "SINGLE";

    const prefixMap: Record<string, string> = {
      STUD: "ST",
      RING: "RG",
      HOOP: "HP",
      BARBELL: "BB",
      CURVED_BARBELL: "CB",
      OTHER: "OT",
    };

    const code =
      productType === "COMBO"
        ? "CM"
        : prefixMap[jewelleryType];

    if (!code) {
      return res.status(400).json({
        message: "Invalid jewellery type.",
      });
    }

    const prefix = `ABK-${code}-`;

    const lastProduct =
      await prisma.product.findFirst({
        where: {
          sku: {
            startsWith: prefix,
          },
        },

        orderBy: {
          sku: "desc",
        },

        select: {
          sku: true,
        },
      });

    let nextNumber = 1;

    if (lastProduct) {
      const lastPart =
        lastProduct.sku.split("-").pop();

      const parsedNumber =
        Number(lastPart);

      if (!Number.isNaN(parsedNumber)) {
        nextNumber = parsedNumber + 1;
      }
    }

    const sku =
      `${prefix}${String(nextNumber).padStart(4, "0")}`;

    return res.status(200).json({
      sku,
    });
  } catch (error) {
    console.error(
      "Failed to generate SKU:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to generate SKU.",
    });
  }
}


export async function createProduct(
  req: Request,
  res: Response
) {
  const parsed =
    createAdminProductSchema.safeParse(
      req.body
    );

  if (!parsed.success) {
    return res.status(400).json({
      message:
        "Invalid product data.",
      errors:
        parsed.error.flatten(),
    });
  }

  const data = parsed.data;

  try {
    const existingSku =
      await prisma.product.findUnique({
        where: {
          sku: data.sku,
        },
        select: {
          id: true,
        },
      });

    if (existingSku) {
      return res.status(409).json({
        message:
          "A product with this SKU already exists.",
      });
    }

    const slugBase = data.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    let slug = slugBase;

    let slugCounter = 1;

    while (
      await prisma.product.findUnique({
        where: {
          slug,
        },
        select: {
          id: true,
        },
      })
    ) {
      slug = `${slugBase}-${slugCounter}`;
      slugCounter += 1;
    }

    const product =
      await prisma.$transaction(
        async (tx) => {
          let materialId =
            data.materialId ?? null;

          let colorId =
            data.colorId ?? null;

          if (
            data.customMaterialName
          ) {
            const material =
              await tx.material.upsert({
                where: {
                  name:
                    data.customMaterialName,
                },
                update: {},
                create: {
                  name:
                    data.customMaterialName,
                },
              });

            materialId =
              material.id;
          }

          if (
            data.customColorName &&
            data.customColorHex
          ) {
            const color =
              await tx.color.upsert({
                where: {
                  name:
                    data.customColorName,
                },
                update: {
                  hexCode:
                    data.customColorHex,
                },
                create: {
                  name:
                    data.customColorName,
                  hexCode:
                    data.customColorHex,
                },
              });

            colorId =
              color.id;
          }

          if (!materialId) {
  throw new ProductValidationError(
    "Material is required."
  );
}

if (!colorId) {
  throw new ProductValidationError(
    "Colour is required."
  );
}

/*
 * Validate all foreign-key references before
 * attempting to create the product.
 */
const [
  material,
  color,
  validCategories,
  validCollections,
] = await Promise.all([
  tx.material.findUnique({
    where: {
      id: materialId,
    },
    select: {
      id: true,
    },
  }),

  tx.color.findUnique({
    where: {
      id: colorId,
    },
    select: {
      id: true,
    },
  }),

  data.categoryIds.length > 0
    ? tx.category.findMany({
        where: {
          id: {
            in: data.categoryIds,
          },
          isActive: true,
        },
        select: {
          id: true,
        },
      })
    : Promise.resolve([]),

  data.collectionIds.length > 0
    ? tx.collection.findMany({
        where: {
          id: {
            in: data.collectionIds,
          },
          isActive: true,
        },
        select: {
          id: true,
        },
      })
    : Promise.resolve([]),
]);

if (!material) {
  throw new ProductValidationError(
    "Selected material does not exist."
  );
}

if (!color) {
  throw new ProductValidationError(
    "Selected colour does not exist."
  );
}

const uniqueCategoryIds = [
  ...new Set(data.categoryIds),
];

if (
  validCategories.length !==
  uniqueCategoryIds.length
) {
  throw new ProductValidationError(
    "One or more selected categories are invalid."
  );
}

const uniqueCollectionIds = [
  ...new Set(data.collectionIds),
];

if (
  validCollections.length !==
  uniqueCollectionIds.length
) {
  throw new ProductValidationError(
    "One or more selected collections are invalid."
  );
}

if (
  data.productType === "COMBO"
) {
            const comboProductIds = [
  ...new Set(
    data.comboItems.map(
      (item) => item.productId
    )
  ),
];

if (
  comboProductIds.length !==
  data.comboItems.length
) {
  throw new ProductValidationError(
    "The same product cannot be added to a combo more than once."
  );
}

const comboProducts =
  await tx.product.findMany({
    where: {
      id: {
        in: comboProductIds,
      },

      productType: "SINGLE",

      status: {
        not: "ARCHIVED",
      },
    },

    select: {
      id: true,
    },
  });

if (
  comboProducts.length !==
  comboProductIds.length
) {
  throw new ProductValidationError(
    "One or more combo products are invalid."
  );
}
          }

          const createdProduct =
            await tx.product.create({
              data: {
                name: data.name,
                slug,
                sku: data.sku,

                shortDescription:
                  data.shortDescription,
                description:
                  data.description,

                productType:
                  data.productType,

                jewelleryType:
                  data.jewelleryType,

                materialId,
                colorId,

                antiRust:
                  data.antiRust,

                gauge:
                  data.gauge || null,

                diameter:
                  data.diameter ||
                  null,

                price: data.price,

                salePrice:
                  data.salePrice ??
                  null,

                stock:
                  data.productType ===
                  "SINGLE"
                    ? data.stock ??
                      0
                    : null,

                status:
                  data.status,

                isFeatured:
                  data.isFeatured,

                isBestSeller:
                  data.isBestSeller,

                isNewArrival:
                  data.isNewArrival,

                categories: {
                  create:
                    data.categoryIds.map(
                      (categoryId) => ({
                        categoryId,
                      })
                    ),
                },

                collections: {
                  create:
                    data.collectionIds.map(
                      (
                        collectionId
                      ) => ({
                        collectionId,
                      })
                    ),
                },

                comboItems:
                  data.productType ===
                  "COMBO"
                    ? {
                        create:
                          data.comboItems.map(
                            (
                              item
                            ) => ({
                              itemProductId:
                                item.productId,
                              quantity:
                                item.quantity,
                            })
                          ),
                      }
                    : undefined,
              },

              include: {
                color: true,
                material: true,

                categories: {
                  include: {
                    category: true,
                  },
                },

                collections: {
                  include: {
                    collection: true,
                  },
                },

                comboItems: {
                  include: {
                    itemProduct: {
                      select: {
                        id: true,
                        name: true,
                        sku: true,
                        stock: true,
                      },
                    },
                  },
                },
              },
            });

          return createdProduct;
        }
      );

    return res.status(201).json({
      message:
        "Product created successfully.",
      product,
    });
  } catch (error) {
  if (
    error instanceof
    ProductValidationError
  ) {
    return res.status(400).json({
      message: error.message,
    });
  }

  console.error(
    "Failed to create product:",
    error
  );

  return res.status(500).json({
    message:
      "Unable to create product.",
  });
}
}

type ProductImageParams = {
  id: string;
  type: string;
};

export async function uploadProductImage(
  req: Request<ProductImageParams>,
  res: Response
) {
  try {
    const { id, type } = req.params;

    if (
      type !== "PRODUCT" &&
      type !== "WORN"
    ) {
      return res.status(400).json({
        message: "Invalid image type.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Image file is required.",
      });
    }

    const product =
      await prisma.product.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
        },
      });

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    const [
      processedImage,
      processedThumbnail,
    ] = await Promise.all([
      processProductImage(
        req.file.buffer
      ),

      processProductThumbnail(
        req.file.buffer
      ),
    ]);

    const typeName =
      type === "PRODUCT"
        ? "product"
        : "worn";

    const imagePath =
      `${id}/${typeName}.webp`;

    const thumbnailPath =
      `${id}/${typeName}-thumb.webp`;

    const {
      error: imageUploadError,
    } = await supabaseAdmin.storage
      .from("products")
      .upload(
        imagePath,
        processedImage.buffer,
        {
          contentType: "image/webp",
          upsert: true,
        }
      );

    if (imageUploadError) {
      throw imageUploadError;
    }

    const {
      error: thumbnailUploadError,
    } = await supabaseAdmin.storage
      .from("products")
      .upload(
        thumbnailPath,
        processedThumbnail.buffer,
        {
          contentType: "image/webp",
          upsert: true,
        }
      );

    if (thumbnailUploadError) {
      throw thumbnailUploadError;
    }

    const {
      data: publicImageData,
    } = supabaseAdmin.storage
      .from("products")
      .getPublicUrl(imagePath);

    const image =
      await prisma.productImage.upsert({
        where: {
          productId_type: {
            productId: id,
            type,
          },
        },

        update: {
          storagePath: imagePath,
          url:
            publicImageData.publicUrl,

          width:
            processedImage.width,

          height:
            processedImage.height,

          sizeBytes:
            processedImage.sizeBytes,

          altText:
            `${product.name} ${
              type === "PRODUCT"
                ? "product image"
                : "worn image"
            }`,
        },

        create: {
          productId: id,
          type,

          storagePath: imagePath,

          url:
            publicImageData.publicUrl,

          width:
            processedImage.width,

          height:
            processedImage.height,

          sizeBytes:
            processedImage.sizeBytes,

          altText:
            `${product.name} ${
              type === "PRODUCT"
                ? "product image"
                : "worn image"
            }`,
        },
      });

    return res.status(200).json({
      message:
        "Product image uploaded successfully.",

      image,

      thumbnail: {
        storagePath:
          thumbnailPath,

        width:
          processedThumbnail.width,

        height:
          processedThumbnail.height,

        sizeBytes:
          processedThumbnail.sizeBytes,
      },
    });
  } catch (error) {
    console.error(
      "Failed to upload product image:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to upload product image.",
    });
  }
}

export async function updateProductStatus(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (
      status !== "DRAFT" &&
      status !== "ACTIVE" &&
      status !== "ARCHIVED"
    ) {
      return res.status(400).json({
        message: "Invalid product status.",
      });
    }

    const product =
      await prisma.product.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
          status: true,

          images: {
            select: {
              type: true,
            },
          },
        },
      });

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    /*
     * ACTIVE products must have
     * both required image roles.
     */
    if (status === "ACTIVE") {
      const hasProductImage =
        product.images.some(
          (image) =>
            image.type === "PRODUCT"
        );

      const hasWornImage =
        product.images.some(
          (image) =>
            image.type === "WORN"
        );

      if (
        !hasProductImage ||
        !hasWornImage
      ) {
        return res.status(400).json({
          message:
            "Product and worn images are required before publishing.",
        });
      }
    }

    const updatedProduct =
      await prisma.product.update({
        where: {
          id,
        },

        data: {
          status,
        },

        select: {
          id: true,
          name: true,
          sku: true,
          status: true,
          updatedAt: true,
        },
      });

    return res.status(200).json({
      message:
        "Product status updated successfully.",

      product: updatedProduct,
    });
  } catch (error) {
    console.error(
      "Failed to update product status:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to update product status.",
    });
  }
}

export async function getProducts(
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

    const [
      products,
      total,
      totalActive,
      totalDraft,
      lowStock,
    ] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,

        orderBy: {
          createdAt: "desc",
        },

        include: {
          color: {
            select: {
              id: true,
              name: true,
              hexCode: true,
            },
          },

          material: {
            select: {
              id: true,
              name: true,
            },
          },

          images: {
            select: {
              id: true,
              type: true,
              url: true,
              storagePath: true,
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

          comboItems: {
            include: {
              itemProduct: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                  stock: true,
                },
              },
            },
          },
        },
      }),

      prisma.product.count(),

      prisma.product.count({
        where: {
          status: "ACTIVE",
        },
      }),

      prisma.product.count({
        where: {
          status: "DRAFT",
        },
      }),

      prisma.product.count({
        where: {
          productType: "SINGLE",
          stock: {
            lte: 5,
          },
          status: {
            not: "ARCHIVED",
          },
        },
      }),
    ]);

    const formattedProducts =
      products.map((product) => {
        const productImage =
          product.images.find(
            (image) =>
              image.type === "PRODUCT"
          );

        const wornImage =
          product.images.find(
            (image) =>
              image.type === "WORN"
          );

        return {
          id: product.id,

          name: product.name,
          slug: product.slug,
          sku: product.sku,

          productType:
            product.productType,

          jewelleryType:
            product.jewelleryType,

          price:
            product.price.toString(),

          salePrice:
            product.salePrice?.toString() ??
            null,

          stock:
            product.stock,

          status:
            product.status,

          antiRust:
            product.antiRust,

          gauge:
            product.gauge,

          diameter:
            product.diameter,

          isFeatured:
            product.isFeatured,

          isBestSeller:
            product.isBestSeller,

          isNewArrival:
            product.isNewArrival,

          color:
            product.color,

          material:
            product.material,

          categories:
            product.categories.map(
              (item) => item.category
            ),

          collections:
            product.collections.map(
              (item) =>
                item.collection
            ),

          images: {
            product:
              productImage ?? null,

            worn:
              wornImage ?? null,
          },

          comboItems:
            product.comboItems.map(
              (item) => ({
                productId:
                  item.itemProduct.id,

                name:
                  item.itemProduct.name,

                sku:
                  item.itemProduct.sku,

                stock:
                  item.itemProduct.stock,

                quantity:
                  item.quantity,
              })
            ),

          createdAt:
            product.createdAt,

          updatedAt:
            product.updatedAt,
        };
      });

    const totalPages =
      Math.max(
        1,
        Math.ceil(total / limit)
      );

    return res.status(200).json({
      products:
        formattedProducts,

      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage:
          page < totalPages,
        hasPreviousPage:
          page > 1,
      },

      stats: {
        totalProducts: total,
        activeProducts:
          totalActive,
        draftProducts:
          totalDraft,
        lowStockProducts:
          lowStock,
      },
    });
  } catch (error) {
    console.error(
      "Failed to fetch products:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to load products.",
    });
  }
}