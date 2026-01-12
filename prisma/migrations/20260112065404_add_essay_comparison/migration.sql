-- CreateTable
CREATE TABLE "EssayComparison" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userProfileId" TEXT,
    "essayAId" TEXT NOT NULL,
    "essayBId" TEXT NOT NULL,
    "scoreA" INTEGER NOT NULL,
    "scoreB" INTEGER NOT NULL,
    "strengthsA" TEXT NOT NULL,
    "improvementsA" TEXT NOT NULL,
    "strengthsB" TEXT NOT NULL,
    "improvementsB" TEXT NOT NULL,
    "winner" TEXT NOT NULL,
    "percentageDiff" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EssayComparison_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EssayComparison" ADD CONSTRAINT "EssayComparison_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EssayComparison" ADD CONSTRAINT "EssayComparison_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EssayComparison" ADD CONSTRAINT "EssayComparison_essayAId_fkey" FOREIGN KEY ("essayAId") REFERENCES "Essay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EssayComparison" ADD CONSTRAINT "EssayComparison_essayBId_fkey" FOREIGN KEY ("essayBId") REFERENCES "Essay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
