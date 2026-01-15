/*
  Warnings:

  - You are about to drop the column `essayTitle` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `scholarshipAmount` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `scholarshipDeadline` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `scholarshipTitle` on the `Application` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "essayTitle",
DROP COLUMN "scholarshipAmount",
DROP COLUMN "scholarshipDeadline",
DROP COLUMN "scholarshipTitle";
