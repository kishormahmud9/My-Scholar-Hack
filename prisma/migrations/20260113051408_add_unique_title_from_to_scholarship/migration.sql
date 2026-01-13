/*
  Warnings:

  - A unique constraint covering the columns `[title,from]` on the table `Scholarship` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Scholarship_title_from_key" ON "Scholarship"("title", "from");
