import { pgTable, uuid, varchar, boolean, real, date } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  user_id: uuid("user_id").primaryKey().defaultRandom(),
  preferences_id: uuid("preferences_id").notNull(),
  password_hash: varchar("password_hash").notNull(),
  password_salt: varchar("password_salt").notNull(),
  name: varchar("name").notNull(),
  phone: varchar("phone"),
});

export const preferences = pgTable("preferences", {
  preferences_id: uuid("preferences_id").primaryKey().defaultRandom(),
  notifications_enabled: boolean("notifications_enabled").default(true),
  alert_radius_km: real("alert_radius_km").notNull(),
  ui_theme: varchar("ui_theme").notNull(),
  language: varchar("language").notNull(),
});

export const report_type = pgTable("report_type", {
  report_type_id: uuid("report_type_id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  description: varchar("description"),
});

export const report = pgTable("report", {
  report_id: uuid("report_id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => user.user_id),
  report_type_id: uuid("report_type_id").references(() => report_type.report_type_id),
  latitude: varchar("latitude").notNull(),
  longitude: varchar("longitude").notNull(),
  description: varchar("description"),
  report_date: varchar("report_date").notNull(),
});

export const report_media = pgTable("report_media", {
  report_id: uuid("report_id").references(() => report.report_id),
  url: varchar("url").notNull(),
  media_date: date("media_date").notNull(),
  type: varchar("type").notNull(),
});

export const comment = pgTable("comment", {
  comment_id: uuid("comment_id").primaryKey().defaultRandom(),
  report_id: uuid("report_id").references(() => report.report_id),
  user_id: uuid("user_id").references(() => user.user_id),
  message: varchar("message").notNull(),
  comment_date: varchar("comment_date").notNull(),
});

export const comment_media = pgTable("comment_media", {
  comment_id: uuid("comment_id").references(() => comment.comment_id),
  url: varchar("url").notNull(),
  media_date: date("media_date").notNull(),
  type: varchar("type").notNull(),
});

export const point_type = pgTable("point_type", {
  point_type_id: uuid("point_type_id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  description: varchar("description"),
});

export const point_of_interest = pgTable("point_of_interest", {
  point_of_interest_id: uuid("point_of_interest_id").primaryKey().defaultRandom(),
  point_type_id: uuid("point_type_id").references(() => point_type.point_type_id),
  name: varchar("name").notNull(),
  latitude: varchar("latitude").notNull(),
  longitude: varchar("longitude").notNull(),
  physical_address: varchar("physical_address"),
});
