/*
  Warnings:

  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider,providerId]` on the table `AuthProvider` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `provider` on the `AuthProvider` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AuthProviderType" AS ENUM ('EMAIL', 'GOOGLE');

-- DropForeignKey
ALTER TABLE "AuthProvider" DROP CONSTRAINT "AuthProvider_userId_fkey";

-- AlterTable
ALTER TABLE "AuthProvider" DROP COLUMN "provider",
ADD COLUMN     "provider" "AuthProviderType" NOT NULL,
ALTER COLUMN "providerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isActive",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX "AuthProvider_userId_idx" ON "AuthProvider"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthProvider_provider_providerId_key" ON "AuthProvider"("provider", "providerId");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- AddForeignKey
ALTER TABLE "AuthProvider" ADD CONSTRAINT "AuthProvider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
