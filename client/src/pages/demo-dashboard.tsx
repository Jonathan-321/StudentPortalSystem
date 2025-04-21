import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { format } from "date-fns";

// Create mock data for the demo
const mockUser = {
  id: 1,
  username: "john",
  email: "john@example.com",
  firstName: "John",
  lastName: "Doe",
  role: "student",
  studentId: "STU12345",
  language: "en",
  program: "Computer Science",
  year: 2,
};

const mockEnrollments = [
  {
    id: 1,
    courseId: 101,
    course: {
      id: 101,
      code: "CSC301",
      name: "Data Structures and Algorithms",
      instructorName: "Dr. Jane Smith",
      schedule: "Mon/Wed 10:30-12:00",
      totalWeeks: 16,
    },
    currentWeek: 6,
    progress: 37.5,
  },
  {
    id: 2,
    courseId: 102,
    course: {
      id: 102,
      code: "CSC315",
      name: "Software Engineering",
      instructorName: "Prof. Michael Johnson",
      schedule: "Tue/Thu 14:00-15:30",
      totalWeeks: 16,
    },
    currentWeek: 5,
    progress: 31.25,
  },
  {
    id: 3,
    courseId: 103,
    course: {
      id: 103,
      code: "MTH201",
      name: "Linear Algebra",
      instructorName: "Dr. Robert Williams",
      schedule: "Fri 9:00-12:00",
      totalWeeks: 16,
    },
    currentWeek: 7,
    progress: 43.75,
  },
];

