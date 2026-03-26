-- CreateTable
CREATE TABLE "StudentInstruction" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "instructionText" TEXT,
    "instructionPrompt" TEXT,
    "aboutScholarshipText" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentInstruction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudentInstruction" ADD CONSTRAINT "StudentInstruction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
