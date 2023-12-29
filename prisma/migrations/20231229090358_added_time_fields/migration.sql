/*
  Warnings:

  - You are about to drop the column `time` on the `Post` table. All the data in the column will be lost.
  - The `dateFrom` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `dateTo` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `timeFrom` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeTo` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "time",
ADD COLUMN     "timeFrom" VARCHAR(255) NOT NULL,
ADD COLUMN     "timeTo" VARCHAR(255) NOT NULL,
DROP COLUMN "dateFrom",
ADD COLUMN     "dateFrom" TIMESTAMP(3),
DROP COLUMN "dateTo",
ADD COLUMN     "dateTo" TIMESTAMP(3);
