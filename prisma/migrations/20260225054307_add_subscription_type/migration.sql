-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('MONTHLY', 'YEARLY');

-- AlterTable
ALTER TABLE "SubscriptionStudent" ADD COLUMN     "type" "SubscriptionType";
