/*
  Warnings:

  - You are about to drop the column `from` on the `Scholarship` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title,provider]` on the table `Scholarship` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `provider` to the `Scholarship` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Scholarship_title_from_key";

-- AlterTable
ALTER TABLE "Scholarship" DROP COLUMN "from",
ADD COLUMN     "provider" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Scholarship_title_provider_key" ON "Scholarship"("title", "provider");
