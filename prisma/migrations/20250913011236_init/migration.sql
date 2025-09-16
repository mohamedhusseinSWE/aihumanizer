/*
  Warnings:

  - A unique constraint covering the columns `[subscriptionId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "planName" TEXT NOT NULL DEFAULT 'free',
ADD COLUMN     "subscriptionId" TEXT,
ADD COLUMN     "subscriptionStatus" TEXT NOT NULL DEFAULT 'free';

-- CreateIndex
CREATE UNIQUE INDEX "user_subscriptionId_key" ON "public"."user"("subscriptionId");
