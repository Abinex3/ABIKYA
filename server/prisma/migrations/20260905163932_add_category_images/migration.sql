-- CreateTable
CREATE TABLE "CategoryImage" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "width" INTEGER,
    "height" INTEGER,
    "sizeBytes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CategoryImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CategoryImage_categoryId_idx" ON "CategoryImage"("categoryId");

-- CreateIndex
CREATE INDEX "CategoryImage_categoryId_sortOrder_idx" ON "CategoryImage"("categoryId", "sortOrder");

-- AddForeignKey
ALTER TABLE "CategoryImage" ADD CONSTRAINT "CategoryImage_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
