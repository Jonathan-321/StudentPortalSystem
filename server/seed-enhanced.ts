import { storage } from "./storage-optimized";
import { hashPassword } from "./auth";

// Enhanced database seeding with comprehensive data
export async function seedDatabaseEnhanced() {
  try {
    console.log("Starting enhanced database seeding...");

    // Check if already seeded
    const existingUsers = await storage.getUserByUsername("admin");
    if (existingUsers) {
      console.log("Database already seeded, skipping...");
      return;
    }

    // Create users
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

    const studentPassword = await hashPassword("password");
    const john = await storage.createUser({
      username: "john",
      password: studentPassword,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@ur.ac.rw",
      studentId: "219002134",
      role: "student",
      language: "en",
    });

    // Create additional students
    const jane = await storage.createUser({
      username: "jane",
      password: await hashPassword("password"),
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@ur.ac.rw",
      studentId: "219002135",
      role: "student",
      language: "en",
    });

    const alice = await storage.createUser({
      username: "alice",
      password: await hashPassword("password"),
      firstName: "Alice",
      lastName: "Uwimana",
      email: "alice.uwimana@ur.ac.rw",
      studentId: "219002136",
      role: "student",
      language: "rw",
    });

    // Create comprehensive course list
    const courses = [
      {
        code: "CSC101",
        name: "Introduction to Computer Science",
        description: "Basic concepts of computer science and programming using Python",
        credits: 3,
        instructorName: "Dr. Emmanuel Niyibizi",
        schedule: "Monday, Wednesday 10:00-11:30",
        duration: 90,
        totalWeeks: 15,
      },
      {
        code: "CSC201",
        name: "Data Structures and Algorithms",
        description: "Advanced programming concepts, data structures, and algorithm design",
        credits: 4,
        instructorName: "Dr. Sarah Kagabo",
        schedule: "Tuesday, Thursday 08:00-09:30",
        duration: 90,
        totalWeeks: 15,
      },
      {
        code: "MTH101",
        name: "Calculus I",
        description: "Introduction to differential and integral calculus",
        credits: 4,
        instructorName: "Prof. Alice Mukashema",
        schedule: "Tuesday, Thursday 13:00-14:30",
        duration: 90,
        totalWeeks: 15,
      },
      {
        code: "MTH201",
        name: "Linear Algebra",
        description: "Vector spaces, matrices, and linear transformations",
        credits: 3,
        instructorName: "Dr. Peter Habiyambere",
        schedule: "Monday, Wednesday, Friday 09:00-10:00",
        duration: 60,
        totalWeeks: 15,
      },
      {
        code: "PHYS101",
        name: "Physics I",
        description: "Mechanics, thermodynamics, and waves",
        credits: 4,
        instructorName: "Dr. Robert Kanyamibwa",
        schedule: "Monday, Wednesday 13:00-14:30",
        duration: 90,
        totalWeeks: 15,
      },
      {
        code: "ENG101",
        name: "English Composition",
        description: "Academic writing and critical thinking skills",
        credits: 3,
        instructorName: "Ms. Grace Uwase",
        schedule: "Tuesday, Thursday 15:00-16:30",
        duration: 90,
        totalWeeks: 15,
      },
      {
        code: "BUS101",
        name: "Introduction to Business",
        description: "Fundamentals of business organization and management",
        credits: 3,
        instructorName: "Prof. Jean-Claude Nshimiyimana",
        schedule: "Monday, Wednesday 15:00-16:30",
        duration: 90,
        totalWeeks: 15,
      },
      {
        code: "CSC301",
        name: "Database Systems",
        description: "Design and implementation of database management systems",
        credits: 4,
        instructorName: "Dr. Emmanuel Niyibizi",
        schedule: "Tuesday, Thursday 10:00-11:30",
        duration: 90,
        totalWeeks: 15,
      },
    ];

    const createdCourses = [];
    for (const course of courses) {
      const created = await storage.createCourse(course);
      createdCourses.push(created);
    }

    // Create enrollments for John (main student)
    const johnEnrollments = [0, 2, 4, 5]; // CSC101, MTH101, PHYS101, ENG101
    for (const index of johnEnrollments) {
      await storage.createEnrollment({
        userId: john.id,
        courseId: createdCourses[index].id,
        status: "active",
      });
    }

    // Create enrollments for Jane
    const janeEnrollments = [1, 3, 5, 6]; // CSC201, MTH201, ENG101, BUS101
    for (const index of janeEnrollments) {
      await storage.createEnrollment({
        userId: jane.id,
        courseId: createdCourses[index].id,
        status: "active",
      });
    }

    // Create academic records with grades for John
    await storage.createAcademic({
      userId: john.id,
      courseId: createdCourses[0].id, // CSC101
      semester: "Fall",
      academicYear: "2023",
      grade: "A",
      score: 92,
      status: "in-progress",
    });

    await storage.createAcademic({
      userId: john.id,
      courseId: createdCourses[2].id, // MTH101
      semester: "Fall",
      academicYear: "2023",
      grade: "B+",
      score: 85,
      status: "in-progress",
    });

    await storage.createAcademic({
      userId: john.id,
      courseId: createdCourses[4].id, // PHYS101
      semester: "Fall",
      academicYear: "2023",
      grade: "A-",
      score: 88,
      status: "in-progress",
    });

    // Create comprehensive announcements
    const announcements = [
      {
        title: "Welcome to the New Academic Year 2023-2024",
        content: "Dear Students, Welcome back to the University of Rwanda! We are excited to begin this new academic year with you. Please ensure you have completed your registration and collected your student ID cards from the registrar's office.",
        department: "Office of the Vice Chancellor",
        postedBy: "Dr. Jean-Pierre Mugabo",
        isImportant: true,
      },
      {
        title: "Library Hours Extended During Examination Period",
        content: "The university library will extend its operating hours during the examination period. New hours: Monday-Friday: 7:00 AM - 10:00 PM, Saturday: 8:00 AM - 8:00 PM, Sunday: 10:00 AM - 6:00 PM.",
        department: "Library Services",
        postedBy: "Library Administration",
        isImportant: false,
      },
      {
        title: "COVID-19 Health Guidelines Update",
        content: "Please continue to follow health guidelines on campus. Masks are optional but recommended in crowded spaces. Hand sanitizing stations are available throughout the campus.",
        department: "Health Services",
        postedBy: "Dr. Marie Uwimana",
        isImportant: true,
      },
      {
        title: "Career Fair 2024 - Save the Date",
        content: "The annual University of Rwanda Career Fair will be held on March 15-16, 2024. Over 50 companies will be present. Start preparing your CV and professional attire!",
        department: "Career Services",
        postedBy: "Career Development Office",
        isImportant: false,
      },
      {
        title: "Student Government Elections",
        content: "Student government elections will be held on February 20, 2024. Nomination forms are available at the Student Affairs office. Deadline for submissions is February 10, 2024.",
        department: "Student Affairs",
        postedBy: "Electoral Commission",
        isImportant: false,
      },
    ];

    for (const announcement of announcements) {
      await storage.createAnnouncement(announcement);
    }

    // Create detailed financial records for John
    const finances = [
      {
        userId: john.id,
        amount: 600000, // RWF
        type: "fee",
        description: "Tuition Fee for Fall 2023 Semester",
        status: "pending",
      },
      {
        userId: john.id,
        amount: 200000, // RWF
        type: "payment",
        description: "First installment payment - Tuition",
        status: "completed",
      },
      {
        userId: john.id,
        amount: 50000, // RWF
        type: "fee",
        description: "Laboratory Fee",
        status: "pending",
      },
      {
        userId: john.id,
        amount: 30000, // RWF
        type: "fee",
        description: "Library Fee",
        status: "completed",
      },
      {
        userId: john.id,
        amount: 100000, // RWF
        type: "scholarship",
        description: "Merit-based Scholarship Award",
        status: "completed",
      },
      {
        userId: john.id,
        amount: 25000, // RWF
        type: "fee",
        description: "Student Activities Fee",
        status: "completed",
      },
    ];

    for (const finance of finances) {
      await storage.createFinance(finance);
    }

    // Create diverse tasks and assignments
    const tasks = [
      {
        title: "Programming Assignment 1: Python Basics",
        description: "Complete exercises 1-10 on Python fundamentals. Submit via the course portal.",
        courseId: createdCourses[0].id, // CSC101
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        type: "assignment",
        status: "pending",
      },
      {
        title: "Calculus Problem Set 3",
        description: "Solve problems 1-25 from Chapter 3. Show all work for full credit.",
        courseId: createdCourses[2].id, // MTH101
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
        type: "assignment",
        status: "pending",
      },
      {
        title: "Physics Lab Report: Motion and Forces",
        description: "Submit your lab report including data analysis and conclusions.",
        courseId: createdCourses[4].id, // PHYS101
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
        type: "assignment",
        status: "pending",
      },
      {
        title: "Midterm Exam: Introduction to Computer Science",
        description: "Covers chapters 1-5. Room: CB 201, Time: 10:00 AM",
        courseId: createdCourses[0].id, // CSC101
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
        type: "exam",
        status: "pending",
      },
      {
        title: "Essay: Academic Writing",
        description: "Write a 1500-word argumentative essay on a topic of your choice.",
        courseId: createdCourses[5].id, // ENG101
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
        type: "assignment",
        status: "pending",
      },
      {
        title: "Group Project: Database Design",
        description: "Design a database system for a small business. Groups of 3-4 students.",
        courseId: createdCourses[0].id, // CSC101
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks
        type: "project",
        status: "pending",
      },
      {
        title: "Quiz 2: Derivatives and Integrals",
        description: "Online quiz covering sections 2.1-2.5. 30 minutes, 20 questions.",
        courseId: createdCourses[2].id, // MTH101
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
        type: "exam",
        status: "pending",
      },
    ];

    for (const task of tasks) {
      await storage.createTask(task);
    }

    // Create notifications for John
    const notifications = [
      {
        userId: john.id,
        title: "New Assignment Posted",
        content: "Programming Assignment 1 has been posted for CSC101. Due in 3 days.",
        type: "academic",
        isRead: false,
      },
      {
        userId: john.id,
        title: "Payment Reminder",
        content: "Your tuition balance of 400,000 RWF is due by the end of the month.",
        type: "financial",
        isRead: false,
      },
      {
        userId: john.id,
        title: "Grade Posted",
        content: "Your grade for Physics Lab 1 has been posted: A-",
        type: "academic",
        isRead: false,
      },
      {
        userId: john.id,
        title: "Library Book Due",
        content: "Your library book 'Introduction to Algorithms' is due tomorrow.",
        type: "general",
        isRead: false,
      },
      {
        userId: john.id,
        title: "Upcoming Exam",
        content: "Reminder: Calculus midterm exam is scheduled for next week.",
        type: "academic",
        isRead: false,
      },
      {
        userId: john.id,
        title: "Course Registration Opens",
        content: "Registration for Spring 2024 courses opens on November 15, 2023.",
        type: "general",
        isRead: false,
      },
    ];

    for (const notification of notifications) {
      await storage.createNotification(notification);
    }

    console.log("✅ Enhanced database seeding completed successfully!");
    console.log("Created:");
    console.log(`- ${4} users (admin, john, jane, alice)`);
    console.log(`- ${courses.length} courses`);
    console.log(`- ${johnEnrollments.length + janeEnrollments.length} enrollments`);
    console.log(`- ${3} academic records`);
    console.log(`- ${announcements.length} announcements`);
    console.log(`- ${finances.length} financial records`);
    console.log(`- ${tasks.length} tasks/assignments`);
    console.log(`- ${notifications.length} notifications`);
    
  } catch (error) {
    console.error("Error in enhanced seeding:", error);
    throw error;
  }
}