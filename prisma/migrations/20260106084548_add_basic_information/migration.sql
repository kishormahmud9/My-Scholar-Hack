-- CreateEnum
CREATE TYPE "SchoolType" AS ENUM ('HIGH_SCHOOL', 'COLLEGE', 'UNIVERSITY', 'OTHER');

-- CreateTable
CREATE TABLE "BasicInformation" (
    "id" TEXT NOT NULL,
    "userProfileId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "schoolType" "SchoolType" NOT NULL,
    "gpa" DOUBLE PRECISION,
    "grade" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BasicInformation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BasicInformation_userProfileId_key" ON "BasicInformation"("userProfileId");

-- AddForeignKey
ALTER TABLE "BasicInformation" ADD CONSTRAINT "BasicInformation_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
