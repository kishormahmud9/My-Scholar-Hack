/*
  Warnings:

  - You are about to drop the column `details` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `prompt` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `requirements` on the `Application` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "details",
DROP COLUMN "prompt",
DROP COLUMN "requirements";
