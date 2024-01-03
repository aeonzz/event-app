-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "accessibility" TEXT NOT NULL DEFAULT 'public';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "imageUrl" TEXT;
