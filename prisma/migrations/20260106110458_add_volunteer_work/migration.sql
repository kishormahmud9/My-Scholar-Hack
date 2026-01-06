-- CreateTable
CREATE TABLE "VolunteerWork" (
    "id" TEXT NOT NULL,
    "userProfileId" TEXT NOT NULL,
    "WhatVolunteerWork" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "totalHours" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VolunteerWork_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VolunteerWork_userProfileId_key" ON "VolunteerWork"("userProfileId");

-- CreateIndex
CREATE INDEX "VolunteerWork_userProfileId_idx" ON "VolunteerWork"("userProfileId");

-- AddForeignKey
ALTER TABLE "VolunteerWork" ADD CONSTRAINT "VolunteerWork_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
