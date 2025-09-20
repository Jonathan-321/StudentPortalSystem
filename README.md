# University of Rwanda Student Portal System

A modern, responsive student portal system built with React, TypeScript, and PostgreSQL. This progressive web application (PWA) provides students with a centralized platform to manage their academic life.

## 🚀 Features

### Core Functionality
- **Authentication System**: Secure login/logout with session management
- **Student Dashboard**: Personalized view of courses, tasks, and notifications
- **Course Management**: View enrolled courses, register for new courses
- **Academic Records**: Track grades, GPA, and academic progress
- **Financial Management**: View tuition fees, payment history, and balances
- **Notification Center**: Real-time updates on assignments, announcements, and deadlines
- **Multi-language Support**: Available in English, French, and Kinyarwanda
- **PWA Support**: Install as a mobile app, works offline

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: Express.js, Node.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with session-based auth
- **UI Components**: Radix UI, shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Internationalization**: i18next

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+
- Git

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jonathan-321/StudentPortalSystem.git
   cd StudentPortalSystem
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   - Make sure PostgreSQL is running on your system
   - Create a database named `studentportal`:
     ```sql
     createdb studentportal
     ```

4. **Configure environment variables**
   - Create a `.env` file in the root directory:
     ```env
     # Database URL for local PostgreSQL
     DATABASE_URL=postgresql://your_username@localhost:5432/studentportal
     ```
   - Replace `your_username` with your PostgreSQL username

5. **Initialize the database schema**
   ```bash
   npm run db:push
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`
   - The database will be automatically seeded with test data on first run

## 🔑 Test Credentials

### Student Account
- **Username**: `john`
- **Password**: `password`
- **Role**: Student (has access to courses, grades, finances)

### Admin Account
- **Username**: `admin`
- **Password**: `password`
- **Role**: Administrator (full system access)

## 📱 PWA Installation

The app can be installed as a Progressive Web App:
1. Open the app in Chrome/Edge/Safari
2. Look for the install prompt in the address bar
3. Click "Install" to add it to your device

## 🏗️ Project Structure

```
StudentPortalSystem/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route pages
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities and configurations
│   └── public/          # Static assets
├── server/              # Express backend
│   ├── index.ts        # Server entry point
│   ├── routes.ts       # API routes
│   ├── auth.ts         # Authentication logic
│   ├── db.ts           # Database connection
│   └── storage.ts      # Data access layer
├── shared/              # Shared types and schemas
└── migrations/          # Database migrations
```

## 📡 API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `POST /api/register` - New user registration
- `GET /api/user` - Get current user

### Academic
- `GET /api/courses` - List all courses
- `GET /api/enrollments` - Get user's enrolled courses
- `POST /api/enrollments` - Enroll in a course
- `GET /api/academics` - Get academic records
- `GET /api/tasks` - Get assignments and tasks

### Administrative
- `GET /api/announcements` - Get system announcements
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `GET /api/finances` - Get financial records

## 🧪 Testing the Application

1. **Test Authentication Flow**
   ```bash
   # Login
   curl -X POST http://localhost:3000/api/login \
     -H "Content-Type: application/json" \
     -d '{"username":"john","password":"password"}'
   ```

2. **Test API Endpoints**
   - Use the cookies from login response for authenticated requests
   - Most endpoints require authentication except `/api/announcements`

## 🚀 Deployment

### Production Build
```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Environment Variables for Production
```env
DATABASE_URL=your_production_db_url
SESSION_SECRET=your_secure_session_secret
NODE_ENV=production
```

## 💡 Recommendations for Student-Centric Improvements

### 1. **Smart Notifications & Reminders**
- **Assignment Deadline Alerts**: Push notifications 24hrs before deadlines
- **Class Reminders**: 15-minute alerts before scheduled classes
- **Grade Updates**: Instant notifications when grades are posted
- **Fee Payment Reminders**: Alerts for upcoming payment deadlines

### 2. **Academic Performance Tools**
- **GPA Calculator**: Real-time GPA tracking with "what-if" scenarios
- **Study Planner**: AI-powered study schedule based on course load
- **Progress Tracker**: Visual representation of degree completion
- **Prerequisite Checker**: Automatic validation for course registration

### 3. **Collaboration Features**
- **Study Groups**: Create/join study groups for courses
- **Resource Sharing**: Upload and share notes, past papers
- **Peer Tutoring**: Connect with tutors for difficult courses
- **Discussion Forums**: Course-specific discussion boards

### 4. **Mobile-First Enhancements**
- **Offline Mode**: Access schedules, grades, and materials offline
- **Quick Actions**: Swipe gestures for common tasks
- **Biometric Login**: Face ID/fingerprint authentication
- **Dark Mode**: Reduce eye strain during late-night study

### 5. **Integration Opportunities**
- **Library Integration**: Check book availability, extend loans
- **Campus Maps**: Interactive maps with class locations
- **Meal Plan Tracking**: Monitor dining hall credits
- **Transportation**: Real-time campus shuttle tracking

### 6. **Student Wellness**
- **Mental Health Resources**: Quick access to counseling services
- **Academic Advisor Chat**: In-app messaging with advisors
- **Career Center Integration**: Job postings and interview scheduling
- **Event Calendar**: Campus activities and opportunities

### 7. **Personalization**
- **Custom Dashboard**: Drag-and-drop widgets
- **Notification Preferences**: Granular control over alerts
- **Theme Customization**: Personal color schemes
- **Language Learning**: Practice portal navigation in different languages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Email: support@ur.ac.rw

---

Built with ❤️ for University of Rwanda students