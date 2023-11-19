/*
  Warnings:

  - Made the column `tagTagId` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_tagTagId_fkey";

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "tagTagId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_tagTagId_fkey" FOREIGN KEY ("tagTagId") REFERENCES "Tag"("tagId") ON DELETE RESTRICT ON UPDATE CASCADE;
