import { sql } from "drizzle-orm";
import { db } from "./db";

export async function initializeDatabase() {
  try {
    console.log("Initializing database schema...");
    
    // Create tables if they don't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        student_id TEXT,
        role TEXT DEFAULT 'student' NOT NULL,
        profile_image TEXT,
        language TEXT DEFAULT 'en' NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT,
        credits INTEGER NOT NULL,
        instructor_name TEXT,
        schedule TEXT,
        duration INTEGER,
        total_weeks INTEGER DEFAULT 15
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS enrollments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        enrollment_date TIMESTAMP DEFAULT NOW(),
        status TEXT DEFAULT 'active',
        current_week INTEGER DEFAULT 1,
        progress INTEGER DEFAULT 0
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        department TEXT,
        posted_by TEXT,
        posted_at TIMESTAMP DEFAULT NOW(),
        is_important BOOLEAN DEFAULT false
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS finances (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        amount INTEGER NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        transaction_date TIMESTAMP DEFAULT NOW(),
        status TEXT DEFAULT 'completed'
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        course_id INTEGER,
        due_date TIMESTAMP,
        type TEXT NOT NULL,
        status TEXT DEFAULT 'pending'
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        type TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS academics (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        semester TEXT NOT NULL,
        academic_year TEXT NOT NULL,
        grade TEXT,
        score INTEGER,
        status TEXT DEFAULT 'in-progress'
      )
    `);

    console.log("Database schema initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}