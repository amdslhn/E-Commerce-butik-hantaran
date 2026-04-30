-- AlterTable
ALTER TABLE "services" ADD COLUMN     "is_unlimited" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stok_box" INTEGER NOT NULL DEFAULT 0;
