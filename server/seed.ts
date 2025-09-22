import { storage } from "./storage.js";
import { hashPassword } from "./auth-vercel.js";

// Initialize the database with default data
export async function seedDatabase() {
  try {
    // Check if we already have users
    const existingUsers = await storage.getUserByUsername("admin");
    if (existingUsers) {
      console.log("Database already seeded, skipping...");
      return;
    }

    console.log("Seeding database with initial data...");

    // Create admin user
    const adminPassword = await hashPassword("password");
    const admin = await storage.createUser({
      username: "admin",
      password: adminPassword,
      firstName: "Admin",
      lastName: "User",
      email: "admin@ur.ac.rw",
      role: "admin",
      language: "en",
    });
    
    // Create test student user
    const studentPassword = await hashPassword("password");
    const student = await storage.createUser({
      username: "john",
      password: studentPassword,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@ur.ac.rw",
      studentId: "219002134",
      role: "student",
      language: "en",
    });
    
    // Create courses
    const csc101 = await storage.createCourse({
      code: "CSC101",
      name: "Introduction to Computer Science",
      description: "Basic concepts of computer science and programming",
      credits: 3,
      instructorName: "Dr. Emmanuel Niyibizi",
      schedule: "Monday, Wednesday 10:00-11:30",
      duration: 90,
      totalWeeks: 15,
    });
    
    const mth101 = await storage.createCourse({
      code: "MTH101",
      name: "Calculus I",
      description: "Introduction to differential and integral calculus",
      credits: 4,
      instructorName: "Prof. Alice Mukashema",
      schedule: "Tuesday, Thursday 13:00-14:30",
      duration: 90,
      totalWeeks: 15,
    });
    
    const phys101 = await storage.createCourse({
      code: "PHYS101",
      name: "Physics I",
      description: "Mechanics, thermodynamics, and waves",
      credits: 4,
      instructorName: "Dr. Robert Kanyamibwa",
      schedule: "Monday, Wednesday 13:00-14:30",
      duration: 90,
      totalWeeks: 15,
    });
    
    // Create enrollments
    await storage.createEnrollment({
      userId: student.id,
      courseId: csc101.id,
      status: "active",
    });
    
    await storage.createEnrollment({
      userId: student.id,
      courseId: mth101.id,
      status: "active",
    });
    
    // Create announcements
    await storage.createAnnouncement({
      title: "Welcome to the New Semester",
      content: "Welcome back to the University of Rwanda for the Fall 2023 semester. We hope you had a restful break and are ready to start a new academic year.",
      department: "Office of Academic Affairs",
      postedBy: "Dr. Jean-Pierre Mugabo",
      isImportant: true,
    });
    
    await storage.createAnnouncement({
      title: "Library Hours Extended During Exams",
      content: "The university library will extend its operating hours during the exam period, remaining open until 22:00 from Monday to Friday.",
      department: "Library Services",
      postedBy: "Library Administration",
      isImportant: false,
    });
    
    // Create finances
    await storage.createFinance({
      userId: student.id,
      amount: 200000, // RWF
      type: "fee",
      description: "Tuition Fee for Fall 2023",
      status: "paid",
    });
    
    await storage.createFinance({
      userId: student.id,
      amount: 50000, // RWF
      type: "payment",
      description: "First payment installment",
      status: "completed",
    });
    
    // Create tasks
    await storage.createTask({
      title: "CSC101 Assignment 1",
      description: "Complete the programming exercises 1-5 in Chapter A",
      courseId: csc101.id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      type: "assignment",
      status: "pending",
    });
    
    await storage.createTask({
      title: "MTH101 Midterm Exam",
      description: "Midterm examination covering chapters 1-5",
      courseId: mth101.id,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
      type: "exam",
      status: "pending",
    });
    
    // Create notifications
    await storage.createNotification({
      userId: student.id,
      title: "New Assignment Posted",
      content: "A new assignment has been posted for CSC101. Due date: 1 week from now.",
      type: "academic",
    });
    
    await storage.createNotification({
      userId: student.id,
      title: "Tuition Payment Received",
      content: "Your payment of 50,000 RWF has been received and processed. Thank you!",
      type: "financial",
    });
    
    // Create academic records
    await storage.createAcademic({
      userId: student.id,
      courseId: csc101.id,
      semester: "Fall 2023",
      academicYear: "2023-2024",
      status: "in-progress",
    });
    
    await storage.createAcademic({
      userId: student.id,
      courseId: mth101.id,
      semester: "Fall 2023",
      academicYear: "2023-2024",
      status: "in-progress",
    });

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}