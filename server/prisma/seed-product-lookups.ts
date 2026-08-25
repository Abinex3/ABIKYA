import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

const categories = [
  ["Lobe", "lobe"],
  ["Bugadi", "bugadi"],
  ["Belly Button", "belly-button"],
  ["Nose", "nose"],
  ["Eyebrow", "eyebrow"],
  ["Tongue", "tongue"],
  ["Upper Lobe", "upper-lobe"],
  ["Flat", "flat"],
  ["Helix", "helix"],
  ["Snug", "snug"],
  ["Conch", "conch"],
  ["Tragus", "tragus"],
  ["Daith", "daith"],
];

const colors = [
  ["Silver", "#C0C0C0"],
  ["Gold", "#D4AF37"],
  ["Rose Gold", "#B76E79"],
  ["Black", "#000000"],
];

const materials = [
  "Titanium",
  "Stainless Steel",
  "Surgical Steel",
  "Sterling Silver",
];

const collections = [
  ["Best Seller", "best-seller"],
  ["Price Drop", "price-drop"],
  ["New Collection", "new-collection"],
  ["Featured", "featured"],
];

async function main() {
  for (const [name, slug] of categories) {
    await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: {
        name,
        slug,
      },
    });
  }

  for (const [name, hexCode] of colors) {
    await prisma.color.upsert({
      where: { name },
      update: { hexCode },
      create: {
        name,
        hexCode,
      },
    });
  }

  for (const name of materials) {
    await prisma.material.upsert({
      where: { name },
      update: {},
      create: {
        name,
      },
    });
  }

  for (const [name, slug] of collections) {
    await prisma.collection.upsert({
      where: { slug },
      update: { name },
      create: {
        name,
        slug,
        isActive: true,
      },
    });
  }

  console.log(
    "Product lookup data and collections seeded successfully."
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });