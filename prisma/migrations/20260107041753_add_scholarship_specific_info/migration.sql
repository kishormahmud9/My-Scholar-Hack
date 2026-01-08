-- CreateTable
CREATE TABLE "ScholarshipSpecificInfo" (
    "id" TEXT NOT NULL,
    "userProfileId" TEXT NOT NULL,
    "scholarshipsInterested" TEXT[],
    "specificScholarships" TEXT,
    "scholarshipDeadline" "ScholarshipDeadlineTimeline",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScholarshipSpecificInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScholarshipSpecificInfo_userProfileId_key" ON "ScholarshipSpecificInfo"("userProfileId");

-- CreateIndex
CREATE INDEX "ScholarshipSpecificInfo_userProfileId_idx" ON "ScholarshipSpecificInfo"("userProfileId");

-- AddForeignKey
ALTER TABLE "ScholarshipSpecificInfo" ADD CONSTRAINT "ScholarshipSpecificInfo_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
