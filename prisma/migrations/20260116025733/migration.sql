-- CreateEnum
CREATE TYPE "StudentSubscriptionStatus" AS ENUM ('ACTIVE', 'TRAIL', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "SubscriptionStudent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "subscriptionStatus" "StudentSubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "purchaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionStudent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionStudent_userId_key" ON "SubscriptionStudent"("userId");

-- AddForeignKey
ALTER TABLE "SubscriptionStudent" ADD CONSTRAINT "SubscriptionStudent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionStudent" ADD CONSTRAINT "SubscriptionStudent_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
