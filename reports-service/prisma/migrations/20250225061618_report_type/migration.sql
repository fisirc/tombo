/*
  Warnings:

  - You are about to drop the column `report_type_id` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the `report_types` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `report_type` to the `reports` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_report_type_id_fkey";

-- AlterTable
ALTER TABLE "reports" DROP COLUMN "report_type_id",
ADD COLUMN     "report_type" TEXT NOT NULL;

-- DropTable
DROP TABLE "report_types";
