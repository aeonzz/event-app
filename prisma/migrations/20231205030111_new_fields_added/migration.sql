/*
  Warnings:

  - You are about to drop the column `fwall` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "fwall",
ADD COLUMN     "anonymous" BOOLEAN NOT NULL DEFAULT false;
