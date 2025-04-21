import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { format, parseISO, isToday, isPast, addDays } from 'date-fns';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import Layout from '@/components/Layout';
import { 
  Loader2, 
  BarChart3, 
  BookOpen, 
  UserCheck, 
  Bell, 
  CalendarDays,
  BookMarked,
  GraduationCap,
  CreditCard,
  Clock,
  Calendar,
  Award,
  FileText,
  CheckCircle2,
  AlertCircle,
  Info,
  ArrowUpRight,
  Library,
  LifeBuoy,
  BookOpenCheck,
  GanttChartSquare
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Helper functions
const getStatusColor = (daysLeft: number) => {
  if (daysLeft <= 2) return 'text-red-600 bg-red-50';
  if (daysLeft <= 5) return 'text-amber-600 bg-amber-50';
  return 'text-blue-600 bg-blue-50';
};

const getProgressColor = (progress: number) => {
  if (progress < 30) return 'bg-red-600';
  if (progress < 70) return 'bg-amber-500';
  return 'bg-green-600';
};

const formatDueDate = (dueDate: string) => {
  const date = parseISO(dueDate);
  if (isToday(date)) return 'Today';
  if (isToday(addDays(date, -1))) return 'Tomorrow';
  return format(date, 'MMM d');
};

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
};

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

  // Fetch finances
  const { data: finances, isLoading: isLoadingFinances } = useQuery({
    queryKey: ['/api/finances'],
    enabled: !!user,
  });

  // Calculate statistics
  const stats = {
    coursesCount: enrollments?.length || 0,
    tasksCount: tasks?.filter(task => task.status !== 'completed').length || 0,
    upcomingExams: tasks?.filter(task => task.type === 'exam' && task.status !== 'completed').length || 0,
    completedTasks: tasks?.filter(task => task.status === 'completed').length || 0,
    overallGPA: academics?.[0]?.gpa || 0,
    creditsCompleted: academics?.[0]?.creditsCompleted || 0,
    creditsRequired: academics?.[0]?.creditsRequired || 0,
    currentSemester: academics?.[0]?.currentSemester || '',
    degreeProgress: ((academics?.[0]?.creditsCompleted || 0) / (academics?.[0]?.creditsRequired || 1)) * 100,
    totalBalance: finances?.reduce((total, item) => {
      return item.type === 'payment' ? total - item.amount : total + item.amount;
    }, 0) || 0,
    pendingPayments: finances?.filter(finance => 
      finance.type === 'fee' && finance.status === 'pending'
    ).length || 0,
    importantAnnouncements: announcements?.filter(announcement => announcement.isImportant).length || 0
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
  
  // Prioritize tasks
  const urgentTasks = tasks?.filter(task => {
    if (task.status === 'completed') return false;
    if (!task.dueDate) return false;
    
    const dueDate = new Date(task.dueDate);
    const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 3;
  }) || [];
  
  const upcomingTasks = tasks?.filter(task => {
    if (task.status === 'completed') return false;
    if (!task.dueDate) return true; // Tasks without due dates
    
    const dueDate = new Date(task.dueDate);
    const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft > 3;
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
            {/* Student Header with key information */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="relative bg-primary-600 text-white pt-10 pb-24">
                {/* Decorative pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#smallGrid)" />
                  </svg>
                </div>
                
                <div className="container mx-auto px-6 relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                      <AvatarFallback className="bg-primary-200 text-primary-800 text-xl font-bold">
                        {getInitials(user?.firstName || '', user?.lastName || '')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="mt-4 md:mt-0 md:ml-6">
                      <div className="flex flex-col md:flex-row md:items-baseline">
                        <h1 className="text-2xl md:text-3xl font-bold">
                          {user?.firstName} {user?.lastName}
                        </h1>
                        <Badge variant="secondary" className="mt-2 md:mt-0 md:ml-3 text-xs px-2 py-0.5 bg-primary-200 text-primary-800">
                          {user?.role || 'Student'}
                        </Badge>
                      </div>
                      
                      <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-primary-100">
                        <div className="flex items-center">
                          <GraduationCap className="h-4 w-4 mr-1.5" />
                          <span>{academics?.[0]?.program || 'Computer Science'}</span>
                        </div>
                        <div className="flex items-center">
                          <BookMarked className="h-4 w-4 mr-1.5" />
                          <span>
                            {t('Year')} {academics?.[0]?.yearOfStudy || '3'}, {stats.currentSemester}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-1.5" />
                          <span>GPA: {stats.overallGPA.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Stats cards overlapping the header */}
              <div className="container mx-auto px-6 relative -mt-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="border-b-4 border-primary-400">
                    <CardHeader className="pb-2">
                      <CardDescription className="text-xs uppercase tracking-wide font-medium">
                        {t('Degree Progress')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-2xl font-bold text-primary-600">{Math.round(stats.degreeProgress)}%</span>
                        <span className="text-sm text-gray-500">{stats.creditsCompleted}/{stats.creditsRequired} {t('credits')}</span>
                      </div>
                      <Progress value={stats.degreeProgress} className="h-2" />
                    </CardContent>
                  </Card>
                  
                  <Card className="border-b-4 border-blue-400">
                    <CardHeader className="pb-2">
                      <CardDescription className="text-xs uppercase tracking-wide font-medium">
                        {t('Current Courses')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{stats.coursesCount}</div>
                          <div className="text-sm text-gray-500">{t('Active Enrollments')}</div>
                        </div>
                        <BookOpen className="h-8 w-8 text-blue-200" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-b-4 border-amber-400">
                    <CardHeader className="pb-2">
                      <CardDescription className="text-xs uppercase tracking-wide font-medium">
                        {t('Financial Status')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-2xl font-bold text-amber-600">
                            {stats.pendingPayments > 0 ? (
                              <span>{stats.pendingPayments} {t('Due')}</span>
                            ) : (
                              <CheckCircle2 className="h-6 w-6 text-green-500" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {stats.pendingPayments > 0 ? t('Pending Payments') : t('All Payments Up to Date')}
                          </div>
                        </div>
                        <CreditCard className="h-8 w-8 text-amber-200" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-b-4 border-red-400">
                    <CardHeader className="pb-2">
                      <CardDescription className="text-xs uppercase tracking-wide font-medium">
                        {t('Urgent Tasks')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-2xl font-bold text-red-600">{urgentTasks.length}</div>
                          <div className="text-sm text-gray-500">{t('Due Soon')}</div>
                        </div>
                        <AlertCircle className="h-8 w-8 text-red-200" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Quick action buttons */}
              <div className="container mx-auto px-6 py-4 mt-4">
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="flex items-center gap-1.5 text-primary-600 border-primary-200 hover:bg-primary-50 px-3">
                    <FileText className="h-4 w-4" />
                    {t('Access Transcript')}
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-1.5 text-primary-600 border-primary-200 hover:bg-primary-50 px-3">
                    <Calendar className="h-4 w-4" />
                    {t('Academic Calendar')}
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-1.5 text-primary-600 border-primary-200 hover:bg-primary-50 px-3">
                    <BookOpenCheck className="h-4 w-4" />
                    {t('Course Registration')}
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-1.5 text-primary-600 border-primary-200 hover:bg-primary-50 px-3">
                    <GanttChartSquare className="h-4 w-4" />
                    {t('Exam Schedule')}
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Main Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-8 space-y-6">
                {/* Important Alerts */}
                {urgentTasks.length > 0 && (
                  <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-start">
                    <div className="flex-shrink-0 bg-red-100 rounded-full p-2 mr-3">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-red-800">{t('Urgent Deadlines Approaching')}</h4>
                      <p className="text-sm text-red-700 mt-0.5">
                        {t('You have')} {urgentTasks.length} {t('task(s) due within 3 days')}
                      </p>
                      <div className="mt-2">
                        <Button size="sm" variant="outline" className="text-xs bg-white border-red-200 text-red-700 hover:bg-red-50">
                          {t('View Tasks')}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Academic Progress */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-primary-500" />
                        {t('Academic Progress')}
                      </CardTitle>
                      <Button size="sm" variant="ghost" className="text-xs gap-1 h-7">
                        {t('Full Report')}
                        <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-xs text-blue-600 uppercase font-semibold tracking-wide mb-1">
                          {t('GPA')}
                        </div>
                        <div className="text-3xl font-bold text-blue-700">
                          {stats.overallGPA.toFixed(2)}
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                          {stats.overallGPA >= 3.5 ? t('Excellent') : 
                           stats.overallGPA >= 3.0 ? t('Very Good') : 
                           stats.overallGPA >= 2.5 ? t('Good') : t('Average')}
                        </div>
                      </div>
                      
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="text-xs text-green-600 uppercase font-semibold tracking-wide mb-1">
                          {t('Credits')}
                        </div>
                        <div className="text-3xl font-bold text-green-700">
                          {stats.creditsCompleted}
                          <span className="text-sm text-green-600 font-normal ml-1">/ {stats.creditsRequired}</span>
                        </div>
                        <div className="text-xs text-green-600 mt-1">
                          {t('Credits Earned')}
                        </div>
                      </div>
                      
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="text-xs text-purple-600 uppercase font-semibold tracking-wide mb-1">
                          {t('Status')}
                        </div>
                        <div className="text-xl font-bold text-purple-700">
                          {t('Good Standing')}
                        </div>
                        <div className="text-xs text-purple-600 mt-1">
                          {t('Academic Status')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-sm font-medium mb-2">{t('Degree Progress')}</div>
                      <div className="flex items-center mb-2">
                        <Progress value={stats.degreeProgress} className="h-3 flex-1" />
                        <span className="ml-3 text-sm font-medium">{Math.round(stats.degreeProgress)}%</span>
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <div>0%</div>
                        <div>25%</div>
                        <div>50%</div>
                        <div>75%</div>
                        <div>100%</div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <div className="text-sm font-medium mb-2">{t('Recent Grades')}</div>
                      <div className="bg-gray-50 rounded-lg border border-gray-100 divide-y divide-gray-100">
                        <div className="px-4 py-3 flex justify-between items-center">
                          <div>
                            <div className="font-medium">CSC234: Data Structures</div>
                            <div className="text-xs text-gray-500">{t('Midterm Exam')}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">A</Badge>
                            <span className="text-sm">92%</span>
                          </div>
                        </div>
                        <div className="px-4 py-3 flex justify-between items-center">
                          <div>
                            <div className="font-medium">MTH202: Linear Algebra</div>
                            <div className="text-xs text-gray-500">{t('Assignment 3')}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">B+</Badge>
                            <span className="text-sm">87%</span>
                          </div>
                        </div>
                        <div className="px-4 py-3 flex justify-between items-center">
                          <div>
                            <div className="font-medium">ENG101: Communication Skills</div>
                            <div className="text-xs text-gray-500">{t('Essay')}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">A-</Badge>
                            <span className="text-sm">90%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Current Courses */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary-500" />
                        {t('Current Courses')}
                      </CardTitle>
                      <Link href="/academics" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                        {t('View All')}
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoadingEnrollments ? (
                      <div className="py-8 flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : enrollments && enrollments.length > 0 ? (
                      <div className="space-y-4">
                        {enrollments.slice(0, 3).map(enrollment => (
                          <div key={enrollment.id} className="border border-gray-100 bg-gray-50 rounded-lg p-4 transition-colors hover:bg-gray-100/80">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-start gap-3">
                                <div className="rounded-lg bg-primary-100 text-primary-700 w-10 h-10 flex items-center justify-center flex-shrink-0">
                                  <BookOpenCheck className="h-5 w-5" />
                                </div>
                                <div>
                                  <div className="flex items-center">
                                    <h4 className="font-semibold text-gray-900">{enrollment.course?.code}: {enrollment.course?.name}</h4>
                                  </div>
                                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 mt-1">
                                    <div className="flex items-center">
                                      <i className="fas fa-user-tie text-gray-400 mr-1.5"></i>
                                      {enrollment.course?.instructorName}
                                    </div>
                                    <div className="flex items-center">
                                      <i className="fas fa-calendar-alt text-gray-400 mr-1.5"></i>
                                      {enrollment.course?.schedule}
                                    </div>
                                    <div className="flex items-center">
                                      <i className="fas fa-map-marker-alt text-gray-400 mr-1.5"></i>
                                      {enrollment.course?.location || 'Online'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge variant="outline" className="bg-primary-50 text-primary-700 border-primary-200 whitespace-nowrap">
                                  {enrollment.course?.credits} {t('credits')}
                                </Badge>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                        <ArrowUpRight className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{t('View course details')}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                            <div className="mt-4">
                              <div className="flex justify-between items-center text-xs text-gray-500 mb-1.5">
                                <span>{t('Progress')}</span>
                                <span>
                                  {enrollment.currentWeek}/{enrollment.course?.totalWeeks} {t('Weeks')}
                                </span>
                              </div>
                              <Progress 
                                value={enrollment.progress} 
                                className="h-2" 
                                indicatorClassName={getProgressColor(enrollment.progress)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center text-gray-500">
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
                  </CardContent>
                </Card>
                
                {/* Today's Schedule */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary-500" />
                        {t('Today\'s Schedule')}
                      </CardTitle>
                      <div className="text-sm text-gray-500">
                        {format(today, 'EEEE, MMMM d')}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoadingEnrollments ? (
                      <div className="py-8 flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : todaySchedule && todaySchedule.length > 0 ? (
                      <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-3 top-6 bottom-6 w-0.5 bg-gray-200" />
                        
                        <div className="space-y-6 relative">
                          {todaySchedule.map((enrollment) => {
                            const [day, time] = enrollment.course?.schedule?.split(' ') || [];
                            const [startTime, endTime] = time?.split('-') || [];
                            const isCurrentClass = true; // This would be based on actual current time
                            
                            return (
                              <div key={enrollment.id} className="pl-10 relative">
                                {/* Timeline dot */}
                                <div className={`absolute left-0 top-0 h-6 w-6 rounded-full border-2 border-white flex items-center justify-center
                                  ${isCurrentClass ? 'bg-green-500' : 'bg-gray-200'}`}>
                                  <div className={`h-3 w-3 rounded-full ${isCurrentClass ? 'bg-white' : 'bg-gray-400'}`}></div>
                                </div>
                                
                                <div className={`p-4 rounded-lg transition-colors
                                  ${isCurrentClass ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100'}`}>
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                      <div className="flex items-center">
                                        <h4 className="font-medium text-gray-900">{enrollment.course?.code}: {enrollment.course?.name}</h4>
                                        {isCurrentClass && (
                                          <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">
                                            {t('Current')}
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-1">
                                        <div className="flex items-center">
                                          <i className="fas fa-clock text-gray-400 mr-1.5"></i>
                                          {time}
                                        </div>
                                        <div className="flex items-center">
                                          <i className="fas fa-map-marker-alt text-gray-400 mr-1.5"></i>
                                          {enrollment.course?.location || t('Online')}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex">
                                      <Button size="sm" variant="outline" className="text-xs h-8">
                                        {t('View Materials')}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="py-8 text-center text-gray-500">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                          <Calendar className="h-8 w-8 text-gray-400" />
                        </div>
                        <p>{t('No classes scheduled for today')}</p>
                        <p className="text-sm mt-1">{t('Enjoy your free day!')}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Right Column - Secondary Content */}
              <div className="lg:col-span-4 space-y-6">
                {/* Urgent Tasks */}
                <Card className="border border-red-100">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        {t('Urgent Tasks')}
                      </CardTitle>
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 font-normal">
                        {urgentTasks.length} {t('Due Soon')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoadingTasks ? (
                      <div className="py-4 flex justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : urgentTasks.length > 0 ? (
                      <div className="space-y-3">
                        {urgentTasks.map((task) => {
                          const dueDate = new Date(task.dueDate);
                          const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                          
                          return (
                            <div key={task.id} className="p-3 border border-red-100 bg-red-50/50 rounded-lg">
                              <div className="flex justify-between items-start">
                                <div className="flex items-start gap-2">
                                  <div className={`rounded-full p-1.5 flex items-center justify-center flex-shrink-0
                                    ${task.type === 'assignment' ? 'bg-amber-100 text-amber-600' :
                                      task.type === 'exam' ? 'bg-blue-100 text-blue-600' :
                                      'bg-emerald-100 text-emerald-600'}`}>
                                    <i className={`${
                                      task.type === 'assignment' ? 'fas fa-clipboard-list' :
                                      task.type === 'exam' ? 'fas fa-book-open' :
                                      'fas fa-file-code'
                                    } text-xs`}></i>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                                    <div className="text-xs text-gray-600 mt-0.5">
                                      {task.course?.code}: {task.course?.name}
                                    </div>
                                  </div>
                                </div>
                                <Badge className={`ml-1 text-xs ${getStatusColor(daysLeft)}`}>
                                  {daysLeft === 0 ? t('Today') : 
                                   daysLeft === 1 ? t('Tomorrow') : 
                                   `${daysLeft} ${t('days')}`}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                <div className="text-xs text-gray-500">
                                  {formatDueDate(task.dueDate)}, {task.dueTime || '11:59 PM'}
                                </div>
                                <Button variant="ghost" size="sm" className="h-7 text-xs text-primary-600 hover:text-primary-700 hover:bg-primary-50 p-0 px-2">
                                  {t('Complete')}
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-6 text-center text-gray-500">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                        <p className="text-sm">{t('No urgent tasks due soon')}</p>
                      </div>
                    )}
                    
                    {urgentTasks.length > 0 && (
                      <div className="mt-3">
                        <Button variant="outline" className="w-full text-red-600 border-red-100 bg-red-50 hover:bg-red-100 hover:text-red-700">
                          {t('Manage All Tasks')}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Important Announcements */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Bell className="h-5 w-5 text-primary-500" />
                        {t('Announcements')}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {stats.importantAnnouncements} {t('Important')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoadingAnnouncements ? (
                      <div className="py-4 flex justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : announcements && announcements.length > 0 ? (
                      <div className="space-y-3">
                        {announcements.slice(0, 3).map((announcement) => (
                          <div 
                            key={announcement.id} 
                            className={`p-3 border rounded-lg ${
                              announcement.isImportant 
                                ? 'bg-primary-50/50 border-primary-100' 
                                : 'bg-gray-50 border-gray-100'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <div className={`rounded-full p-1.5 flex items-center justify-center flex-shrink-0 ${
                                announcement.isImportant 
                                  ? 'bg-primary-100 text-primary-600' 
                                  : 'bg-gray-200 text-gray-600'
                              }`}>
                                {announcement.isImportant ? (
                                  <i className="fas fa-bullhorn text-xs"></i>
                                ) : (
                                  <Info className="h-3.5 w-3.5" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center">
                                  <h4 className="font-medium text-gray-900 text-sm">{announcement.title}</h4>
                                  {announcement.isImportant && (
                                    <Badge variant="outline" className="ml-2 text-[10px] px-1 py-0 h-4 bg-primary-50 text-primary-700 border-primary-200">
                                      {t('Important')}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {announcement.content}
                                </p>
                                <div className="flex items-center mt-1.5 text-xs text-gray-500">
                                  <i className="fas fa-building mr-1 text-gray-400"></i>
                                  <span>{announcement.department}</span>
                                  <span className="mx-1.5">•</span>
                                  <i className="fas fa-calendar-alt mr-1 text-gray-400"></i>
                                  <span>{format(new Date(announcement.postedAt), 'MMM d')}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 text-center text-gray-500">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                          <Bell className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-sm">{t('No announcements at this time')}</p>
                      </div>
                    )}
                    
                    {announcements && announcements.length > 0 && (
                      <div className="mt-3">
                        <Link href="/announcements">
                          <Button variant="outline" className="w-full">
                            {t('View All Announcements')}
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Study Priority Management */}
                <Card className="border border-indigo-100">
                  <CardHeader className="pb-2 border-b bg-indigo-50/50">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-900">
                        <i className="fas fa-brain text-indigo-600 mr-0.5"></i>
                        {t('Study Priorities')}
                      </CardTitle>
                      <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
                        {t('New Feature')}
                      </Badge>
                    </div>
                    <CardDescription className="text-indigo-700 mt-1">
                      {t('Organize and track your personal study priorities')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex justify-between mb-4 pb-2 border-b border-indigo-100">
                      <div className="text-center px-2">
                        <div className="text-xl font-bold text-red-600">2</div>
                        <div className="text-xs text-gray-600">{t('High')}</div>
                      </div>
                      <div className="text-center px-2">
                        <div className="text-xl font-bold text-amber-600">3</div>
                        <div className="text-xs text-gray-600">{t('Medium')}</div>
                      </div>
                      <div className="text-center px-2">
                        <div className="text-xl font-bold text-green-600">1</div>
                        <div className="text-xs text-gray-600">{t('Low')}</div>
                      </div>
                      <div className="text-center px-2">
                        <div className="text-xl font-bold text-indigo-600">4</div>
                        <div className="text-xs text-gray-600">{t('Done')}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {/* High priority study task */}
                      <div className="p-3 border border-red-100 rounded-lg bg-red-50/30">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5"></div>
                            <div>
                              <h4 className="font-medium text-gray-900 text-sm">Complete CSC101 Programming Assignment</h4>
                              <div className="mt-1 text-xs text-gray-600 flex items-center">
                                <i className="fas fa-clock text-gray-400 mr-1"></i>
                                <span>Est. 2 hours</span>
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-red-100 text-red-700 border-0">
                            {t('High')}
                          </Badge>
                        </div>
                        <div className="mt-2 pl-5">
                          <div className="text-xs text-gray-500 flex justify-between mb-1">
                            <span>{t('Progress')}</span>
                            <span>30%</span>
                          </div>
                          <Progress value={30} className="h-1.5 bg-gray-200">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: '30%' }}></div>
                          </Progress>
                        </div>
                      </div>
                      
                      {/* Medium priority study task */}
                      <div className="p-3 border border-amber-100 rounded-lg bg-amber-50/30">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-2">
                            <div className="w-3 h-3 bg-amber-500 rounded-full mt-1.5"></div>
                            <div>
                              <h4 className="font-medium text-gray-900 text-sm">Review MTH101 Lecture Notes</h4>
                              <div className="mt-1 text-xs text-gray-600 flex items-center">
                                <i className="fas fa-calendar-day text-gray-400 mr-1"></i>
                                <span>Before next class</span>
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-amber-100 text-amber-700 border-0">
                            {t('Medium')}
                          </Badge>
                        </div>
                        <div className="mt-2 pl-5">
                          <div className="text-xs text-gray-500 flex justify-between mb-1">
                            <span>{t('Progress')}</span>
                            <span>50%</span>
                          </div>
                          <Progress value={50} className="h-1.5 bg-gray-200">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '50%' }}></div>
                          </Progress>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between">
                      <Button size="sm" variant="outline" className="text-xs h-8 text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                        {t('View All')}
                      </Button>
                      <Button size="sm" className="text-xs h-8 bg-indigo-600 hover:bg-indigo-700 text-white">
                        <i className="fas fa-plus mr-1.5 text-[10px]"></i>
                        {t('Add Priority')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Quick Links */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <i className="fas fa-link text-primary-500 mr-0.5"></i>
                      {t('Quick Links')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <Link 
                        href="#library" 
                        className="group flex flex-col items-center bg-gray-50 hover:bg-primary-50 p-4 rounded-lg border border-gray-200 hover:border-primary-200 transition-colors"
                      >
                        <Library className="h-6 w-6 text-primary-500 mb-2 group-hover:text-primary-600" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">{t('Library')}</span>
                      </Link>
                      
                      <Link 
                        href="#e-learning" 
                        className="group flex flex-col items-center bg-gray-50 hover:bg-primary-50 p-4 rounded-lg border border-gray-200 hover:border-primary-200 transition-colors"
                      >
                        <BookOpenCheck className="h-6 w-6 text-primary-500 mb-2 group-hover:text-primary-600" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">{t('E-Learning')}</span>
                      </Link>
                      
                      <Link 
                        href="#transcript" 
                        className="group flex flex-col items-center bg-gray-50 hover:bg-primary-50 p-4 rounded-lg border border-gray-200 hover:border-primary-200 transition-colors"
                      >
                        <FileText className="h-6 w-6 text-primary-500 mb-2 group-hover:text-primary-600" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">{t('Transcript')}</span>
                      </Link>
                      
                      <Link 
                        href="#support" 
                        className="group flex flex-col items-center bg-gray-50 hover:bg-primary-50 p-4 rounded-lg border border-gray-200 hover:border-primary-200 transition-colors"
                      >
                        <LifeBuoy className="h-6 w-6 text-primary-500 mb-2 group-hover:text-primary-600" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">{t('Support')}</span>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
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