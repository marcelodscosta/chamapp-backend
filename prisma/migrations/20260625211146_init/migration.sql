-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "is_scheduled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "scheduled_date" DATE,
ADD COLUMN     "scheduled_time_slot" TEXT;

-- AlterTable
ALTER TABLE "store_settings" ADD COLUMN     "holidays" JSONB,
ADD COLUMN     "operating_days" JSONB;
