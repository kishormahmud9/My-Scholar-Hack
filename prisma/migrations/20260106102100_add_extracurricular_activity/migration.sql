-- CreateTable
CREATE TABLE "ExtracurricularActivity" (
    "id" TEXT NOT NULL,
    "userProfileId" TEXT NOT NULL,
    "activityName" TEXT NOT NULL,
    "yearsInvolved" TEXT NOT NULL,
    "leadership" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExtracurricularActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExtracurricularActivity_userProfileId_key" ON "ExtracurricularActivity"("userProfileId");

-- CreateIndex
CREATE INDEX "ExtracurricularActivity_userProfileId_idx" ON "ExtracurricularActivity"("userProfileId");

-- AddForeignKey
ALTER TABLE "ExtracurricularActivity" ADD CONSTRAINT "ExtracurricularActivity_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
