-- CreateTable
CREATE TABLE "ManualApplication" (
    "id" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'DRAFT',
    "userId" TEXT NOT NULL,
    "essayId" TEXT,
    "scholarshipId" TEXT NOT NULL,
    "essayTitle" TEXT,
    "scholarshipTitle" TEXT NOT NULL,
    "scholarshipAmount" INTEGER,
    "scholarshipDeadline" TIMESTAMP(3),
    "scholarshipName" TEXT,
    "prompt" TEXT,
    "details" TEXT,
    "requirements" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManualApplication_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ManualApplication" ADD CONSTRAINT "ManualApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManualApplication" ADD CONSTRAINT "ManualApplication_essayId_fkey" FOREIGN KEY ("essayId") REFERENCES "Essay"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManualApplication" ADD CONSTRAINT "ManualApplication_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "Scholarship"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
