import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { setupAuth } from "./auth.js";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint (no auth required)
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Set up authentication routes FIRST
  setupAuth(app);

  // Combined dashboard endpoint for better performance (AFTER auth setup)
  app.get("/api/dashboard", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = req.user!.id;
      
      // Fetch all dashboard data in parallel
      const [enrollments, announcements, tasks, academics, finances] = await Promise.all([
        storage.getUserEnrollments(userId),
        storage.getAllAnnouncements(),
        storage.getUserTasks(userId),
        storage.getUserAcademics(userId),
        storage.getUserFinances(userId)
      ]);
      
      res.json({
        user: req.user,
        enrollments,
        announcements,
        tasks,
        academics,
        finances
      });
    } catch (error) {
      console.error('Dashboard endpoint error:', error);
      next(error);
    }
  });

  // Courses routes
  app.get("/api/courses", async (req, res, next) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/courses/:id", async (req, res, next) => {
    try {
      const course = await storage.getCourse(parseInt(req.params.id));
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      next(error);
    }
  });

  // Enrollment routes
  app.get("/api/enrollments", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const enrollments = await storage.getUserEnrollments(req.user!.id);
      res.json(enrollments);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/enrollments", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const enrollment = await storage.createEnrollment({
        ...req.body,
        userId: req.user!.id,
      });
      res.status(201).json(enrollment);
    } catch (error) {
      next(error);
    }
  });

  // Announcements routes
  app.get("/api/announcements", async (req, res, next) => {
    try {
      const announcements = await storage.getAllAnnouncements();
      res.json(announcements);
    } catch (error) {
      next(error);
    }
  });

  // Finance routes
  app.get("/api/finances", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const finances = await storage.getUserFinances(req.user!.id);
      res.json(finances);
    } catch (error) {
      next(error);
    }
  });

  // Tasks routes
  app.get("/api/tasks", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const tasks = await storage.getUserTasks(req.user!.id);
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  });

  // Notifications routes
  app.get("/api/notifications", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const notifications = await storage.getUserNotifications(req.user!.id);
      res.json(notifications);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const notification = await storage.markNotificationAsRead(
        parseInt(req.params.id),
        req.user!.id
      );
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      res.json(notification);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/notifications/read-all", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      await storage.markAllNotificationsAsRead(req.user!.id);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  });

  // Academic records routes
  app.get("/api/academics", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const academics = await storage.getUserAcademics(req.user!.id);
      res.json(academics);
    } catch (error) {
      next(error);
    }
  });

  // Combined academics page endpoint for better performance
  app.get("/api/academics-page", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = req.user!.id;
      
      // Fetch all academics page data in parallel
      const [enrollments, academics, courses] = await Promise.all([
        storage.getUserEnrollments(userId),
        storage.getUserAcademics(userId),
        storage.getAllCourses()
      ]);
      
      res.json({
        user: req.user,
        enrollments,
        academics,
        courses
      });
    } catch (error) {
      console.error('Academics page endpoint error:', error);
      next(error);
    }
  });

  app.get("/api/academics/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const academic = await storage.getAcademic(parseInt(req.params.id), req.user!.id);
      if (!academic) {
        return res.status(404).json({ message: "Academic record not found" });
      }
      res.json(academic);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/academics", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const academic = await storage.createAcademic({
        ...req.body,
        userId: req.user!.id
      });
      res.status(201).json(academic);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/academics/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const academic = await storage.updateAcademic(
        parseInt(req.params.id),
        req.user!.id,
        req.body
      );
      if (!academic) {
        return res.status(404).json({ message: "Academic record not found" });
      }
      res.json(academic);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/academics/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      await storage.deleteAcademic(parseInt(req.params.id), req.user!.id);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });

  // Course enrollment routes
  app.post("/api/enrollments", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      // Create enrollment
      const enrollment = await storage.createEnrollment({
        userId: req.user!.id,
        courseId: req.body.courseId,
        status: "active"
      });
      
      // Create corresponding academic record
      await storage.createAcademic({
        userId: req.user!.id,
        courseId: req.body.courseId,
        semester: req.body.semester || "Fall 2023",
        academicYear: req.body.academicYear || "2023-2024",
        status: "in-progress"
      });
      
      res.status(201).json(enrollment);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
