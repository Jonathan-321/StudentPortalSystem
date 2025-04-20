import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  studentId: text("student_id"),
  role: text("role").default("student").notNull(),
  profileImage: text("profile_image"),
  language: text("language").default("en").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
  studentId: true,
  role: true,
  language: true,
  profileImage: true,
});

// Course model
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  credits: integer("credits").notNull(),
  instructorName: text("instructor_name"),
  schedule: text("schedule"),
  duration: integer("duration"),
  totalWeeks: integer("total_weeks").default(15),
});

export const insertCourseSchema = createInsertSchema(courses).pick({
  code: true,
  name: true,
  description: true,
  credits: true,
  instructorName: true,
  schedule: true,
  duration: true,
  totalWeeks: true,
});

// Student course enrollment model
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  courseId: integer("course_id").notNull(),
  enrollmentDate: timestamp("enrollment_date").defaultNow(),
  status: text("status").default("active"),
  currentWeek: integer("current_week").default(1),
  progress: integer("progress").default(0),
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).pick({
  userId: true,
  courseId: true,
  status: true,
});

// Announcements model
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  department: text("department"),
  postedBy: text("posted_by"),
  postedAt: timestamp("posted_at").defaultNow(),
  isImportant: boolean("is_important").default(false),
});

export const insertAnnouncementSchema = createInsertSchema(announcements).pick({
  title: true,
  content: true,
  department: true,
  postedBy: true,
  isImportant: true,
});

// Financial records model
export const finances = pgTable("finances", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: integer("amount").notNull(),
  type: text("type").notNull(), // payment, fee, scholarship
  description: text("description"),
  transactionDate: timestamp("transaction_date").defaultNow(),
  status: text("status").default("completed"),
});

export const insertFinanceSchema = createInsertSchema(finances).pick({
  userId: true,
  amount: true,
  type: true,
  description: true,
  status: true,
});

// Task/Assignment model
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  courseId: integer("course_id"),
  dueDate: timestamp("due_date"),
  type: text("type").notNull(), // assignment, exam, project
  status: text("status").default("pending"),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  description: true,
  courseId: true,
  dueDate: true,
  type: true,
  status: true,
});

// Notifications model
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(), // academic, financial, general
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  title: true,
  content: true,
  type: true,
});

// Academic records model
export const academics = pgTable("academics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  courseId: integer("course_id").notNull(),
  semester: text("semester").notNull(),
  academicYear: text("academic_year").notNull(),
  grade: text("grade"),
  score: integer("score"),
  status: text("status").default("in-progress"),
});

export const insertAcademicSchema = createInsertSchema(academics).pick({
  userId: true,
  courseId: true,
  semester: true,
  academicYear: true,
  grade: true,
  score: true,
  status: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Enrollment = typeof enrollments.$inferSelect;

export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;

export type InsertFinance = z.infer<typeof insertFinanceSchema>;
export type Finance = typeof finances.$inferSelect;

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

export type InsertAcademic = z.infer<typeof insertAcademicSchema>;
export type Academic = typeof academics.$inferSelect;
