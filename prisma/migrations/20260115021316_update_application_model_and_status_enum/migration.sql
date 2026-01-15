/*
  Warnings:

  - Added the required column `scholarshipTitle` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_essayId_fkey";

-- DropIndex
DROP INDEX "Application_userId_scholarshipId_key";

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "essayTitle" TEXT,
ADD COLUMN     "scholarshipAmount" INTEGER,
ADD COLUMN     "scholarshipDeadline" TIMESTAMP(3),
ADD COLUMN     "scholarshipTitle" TEXT NOT NULL,
ALTER COLUMN "essayId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_essayId_fkey" FOREIGN KEY ("essayId") REFERENCES "Essay"("id") ON DELETE SET NULL ON UPDATE CASCADE;
