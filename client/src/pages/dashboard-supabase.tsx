import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { format, parseISO, isToday, isPast } from 'date-fns';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import Layout from '@/components/Layout';
import { 
  Loader2, 
  BookOpen, 
  Bell, 
  CalendarDays,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from '@/hooks/use-auth-supabase';
import { supabaseApi } from '@/lib/supabase';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch dashboard data using Supabase
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const [enrollments, announcements, tasks, academics, finances] = await Promise.all([
        supabaseApi.getUserEnrollments(user.id),
        supabaseApi.getAnnouncements(),
        supabaseApi.getUserTasks(user.id),
        supabaseApi.getUserAcademics(user.id),
        supabaseApi.getUserFinances(user.id)
      ]);

      return {
        user,
        enrollments,
        announcements,
        tasks,
        academics,
        finances
      };
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (!user) {
    return <div>Please log in</div>;
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="mr-2 h-8 w-8 animate-spin" />
          <span>{t('Loading...')}</span>
        </div>
      </Layout>
    );
  }

  if (!dashboardData) {
    return <div>No data available</div>;
  }

  const { enrollments = [], announcements = [], tasks = [], finances = [] } = dashboardData;

  // Calculate statistics
  const totalCourses = enrollments.length;
  const activeTasks = tasks.filter((t: any) => t.status === 'pending').length;
  const totalBalance = finances.reduce((sum: number, f: any) => {
    return f.type === 'payment' ? sum + f.amount : sum - f.amount;
  }, 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h1 className="text-2xl font-bold text-gray-900">
            {t('Welcome back')}, {user.first_name || user.firstName || 'Student'}!
          </h1>
          <p className="text-gray-600 mt-1">
            {t("Here's what's happening with your studies today")}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('Enrolled Courses')}
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                {t('Active this semester')}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('Pending Tasks')}
              </CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTasks}</div>
              <p className="text-xs text-muted-foreground">
                {t('Due this week')}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('Account Balance')}
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalBalance.toLocaleString()} RWF
              </div>
              <p className="text-xs text-muted-foreground">
                {t('Current balance')}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('New Announcements')}
              </CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{announcements.length}</div>
              <p className="text-xs text-muted-foreground">
                {t('This week')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">{t('Overview')}</TabsTrigger>
            <TabsTrigger value="courses">{t('My Courses')}</TabsTrigger>
            <TabsTrigger value="announcements">{t('Announcements')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Upcoming Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>{t('Upcoming Tasks')}</CardTitle>
                <CardDescription>
                  {t('Your assignments and deadlines')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tasks.length === 0 ? (
                  <p className="text-sm text-gray-500">{t('No tasks due')}</p>
                ) : (
                  <div className="space-y-3">
                    {tasks.slice(0, 5).map((task: any) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Clock className={`h-5 w-5 ${
                            task.due_date && isPast(parseISO(task.due_date)) 
                              ? 'text-red-500' 
                              : 'text-gray-400'
                          }`} />
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm text-gray-600">
                              {task.course?.name || 'General'} • {task.type}
                            </p>
                          </div>
                        </div>
                        {task.due_date && (
                          <Badge variant={isPast(parseISO(task.due_date)) ? "destructive" : "secondary"}>
                            {format(parseISO(task.due_date), 'MMM dd')}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {enrollments.map((enrollment: any) => (
                <Card key={enrollment.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {enrollment.course?.code}
                    </CardTitle>
                    <CardDescription>
                      {enrollment.course?.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{t('Credits')}:</span>
                        <span className="font-medium">{enrollment.course?.credits}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{t('Progress')}:</span>
                        <span className="font-medium">{enrollment.progress || 0}%</span>
                      </div>
                      <Progress value={enrollment.progress || 0} className="mt-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="announcements" className="space-y-4">
            {announcements.map((announcement: any) => (
              <Card key={announcement.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        {announcement.title}
                      </CardTitle>
                      <CardDescription>
                        {announcement.posted_by} • {announcement.department}
                      </CardDescription>
                    </div>
                    {announcement.is_important && (
                      <Badge variant="destructive">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        {t('Important')}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{announcement.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {format(parseISO(announcement.posted_at), 'PPP')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}