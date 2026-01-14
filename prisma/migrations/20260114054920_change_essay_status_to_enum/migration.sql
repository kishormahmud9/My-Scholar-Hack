/*
  Warnings:

  - The `status` column on the `Essay` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EssayStatus" AS ENUM ('SAVED', 'EDIT', 'DELETED');

-- AlterTable
ALTER TABLE "Essay" DROP COLUMN "status",
ADD COLUMN     "status" "EssayStatus" NOT NULL DEFAULT 'SAVED';
