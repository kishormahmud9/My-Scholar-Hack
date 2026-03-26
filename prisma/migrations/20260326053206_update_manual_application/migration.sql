/*
  Warnings:

  - You are about to drop the column `details` on the `ManualApplication` table. All the data in the column will be lost.
  - You are about to drop the column `essayTitle` on the `ManualApplication` table. All the data in the column will be lost.
  - You are about to drop the column `requirements` on the `ManualApplication` table. All the data in the column will be lost.
  - You are about to drop the column `scholarshipDeadline` on the `ManualApplication` table. All the data in the column will be lost.
  - You are about to drop the column `scholarshipId` on the `ManualApplication` table. All the data in the column will be lost.
  - You are about to drop the column `scholarshipName` on the `ManualApplication` table. All the data in the column will be lost.
  - You are about to drop the column `scholarshipTitle` on the `ManualApplication` table. All the data in the column will be lost.
  - Added the required column `amount` to the `ManualApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `ManualApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `ManualApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `ManualApplication` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ManualApplication" DROP CONSTRAINT "ManualApplication_scholarshipId_fkey";

-- AlterTable
ALTER TABLE "ManualApplication" DROP COLUMN "details",
DROP COLUMN "essayTitle",
DROP COLUMN "requirements",
DROP COLUMN "scholarshipDeadline",
DROP COLUMN "scholarshipId",
DROP COLUMN "scholarshipName",
DROP COLUMN "scholarshipTitle",
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "deadline" TIMESTAMP(3),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "detailUrl" TEXT,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "provider" TEXT NOT NULL,
ADD COLUMN     "subject" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
