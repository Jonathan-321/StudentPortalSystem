import { createHash } from 'crypto';
import { parse } from 'cookie';

// Simulated in-memory database for Vercel deployment
const users = [
  {
    id: 1,
    username: 'john',
    password: 'password', // In production, this would be hashed
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@ur.ac.rw',
    studentId: '219002134',
    role: 'student',
    language: 'en'
  },
  {
    id: 2,
    username: 'admin',
    password: 'password',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@ur.ac.rw',
    role: 'admin',
    language: 'en'
  }
];

const announcements = [
  {
    id: 1,
    title: "Welcome to the New Semester",
    content: "Welcome back to the University of Rwanda for the Fall 2023 semester. We hope you had a restful break and are ready to start a new academic year.",
    department: "Office of Academic Affairs",
    postedBy: "Dr. Jean-Pierre Mugabo",
    isImportant: true,
    postedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Library Hours Extended During Exams",
    content: "The university library will extend its operating hours during the exam period, remaining open until 22:00 from Monday to Friday.",
    department: "Library Services",
    postedBy: "Library Administration",
    isImportant: false,
    postedAt: new Date().toISOString()
  }
];

const courses = [
  {
    id: 1,
    code: "CSC101",
    name: "Introduction to Computer Science",
    description: "Basic concepts of computer science and programming",
    credits: 3,
    instructorName: "Dr. Emmanuel Niyibizi",
    schedule: "Monday, Wednesday 10:00-11:30",
    duration: 90,
    totalWeeks: 15
  },
  {
    id: 2,
    code: "MTH101",
    name: "Calculus I",
    description: "Introduction to differential and integral calculus",
    credits: 4,
    instructorName: "Prof. Alice Mukashema",
    schedule: "Tuesday, Thursday 13:00-14:30",
    duration: 90,
    totalWeeks: 15
  }
];

const enrollments = [
  {
    userId: 1,
    courseId: 1,
    status: 'active',
    course: courses[0]
  },
  {
    userId: 1,
    courseId: 2,
    status: 'active',
    course: courses[1]
  }
];

