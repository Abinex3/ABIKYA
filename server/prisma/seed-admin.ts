import "dotenv/config";

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL!,
});

const prisma = new PrismaClient({ adapter });
import { hashPassword } from "../src/services/password";



async function main() {
  const email = process.env.ADMIN_SEED_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_SEED_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD are required."
    );
  }

  if (password.length < 14) {
    throw new Error(
      "Admin password must be at least 14 characters."
    );
  }

  const passwordHash = await hashPassword(password);

  await prisma.adminUser.upsert({
    where: {
      email,
    },

    update: {},

    create: {
      email,
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });

  console.log("Initial admin created successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });