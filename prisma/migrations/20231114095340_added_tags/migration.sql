/*
  Warnings:

  - Added the required column `tagTagId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "tagTagId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Tag" (
    "tagId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("tagId")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_tagTagId_fkey" FOREIGN KEY ("tagTagId") REFERENCES "Tag"("tagId") ON DELETE RESTRICT ON UPDATE CASCADE;
