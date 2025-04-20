import { 
  users, type User, type InsertUser,
  courses, type Course, type InsertCourse,
  enrollments, type Enrollment, type InsertEnrollment,
  announcements, type Announcement, type InsertAnnouncement,
  finances, type Finance, type InsertFinance,
  tasks, type Task, type InsertTask,
  notifications, type Notification, type InsertNotification,
  academics, type Academic, type InsertAcademic 
} from "@shared/schema";
import session from "express-session";
import * as connectPgSimple from "connect-pg-simple";
import { db, pool } from "./db";
import { eq, and, desc } from "drizzle-orm";

const PostgresSessionStore = connectPgSimple.default(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByStudentId(studentId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLanguage(id: number, language: string): Promise<User>;

  // Course methods
  getCourse(id: number): Promise<Course | undefined>;
  getAllCourses(): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;

  // Enrollment methods
  getUserEnrollments(userId: number): Promise<
    (Enrollment & { course: Course | undefined })[]
  >;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;

  // Announcement methods
  getAllAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;

  // Finance methods
  getUserFinances(userId: number): Promise<Finance[]>;
  createFinance(finance: InsertFinance): Promise<Finance>;

  // Task methods
  getUserTasks(userId: number): Promise<
    (Task & { course: Course | undefined })[]
  >;
  createTask(task: InsertTask): Promise<Task>;

  // Notification methods
  getUserNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number, userId: number): Promise<Notification | undefined>;
  markAllNotificationsAsRead(userId: number): Promise<void>;

  // Academic methods
  getUserAcademics(userId: number): Promise<
    (Academic & { course: Course | undefined })[]
  >;
  createAcademic(academic: InsertAcademic): Promise<Academic>;

  // Session store
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }
  
  async getUserByStudentId(studentId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.studentId, studentId));
    return result[0];
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }
  
  async updateUserLanguage(id: number, language: string): Promise<User> {
    const result = await db
      .update(users)
      .set({ language })
      .where(eq(users.id, id))
      .returning();
    
    return result[0];
  }
  
  // Course methods
  async getCourse(id: number): Promise<Course | undefined> {
    const result = await db.select().from(courses).where(eq(courses.id, id));
    return result[0];
  }
  
  async getAllCourses(): Promise<Course[]> {
    return db.select().from(courses);
  }
  
  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const result = await db.insert(courses).values(insertCourse).returning();
    return result[0];
  }
  
  // Enrollment methods
  async getUserEnrollments(userId: number): Promise<(Enrollment & { course: Course | undefined })[]> {
    const userEnrollments = await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.userId, userId));
    
    const result = [];
    
    for (const enrollment of userEnrollments) {
      const courseResult = await db
        .select()
        .from(courses)
        .where(eq(courses.id, enrollment.courseId));
      
      result.push({
        ...enrollment,
        course: courseResult[0]
      });
    }
    
    return result;
  }
  
  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const result = await db.insert(enrollments).values(insertEnrollment).returning();
    return result[0];
  }
  
  // Announcement methods
  async getAllAnnouncements(): Promise<Announcement[]> {
    return db.select().from(announcements).orderBy(desc(announcements.postedAt));
  }
  
  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const result = await db.insert(announcements).values(insertAnnouncement).returning();
    return result[0];
  }
  
  // Finance methods
  async getUserFinances(userId: number): Promise<Finance[]> {
    return db
      .select()
      .from(finances)
      .where(eq(finances.userId, userId))
      .orderBy(desc(finances.transactionDate));
  }
  
  async createFinance(insertFinance: InsertFinance): Promise<Finance> {
    const result = await db.insert(finances).values(insertFinance).returning();
    return result[0];
  }
  
  // Task methods
  async getUserTasks(userId: number): Promise<(Task & { course: Course | undefined })[]> {
    // First get all enrollments for the user
    const userEnrollments = await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.userId, userId));
    
    const courseIds = userEnrollments.map(enrollment => enrollment.courseId);
    
    // Then get all tasks for those courses
    const userTasks = await db
      .select()
      .from(tasks)
      .where(courseIds.length > 0 ? 
        // Make sure the task's course ID is in the list of enrolled course IDs
        eq(tasks.courseId, courseIds[0]) 
        // Or no enrollments, in which case we don't return any tasks
        : undefined
      );
    
    // Sort by due date if available
    userTasks.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
    
    // Add the course details to each task
    const result = [];
    
    for (const task of userTasks) {
      if (!task.courseId) {
        result.push({
          ...task,
          course: undefined
        });
        continue;
      }
      
      const courseResult = await db
        .select()
        .from(courses)
        .where(eq(courses.id, task.courseId));
      
      result.push({
        ...task,
        course: courseResult[0]
      });
    }
    
    return result;
  }
  
  async createTask(insertTask: InsertTask): Promise<Task> {
    const result = await db.insert(tasks).values(insertTask).returning();
    return result[0];
  }
  
  // Notification methods
  async getUserNotifications(userId: number): Promise<Notification[]> {
    return db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }
  
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const result = await db.insert(notifications).values(insertNotification).returning();
    return result[0];
  }
  
  async markNotificationAsRead(id: number, userId: number): Promise<Notification | undefined> {
    const result = await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(
        eq(notifications.id, id),
        eq(notifications.userId, userId)
      ))
      .returning();
    
    return result[0];
  }
  
  async markAllNotificationsAsRead(userId: number): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false)
      ));
  }
  
  // Academic methods
  async getUserAcademics(userId: number): Promise<(Academic & { course: Course | undefined })[]> {
    const userAcademics = await db
      .select()
      .from(academics)
      .where(eq(academics.userId, userId));
    
    const result = [];
    
    for (const academic of userAcademics) {
      const courseResult = await db
        .select()
        .from(courses)
        .where(eq(courses.id, academic.courseId));
      
      result.push({
        ...academic,
        course: courseResult[0]
      });
    }
    
    return result;
  }
  
  async createAcademic(insertAcademic: InsertAcademic): Promise<Academic> {
    const result = await db.insert(academics).values(insertAcademic).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();