/*
  Warnings:

  - You are about to drop the column `TBD` on the `Dashboard` table. All the data in the column will be lost.
  - You are about to drop the column `modifiedAtB` on the `Dashboard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Dashboard" DROP COLUMN "TBD",
DROP COLUMN "modifiedAtB",
ADD COLUMN     "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
