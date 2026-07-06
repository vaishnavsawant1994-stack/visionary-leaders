/*
  Warnings:

  - The primary key for the `Subscriber` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX "Subscriber_email_idx";

-- AlterTable
ALTER TABLE "Subscriber" DROP CONSTRAINT "Subscriber_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Subscriber_id_seq";
