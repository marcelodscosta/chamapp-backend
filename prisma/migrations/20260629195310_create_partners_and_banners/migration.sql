-- CreateEnum
CREATE TYPE "BannerTargetType" AS ENUM ('EXTERNAL_LINK', 'PARTNER_PROFILE');

-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'PREPARING';

-- CreateTable
CREATE TABLE "partners" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo_url" TEXT,
    "description" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "website" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_banners" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "target_type" "BannerTargetType" NOT NULL DEFAULT 'EXTERNAL_LINK',
    "target_url" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "views_count" INTEGER NOT NULL DEFAULT 0,
    "clicks_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "partner_banners_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "partner_banners" ADD CONSTRAINT "partner_banners_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;
