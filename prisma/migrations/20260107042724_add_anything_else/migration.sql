-- CreateTable
CREATE TABLE "AnythingElse" (
    "id" TEXT NOT NULL,
    "userProfileId" TEXT NOT NULL,
    "anythingElse" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnythingElse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnythingElse_userProfileId_key" ON "AnythingElse"("userProfileId");

-- CreateIndex
CREATE INDEX "AnythingElse_userProfileId_idx" ON "AnythingElse"("userProfileId");

-- AddForeignKey
ALTER TABLE "AnythingElse" ADD CONSTRAINT "AnythingElse_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
