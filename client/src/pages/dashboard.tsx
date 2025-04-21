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
      <div className="bg-black rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 text-yellow-400">{t('Welcome back')}, {user.firstName}!</h2>
            <p className="text-yellow-300">{t('Academic Year')} 2023-2024, Semester 1</p>
            <p className="mt-2 text-sm text-yellow-200">{t('Last login')}: {format(new Date(), 'PPp')}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-300 transition-colors">
              {t('Academic Calendar')}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-5 flex items-center">
          <div className="bg-primary-100 text-primary-500 rounded-full p-3 mr-4">
            <i className="fas fa-calendar-alt text-xl"></i>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('Next Class')}</p>
            <p className="font-semibold">CSC301 - 10:30 AM</p>
            <p className="text-xs text-primary-500 mt-1">Room 302A • 15 min</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-5 flex items-center">
          <div className="bg-primary-100 text-primary-500 rounded-full p-3 mr-4">
            <i className="fas fa-book-open text-xl"></i>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('Registered Courses')}</p>
            <p className="font-semibold">{isLoadingEnrollments ? "..." : `${enrollments?.length || 0} ${t('Courses')}`}</p>
            <div className="flex mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                {t('In Progress')}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-5 flex items-center">
          <div className="bg-primary-100 text-primary-500 rounded-full p-3 mr-4">
            <i className="fas fa-money-check-alt text-xl"></i>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('Account Balance')}</p>
            <p className="font-semibold">RWF 50,000</p>
            <div className="flex mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                {t('Paid')}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-5 flex items-center">
          <div className="bg-primary-100 text-primary-500 rounded-full p-3 mr-4">
            <i className="fas fa-clipboard-check text-xl"></i>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('Pending Tasks')}</p>
            <p className="font-semibold">{isLoadingTasks ? "..." : `${tasks?.length || 0} ${t('Tasks')}`}</p>
            <div className="flex mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                {t('Due Soon')}
              </span>
            </div>
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
                    <Link href="/course-registration" className="text-primary-500 text-sm hover:underline">
                      {t('View All')}
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
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold">{enrollment.course?.code}: {enrollment.course?.name}</h4>
                              <p className="text-sm text-gray-500">{enrollment.course?.instructorName} • {enrollment.course?.schedule}</p>
                            </div>
                            <Link href={`/academics?course=${enrollment.courseId}`} className="text-sm text-primary-500 flex items-center">
                              <span>{t('Details')}</span>
                              <i className="fas fa-chevron-right ml-1 text-xs"></i>
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
                      <Link href="/course-registration" className="text-primary-500 hover:underline mt-2 inline-block">
                        {t('Register for courses')}
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
                  
                  {isLoadingTasks ? (
                    <div className="p-8 flex justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : tasks && tasks.length > 0 ? (
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
                    <Link href="/timetable" className="text-primary-500 text-sm hover:underline">
                      {t('Full Timetable')}
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
                
                {/* Study Priority Management - Blackboard-inspired Feature */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold font-heading flex items-center">
                      {t('Study Priorities')}
                      <span className="ml-2 bg-blue-100 text-blue-600 text-xs rounded-full px-2 py-0.5">New Feature</span>
                    </h3>
                    <button className="text-primary-500 text-sm hover:underline flex items-center">
                      <i className="fas fa-plus mr-1 text-xs"></i> {t('Add Priority')}
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex flex-col space-y-3">
                      <div className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                            <h4 className="font-medium">Complete CSC101 Programming Assignment</h4>
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs bg-red-50 text-red-600 rounded px-2 py-1">High Priority</span>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">Due in 3 days</div>
                        <div className="mt-2 flex justify-between items-center">
                          <div className="flex items-center text-gray-500 text-sm">
                            <i className="fas fa-clock mr-1"></i> Est. 2 hours
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-xs px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">Mark Complete</button>
                            <button className="text-xs px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">Set Reminder</button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                            <h4 className="font-medium">Review MTH101 Lecture Notes</h4>
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs bg-yellow-50 text-yellow-600 rounded px-2 py-1">Medium Priority</span>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">Recommended before next lecture</div>
                        <div className="mt-2 flex justify-between items-center">
                          <div className="flex items-center text-gray-500 text-sm">
                            <i className="fas fa-clock mr-1"></i> Est. 1 hour
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-xs px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">Mark Complete</button>
                            <button className="text-xs px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">Set Reminder</button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            <h4 className="font-medium">Join Study Group for PHYS101</h4>
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs bg-green-50 text-green-600 rounded px-2 py-1">Low Priority</span>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">Thursday, 3:00 PM - Library Room 2</div>
                        <div className="mt-2 flex justify-between items-center">
                          <div className="flex items-center text-gray-500 text-sm">
                            <i className="fas fa-users mr-1"></i> 5 students joined
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-xs px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">Add to Calendar</button>
                            <button className="text-xs px-2 py-1 border border-primary-200 rounded bg-primary-50 text-primary-600 hover:bg-primary-100">Join Group</button>
                          </div>
                        </div>
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
