-- CreateTable
CREATE TABLE "DiversityIdentity" (
    "id" TEXT NOT NULL,
    "userProfileId" TEXT NOT NULL,
    "genderIdentity" TEXT,
    "religiousIdentity" TEXT,
    "selfIdentification" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiversityIdentity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiversityIdentity_userProfileId_key" ON "DiversityIdentity"("userProfileId");

-- CreateIndex
CREATE INDEX "DiversityIdentity_userProfileId_idx" ON "DiversityIdentity"("userProfileId");

-- AddForeignKey
ALTER TABLE "DiversityIdentity" ADD CONSTRAINT "DiversityIdentity_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
