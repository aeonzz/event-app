/*
  Warnings:

  - Made the column `yawa` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "yawa" SET NOT NULL;
