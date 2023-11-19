-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_tagTagId_fkey";

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "tagTagId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_tagTagId_fkey" FOREIGN KEY ("tagTagId") REFERENCES "Tag"("tagId") ON DELETE SET NULL ON UPDATE CASCADE;
