-- AlterTable
ALTER TABLE "product_categories" ADD COLUMN "image_url" TEXT;

-- AlterTable
ALTER TABLE "partner_banners" ADD COLUMN "show_on_home" BOOLEAN NOT NULL DEFAULT false;
