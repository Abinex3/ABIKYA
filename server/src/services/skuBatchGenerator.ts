import type { PrismaClient } from "../generated/prisma/client.js";

type JewelleryType =
  | "STUD"
  | "RING"
  | "HOOP"
  | "BARBELL"
  | "CURVED_BARBELL"
  | "OTHER";

type ProductType = "SINGLE" | "COMBO";

const PREFIX_MAP: Record<JewelleryType, string> = {
  STUD: "ST",
  RING: "RG",
  HOOP: "HP",
  BARBELL: "BB",
  CURVED_BARBELL: "CB",
  OTHER: "OT",
};

function resolvePrefix(
  productType: ProductType,
  jewelleryType: JewelleryType
): string {
  const code =
    productType === "COMBO"
      ? "CM"
      : PREFIX_MAP[jewelleryType];

  return `ABK-${code}-`;
}

/**
 * Generates SKUs for an entire CSV import batch, in order, without
 * re-querying the DB on every row. Mirrors the numbering scheme from
 * getNextProductSku() in adminProductController.ts.
 *
 * Call getNextSku() sequentially (not in parallel) so numbers stay
 * gap-free and in the same order the CSV rows were processed.
 */
export function createSkuBatchGenerator(
  prisma: PrismaClient
) {
  const nextNumberByPrefix = new Map<
    string,
    number
  >();

  async function getNextSku(
    productType: ProductType,
    jewelleryType: JewelleryType
  ): Promise<string> {
    const prefix = resolvePrefix(
      productType,
      jewelleryType
    );

    let nextNumber =
      nextNumberByPrefix.get(prefix);

    if (nextNumber === undefined) {
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

      nextNumber = 1;

      if (lastProduct) {
        const lastPart = lastProduct.sku
          .split("-")
          .pop();

        const parsed = Number(lastPart);

        if (!Number.isNaN(parsed)) {
          nextNumber = parsed + 1;
        }
      }
    }

    const sku = `${prefix}${String(
      nextNumber
    ).padStart(4, "0")}`;

    nextNumberByPrefix.set(
      prefix,
      nextNumber + 1
    );

    return sku;
  }

  return { getNextSku };
}