/*
  Warnings:

  - You are about to drop the column `modifiedAt` on the `Dashboard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Dashboard" DROP COLUMN "modifiedAt",
ADD COLUMN     "modifiedAtB" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
