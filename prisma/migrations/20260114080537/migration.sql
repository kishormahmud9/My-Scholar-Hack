/*
  Warnings:

  - The values [EDIT] on the enum `EssayStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `subject` on the `Essay` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EssayStatus_new" AS ENUM ('GENERATING', 'SAVED', 'DELETED', 'FAILED', 'EDITED');
ALTER TABLE "public"."Essay" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Essay" ALTER COLUMN "status" TYPE "EssayStatus_new" USING ("status"::text::"EssayStatus_new");
ALTER TYPE "EssayStatus" RENAME TO "EssayStatus_old";
ALTER TYPE "EssayStatus_new" RENAME TO "EssayStatus";
DROP TYPE "public"."EssayStatus_old";
ALTER TABLE "Essay" ALTER COLUMN "status" SET DEFAULT 'GENERATING';
COMMIT;

-- AlterTable
ALTER TABLE "Essay" DROP COLUMN "subject",
ALTER COLUMN "status" SET DEFAULT 'GENERATING';
