/*
  Warnings:

  - The `firstGenStatus` column on the `FamilyBackground` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "FamilyBackground" DROP COLUMN "firstGenStatus",
ADD COLUMN     "firstGenStatus" TEXT;

-- DropEnum
DROP TYPE "FirstGenStatus";
