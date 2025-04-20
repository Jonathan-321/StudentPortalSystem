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
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

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
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private enrollments: Map<number, Enrollment>;
  private announcements: Map<number, Announcement>;
  private finances: Map<number, Finance>;
  private tasks: Map<number, Task>;
  private notifications: Map<number, Notification>;
  private academics: Map<number, Academic>;
  
  sessionStore: session.SessionStore;
  
  userId: number = 1;
  courseId: number = 1;
  enrollmentId: number = 1;
  announcementId: number = 1;
  financeId: number = 1;
  taskId: number = 1;
  notificationId: number = 1;
  academicId: number = 1;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.enrollments = new Map();
    this.announcements = new Map();
    this.finances = new Map();
    this.tasks = new Map();
    this.notifications = new Map();
    this.academics = new Map();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Initialize with some default courses
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    const defaultCourses: InsertCourse[] = [
      {
        code: "CSC301",
        name: "Data Structures and Algorithms",
        description: "Introduction to data structures and algorithm analysis",
        credits: 3,
        instructorName: "Dr. Emmanuel Niyibizi",
        schedule: "Monday, Wednesday 10:30 - 12:00",
        duration: 90,
        totalWeeks: 15
      },
      {
        code: "MTH241",
        name: "Linear Algebra",
        description: "Introduction to linear algebra and its applications",
        credits: 3,
        instructorName: "Prof. Alice Mukashema",
        schedule: "Tuesday, Friday 08:00 - 09:30",
        duration: 90,
        totalWeeks: 15
      },
      {
        code: "CSC325",
        name: "Database Systems",
        description: "Concepts and practice of database management systems",
        credits: 4,
        instructorName: "Dr. Jean Pierre Mugabo",
        schedule: "Thursday 14:00 - 17:00",
        duration: 180,
        totalWeeks: 15
      },
      {
        code: "CSC315",
        name: "Software Engineering",
        description: "Principles and practices of software development",
        credits: 3,
        instructorName: "Dr. Frank Mugisha",
        schedule: "Wednesday 14:00 - 15:30",
        duration: 90,
        totalWeeks: 15
      }
    ];
    
    defaultCourses.forEach(course => {
      this.createCourse(course);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async getUserByStudentId(studentId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.studentId === studentId
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      role: "student",
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserLanguage(id: number, language: string): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser = { ...user, language };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Course methods
  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.courseId++;
    const course: Course = { ...insertCourse, id };
    this.courses.set(id, course);
    return course;
  }

  // Enrollment methods
  async getUserEnrollments(userId: number): Promise<(Enrollment & { course: Course | undefined })[]> {
    const userEnrollments = Array.from(this.enrollments.values()).filter(
      (enrollment) => enrollment.userId === userId
    );
    
    return userEnrollments.map(enrollment => ({
      ...enrollment,
      course: this.courses.get(enrollment.courseId)
    }));
  }

  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const id = this.enrollmentId++;
    const now = new Date();
    const enrollment: Enrollment = { 
      ...insertEnrollment, 
      id, 
      enrollmentDate: now,
      currentWeek: 1,
      progress: 0
    };
    this.enrollments.set(id, enrollment);
    return enrollment;
  }

  // Announcement methods
  async getAllAnnouncements(): Promise<Announcement[]> {
    return Array.from(this.announcements.values()).sort((a, b) => 
      new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
    );
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const id = this.announcementId++;
    const now = new Date();
    const announcement: Announcement = { 
      ...insertAnnouncement, 
      id, 
      postedAt: now
    };
    this.announcements.set(id, announcement);
    return announcement;
  }

  // Finance methods
  async getUserFinances(userId: number): Promise<Finance[]> {
    return Array.from(this.finances.values())
      .filter(finance => finance.userId === userId)
      .sort((a, b) => 
        new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
      );
  }

  async createFinance(insertFinance: InsertFinance): Promise<Finance> {
    const id = this.financeId++;
    const now = new Date();
    const finance: Finance = { 
      ...insertFinance, 
      id, 
      transactionDate: now
    };
    this.finances.set(id, finance);
    return finance;
  }

  // Task methods
  async getUserTasks(userId: number): Promise<(Task & { course: Course | undefined })[]> {
    // Get all enrollments for this user
    const userEnrollments = Array.from(this.enrollments.values()).filter(
      enrollment => enrollment.userId === userId
    );
    
    // Get all tasks for the courses the user is enrolled in
    const userTasks = Array.from(this.tasks.values()).filter(task => 
      task.courseId !== undefined && 
      userEnrollments.some(enrollment => enrollment.courseId === task.courseId)
    );
    
    return userTasks.map(task => ({
      ...task,
      course: task.courseId ? this.courses.get(task.courseId) : undefined
    }));
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.taskId++;
    const task: Task = { ...insertTask, id };
    this.tasks.set(id, task);
    return task;
  }

  // Notification methods
  async getUserNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.notificationId++;
    const now = new Date();
    const notification: Notification = { 
      ...insertNotification, 
      id, 
      isRead: false,
      createdAt: now
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: number, userId: number): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    
    if (!notification || notification.userId !== userId) {
      return undefined;
    }
    
    const updatedNotification = { ...notification, isRead: true };
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }

  async markAllNotificationsAsRead(userId: number): Promise<void> {
    const userNotifications = Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId);
    
    userNotifications.forEach(notification => {
      this.notifications.set(notification.id, { ...notification, isRead: true });
    });
  }

  // Academic methods
  async getUserAcademics(userId: number): Promise<(Academic & { course: Course | undefined })[]> {
    const userAcademics = Array.from(this.academics.values()).filter(
      academic => academic.userId === userId
    );
    
    return userAcademics.map(academic => ({
      ...academic,
      course: this.courses.get(academic.courseId)
    }));
  }

  async createAcademic(insertAcademic: InsertAcademic): Promise<Academic> {
    const id = this.academicId++;
    const academic: Academic = { ...insertAcademic, id };
    this.academics.set(id, academic);
    return academic;
  }
}

export const storage = new MemStorage();
