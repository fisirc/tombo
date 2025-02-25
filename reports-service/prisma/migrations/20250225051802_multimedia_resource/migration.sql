/*
  Warnings:

  - You are about to drop the column `url` on the `multimedia_comments` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `multimedia_reports` table. All the data in the column will be lost.
  - Added the required column `resource` to the `multimedia_comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resource` to the `multimedia_reports` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "multimedia_comments" DROP COLUMN "url",
ADD COLUMN     "resource" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "multimedia_reports" DROP COLUMN "url",
ADD COLUMN     "resource" TEXT NOT NULL;
