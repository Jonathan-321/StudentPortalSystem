import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const { data: enrollments = [], isLoading: isLoadingEnrollments } = useQuery<any[]>({
    queryKey: ["/api/enrollments"],
    enabled: !!user,
  });

  const { data: announcements = [], isLoading: isLoadingAnnouncements } = useQuery<any[]>({
    queryKey: ["/api/announcements"],
    enabled: !!user,
  });

  const { data: tasks = [], isLoading: isLoadingTasks } = useQuery<any[]>({
    queryKey: ["/api/tasks"],
    enabled: !!user,
  });

  const { data: finances = [], isLoading: isLoadingFinances } = useQuery<any[]>({
    queryKey: ["/api/finances"],
    enabled: !!user,
  });

  const isLoading = isLoadingEnrollments || isLoadingAnnouncements || isLoadingTasks || isLoadingFinances;

  if (!user) return null;

  return (
    <Layout title="Dashboard">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#002347] to-[#003366] rounded-lg shadow-md p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-3 text-white">{t('Welcome back')}, {user.firstName}!</h2>
            <div className="flex items-center">
              <div className="bg-white/20 px-3 py-1 rounded text-white mr-3">
                {t('Academic Year')} 2023-2024
              </div>
              <div className="bg-primary-500 px-3 py-1 rounded text-white">
                Semester 1
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-200">{t('Last login')}: {format(new Date(), 'PPp')}</p>
          </div>
          <div className="mt-6 md:mt-0 flex flex-col md:items-end">
            <button className="bg-white text-[#003366] px-5 py-2.5 rounded-md font-semibold hover:bg-gray-100 transition-colors shadow-sm">
              {t('Academic Calendar')}
            </button>
            <div className="mt-3 bg-blue-600/30 text-white px-3 py-1 rounded-md text-sm">
              <i className="fas fa-check-circle mr-1"></i> {t('Enrollment Status')}: {t('Active')}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6">
          <div className="flex items-center mb-3">
            <div className="bg-blue-50 text-blue-600 rounded-full p-3 mr-3">
              <i className="fas fa-calendar-alt text-xl"></i>
            </div>
            <h3 className="font-medium text-gray-700">{t('Next Class')}</h3>
          </div>
          <div className="mt-2">
            <p className="text-xl font-bold text-gray-900">CSC301</p>
            <div className="flex justify-between items-center mt-1">
              <p className="text-sm font-medium text-gray-600">10:30 AM</p>
              <div className="flex items-center text-primary-500">
                <i className="fas fa-map-marker-alt mr-1 text-xs"></i>
                <p className="text-xs">Room 302A</p>
              </div>
            </div>
            <div className="mt-3 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded inline-flex items-center">
              <i className="fas fa-clock mr-1"></i> {t('Starting in')} 15 min
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6">
          <div className="flex items-center mb-3">
            <div className="bg-indigo-50 text-indigo-600 rounded-full p-3 mr-3">
              <i className="fas fa-book-open text-xl"></i>
            </div>
            <h3 className="font-medium text-gray-700">{t('Courses')}</h3>
          </div>
          <div className="mt-2">
            <p className="text-xl font-bold text-gray-900">{isLoadingEnrollments ? "..." : enrollments?.length || 0}</p>
            <p className="text-sm text-gray-600 mt-1">{t('Registered courses this semester')}</p>
            <div className="mt-3 flex justify-between">
              <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-1 rounded">
                {t('All In Progress')}
              </span>
              <Link to="/course-registration" className="text-xs text-primary-600 hover:underline flex items-center">
                {t('View Details')} <i className="fas fa-arrow-right ml-1"></i>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6">
          <div className="flex items-center mb-3">
            <div className="bg-green-50 text-green-600 rounded-full p-3 mr-3">
              <i className="fas fa-money-check-alt text-xl"></i>
            </div>
            <h3 className="font-medium text-gray-700">{t('Finances')}</h3>
          </div>
          <div className="mt-2">
            <p className="text-xl font-bold text-gray-900">RWF 50,000</p>
            <p className="text-sm text-gray-600 mt-1">{t('Current balance')}</p>
            <div className="mt-3 flex justify-between">
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded">
                <i className="fas fa-check-circle mr-1"></i> {t('Fully Paid')}
              </span>
              <Link to="/finance" className="text-xs text-primary-600 hover:underline flex items-center">
                {t('View Details')} <i className="fas fa-arrow-right ml-1"></i>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6">
          <div className="flex items-center mb-3">
            <div className="bg-amber-50 text-amber-600 rounded-full p-3 mr-3">
              <i className="fas fa-clipboard-check text-xl"></i>
            </div>
            <h3 className="font-medium text-gray-700">{t('Tasks')}</h3>
          </div>
          <div className="mt-2">
            <p className="text-xl font-bold text-gray-900">{isLoadingTasks ? "..." : tasks?.length || 0}</p>
            <p className="text-sm text-gray-600 mt-1">{t('Pending assignments & tasks')}</p>
            <div className="mt-3 flex justify-between">
              <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded">
                <i className="fas fa-exclamation-circle mr-1"></i> {t('2 Due Soon')}
              </span>
              <a href="#tasks" className="text-xs text-primary-600 hover:underline flex items-center">
                {t('View All')} <i className="fas fa-arrow-right ml-1"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="mb-8">
        <Tabs defaultValue="overview">
          <div className="border-b border-gray-200">
            <TabsList className="flex -mb-px text-sm font-medium bg-transparent">
              <TabsTrigger 
                value="overview" 
                className="inline-block p-4 border-b-2 text-sm font-medium hover:text-primary-600 hover:border-primary-300 focus:outline-none"
              >
                <i className="fas fa-th-large mr-2"></i>
                {t('Overview')}
              </TabsTrigger>
              <TabsTrigger 
                value="courses" 
                className="inline-block p-4 border-b-2 text-sm font-medium hover:text-primary-600 hover:border-primary-300 focus:outline-none"
              >
                <i className="fas fa-book mr-2"></i>
                {t('Courses')}
              </TabsTrigger>
              <TabsTrigger 
                value="announcements" 
                className="inline-block p-4 border-b-2 text-sm font-medium hover:text-primary-600 hover:border-primary-300 focus:outline-none"
              >
                <i className="fas fa-bullhorn mr-2"></i>
                {t('Announcements')}
              </TabsTrigger>
              <TabsTrigger 
                value="tasks" 
                className="inline-block p-4 border-b-2 text-sm font-medium hover:text-primary-600 hover:border-primary-300 focus:outline-none"
              >
                <i className="fas fa-tasks mr-2"></i>
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
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                      <i className="fas fa-graduation-cap text-primary-600 mr-2"></i>
                      {t('Current Courses')}
                    </h3>
                    <Link href="/course-registration" className="text-primary-600 text-sm hover:underline flex items-center">
                      {t('View All')}
                      <i className="fas fa-external-link-alt ml-1 text-xs"></i>
                    </Link>
                  </div>
                  
                  {isLoadingEnrollments ? (
                    <div className="p-8 flex justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : enrollments && enrollments.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {enrollments.slice(0, 3).map((enrollment) => (
                        <div key={enrollment.id} className="p-5 hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <div className="flex items-start">
                              <div className="hidden sm:flex h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 mr-3 items-center justify-center">
                                <i className="fas fa-book"></i>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{enrollment.course?.code}: {enrollment.course?.name}</h4>
                                <p className="text-sm text-gray-600 mt-1 flex items-center">
                                  <i className="fas fa-chalkboard-teacher text-gray-400 mr-1.5"></i>
                                  {enrollment.course?.instructorName} 
                                  <span className="mx-1.5">•</span>
                                  <i className="fas fa-clock text-gray-400 mr-1.5"></i>
                                  {enrollment.course?.schedule}
                                </p>
                              </div>
                            </div>
                            <Link 
                              href={`/academics?course=${enrollment.courseId}`} 
                              className="mt-3 sm:mt-0 text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center bg-primary-50 hover:bg-primary-100 px-3 py-1 rounded-md transition-colors"
                            >
                              <span>{t('View Details')}</span>
                              <i className="fas fa-arrow-right ml-1.5 text-xs"></i>
                            </Link>
                          </div>
                          <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <div className="w-full sm:max-w-xs">
                              <div className="text-xs text-gray-600 flex justify-between mb-1.5 font-medium">
                                <span>{t('Course Progress')}</span>
                                <span>{enrollment.currentWeek}/{enrollment.course?.totalWeeks} {t('Weeks')}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-primary-600 h-2.5 rounded-full" 
                                  style={{ width: `${enrollment.progress}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                <span className="font-medium text-primary-600">{enrollment.progress}%</span> {t('complete')}
                              </div>
                            </div>
                            <div className="mt-3 sm:mt-0 sm:ml-4 flex space-x-2">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                <i className="fas fa-exclamation-circle mr-1"></i> {t('Assignment Due')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <i className="fas fa-book-open text-gray-400 text-2xl"></i>
                      </div>
                      <p className="text-lg font-medium text-gray-600">{t('No courses found')}</p>
                      <p className="text-sm text-gray-500 mt-1">{t('You are not enrolled in any courses this semester')}</p>
                      <Link 
                        href="/course-registration" 
                        className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                      >
                        <i className="fas fa-plus mr-1.5"></i> {t('Register for Courses')}
                      </Link>
                    </div>
                  )}
                </div>
                
                {/* Upcoming Tasks */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                      <i className="fas fa-tasks text-primary-600 mr-2"></i>
                      {t('Upcoming Tasks')}
                    </h3>
                    <a href="#all-tasks" className="text-primary-600 text-sm hover:underline flex items-center">
                      {t('View All')}
                      <i className="fas fa-external-link-alt ml-1 text-xs"></i>
                    </a>
                  </div>
                  
                  {isLoadingTasks ? (
                    <div className="p-8 flex justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : tasks && tasks.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                      {tasks.slice(0, 3).map((task) => (
                        <li key={task.id} className="p-5 hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center">
                            <div className="flex items-start flex-1">
                              <div className={`${
                                task.type === 'assignment' ? 'bg-amber-100 text-amber-600' :
                                task.type === 'exam' ? 'bg-blue-100 text-blue-600' :
                                'bg-emerald-100 text-emerald-600'
                              } rounded-full p-3 mr-4 flex-shrink-0`}>
                                <i className={`${
                                  task.type === 'assignment' ? 'fas fa-clipboard-list' :
                                  task.type === 'exam' ? 'fas fa-book-open' :
                                  'fas fa-file-code'
                                }`}></i>
                              </div>
                              <div>
                                <div className="flex items-center">
                                  <p className="font-medium text-gray-900">{task.title}</p>
                                  <div className="ml-2 px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                                    {task.type === 'assignment' ? t('Assignment') : 
                                     task.type === 'exam' ? t('Exam') : t('Project')}
                                  </div>
                                </div>
                                <div className="mt-1 flex items-center text-sm text-gray-600">
                                  <i className="fas fa-book text-gray-400 mr-1.5"></i>
                                  <span>{task.course?.code}</span>
                                  <span className="mx-1.5">•</span>
                                  <i className="fas fa-calendar-alt text-gray-400 mr-1.5"></i>
                                  <span>{task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : t('No due date')}</span>
                                </div>
                                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{task.description}</p>
                              </div>
                            </div>
                            
                            <div className="mt-3 sm:mt-0 sm:ml-4 flex flex-col items-end">
                              {task.dueDate && (
                                <div className={`${
                                  Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 2
                                    ? 'bg-red-100 text-red-800'
                                    : Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 5
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-blue-100 text-blue-800'
                                } px-3 py-1.5 rounded-md text-sm font-medium flex items-center`}>
                                  <i className="fas fa-clock mr-1.5"></i>
                                  {t('Due in')} {Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} {t('days')}
                                </div>
                              )}
                              <button className="mt-2 text-xs text-primary-600 hover:text-primary-700 flex items-center">
                                <i className="fas fa-check-circle mr-1"></i>
                                {t('Mark as done')}
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <i className="fas fa-clipboard-check text-gray-400 text-2xl"></i>
                      </div>
                      <p className="text-lg font-medium text-gray-600">{t('No upcoming tasks')}</p>
                      <p className="text-sm text-gray-500 mt-1">{t('You have no pending assignments or exams')}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-6">
                {/* Today's Schedule */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                      <i className="fas fa-calendar-day text-primary-600 mr-2"></i>
                      {t('Today\'s Schedule')}
                    </h3>
                    <Link href="/timetable" className="text-primary-600 text-sm hover:underline flex items-center">
                      {t('Full Timetable')}
                      <i className="fas fa-external-link-alt ml-1 text-xs"></i>
                    </Link>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors">
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <h4 className="font-medium text-base flex items-center">
                        <i className="fas fa-calendar-alt text-primary-500 mr-2"></i>
                        {format(new Date(), 'EEEE, MMMM d')}
                      </h4>
                      <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors">
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {/* Current class - highlighted */}
                      <div className="border-l-4 border-primary-600 bg-primary-50 p-4 rounded-lg shadow-sm relative">
                        <div className="absolute -right-1 -top-1 bg-primary-600 text-white text-xs rounded-full px-2 py-1 font-medium">
                          Now
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-2">
                              <i className="fas fa-code"></i>
                            </div>
                            <p className="font-medium text-primary-800">CSC301: Data Structures and Algorithms</p>
                          </div>
                          <span className="text-sm bg-primary-100 text-primary-800 px-2 py-1 rounded font-medium">10:30 - 12:00</span>
                        </div>
                        <div className="mt-2 flex items-center text-primary-700 text-sm">
                          <i className="fas fa-map-marker-alt mr-1.5"></i>
                          <span>Room: LT5, Main Campus</span>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <a href="#" className="text-xs bg-white text-primary-600 border border-primary-200 hover:bg-primary-50 px-2 py-1 rounded flex items-center">
                            <i className="fas fa-file-pdf mr-1"></i> Lecture Notes
                          </a>
                        </div>
                      </div>
                      
                      {/* Break */}
                      <div className="border-l-4 border-gray-300 bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-2">
                              <i className="fas fa-coffee"></i>
                            </div>
                            <p className="font-medium text-gray-700">Lunch Break</p>
                          </div>
                          <span className="text-sm text-gray-600">12:00 - 14:00</span>
                        </div>
                      </div>
                      
                      {/* Upcoming class */}
                      <div className="border-l-4 border-indigo-500 bg-indigo-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2">
                              <i className="fas fa-laptop-code"></i>
                            </div>
                            <p className="font-medium text-indigo-800">CSC315: Software Engineering</p>
                          </div>
                          <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded font-medium">14:00 - 15:30</span>
                        </div>
                        <div className="mt-2 flex items-center text-indigo-700 text-sm">
                          <i className="fas fa-map-marker-alt mr-1.5"></i>
                          <span>Room: CS Lab 2, ICT Building</span>
                        </div>
                      </div>
                      
                      {/* Meeting */}
                      <div className="border-l-4 border-emerald-500 bg-emerald-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mr-2">
                              <i className="fas fa-users"></i>
                            </div>
                            <p className="font-medium text-emerald-800">Student Group Project Meeting</p>
                          </div>
                          <span className="text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded font-medium">16:00 - 17:30</span>
                        </div>
                        <div className="mt-2 flex items-center text-emerald-700 text-sm">
                          <i className="fas fa-map-marker-alt mr-1.5"></i>
                          <span>Location: Library Study Room 3</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Study Priority Management - Blackboard-inspired Feature */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 mb-6">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                      <i className="fas fa-brain text-primary-600 mr-2"></i>
                      {t('Study Priorities')}
                      <span className="ml-2 bg-blue-100 text-blue-600 text-xs rounded-full px-2 py-0.5">New Feature</span>
                    </h3>
                    <button className="text-primary-600 text-sm hover:bg-primary-50 flex items-center px-3 py-1 rounded-md border border-primary-200 transition-colors">
                      <i className="fas fa-plus mr-1 text-xs"></i> {t('Add Priority')}
                    </button>
                  </div>
                  
                  <div className="p-5">
                    {/* Priority status overview */}
                    <div className="flex justify-between mb-4 pb-4 border-b border-gray-100">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">2</div>
                        <div className="text-xs text-gray-600">{t('High Priority')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-amber-600">3</div>
                        <div className="text-xs text-gray-600">{t('Medium Priority')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">1</div>
                        <div className="text-xs text-gray-600">{t('Low Priority')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600">4</div>
                        <div className="text-xs text-gray-600">{t('Completed')}</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-4">
                      {/* High priority task */}
                      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow bg-red-50/30">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-4 h-4 bg-red-500 rounded-full mt-1 mr-3"></div>
                            <div>
                              <h4 className="font-medium text-gray-900">Complete CSC101 Programming Assignment</h4>
                              <div className="mt-1 text-sm text-gray-600 flex items-center">
                                <i className="fas fa-calendar-alt text-gray-400 mr-1.5"></i>
                                <span>Due in 3 days</span>
                                <span className="mx-2">•</span>
                                <i className="fas fa-clock text-gray-400 mr-1.5"></i>
                                <span>Est. 2 hours</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center ml-2">
                            <span className="text-xs font-medium bg-red-100 text-red-800 rounded-full px-2.5 py-1 flex items-center">
                              <i className="fas fa-exclamation-circle mr-1"></i>
                              {t('High Priority')}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <div className="w-full max-w-xs">
                            <div className="text-xs text-gray-600 flex justify-between mb-1.5">
                              <span>{t('Progress')}</span>
                              <span>30%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-red-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button className="text-xs px-2.5 py-1.5 border border-gray-200 rounded hover:bg-gray-50 flex items-center transition-colors">
                              <i className="fas fa-check-circle mr-1 text-green-500"></i>
                              {t('Mark Complete')}
                            </button>
                            <button className="text-xs px-2.5 py-1.5 border border-gray-200 rounded hover:bg-gray-50 flex items-center transition-colors">
                              <i className="fas fa-bell mr-1 text-amber-500"></i>
                              {t('Set Reminder')}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Medium priority task */}
                      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow bg-amber-50/30">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-4 h-4 bg-amber-500 rounded-full mt-1 mr-3"></div>
                            <div>
                              <h4 className="font-medium text-gray-900">Review MTH101 Lecture Notes</h4>
                              <div className="mt-1 text-sm text-gray-600 flex items-center">
                                <i className="fas fa-book text-gray-400 mr-1.5"></i>
                                <span>Recommended before next lecture</span>
                                <span className="mx-2">•</span>
                                <i className="fas fa-clock text-gray-400 mr-1.5"></i>
                                <span>Est. 1 hour</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center ml-2">
                            <span className="text-xs font-medium bg-amber-100 text-amber-800 rounded-full px-2.5 py-1 flex items-center">
                              <i className="fas fa-arrow-alt-circle-up mr-1"></i>
                              {t('Medium Priority')}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <div className="w-full max-w-xs">
                            <div className="text-xs text-gray-600 flex justify-between mb-1.5">
                              <span>{t('Progress')}</span>
                              <span>50%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-amber-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button className="text-xs px-2.5 py-1.5 border border-gray-200 rounded hover:bg-gray-50 flex items-center transition-colors">
                              <i className="fas fa-check-circle mr-1 text-green-500"></i>
                              {t('Mark Complete')}
                            </button>
                            <button className="text-xs px-2.5 py-1.5 border border-gray-200 rounded hover:bg-gray-50 flex items-center transition-colors">
                              <i className="fas fa-bell mr-1 text-amber-500"></i>
                              {t('Set Reminder')}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Low priority task */}
                      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow bg-green-50/30">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-4 h-4 bg-green-500 rounded-full mt-1 mr-3"></div>
                            <div>
                              <h4 className="font-medium text-gray-900">Join Study Group for PHYS101</h4>
                              <div className="mt-1 text-sm text-gray-600 flex items-center">
                                <i className="fas fa-calendar-day text-gray-400 mr-1.5"></i>
                                <span>Thursday, 3:00 PM</span>
                                <span className="mx-2">•</span>
                                <i className="fas fa-map-marker-alt text-gray-400 mr-1.5"></i>
                                <span>Library Room 2</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center ml-2">
                            <span className="text-xs font-medium bg-green-100 text-green-800 rounded-full px-2.5 py-1 flex items-center">
                              <i className="fas fa-arrow-alt-circle-down mr-1"></i>
                              {t('Low Priority')}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <div className="flex items-center text-gray-600 text-sm">
                            <i className="fas fa-users mr-1.5"></i>
                            <span>5 students joined</span>
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-xs px-2.5 py-1.5 border border-gray-200 rounded hover:bg-gray-50 flex items-center transition-colors">
                              <i className="fas fa-calendar-plus mr-1 text-blue-500"></i>
                              {t('Add to Calendar')}
                            </button>
                            <button className="text-xs px-2.5 py-1.5 border border-primary-200 rounded bg-primary-50 text-primary-600 hover:bg-primary-100 flex items-center transition-colors">
                              <i className="fas fa-user-plus mr-1"></i>
                              {t('Join Group')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-center">
                      <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                        {t('View All Priorities')} <i className="fas fa-arrow-right ml-1 text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Announcements */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold font-heading">{t('Announcements')}</h3>
                    <a href="#all-announcements" className="text-primary-500 text-sm hover:underline">{t('View All')}</a>
                  </div>
                  
                  {isLoadingAnnouncements ? (
                    <div className="p-8 flex justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : announcements && announcements.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {announcements.slice(0, 2).map((announcement) => (
                        <div key={announcement.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-start">
                            <div className="bg-red-100 text-red-600 rounded-full p-2 mr-3 mt-1">
                              <i className="fas fa-bullhorn"></i>
                            </div>
                            <div>
                              <h4 className="font-medium">{announcement.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                              <div className="flex items-center mt-2 text-xs text-gray-500">
                                <span>{announcement.department}</span>
                                <span className="mx-2">•</span>
                                <span>{format(new Date(announcement.postedAt), 'MMM d, yyyy')}</span>
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
                
                {/* Quick Links */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-bold font-heading">{t('Quick Links')}</h3>
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-3">
                    <a href="#library" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center">
                      <i className="fas fa-book text-primary-500 text-xl mb-2"></i>
                      <p className="text-sm font-medium">{t('Library Resources')}</p>
                    </a>
                    <a href="#e-learning" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center">
                      <i className="fas fa-laptop text-primary-500 text-xl mb-2"></i>
                      <p className="text-sm font-medium">{t('E-Learning')}</p>
                    </a>
                    <a href="#transcript" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center">
                      <i className="fas fa-file-alt text-primary-500 text-xl mb-2"></i>
                      <p className="text-sm font-medium">{t('Transcript Request')}</p>
                    </a>
                    <a href="#support" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center">
                      <i className="fas fa-headset text-primary-500 text-xl mb-2"></i>
                      <p className="text-sm font-medium">{t('IT Support')}</p>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="courses">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">{t('Registered Courses')}</h3>
              
              {isLoadingEnrollments ? (
                <div className="p-8 flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : enrollments && enrollments.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="py-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">{enrollment.course?.code}: {enrollment.course?.name}</h4>
                          <p className="text-sm text-gray-500">{enrollment.course?.instructorName} • {enrollment.course?.schedule}</p>
                          <p className="text-sm text-gray-500">{enrollment.course?.credits} credits</p>
                        </div>
                        <Link href={`/academics?course=${enrollment.courseId}`} className="text-primary-500 hover:text-primary-600">
                          <i className="fas fa-arrow-right"></i>
                        </Link>
                      </div>
                      <div className="mt-2">
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
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">{t('You are not enrolled in any courses')}</p>
                  <Link href="/course-registration" className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md inline-block">
                    {t('Register for Courses')}
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="announcements">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">{t('Recent Announcements')}</h3>
              
              {isLoadingAnnouncements ? (
                <div className="p-8 flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : announcements && announcements.length > 0 ? (
                <div className="space-y-6">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-start">
                        <div className={`${
                          announcement.isImportant ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                        } rounded-full p-2 mr-3 mt-1`}>
                          <i className={`${
                            announcement.isImportant ? 'fas fa-bullhorn' : 'fas fa-info-circle'
                          }`}></i>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{announcement.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <span>{announcement.department}</span>
                            <span className="mx-2">•</span>
                            <span>{announcement.postedBy}</span>
                            <span className="mx-2">•</span>
                            <span>{format(new Date(announcement.postedAt), 'PPP')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">{t('No announcements available')}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tasks">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">{t('Upcoming Tasks')}</h3>
              
              {isLoadingTasks ? (
                <div className="p-8 flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : tasks && tasks.length > 0 ? (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center">
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
                          <div className="flex justify-between">
                            <h4 className="font-medium">{task.title}</h4>
                            <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                              {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          <div className="flex justify-between items-center mt-2">
                            <div className="text-xs text-gray-500">
                              <span>{task.course?.code}</span>
                              {task.dueDate && (
                                <>
                                  <span className="mx-2">•</span>
                                  <span>{t('Due')}: {format(new Date(task.dueDate), 'PPP')}</span>
                                </>
                              )}
                            </div>
                            <div>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">{t('No pending tasks')}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
