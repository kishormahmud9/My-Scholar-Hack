/*
  Warnings:

  - Changed the type of `schoolType` on the `BasicInformation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `gpa` on table `BasicInformation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BasicInformation" DROP COLUMN "schoolType",
ADD COLUMN     "schoolType" TEXT NOT NULL,
ALTER COLUMN "gpa" SET NOT NULL;

-- DropEnum
DROP TYPE "SchoolType";
