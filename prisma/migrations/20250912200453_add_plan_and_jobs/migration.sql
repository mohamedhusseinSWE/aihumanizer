-- AlterTable
ALTER TABLE "public"."plans" ADD COLUMN     "models" TEXT[] DEFAULT ARRAY[]::TEXT[];
