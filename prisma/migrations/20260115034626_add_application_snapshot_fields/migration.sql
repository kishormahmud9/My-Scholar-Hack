/*
  Warnings:

  - Added the required column `scholarshipTitle` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "essayTitle" TEXT,
ADD COLUMN     "scholarshipAmount" INTEGER,
ADD COLUMN     "scholarshipDeadline" TIMESTAMP(3),
ADD COLUMN     "scholarshipTitle" TEXT NOT NULL;
