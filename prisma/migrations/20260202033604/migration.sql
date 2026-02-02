-- AlterTable
ALTER TABLE "Scholarship" ADD COLUMN     "detailUrl" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isPlan" BOOLEAN DEFAULT false;