const tasks = [
  {
    id: 1,
    title: "CSC101 Assignment 1",
    description: "Complete the programming exercises 1-5 in Chapter A",
    courseId: 1,
    course: courses[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    type: "assignment",
    status: "pending"
  },
  {
    id: 2,
    title: "MTH101 Midterm Exam",
    description: "Midterm examination covering chapters 1-5",
    courseId: 2,
    course: courses[1],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    type: "exam",
    status: "pending"
  }
];

const finances = [
  {
    id: 1,
    userId: 1,
    amount: 200000,
    type: "fee",
    description: "Tuition Fee for Fall 2023",
    status: "paid",
    transactionDate: new Date().toISOString()
  },
  {
    id: 2,
    userId: 1,
    amount: 50000,
    type: "payment",
    description: "First payment installment",
    status: "completed",
    transactionDate: new Date().toISOString()
  }
];

const notifications = [
  {
    id: 1,
    userId: 1,
    title: "New Assignment Posted",
    content: "A new assignment has been posted for CSC101. Due date: 1 week from now.",
    type: "academic",
    isRead: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    userId: 1,
    title: "Tuition Payment Received",
    content: "Your payment of 50,000 RWF has been received and processed. Thank you!",
    type: "financial",
    isRead: false,
    createdAt: new Date().toISOString()
  }
];

const academics = [
  {
    id: 1,
    userId: 1,
    courseId: 1,
    course: courses[0],
    semester: "Fall 2023",
    academicYear: "2023-2024",
    status: "in-progress",
    grade: null,
    gpa: null
  },
  {
    id: 2,
    userId: 1,
    courseId: 2,
    course: courses[1],
    semester: "Fall 2023",
    academicYear: "2023-2024",
    status: "in-progress",
    grade: null,
    gpa: null
  }
];

// Simple session storage (in production, use a proper session store)
const sessions = new Map();

export default async function handler(req, res) {
  const { path } = req.query;
  const route = path ? path.join('/') : '';
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Cookie');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Parse cookies manually
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const sessionId = cookies.sessionId;
  const session = sessionId ? sessions.get(sessionId) : null;

  // Authentication endpoints
  if (route === 'login' && req.method === 'POST') {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      // Create session
      const newSessionId = createHash('sha256').update(Date.now().toString()).digest('hex');
      const { password: _, ...userWithoutPassword } = user;
      sessions.set(newSessionId, { user: userWithoutPassword });
      
      res.setHeader('Set-Cookie', `sessionId=${newSessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`);
      return res.status(200).json(userWithoutPassword);
    } else {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  }

  if (route === 'register' && req.method === 'POST') {
    const { username, password, email, firstName, lastName, studentId, role = 'student', language = 'en' } = req.body;
    
    // Check if user already exists
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    if (studentId && users.find(u => u.studentId === studentId)) {
      return res.status(400).json({ message: 'Student ID already exists' });
    }
    
    // Create new user
    const newUser = {
      id: users.length + 1,
      username,
      password, // In production, this would be hashed
      firstName,
      lastName,
      email,
      studentId,
      role,
      language
    };
    
    users.push(newUser);
    
    // Create session
    const newSessionId = createHash('sha256').update(Date.now().toString()).digest('hex');
    const { password: _, ...userWithoutPassword } = newUser;
    sessions.set(newSessionId, { user: userWithoutPassword });
    
    res.setHeader('Set-Cookie', `sessionId=${newSessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`);
    return res.status(201).json(userWithoutPassword);
  }

  if (route === 'logout' && req.method === 'POST') {
    if (sessionId) {
      sessions.delete(sessionId);
    }
    res.setHeader('Set-Cookie', 'sessionId=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
    return res.status(200).json({ message: 'Logged out successfully' });
  }

  if (route === 'user' && req.method === 'GET') {
    if (!session) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    return res.status(200).json(session.user);
  }

  if (route === 'user/language' && req.method === 'PATCH') {
    if (!session) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { language } = req.body;
    if (!language || !['en', 'fr', 'rw'].includes(language)) {
      return res.status(400).json({ message: 'Invalid language' });
    }
    
    // Update user language
    const user = users.find(u => u.id === session.user.id);
    if (user) {
      user.language = language;
      session.user.language = language;
      return res.status(200).json(session.user);
    }
    
    return res.status(404).json({ message: 'User not found' });
  }

  // Dashboard endpoints
  if (route === 'dashboard/stats' && req.method === 'GET') {
    if (!session) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const userEnrollments = enrollments.filter(e => e.userId === session.user.id);
    const userTasks = tasks.filter(t => userEnrollments.some(e => e.courseId === t.courseId));
    const userNotifications = notifications.filter(n => n.userId === session.user.id);
    
    return res.status(200).json({
      totalCourses: userEnrollments.length,
      pendingTasks: userTasks.filter(t => t.status === 'pending').length,
      unreadNotifications: userNotifications.filter(n => !n.isRead).length,
      gpa: 3.5 // Hardcoded for now
    });
  }

  if (route === 'enrollments' && req.method === 'GET') {
    if (!session) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const userEnrollments = enrollments.filter(e => e.userId === session.user.id);
    return res.status(200).json(userEnrollments);
  }

  if (route === 'announcements' && req.method === 'GET') {
    return res.status(200).json(announcements);
  }

  if (route === 'courses' && req.method === 'GET') {
    return res.status(200).json(courses);
  }

  if (route === 'tasks' && req.method === 'GET') {
    if (!session) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const userEnrollments = enrollments.filter(e => e.userId === session.user.id);
    const userTasks = tasks.filter(t => userEnrollments.some(e => e.courseId === t.courseId));
    return res.status(200).json(userTasks);
  }

  if (route === 'finances' && req.method === 'GET') {
    if (!session) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const userFinances = finances.filter(f => f.userId === session.user.id);
    return res.status(200).json(userFinances);
  }

  if (route === 'notifications' && req.method === 'GET') {
    if (!session) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const userNotifications = notifications.filter(n => n.userId === session.user.id);
    return res.status(200).json(userNotifications);
  }

  if (route.startsWith('notifications/') && route.endsWith('/read') && req.method === 'PATCH') {
    if (!session) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const notificationId = parseInt(route.split('/')[1]);
    const notification = notifications.find(n => n.id === notificationId && n.userId === session.user.id);
    
    if (notification) {
      notification.isRead = true;
      return res.status(200).json(notification);
    }
    
    return res.status(404).json({ message: 'Notification not found' });
  }

  if (route === 'notifications/read-all' && req.method === 'POST') {
    if (!session) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    notifications.forEach(n => {
      if (n.userId === session.user.id) {
        n.isRead = true;
      }
    });
    
    return res.status(200).json({ message: 'All notifications marked as read' });
  }

  if (route === 'academics' && req.method === 'GET') {
    if (!session) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const userAcademics = academics.filter(a => a.userId === session.user.id);
    return res.status(200).json(userAcademics);
  }

  // Default response
  res.status(404).json({ message: `Route /api/${route} not found` });
}