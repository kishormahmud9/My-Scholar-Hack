/*
  Warnings:

  - You are about to drop the column `awardAmount` on the `Scholarship` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `Scholarship` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Scholarship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `from` to the `Scholarship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Scholarship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Scholarship` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Scholarship" DROP COLUMN "awardAmount",
DROP COLUMN "provider",
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "from" TEXT NOT NULL,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
