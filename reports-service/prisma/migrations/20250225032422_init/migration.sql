-- CreateTable
CREATE TABLE "multimedia_comments" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "multimedia_comment_date" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "comment_id" TEXT NOT NULL,

    CONSTRAINT "multimedia_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "comment_date" TIMESTAMP(3) NOT NULL,
    "report_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "report_date" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "report_type_id" TEXT NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "multimedia_reports" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "multimedia_report_date" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,

    CONSTRAINT "multimedia_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "point_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "point_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "points" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "physical_address" TEXT NOT NULL,
    "point_type_id" TEXT NOT NULL,

    CONSTRAINT "points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "report_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "authk_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "preferences_id" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preferences" (
    "id" TEXT NOT NULL,
    "active_notifications" BOOLEAN NOT NULL,
    "alert_radius_km" DOUBLE PRECISION NOT NULL,
    "interface_theme" TEXT NOT NULL,
    "language" TEXT NOT NULL,

    CONSTRAINT "preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_authk_id_key" ON "users"("authk_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_preferences_id_key" ON "users"("preferences_id");

-- AddForeignKey
ALTER TABLE "multimedia_comments" ADD CONSTRAINT "multimedia_comments_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_report_type_id_fkey" FOREIGN KEY ("report_type_id") REFERENCES "report_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "multimedia_reports" ADD CONSTRAINT "multimedia_reports_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "points" ADD CONSTRAINT "points_point_type_id_fkey" FOREIGN KEY ("point_type_id") REFERENCES "point_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_preferences_id_fkey" FOREIGN KEY ("preferences_id") REFERENCES "preferences"("id") ON DELETE SET NULL ON UPDATE CASCADE;
