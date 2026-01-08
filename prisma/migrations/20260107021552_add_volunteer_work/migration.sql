/*
  Warnings:

  - You are about to drop the column `WhatVolunteerWork` on the `VolunteerWork` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "VolunteerWork" DROP COLUMN "WhatVolunteerWork",
ADD COLUMN     "whatVolunteerWork" TEXT;
