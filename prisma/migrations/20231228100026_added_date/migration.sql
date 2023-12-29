/*
  Warnings:

  - You are about to drop the column `date` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "date",
ADD COLUMN     "dateFrom" VARCHAR(255),
ADD COLUMN     "dateTo" VARCHAR(255);
