/*
  Warnings:

  - The `scholarshipDeadline` column on the `ScholarshipSpecificInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ScholarshipSpecificInfo" DROP COLUMN "scholarshipDeadline",
ADD COLUMN     "scholarshipDeadline" TEXT;
