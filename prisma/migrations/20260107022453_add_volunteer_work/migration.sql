/*
  Warnings:

  - Made the column `whatVolunteerWork` on table `VolunteerWork` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "VolunteerWork" ALTER COLUMN "whatVolunteerWork" SET NOT NULL;
