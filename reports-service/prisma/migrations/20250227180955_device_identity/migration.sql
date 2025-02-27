/*
  Warnings:

  - You are about to drop the column `comment_date` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `multimedia_comment_date` on the `multimedia_comments` table. All the data in the column will be lost.
  - You are about to drop the column `multimedia_report_date` on the `multimedia_reports` table. All the data in the column will be lost.
  - You are about to drop the column `report_date` on the `reports` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "comments" DROP COLUMN "comment_date",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "multimedia_comments" DROP COLUMN "multimedia_comment_date",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "multimedia_reports" DROP COLUMN "multimedia_report_date",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "reports" DROP COLUMN "report_date",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "device_identities" (
    "id" SERIAL NOT NULL,
    "device_id" TEXT NOT NULL,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "device_identities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "device_identities_device_id_key" ON "device_identities"("device_id");

-- AddForeignKey
ALTER TABLE "device_identities" ADD CONSTRAINT "device_identities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
