/*
  Warnings:

  - The `status` column on the `Magazine` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MagazineStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Magazine" ADD COLUMN     "issueNumber" INTEGER,
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoTitle" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "MagazineStatus" NOT NULL DEFAULT 'DRAFT';

-- CreateIndex
CREATE INDEX "Magazine_status_idx" ON "Magazine"("status");

-- CreateIndex
CREATE INDEX "Magazine_publishDate_idx" ON "Magazine"("publishDate");

-- CreateIndex
CREATE INDEX "Magazine_categoryId_idx" ON "Magazine"("categoryId");
