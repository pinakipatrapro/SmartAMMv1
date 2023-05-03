/*
  Warnings:

  - You are about to drop the column `sampleValues` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "sampleValues",
ADD COLUMN     "configData" JSONB;
