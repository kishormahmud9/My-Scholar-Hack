/*
  Warnings:

  - A unique constraint covering the columns `[userProfileId]` on the table `Education` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Education` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Education" DROP CONSTRAINT "Education_userProfileId_fkey";

-- AlterTable
ALTER TABLE "Education" ADD COLUMN     "achievements" TEXT,
ADD COLUMN     "major" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Education_userProfileId_key" ON "Education"("userProfileId");

-- CreateIndex
CREATE INDEX "Education_level_idx" ON "Education"("level");

-- CreateIndex
CREATE INDEX "Education_institutionName_idx" ON "Education"("institutionName");

-- CreateIndex
CREATE INDEX "Education_major_idx" ON "Education"("major");

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
