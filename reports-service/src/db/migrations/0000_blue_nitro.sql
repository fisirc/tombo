CREATE TABLE "comment" (
	"comment_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid,
	"user_id" uuid,
	"message" varchar NOT NULL,
	"comment_date" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comment_media" (
	"comment_id" uuid,
	"url" varchar NOT NULL,
	"media_date" date NOT NULL,
	"type" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "point_of_interest" (
	"point_of_interest_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"point_type_id" uuid,
	"name" varchar NOT NULL,
	"latitude" varchar NOT NULL,
	"longitude" varchar NOT NULL,
	"physical_address" varchar
);
--> statement-breakpoint
CREATE TABLE "point_type" (
	"point_type_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar
);
--> statement-breakpoint
CREATE TABLE "preferences" (
	"preferences_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"notifications_enabled" boolean DEFAULT true,
	"alert_radius_km" real NOT NULL,
	"ui_theme" varchar NOT NULL,
	"language" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "report" (
	"report_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"report_type_id" uuid,
	"latitude" varchar NOT NULL,
	"longitude" varchar NOT NULL,
	"description" varchar,
	"report_date" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "report_media" (
	"report_id" uuid,
	"url" varchar NOT NULL,
	"media_date" date NOT NULL,
	"type" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "report_type" (
	"report_type_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar
);
--> statement-breakpoint
CREATE TABLE "user" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"preferences_id" uuid NOT NULL,
	"password_hash" varchar NOT NULL,
	"password_salt" varchar NOT NULL,
	"name" varchar NOT NULL,
	"phone" varchar
);
--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_report_id_report_report_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."report"("report_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_media" ADD CONSTRAINT "comment_media_comment_id_comment_comment_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comment"("comment_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "point_of_interest" ADD CONSTRAINT "point_of_interest_point_type_id_point_type_point_type_id_fk" FOREIGN KEY ("point_type_id") REFERENCES "public"."point_type"("point_type_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_report_type_id_report_type_report_type_id_fk" FOREIGN KEY ("report_type_id") REFERENCES "public"."report_type"("report_type_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_media" ADD CONSTRAINT "report_media_report_id_report_report_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."report"("report_id") ON DELETE no action ON UPDATE no action;