const mockTasks = [
  {
    id: 1,
    title: "Algorithm Analysis Assignment",
    type: "assignment",
    course: {
      id: 101,
      code: "CSC301",
    },
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    title: "Midterm Examination",
    type: "exam",
    course: {
      id: 102,
      code: "CSC315",
    },
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    title: "Project Proposal",
    type: "project",
    course: {
      id: 103,
      code: "MTH201",
    },
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const mockAnnouncements = [
  {
    id: 1,
    title: "Registration Deadline Extended",
    message: "The deadline for course registration has been extended to October 15th.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    department: "Academic Affairs",
  },
  {
    id: 2,
    title: "Campus Wi-Fi Maintenance",
    message: "The campus Wi-Fi will be unavailable on Saturday from 10 AM to 2 PM due to maintenance.",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    department: "IT Department",
  },
];

export default function DemoDashboard() {
  const { t } = useTranslation();
  const user = mockUser;
  const enrollments = mockEnrollments;
  const tasks = mockTasks;
  const announcements = mockAnnouncements;

  if (!user) return null;

  return (
    <Layout title="Dashboard">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{t('Welcome back')}, {user.firstName}!</h2>
            <p className="opacity-90">{t('Academic Year')} 2023-2024, Semester 1</p>
            <p className="mt-2 text-sm opacity-75">{t('Last login')}: {format(new Date(), 'PPp')}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button className="bg-white text-primary-600 px-4 py-2 rounded font-semibold hover:bg-gray-100 transition-colors">
              {t('Academic Calendar')}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-5 flex items-center">
          <div className="bg-primary-100 text-primary-500 rounded-full p-3 mr-4">
            <i className="fas fa-calendar-alt text-xl"></i>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('Next Class')}</p>
            <p className="font-semibold">CSC301 - 10:30 AM</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5 flex items-center">
          <div className="bg-primary-100 text-primary-500 rounded-full p-3 mr-4">
            <i className="fas fa-book-open text-xl"></i>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('Registered Courses')}</p>
            <p className="font-semibold">{`${enrollments?.length || 0} ${t('Courses')}`}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5 flex items-center">
          <div className="bg-primary-100 text-primary-500 rounded-full p-3 mr-4">
            <i className="fas fa-money-check-alt text-xl"></i>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('Account Balance')}</p>
            <p className="font-semibold">RWF 50,000</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5 flex items-center">
          <div className="bg-primary-100 text-primary-500 rounded-full p-3 mr-4">
            <i className="fas fa-clipboard-check text-xl"></i>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('Pending Tasks')}</p>
            <p className="font-semibold">{`${tasks?.length || 0} ${t('Tasks')}`}</p>
          </div>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="mb-6">
        <Tabs defaultValue="overview">
          <div className="border-b border-gray-200">
            <TabsList className="flex -mb-px text-sm font-medium bg-transparent">
              <TabsTrigger value="overview" className="inline-block p-4 border-b-2 rounded-t-lg focus:outline-none">
                {t('Overview')}
              </TabsTrigger>
              <TabsTrigger value="courses" className="inline-block p-4 border-b-2 rounded-t-lg focus:outline-none">
                {t('Courses')}
              </TabsTrigger>
              <TabsTrigger value="announcements" className="inline-block p-4 border-b-2 rounded-t-lg focus:outline-none">
                {t('Announcements')}
              </TabsTrigger>
              <TabsTrigger value="tasks" className="inline-block p-4 border-b-2 rounded-t-lg focus:outline-none">
                {t('Tasks')}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-4">
            {/* Main Dashboard Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Current Courses */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold font-heading">{t('Current Courses')}</h3>
                    <Link href="/course-registration">
                      <a className="text-primary-500 text-sm hover:underline">{t('View All')}</a>
                    </Link>
                  </div>
                  
                  {enrollments && enrollments.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {enrollments.slice(0, 3).map((enrollment) => (
                        <div key={enrollment.id} className="p-5 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold">{enrollment.course?.code}: {enrollment.course?.name}</h4>
                              <p className="text-sm text-gray-500">{enrollment.course?.instructorName} • {enrollment.course?.schedule}</p>
                            </div>
                            <Link href={`/academics?course=${enrollment.courseId}`}>
                              <a className="text-sm text-primary-500 flex items-center">
                                <span>{t('Details')}</span>
                                <i className="fas fa-chevron-right ml-1 text-xs"></i>
                              </a>
                            </Link>
                          </div>
                          <div className="mt-3 flex justify-between items-center">
                            <div className="w-full max-w-xs">
                              <div className="text-xs text-gray-500 flex justify-between mb-1">
                                <span>{t('Progress')}</span>
                                <span>{enrollment.currentWeek}/{enrollment.course?.totalWeeks} {t('Weeks')}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-primary-500 h-2 rounded-full" 
                                  style={{ width: `${enrollment.progress}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="ml-4 flex space-x-2">
                              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">Assignment Due</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <p>{t('No courses found')}</p>
                      <Link href="/course-registration">
                        <a className="text-primary-500 hover:underline mt-2 inline-block">
                          {t('Register for courses')}
                        </a>
                      </Link>
                    </div>
                  )}
                </div>
                
                {/* Upcoming Tasks */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold font-heading">{t('Upcoming Tasks')}</h3>
                    <a href="#all-tasks" className="text-primary-500 text-sm hover:underline">{t('View All')}</a>
                  </div>
                  
                  {tasks && tasks.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                      {tasks.slice(0, 3).map((task) => (
                        <li key={task.id} className="p-4 flex items-center hover:bg-gray-50">
                          <div className={`${
                            task.type === 'assignment' ? 'bg-yellow-100 text-yellow-600' :
                            task.type === 'exam' ? 'bg-blue-100 text-blue-600' :
                            'bg-green-100 text-green-600'
                          } rounded-full p-2 mr-4`}>
                            <i className={`${
                              task.type === 'assignment' ? 'fas fa-clipboard-list' :
                              task.type === 'exam' ? 'fas fa-book-open' :
                              'fas fa-file-code'
                            }`}></i>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm text-gray-500">
                              {task.course?.code} • {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No due date'}
                            </p>
                          </div>
                          <span className="text-sm text-orange-600">
                            {task.dueDate ? `${t('Due in')} ${Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} ${t('days')}` : ''}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <p>{t('No upcoming tasks')}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-6">
                {/* Timetable */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold font-heading">{t('Today\'s Schedule')}</h3>
                    <Link href="/timetable">
                      <a className="text-primary-500 text-sm hover:underline">{t('Full Timetable')}</a>
                    </Link>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <button className="text-gray-500 hover:text-primary-500">
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <h4 className="font-medium">{format(new Date(), 'EEEE, MMMM d')}</h4>
                      <button className="text-gray-500 hover:text-primary-500">
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="border-l-4 border-primary-500 bg-primary-50 p-3 rounded-r">
                        <div className="flex justify-between">
                          <p className="font-medium">CSC301: Data Structures and Algorithms</p>
                          <span className="text-sm text-primary-500">10:30 - 12:00</span>
                        </div>
                        <p className="text-sm text-gray-600">Room: LT5, Main Campus</p>
                      </div>
                      
                      <div className="border-l-4 border-gray-300 bg-gray-50 p-3 rounded-r">
                        <div className="flex justify-between">
                          <p className="font-medium">Lunch Break</p>
                          <span className="text-sm text-gray-500">12:00 - 14:00</span>
                        </div>
                      </div>
                      
                      <div className="border-l-4 border-secondary-500 bg-yellow-50 p-3 rounded-r">
                        <div className="flex justify-between">
                          <p className="font-medium">CSC315: Software Engineering</p>
                          <span className="text-sm text-secondary-700">14:00 - 15:30</span>
                        </div>
                        <p className="text-sm text-gray-600">Room: CS Lab 2, ICT Building</p>
                      </div>
                      
                      <div className="border-l-4 border-green-500 bg-green-50 p-3 rounded-r">
                        <div className="flex justify-between">
                          <p className="font-medium">Student Group Project Meeting</p>
                          <span className="text-sm text-green-700">16:00 - 17:30</span>
                        </div>
                        <p className="text-sm text-gray-600">Location: Library Study Room 3</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Announcements */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold font-heading">{t('Announcements')}</h3>
                    <a href="#all-announcements" className="text-primary-500 text-sm hover:underline">{t('View All')}</a>
                  </div>
                  
                  {announcements && announcements.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {announcements.slice(0, 2).map((announcement) => (
                        <div key={announcement.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-start">
                            <div className="bg-red-100 text-red-600 rounded-full p-2 mr-3 mt-1">
                              <i className="fas fa-bullhorn"></i>
                            </div>
                            <div>
                              <h4 className="font-medium">{announcement.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{announcement.message}</p>
                              <div className="flex items-center mt-2 text-xs text-gray-500">
                                <span>{announcement.department}</span>
                                <span className="mx-2">•</span>
                                <span>{format(new Date(announcement.createdAt), 'MMM d, yyyy')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <p>{t('No announcements')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="mt-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">{t('All Registered Courses')}</h3>
              <div className="grid gap-4">
                {enrollments && enrollments.map((enrollment) => (
                  <div key={enrollment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{enrollment.course?.code}: {enrollment.course?.name}</h4>
                        <p className="text-sm text-gray-500">{enrollment.course?.instructorName} • {enrollment.course?.schedule}</p>
                      </div>
                      <Link href={`/academics?course=${enrollment.courseId}`}>
                        <a className="text-sm text-primary-500 hover:underline">{t('View Details')}</a>
                      </Link>
                    </div>
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 flex justify-between mb-1">
                        <span>{t('Progress')}</span>
                        <span>{enrollment.currentWeek}/{enrollment.course?.totalWeeks} {t('Weeks')}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full" 
                          style={{ width: `${enrollment.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="announcements" className="mt-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">{t('All Announcements')}</h3>
              <div className="divide-y">
                {announcements && announcements.map((announcement) => (
                  <div key={announcement.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start">
                      <div className="bg-red-100 text-red-600 rounded-full p-2 mr-3 mt-1">
                        <i className="fas fa-bullhorn"></i>
                      </div>
                      <div>
                        <h4 className="font-medium">{announcement.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{announcement.message}</p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <span>{announcement.department}</span>
                          <span className="mx-2">•</span>
                          <span>{format(new Date(announcement.createdAt), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="mt-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">{t('All Tasks')}</h3>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-xs rounded border border-gray-300 bg-white hover:bg-gray-50">
                    {t('Filter')}
                  </button>
                  <button className="px-3 py-1 text-xs rounded bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100">
                    {t('Sort')}
                  </button>
                </div>
              </div>
              <div className="divide-y">
                {tasks && tasks.map((task) => (
                  <div key={task.id} className="py-4 first:pt-0 last:pb-0 flex items-center">
                    <div className={`${
                      task.type === 'assignment' ? 'bg-yellow-100 text-yellow-600' :
                      task.type === 'exam' ? 'bg-blue-100 text-blue-600' :
                      'bg-green-100 text-green-600'
                    } rounded-full p-2 mr-4`}>
                      <i className={`${
                        task.type === 'assignment' ? 'fas fa-clipboard-list' :
                        task.type === 'exam' ? 'fas fa-book-open' :
                        'fas fa-file-code'
                      }`}></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-gray-500">
                            {task.course?.code} • {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No due date'}
                          </p>
                        </div>
                        <div className="text-sm">
                          <span className={`px-3 py-1 rounded-full ${
                            task.type === 'assignment' ? 'bg-yellow-100 text-yellow-800' :
                            task.type === 'exam' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                          </span>
                        </div>
                      </div>
                      {task.dueDate && (
                        <div className="mt-2">
                          <div className="text-xs text-gray-500 flex justify-between mb-1">
                            <span>{t('Time Remaining')}</span>
                            <span className="text-orange-600 font-medium">
                              {`${Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} ${t('days left')}`}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-orange-500 h-1.5 rounded-full" 
                              style={{ width: `${Math.min(100, 100 - (Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) / 14) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}