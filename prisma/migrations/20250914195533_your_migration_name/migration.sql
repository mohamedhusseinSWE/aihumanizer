/*
  Warnings:

  - A unique constraint covering the columns `[affiliateId]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[referralCode]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."CommissionStatus" AS ENUM ('PENDING', 'APPROVED', 'PAID', 'CANCELLED');

-- AlterTable
ALTER TABLE "public"."subscriptions" ADD COLUMN     "affiliateCommission" DECIMAL(10,2),
ADD COLUMN     "affiliateTrackingId" TEXT,
ADD COLUMN     "referralCode" TEXT;

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "affiliateId" TEXT,
ADD COLUMN     "referralCode" TEXT,
ADD COLUMN     "referredBy" TEXT;

-- CreateTable
CREATE TABLE "public"."affiliate_commissions" (
    "id" SERIAL NOT NULL,
    "affiliateId" TEXT NOT NULL,
    "referredUserId" TEXT NOT NULL,
    "subscriptionId" INTEGER,
    "amount" DECIMAL(10,2) NOT NULL,
    "percentage" DECIMAL(5,2) NOT NULL,
    "status" "public"."CommissionStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "affiliate_commissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_affiliateId_key" ON "public"."user"("affiliateId");

-- CreateIndex
CREATE UNIQUE INDEX "user_referralCode_key" ON "public"."user"("referralCode");

-- AddForeignKey
ALTER TABLE "public"."user" ADD CONSTRAINT "user_referredBy_fkey" FOREIGN KEY ("referredBy") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."affiliate_commissions" ADD CONSTRAINT "affiliate_commissions_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."affiliate_commissions" ADD CONSTRAINT "affiliate_commissions_referredUserId_fkey" FOREIGN KEY ("referredUserId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."affiliate_commissions" ADD CONSTRAINT "affiliate_commissions_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "public"."subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
