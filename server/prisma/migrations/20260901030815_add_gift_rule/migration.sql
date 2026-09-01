-- CreateTable
CREATE TABLE "GiftRule" (
    "id" TEXT NOT NULL,
    "minimumOrderQuantity" INTEGER NOT NULL,
    "minimumOrderValue" DECIMAL(10,2),
    "giftProductId" TEXT NOT NULL,
    "giftQuantity" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GiftRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GiftRule_giftProductId_idx" ON "GiftRule"("giftProductId");

-- CreateIndex
CREATE INDEX "GiftRule_isActive_idx" ON "GiftRule"("isActive");

-- CreateIndex
CREATE INDEX "GiftRule_startAt_idx" ON "GiftRule"("startAt");

-- CreateIndex
CREATE INDEX "GiftRule_endAt_idx" ON "GiftRule"("endAt");

-- AddForeignKey
ALTER TABLE "GiftRule" ADD CONSTRAINT "GiftRule_giftProductId_fkey" FOREIGN KEY ("giftProductId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
