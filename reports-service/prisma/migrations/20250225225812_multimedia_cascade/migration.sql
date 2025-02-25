-- DropForeignKey
ALTER TABLE "multimedia_comments" DROP CONSTRAINT "multimedia_comments_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "multimedia_reports" DROP CONSTRAINT "multimedia_reports_report_id_fkey";

-- AddForeignKey
ALTER TABLE "multimedia_comments" ADD CONSTRAINT "multimedia_comments_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "multimedia_reports" ADD CONSTRAINT "multimedia_reports_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
