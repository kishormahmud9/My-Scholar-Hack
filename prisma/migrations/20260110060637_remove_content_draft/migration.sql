/*
  Warnings:

  - You are about to drop the column `contentDraft` on the `Essay` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Essay" DROP COLUMN "contentDraft",
ALTER COLUMN "title" DROP NOT NULL;
