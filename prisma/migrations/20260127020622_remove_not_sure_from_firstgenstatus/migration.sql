/*
  Warnings:

  - The values [not_sure] on the enum `FirstGenStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FirstGenStatus_new" AS ENUM ('yes', 'no');
ALTER TABLE "FamilyBackground" ALTER COLUMN "firstGenStatus" TYPE "FirstGenStatus_new" USING ("firstGenStatus"::text::"FirstGenStatus_new");
ALTER TYPE "FirstGenStatus" RENAME TO "FirstGenStatus_old";
ALTER TYPE "FirstGenStatus_new" RENAME TO "FirstGenStatus";
DROP TYPE "public"."FirstGenStatus_old";
COMMIT;
