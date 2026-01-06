-- DropIndex
DROP INDEX "User_phoneNumber_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "phoneNumber" SET DATA TYPE TEXT;
