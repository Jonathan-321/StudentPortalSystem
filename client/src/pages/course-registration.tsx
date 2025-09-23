import { useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth-supabase";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function CourseRegistration() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [registrationSuccess, setRegistrationSuccess] = useState<string | null>(null);
  
  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["/api/courses"],
    enabled: !!user,
  });

  const { data: enrollments, isLoading: isLoadingEnrollments } = useQuery({
    queryKey: ["/api/enrollments"],
    enabled: !!user,
  });

  const enrollMutation = useMutation({
    mutationFn: async (courseId: number) => {
      const res = await apiRequest("POST", "/api/enrollments", { courseId });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/enrollments"] });
      setRegistrationSuccess("You have successfully registered for this course");
      setTimeout(() => setRegistrationSuccess(null), 3000);
    },
  });

  if (!user) return null;

  const isEnrolled = (courseId: number) => {
    return enrollments?.some(enrollment => enrollment.courseId === courseId);
  };

  const registeredCourses = courses?.filter(course => 
    enrollments?.some(enrollment => enrollment.courseId === course.id)
  );

  const availableCourses = courses?.filter(course => 
    !enrollments?.some(enrollment => enrollment.courseId === course.id)
  );

  return (
    <Layout title="Course Registration">
      {registrationSuccess && (
        <Alert className="mb-4 bg-green-50 border-green-500">
          <Check className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700">Success</AlertTitle>
          <AlertDescription className="text-green-600">
            {registrationSuccess}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="available">{t('Available Courses')}</TabsTrigger>
            <TabsTrigger value="registered">{t('Registered Courses')}</TabsTrigger>
          </TabsList>

          <TabsContent value="available">
            <Card>
              <CardHeader>
                <CardTitle>{t('Available Courses')}</CardTitle>
                <CardDescription>
                  {t('Browse and register for courses that are available this semester')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingCourses || isLoadingEnrollments ? (
                  <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : availableCourses?.length === 0 ? (
                  <Alert variant="default" className="bg-blue-50 text-blue-700 border-blue-200">
                    <AlertCircle className="h-4 w-4 text-blue-700" />
                    <AlertTitle>{t('No Available Courses')}</AlertTitle>
                    <AlertDescription>
                      {t('You have already registered for all available courses this semester')}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    {availableCourses?.map((course) => (
                      <Card key={course.id} className="overflow-hidden">
                        <div className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-bold text-lg">{course.code}</h3>
                                <Badge variant="outline">{course.credits} credits</Badge>
                              </div>
                              <h4 className="font-semibold text-gray-800 mt-1">{course.name}</h4>
                              <p className="text-sm text-gray-600 mt-2">{course.description}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              className="ml-4"
                              onClick={() => enrollMutation.mutate(course.id)}
                              disabled={enrollMutation.isPending || isEnrolled(course.id)}
                            >
                              {enrollMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : null}
                              {t('Register')}
                            </Button>
                          </div>
                          <div className="mt-4 text-sm text-gray-500">
                            <div className="flex flex-col md:flex-row md:space-x-6">
                              <div className="flex items-center mb-2 md:mb-0">
                                <i className="fas fa-user-tie mr-2"></i>
                                <span>{course.instructorName}</span>
                              </div>
                              <div className="flex items-center">
                                <i className="fas fa-calendar-alt mr-2"></i>
                                <span>{course.schedule}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="registered">
            <Card>
              <CardHeader>
                <CardTitle>{t('Registered Courses')}</CardTitle>
                <CardDescription>
                  {t('Courses you are currently registered for this semester')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingCourses || isLoadingEnrollments ? (
                  <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : registeredCourses?.length === 0 ? (
                  <Alert variant="default" className="bg-blue-50 text-blue-700 border-blue-200">
                    <AlertCircle className="h-4 w-4 text-blue-700" />
                    <AlertTitle>{t('No Registered Courses')}</AlertTitle>
                    <AlertDescription>
                      {t('You have not registered for any courses yet')}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    {registeredCourses?.map((course) => (
                      <Card key={course.id} className="overflow-hidden">
                        <div className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-bold text-lg">{course.code}</h3>
                                <Badge variant="outline">{course.credits} credits</Badge>
                              </div>
                              <h4 className="font-semibold text-gray-800 mt-1">{course.name}</h4>
                              <p className="text-sm text-gray-600 mt-2">{course.description}</p>
                            </div>
                            <Badge className="bg-green-500 text-white">{t('Registered')}</Badge>
                          </div>
                          <div className="mt-4 text-sm text-gray-500">
                            <div className="flex flex-col md:flex-row md:space-x-6">
                              <div className="flex items-center mb-2 md:mb-0">
                                <i className="fas fa-user-tie mr-2"></i>
                                <span>{course.instructorName}</span>
                              </div>
                              <div className="flex items-center">
                                <i className="fas fa-calendar-alt mr-2"></i>
                                <span>{course.schedule}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="text-xs text-gray-500 flex justify-between mb-1">
                              <span>{t('Progress')}</span>
                              <span>
                                {enrollments?.find(e => e.courseId === course.id)?.currentWeek}/
                                {course.totalWeeks} {t('Weeks')}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary-500 h-2 rounded-full" 
                                style={{ 
                                  width: `${enrollments?.find(e => e.courseId === course.id)?.progress || 0}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-6">
                <div className="flex items-center text-sm text-gray-500">
                  <i className="fas fa-info-circle mr-2 text-primary"></i>
                  <span>
                    {t('You are registered for')} <strong>{registeredCourses?.length || 0}</strong> {t('courses with a total of')} 
                    <strong> {registeredCourses?.reduce((sum, course) => sum + course.credits, 0) || 0}</strong> {t('credits')}
                  </span>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>{t('Registration Guidelines')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc pl-5">
              <li>{t('Students must register for a minimum of 15 credits per semester')}</li>
              <li>{t('Maximum course load is 21 credits per semester')}</li>
              <li>{t('Registration period ends on October 30, 2023')}</li>
              <li>{t('Course withdrawals are permitted until November 15, 2023')}</li>
              <li>{t('For special permission to exceed the maximum credit limit, please contact the Academic Office')}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
