import { useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Days of the week for the timetable
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Time slots for the timetable
const timeSlots = [
  '08:00 - 10:00',
  '10:30 - 12:00',
  '12:00 - 14:00',
  '14:00 - 15:30',
  '16:00 - 17:30'
];

export default function Timetable() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('week');
  const [currentWeek, setCurrentWeek] = useState('current');
  
  const { data: enrollments, isLoading: isLoadingEnrollments } = useQuery({
    queryKey: ["/api/enrollments"],
    enabled: !!user,
  });

  if (!user) return null;

  // Sample timetable data
  const timetableData = {
    'Monday': {
      '10:30 - 12:00': {
        course: 'CSC301',
        name: 'Data Structures and Algorithms',
        location: 'LT5, Main Campus',
        color: 'green'
      }
    },
    'Tuesday': {
      '08:00 - 10:00': {
        course: 'MTH241',
        name: 'Linear Algebra',
        location: 'LT3, Science Building',
        color: 'blue'
      }
    },
    'Wednesday': {
      '10:30 - 12:00': {
        course: 'CSC301',
        name: 'Data Structures and Algorithms',
        location: 'LT5, Main Campus',
        color: 'green'
      },
      '14:00 - 15:30': {
        course: 'CSC315',
        name: 'Software Engineering',
        location: 'CS Lab 2, ICT Building',
        color: 'yellow'
      },
      '16:00 - 17:30': {
        course: 'Study Group',
        name: 'Project Meeting',
        location: 'Library Study Room 3',
        color: 'gray'
      }
    },
    'Thursday': {
      '14:00 - 17:00': {
        course: 'CSC325',
        name: 'Database Systems',
        location: 'CS Lab 3, ICT Building',
        color: 'purple'
      }
    },
    'Friday': {
      '08:00 - 10:00': {
        course: 'MTH241',
        name: 'Linear Algebra',
        location: 'LT3, Science Building',
        color: 'blue'
      }
    }
  };

  // Get today's events for Today's Schedule
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayEvents = timetableData[today as keyof typeof timetableData] || {};

  // Get color class based on course color
  const getColorClass = (color: string) => {
    switch (color) {
      case 'green':
        return 'border-l-4 border-green-500 bg-green-50';
      case 'blue':
        return 'border-l-4 border-blue-500 bg-blue-50';
      case 'yellow':
        return 'border-l-4 border-yellow-500 bg-yellow-50';
      case 'purple':
        return 'border-l-4 border-purple-500 bg-purple-50';
      case 'gray':
        return 'border-l-4 border-gray-500 bg-gray-50';
      default:
        return 'border-l-4 border-primary-500 bg-primary-50';
    }
  };

  // Function to get text color based on course color
  const getTextColorClass = (color: string) => {
    switch (color) {
      case 'green':
        return 'text-green-700';
      case 'blue':
        return 'text-blue-700';
      case 'yellow':
        return 'text-yellow-700';
      case 'purple':
        return 'text-purple-700';
      case 'gray':
        return 'text-gray-700';
      default:
        return 'text-primary-700';
    }
  };

  return (
    <Layout title="Timetable">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">{t('Class Timetable')}</h2>
            <p className="text-gray-500">{t('Academic Year 2023-2024, Semester 1')}</p>
          </div>
          <div className="flex space-x-2">
            <Select value={currentWeek} onValueChange={setCurrentWeek}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={t('Select Week')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">{t('Current Week')}</SelectItem>
                <SelectItem value="next">{t('Next Week')}</SelectItem>
                <SelectItem value="oct-9">{t('Oct 9-13')}</SelectItem>
                <SelectItem value="oct-16">{t('Oct 16-20')}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <i className="fas fa-print mr-2"></i>
              {t('Print')}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="week" onValueChange={setCurrentView} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="week">{t('Weekly View')}</TabsTrigger>
            <TabsTrigger value="day">{t('Daily View')}</TabsTrigger>
            <TabsTrigger value="list">{t('List View')}</TabsTrigger>
          </TabsList>

          {/* Weekly View */}
          <TabsContent value="week">
            <Card>
              <CardHeader>
                <CardTitle>{t('Weekly Schedule')}</CardTitle>
                <CardDescription>
                  {currentWeek === 'current' 
                    ? t('October 9-13, 2023') 
                    : currentWeek === 'next'
                    ? t('October 16-20, 2023')
                    : t('Selected Week')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingEnrollments ? (
                  <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="border p-2 bg-gray-50 min-w-[100px]">{t('Time')}</th>
                          {weekDays.map(day => (
                            <th key={day} className="border p-2 bg-gray-50 min-w-[150px]">
                              {t(day)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {timeSlots.map(timeSlot => (
                          <tr key={timeSlot}>
                            <td className="border p-2 font-medium text-sm">{timeSlot}</td>
                            {weekDays.map(day => {
                              const dayData = timetableData[day as keyof typeof timetableData] || {};
                              const classInfo = dayData[timeSlot as keyof typeof dayData];
                              
                              return (
                                <td key={`${day}-${timeSlot}`} className="border p-2">
                                  {classInfo ? (
                                    <div className={`${getColorClass(classInfo.color)} p-2 rounded`}>
                                      <p className="font-medium">{classInfo.course}</p>
                                      <p className="text-xs text-gray-600">{classInfo.name}</p>
                                      <p className="text-xs text-gray-500">{classInfo.location}</p>
                                    </div>
                                  ) : timeSlot === '12:00 - 14:00' ? (
                                    <div className="border-l-4 border-gray-300 bg-gray-50 p-2 rounded text-center text-xs text-gray-500">
                                      {t('Lunch Break')}
                                    </div>
                                  ) : null}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Daily View */}
          <TabsContent value="day">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{t(today)}</CardTitle>
                    <CardDescription>
                      {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-4">
                    <Button variant="ghost" size="sm">
                      <i className="fas fa-chevron-left mr-2"></i>
                      {t('Previous')}
                    </Button>
                    <Button variant="ghost" size="sm">
                      {t('Next')}
                      <i className="fas fa-chevron-right ml-2"></i>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingEnrollments ? (
                  <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : Object.keys(todayEvents).length === 0 ? (
                  <Alert className="bg-blue-50 text-blue-700 border-blue-200">
                    <AlertTitle>{t('No Classes Today')}</AlertTitle>
                    <AlertDescription>
                      {t('You have no scheduled classes for today')}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(todayEvents).map(([time, classInfo]) => (
                      <div 
                        key={time} 
                        className={`${getColorClass(classInfo.color)} p-4 rounded-lg`}
                      >
                        <div className="flex justify-between">
                          <h3 className="font-semibold">{classInfo.course}: {classInfo.name}</h3>
                          <span className={`${getTextColorClass(classInfo.color)} font-medium`}>{time}</span>
                        </div>
                        <div className="mt-2 flex items-center text-gray-600">
                          <i className="fas fa-map-marker-alt mr-2"></i>
                          <span>{classInfo.location}</span>
                        </div>
                        <div className="mt-2 flex justify-between text-sm">
                          <span className="text-gray-500">
                            <i className="fas fa-user mr-1"></i> 
                            {classInfo.course === 'CSC301' ? 'Dr. Emmanuel Niyibizi' :
                             classInfo.course === 'MTH241' ? 'Prof. Alice Mukashema' :
                             classInfo.course === 'CSC325' ? 'Dr. Jean Pierre Mugabo' :
                             classInfo.course === 'CSC315' ? 'Dr. Frank Mugisha' :
                             'Group Members'}
                          </span>
                          <Button variant="outline" size="sm">
                            <i className="fas fa-calendar-plus mr-1"></i> {t('Add to Calendar')}
                          </Button>
                        </div>
                      </div>
                    ))}
                    {/* Lunch break */}
                    <div className="border-l-4 border-gray-300 bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{t('Lunch Break')}</h3>
                        <span className="text-gray-500 font-medium">12:00 - 14:00</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* List View */}
          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>{t('All Classes')}</CardTitle>
                <CardDescription>
                  {t('List of all your classes for the semester')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingEnrollments ? (
                  <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {weekDays.map(day => {
                      const dayEvents = timetableData[day as keyof typeof timetableData] || {};
                      const eventTimes = Object.keys(dayEvents);
                      
                      if (eventTimes.length === 0) return null;
                      
                      return (
                        <div key={day}>
                          <h3 className="font-bold text-lg mb-3 pb-2 border-b">{t(day)}</h3>
                          <div className="space-y-3">
                            {eventTimes.map(time => {
                              const classInfo = dayEvents[time as keyof typeof dayEvents];
                              return (
                                <div 
                                  key={`${day}-${time}`} 
                                  className="flex flex-col md:flex-row md:items-center p-3 border rounded-lg hover:bg-gray-50"
                                >
                                  <div className="md:w-1/4">
                                    <span className="font-medium">{time}</span>
                                  </div>
                                  <div className="md:w-1/2 mt-2 md:mt-0">
                                    <p className="font-medium">{classInfo.course}: {classInfo.name}</p>
                                    <p className="text-sm text-gray-500">{classInfo.location}</p>
                                  </div>
                                  <div className="md:w-1/4 mt-2 md:mt-0 md:text-right">
                                    <span 
                                      className={`inline-block px-2 py-1 rounded-full text-xs ${
                                        classInfo.color === 'green' ? 'bg-green-100 text-green-800' :
                                        classInfo.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                                        classInfo.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                        classInfo.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                                        'bg-gray-100 text-gray-800'
                                      }`}
                                    >
                                      {classInfo.course}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Upcoming Events')}</CardTitle>
            <CardDescription>
              {t('Special academic events and deadlines')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start p-4 border rounded-lg">
                <div className="bg-red-100 text-red-600 rounded-full p-3 mr-4">
                  <i className="fas fa-calendar-day"></i>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div>
                      <h3 className="font-medium">{t('Midterm Examination Period')}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {t('The midterm examination period for all courses')}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0 text-sm">
                      <span className="font-medium">October 23-27, 2023</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start p-4 border rounded-lg">
                <div className="bg-blue-100 text-blue-600 rounded-full p-3 mr-4">
                  <i className="fas fa-book"></i>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div>
                      <h3 className="font-medium">{t('Academic Advising Week')}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {t('Schedule meetings with your academic advisor for course planning')}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0 text-sm">
                      <span className="font-medium">November 6-10, 2023</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start p-4 border rounded-lg">
                <div className="bg-green-100 text-green-600 rounded-full p-3 mr-4">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div>
                      <h3 className="font-medium">{t('Course Registration for Next Semester')}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {t('Registration period for the next semester begins')}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0 text-sm">
                      <span className="font-medium">November 15, 2023</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
