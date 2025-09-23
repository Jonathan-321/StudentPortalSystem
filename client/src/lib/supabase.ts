import { createClient } from '@supabase/supabase-js';

// Your Supabase credentials
const supabaseUrl = 'https://ansdvphqrubabvtpfwyv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuc2R2cGhxcnViYWJ2dHBmd3l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MDk4NTUsImV4cCI6MjA3NDA4NTg1NX0.r2-lib_pIHhpaQlkOHlhB0XY64d3C_rclaYfFY3tj88';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for common operations
export const supabaseApi = {
  // Auth
  async login(username: string, password: string) {
    // Since we're using custom users table, we'll query it directly
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error || !users) {
      throw new Error('Invalid credentials');
    }
    
    // For now, we'll do a simple check (in production, use proper auth)
    // Store user in localStorage
    localStorage.setItem('currentUser', JSON.stringify(users));
    return users;
  },

  async logout() {
    localStorage.removeItem('currentUser');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Courses
  async getCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('code');
    
    if (error) throw error;
    return data;
  },

  async getCourse(id: number) {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Enrollments
  async getUserEnrollments(userId: number) {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        course:courses(*)
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  },

  async createEnrollment(userId: number, courseId: number) {
    const { data, error } = await supabase
      .from('enrollments')
      .insert([{ user_id: userId, course_id: courseId, status: 'active' }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Announcements
  async getAnnouncements() {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('posted_at', { ascending: false })
      .limit(20);
    
    if (error) throw error;
    return data;
  },

  // Academics
  async getUserAcademics(userId: number) {
    const { data, error } = await supabase
      .from('academics')
      .select(`
        *,
        course:courses(*)
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  },

  // Finances
  async getUserFinances(userId: number) {
    const { data, error } = await supabase
      .from('finances')
      .select('*')
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Tasks
  async getUserTasks(userId: number) {
    // First get user's enrolled courses
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('course_id')
      .eq('user_id', userId);
    
    if (!enrollments || enrollments.length === 0) return [];
    
    const courseIds = enrollments.map(e => e.course_id);
    
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        course:courses(*)
      `)
      .in('course_id', courseIds)
      .order('due_date');
    
    if (error) throw error;
    return data;
  },

  // Notifications
  async getUserNotifications(userId: number) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async markNotificationAsRead(notificationId: number) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};