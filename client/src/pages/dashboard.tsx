import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { format } from 'date-fns';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import Layout from '@/components/Layout';
import { Loader2, BarChart3, BookOpen, UserCheck, Bell, CalendarDays } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const { t } = useTranslation();
  const [_, setLocation] = useLocation();

  // Fetch user data
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['/api/user'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch courses
  const { data: enrollments, isLoading: isLoadingEnrollments } = useQuery({
    queryKey: ['/api/enrollments'],
    enabled: !!user,
  });

  // Fetch announcements
  const { data: announcements, isLoading: isLoadingAnnouncements } = useQuery({
    queryKey: ['/api/announcements'],
    enabled: !!user,
  });

  // Fetch tasks
  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['/api/tasks'],
    enabled: !!user,
  });

  // Fetch academics
  const { data: academics, isLoading: isLoadingAcademics } = useQuery({
    queryKey: ['/api/academics'],
    enabled: !!user,
  });

  // Calculate statistics
  const stats = {
    coursesCount: enrollments?.length || 0,
    tasksCount: tasks?.length || 0,
    upcomingExams: tasks?.filter(task => task.type === 'exam' && task.status !== 'completed').length || 0,
    completedTasks: tasks?.filter(task => task.status === 'completed').length || 0,
    overallGPA: academics?.[0]?.gpa || 0,
    creditsCompleted: academics?.[0]?.creditsCompleted || 0,
    creditsRequired: academics?.[0]?.creditsRequired || 0,
    currentSemester: academics?.[0]?.currentSemester || '',
  };

  // Filter today's schedule
  const today = new Date();
  const todaySchedule = enrollments?.filter(enrollment => {
    const dayOfWeek = today.getDay();
    const days = {
      'Monday': 1,
      'Tuesday': 2,
      'Wednesday': 3,
      'Thursday': 4,
      'Friday': 5,
      'Saturday': 6,
      'Sunday': 0,
    };
    
    const courseDay = enrollment.course?.schedule.split(' ')[0];
    return days[courseDay as keyof typeof days] === dayOfWeek;
  }) || [];

  return (
    <Layout title={t('Dashboard')}>
      <div className="mb-8">
        <Tabs defaultValue="overview">
          <div className="border-b border-gray-200">
            <TabsList className="flex -mb-px text-sm font-medium bg-transparent">
              <TabsTrigger 
                value="overview" 
                className="inline-block p-4 border-b-2 text-sm font-medium hover:text-primary-600 hover:border-primary-300 focus:outline-none"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                {t('Overview')}
              </TabsTrigger>
              <TabsTrigger 
                value="courses" 
                className="inline-block p-4 border-b-2 text-sm font-medium hover:text-primary-600 hover:border-primary-300 focus:outline-none"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {t('Courses')}
              </TabsTrigger>
              <TabsTrigger 
                value="announcements" 
                className="inline-block p-4 border-b-2 text-sm font-medium hover:text-primary-600 hover:border-primary-300 focus:outline-none"
              >
                <Bell className="w-4 h-4 mr-2" />
                {t('Announcements')}
              </TabsTrigger>
              <TabsTrigger 
                value="tasks" 
                className="inline-block p-4 border-b-2 text-sm font-medium hover:text-primary-600 hover:border-primary-300 focus:outline-none"
              >
                <CalendarDays className="w-4 h-4 mr-2" />
                {t('Tasks')}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-6">
            {/* Main Dashboard Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
              
              {/* Welcome Card */}
              <div className="lg:col-span-8">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-md p-6 text-white mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        {t('Welcome back')}, {user?.firstName || ''}!
                      </h2>
                      <p className="text-primary-100">
                        {t('Current Semester')}: {stats.currentSemester}
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <UserCheck className="w-10 h-10" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">
                        {t('Courses')}
                      </div>
                      <div className="text-2xl font-bold">{stats.coursesCount}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">
                        {t('GPA')}
                      </div>
                      <div className="text-2xl font-bold">{stats.overallGPA.toFixed(2)}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">
                        {t('Tasks')}
                      </div>
                      <div className="text-2xl font-bold">{stats.tasksCount}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">
                        {t('Credits')}
                      </div>
                      <div className="text-2xl font-bold">
                        {stats.creditsCompleted}/{stats.creditsRequired}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Current Courses */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-primary-500" />
                      {t('Current Courses')}
                    </h3>
                    <Link 
                      href="/academics" 
                      className="text-primary-500 text-sm hover:underline flex items-center"
                    >
                      {t('View All')} <i className="fas fa-arrow-right ml-1 text-xs"></i>
                    </Link>
                  </div>
                  
                  {isLoadingEnrollments ? (
                    <div className="p-8 flex justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : enrollments && enrollments.length > 0 ? (
                    <div className="p-4 grid gap-4">
                      {enrollments.slice(0, 3).map(enrollment => (
                        <div key={enrollment.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">{enrollment.course?.code}: {enrollment.course?.name}</h4>
                              <div className="text-sm text-gray-600 mt-1">
                                <span className="inline-flex items-center">
                                  <i className="fas fa-user-tie text-gray-400 mr-1.5"></i>
                                  {enrollment.course?.instructorName}
                                </span>
                                <span className="mx-2">•</span>
                                <span className="inline-flex items-center">
                                  <i className="fas fa-calendar-alt text-gray-400 mr-1.5"></i>
                                  {enrollment.course?.schedule}
                                </span>
                              </div>
                            </div>
                            <div className="mt-2 md:mt-0 md:ml-4">
                              <span className="text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-800">
                                {enrollment.course?.credits} {t('credits')}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2">
                            <div className="text-xs text-gray-500 flex justify-between mb-1">
                              <span>{t('Progress')}</span>
                              <span>{enrollment.currentWeek}/{enrollment.course?.totalWeeks} {t('Weeks')}</span>
                            </div>
                            <Progress value={enrollment.progress} className="h-2 bg-gray-100" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <BookOpen className="h-8 w-8 text-gray-400" />
                      </div>
                      <p>{t('You are not enrolled in any courses')}</p>
                      <Link 
                        href="/course-registration" 
                        className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                      >
                        {t('Register for Courses')} <i className="fas fa-arrow-right ml-1.5 text-xs"></i>
                      </Link>
                    </div>
                  )}
                </div>
                
                {/* Today's Schedule */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                      <i className="fas fa-clock text-primary-600 mr-2"></i>
                      {t('Today\'s Schedule')}
                    </h3>
                    <span className="text-sm text-gray-600">
                      {format(today, 'EEEE, MMMM d')}
                    </span>
                  </div>
                  
                  {isLoadingEnrollments ? (
                    <div className="p-8 flex justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : todaySchedule && todaySchedule.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {todaySchedule.map((enrollment) => {
                        const [day, time] = enrollment.course?.schedule?.split(' ') || [];
                        return (
                          <div key={enrollment.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center">
                              <div className="bg-primary-100 text-primary-600 rounded-full p-2 mr-4">
                                <i className="fas fa-book"></i>
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                  <h4 className="font-medium text-gray-900">{enrollment.course?.code}: {enrollment.course?.name}</h4>
                                  <span className="text-sm font-medium text-gray-600">{time}</span>
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  <i className="fas fa-map-marker-alt text-gray-400 mr-1.5"></i>
                                  {enrollment.course?.location || t('Online')}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <i className="fas fa-calendar-day text-gray-400 text-2xl"></i>
                      </div>
                      <p>{t('No classes scheduled for today')}</p>
                    </div>
                  )}
                </div>
                
                {/* Tasks */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                      <i className="fas fa-tasks text-primary-600 mr-2"></i>
                      {t('Upcoming Tasks')}
                    </h3>
                    <Link 
                      href="/tasks" 
                      className="text-primary-500 text-sm hover:underline flex items-center"
                    >
                      {t('View All')} <i className="fas fa-arrow-right ml-1 text-xs"></i>
                    </Link>
                  </div>
                  
                  {isLoadingTasks ? (
                    <div className="p-8 flex justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : tasks && tasks.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                      {tasks.filter(task => task.status !== 'completed').slice(0, 3).map((task) => (
                        <li key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start">
                            <div className={`${
                              task.type === 'assignment' ? 'bg-amber-100 text-amber-600' :
                              task.type === 'exam' ? 'bg-blue-100 text-blue-600' :
                              'bg-emerald-100 text-emerald-600'
                            } rounded-full p-2 mr-3 flex-shrink-0`}>
                              <i className={`${
                                task.type === 'assignment' ? 'fas fa-clipboard-list' :
                                task.type === 'exam' ? 'fas fa-book-open' :
                                'fas fa-file-code'
                              }`}></i>
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-gray-900">{task.title}</p>
                                  <div className="mt-1 flex items-center text-xs text-gray-600">
                                    <i className="fas fa-book text-gray-400 mr-1"></i>
                                    <span>{task.course?.code}</span>
                                  </div>
                                </div>
                                {task.dueDate && (
                                  <div className={`${
                                    Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 2
                                      ? 'bg-red-100 text-red-800'
                                      : Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 5
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-blue-100 text-blue-800'
                                  } px-2 py-1 rounded-md text-xs font-medium flex items-center ml-2 whitespace-nowrap`}>
                                    <i className="fas fa-clock mr-1"></i>
                                    {Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} {t('days')}
                                  </div>
                                )}
                              </div>
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
              <div className="lg:col-span-4">
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
              
                {/* Announcements - Moved to right column to balance layout */}  
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                      <i className="fas fa-bullhorn text-primary-600 mr-2"></i>
                      {t('Announcements')}
                    </h3>
                    <Link
                      href="/announcements" 
                      className="text-primary-500 text-sm hover:underline flex items-center"
                    >
                      {t('View All')} <i className="fas fa-arrow-right ml-1 text-xs"></i>
                    </Link>
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
                            <div className="bg-primary-100 text-primary-600 rounded-full p-2 mr-3 mt-1">
                              <i className="fas fa-bullhorn"></i>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{announcement.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                              <div className="flex items-center mt-2 text-xs text-gray-500">
                                <i className="fas fa-building mr-1.5 text-gray-400"></i>
                                <span>{announcement.department}</span>
                                <span className="mx-2">•</span>
                                <i className="fas fa-calendar-alt mr-1.5 text-gray-400"></i>
                                <span>{format(new Date(announcement.postedAt), 'MMM d, yyyy')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <i className="fas fa-bullhorn text-gray-400 text-2xl"></i>
                      </div>
                      <p>{t('No announcements')}</p>
                    </div>
                  )}
                </div>
              
                {/* Quick Links - Moved to right column for better balance */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                      <i className="fas fa-link text-primary-600 mr-2"></i>
                      {t('Quick Links')}
                    </h3>
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-3">
                    <a href="#library" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition-colors">
                      <i className="fas fa-book text-primary-500 text-xl mb-2 block"></i>
                      <p className="text-sm font-medium">{t('Library Resources')}</p>
                    </a>
                    <a href="#e-learning" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition-colors">
                      <i className="fas fa-laptop text-primary-500 text-xl mb-2 block"></i>
                      <p className="text-sm font-medium">{t('E-Learning')}</p>
                    </a>
                    <a href="#transcript" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition-colors">
                      <i className="fas fa-file-alt text-primary-500 text-xl mb-2 block"></i>
                      <p className="text-sm font-medium">{t('Transcript Request')}</p>
                    </a>
                    <a href="#support" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition-colors">
                      <i className="fas fa-headset text-primary-500 text-xl mb-2 block"></i>
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