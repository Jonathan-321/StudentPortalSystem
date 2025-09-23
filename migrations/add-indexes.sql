-- Add indexes for better query performance
-- Run this after your initial migration

-- User lookups
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_student_id ON users(student_id);

-- Enrollment queries
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_enrollments_user_course ON enrollments(user_id, course_id);

-- Academic records
CREATE INDEX idx_academics_user_id ON academics(user_id);
CREATE INDEX idx_academics_course_id ON academics(course_id);
CREATE INDEX idx_academics_user_course ON academics(user_id, course_id);

-- Tasks (for filtering by course)
CREATE INDEX idx_tasks_course_id ON tasks(course_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

-- Finances
CREATE INDEX idx_finances_user_id ON finances(user_id);
CREATE INDEX idx_finances_transaction_date ON finances(transaction_date);

-- Announcements
CREATE INDEX idx_announcements_posted_at ON announcements(posted_at);