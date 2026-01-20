/*
  Warnings:

  - You are about to drop the column `lat` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `lng` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `locationName` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Post" DROP COLUMN "lat",
DROP COLUMN "lng",
DROP COLUMN "locationName",
ADD COLUMN     "lats" DOUBLE PRECISION[],
ADD COLUMN     "lngs" DOUBLE PRECISION[],
ADD COLUMN     "locationNames" TEXT[];
