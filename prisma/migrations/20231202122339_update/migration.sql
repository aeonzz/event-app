-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "fwall" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "title" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "department" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';
