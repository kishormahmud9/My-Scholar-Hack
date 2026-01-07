-- CreateTable
CREATE TABLE "EssaySpecificQuestions" (
    "id" TEXT NOT NULL,
    "userProfileId" TEXT NOT NULL,
    "changeInSchoolOrCommunity" TEXT,
    "whatMakesYouDifferent" TEXT,
    "failureExperience" TEXT,
    "issueYouCareAbout" TEXT,
    "additionalQuestion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EssaySpecificQuestions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EssaySpecificQuestions_userProfileId_key" ON "EssaySpecificQuestions"("userProfileId");

-- CreateIndex
CREATE INDEX "EssaySpecificQuestions_userProfileId_idx" ON "EssaySpecificQuestions"("userProfileId");

-- AddForeignKey
ALTER TABLE "EssaySpecificQuestions" ADD CONSTRAINT "EssaySpecificQuestions_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
