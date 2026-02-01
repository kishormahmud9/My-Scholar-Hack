-- CreateEnum
CREATE TYPE "ScrapeStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "ScrapedData" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "payload" JSONB,
    "status" "ScrapeStatus" NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScrapedData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ScrapedData_status_idx" ON "ScrapedData"("status");

-- CreateIndex
CREATE INDEX "ScrapedData_type_idx" ON "ScrapedData"("type");

-- CreateIndex
CREATE UNIQUE INDEX "ScrapedData_url_type_key" ON "ScrapedData"("url", "type");
