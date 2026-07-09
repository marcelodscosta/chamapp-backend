/*
  Warnings:

  - You are about to drop the column `min_points` on the `loyalty_tiers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "loyalty_tiers" DROP COLUMN "min_points",
ADD COLUMN     "min_spent" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "period_days" INTEGER NOT NULL DEFAULT 30;

-- CreateTable
CREATE TABLE "user_locations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "has_active_order" BOOLEAN NOT NULL DEFAULT false,
    "last_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_locations_userId_key" ON "user_locations"("userId");

-- AddForeignKey
ALTER TABLE "user_locations" ADD CONSTRAINT "user_locations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
