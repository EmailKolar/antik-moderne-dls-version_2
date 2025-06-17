-- AlterTable
ALTER TABLE "Product" ADD COLUMN "category" TEXT;
UPDATE "Product" SET "category" = 'Uncategorized' WHERE "category" IS NULL;
ALTER TABLE "Product" ALTER COLUMN "category" SET NOT NULL;
