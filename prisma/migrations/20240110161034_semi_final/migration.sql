/*
  Warnings:

  - Added the required column `updatedAt` to the `UserPostInteraction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "action" TEXT,
ALTER COLUMN "published" DROP NOT NULL,
ALTER COLUMN "published" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "section" TEXT,
ADD COLUMN     "yearLevel" TEXT;

-- AlterTable
ALTER TABLE "UserPostInteraction" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
