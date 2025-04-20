import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useLocation } from "wouter";

export default function Academics() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [location] = useLocation();
  
  // Extract course ID if it exists in the URL
  const searchParams = new URLSearchParams(location.split("?")[1]);
  const courseId = searchParams.get("course") ? parseInt(searchParams.get("course")!) : null;
  
  const { data: enrollments, isLoading: isLoadingEnrollments } = useQuery({
    queryKey: ["/api/enrollments"],
    enabled: !!user,
  });

  const { data: academics, isLoading: isLoadingAcademics } = useQuery({
    queryKey: ["/api/academics"],
    enabled: !!user,
  });

  if (!user) return null;

  const isLoading = isLoadingEnrollments || isLoadingAcademics;

  // Filter to show specific course if courseId is provided
  const filteredEnrollments = courseId 
    ? enrollments?.filter(enrollment => enrollment.courseId === courseId)
    : enrollments;

  return (
    <Layout title="Academics">
      <div className="space-y-6">
        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="courses">{t('Current Courses')}</TabsTrigger>
            <TabsTrigger value="schedule">{t('Schedule')}</TabsTrigger>
            <TabsTrigger value="materials">{t('Course Materials')}</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>{t('Current Courses')}</CardTitle>
                <CardDescription>
                  {t('View and manage your current course enrollments')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredEnrollments?.length === 0 ? (
                  <Alert variant="default" className="bg-blue-50 text-blue-700 border-blue-200">
                    <AlertTitle>{t('No Courses Found')}</AlertTitle>
                    <AlertDescription>
                      {t('You are not currently enrolled in any courses')}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-6">
                    {filteredEnrollments?.map((enrollment) => (
                      <Card key={enrollment.id} className="overflow-hidden border-l-4 border-primary">
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-bold text-lg">{enrollment.course?.code}</h3>
                                <Badge variant="outline">{enrollment.course?.credits} credits</Badge>
                              </div>
                              <h4 className="font-semibold text-gray-800 mt-1">{enrollment.course?.name}</h4>
                              <p className="text-sm text-gray-600 mt-2">{enrollment.course?.description}</p>
                              
                              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded-md">
                                  <h5 className="font-medium text-gray-700 mb-2">{t('Instructor')}</h5>
                                  <div className="flex items-center">
                                    <i className="fas fa-user-tie mr-2 text-primary"></i>
                                    <span>{enrollment.course?.instructorName}</span>
                                  </div>
                                </div>
                                
                                <div className="bg-gray-50 p-3 rounded-md">
                                  <h5 className="font-medium text-gray-700 mb-2">{t('Schedule')}</h5>
                                  <div className="flex items-center">
                                    <i className="fas fa-calendar-alt mr-2 text-primary"></i>
                                    <span>{enrollment.course?.schedule}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4 md:mt-0 md:ml-4 md:text-right">
                              <Badge className="mb-2">
                                {enrollment.status === 'active' ? t('Active') : enrollment.status}
                              </Badge>
                              <p className="text-sm text-gray-600">
                                {t('Enrolled')}: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="mt-6">
                            <div className="text-xs text-gray-500 flex justify-between mb-1">
                              <span>{t('Progress')}</span>
                              <span>
                                {enrollment.currentWeek}/{enrollment.course?.totalWeeks} {t('Weeks')}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary-500 h-2 rounded-full" 
                                style={{ width: `${enrollment.progress}%` }}
                              ></div>
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

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>{t('Weekly Schedule')}</CardTitle>
                <CardDescription>
                  {t('Your weekly class schedule for all enrolled courses')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredEnrollments?.length === 0 ? (
                  <Alert variant="default" className="bg-blue-50 text-blue-700 border-blue-200">
                    <AlertTitle>{t('No Courses Found')}</AlertTitle>
                    <AlertDescription>
                      {t('You are not currently enrolled in any courses')}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="border p-2 bg-gray-50">{t('Time')}</th>
                          <th className="border p-2 bg-gray-50">{t('Monday')}</th>
                          <th className="border p-2 bg-gray-50">{t('Tuesday')}</th>
                          <th className="border p-2 bg-gray-50">{t('Wednesday')}</th>
                          <th className="border p-2 bg-gray-50">{t('Thursday')}</th>
                          <th className="border p-2 bg-gray-50">{t('Friday')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Sample schedule - this would be dynamically generated based on enrollments */}
                        <tr>
                          <td className="border p-2 font-medium">08:00 - 10:00</td>
                          <td className="border p-2"></td>
                          <td className="border p-2 bg-blue-50">
                            <div className="text-sm">
                              <p className="font-medium">MTH241</p>
                              <p className="text-xs text-gray-500">Linear Algebra</p>
                              <p className="text-xs text-gray-500">LT3</p>
                            </div>
                          </td>
                          <td className="border p-2"></td>
                          <td className="border p-2"></td>
                          <td className="border p-2 bg-blue-50">
                            <div className="text-sm">
                              <p className="font-medium">MTH241</p>
                              <p className="text-xs text-gray-500">Linear Algebra</p>
                              <p className="text-xs text-gray-500">LT3</p>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="border p-2 font-medium">10:30 - 12:00</td>
                          <td className="border p-2 bg-green-50">
                            <div className="text-sm">
                              <p className="font-medium">CSC301</p>
                              <p className="text-xs text-gray-500">Data Structures</p>
                              <p className="text-xs text-gray-500">LT5</p>
                            </div>
                          </td>
                          <td className="border p-2"></td>
                          <td className="border p-2 bg-green-50">
                            <div className="text-sm">
                              <p className="font-medium">CSC301</p>
                              <p className="text-xs text-gray-500">Data Structures</p>
                              <p className="text-xs text-gray-500">LT5</p>
                            </div>
                          </td>
                          <td className="border p-2"></td>
                          <td className="border p-2"></td>
                        </tr>
                        <tr>
                          <td className="border p-2 font-medium">14:00 - 17:00</td>
                          <td className="border p-2"></td>
                          <td className="border p-2"></td>
                          <td className="border p-2 bg-yellow-50">
                            <div className="text-sm">
                              <p className="font-medium">CSC315</p>
                              <p className="text-xs text-gray-500">Software Engineering</p>
                              <p className="text-xs text-gray-500">CS Lab 2</p>
                            </div>
                          </td>
                          <td className="border p-2 bg-purple-50">
                            <div className="text-sm">
                              <p className="font-medium">CSC325</p>
                              <p className="text-xs text-gray-500">Database Systems</p>
                              <p className="text-xs text-gray-500">CS Lab 3</p>
                            </div>
                          </td>
                          <td className="border p-2"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials">
            <Card>
              <CardHeader>
                <CardTitle>{t('Course Materials')}</CardTitle>
                <CardDescription>
                  {t('Access lecture notes, assignments, and resources for your courses')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredEnrollments?.length === 0 ? (
                  <Alert variant="default" className="bg-blue-50 text-blue-700 border-blue-200">
                    <AlertTitle>{t('No Courses Found')}</AlertTitle>
                    <AlertDescription>
                      {t('You are not currently enrolled in any courses')}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-8">
                    {filteredEnrollments?.map((enrollment) => (
                      <div key={enrollment.id} className="border-b pb-6 last:border-0 last:pb-0">
                        <h3 className="text-lg font-bold text-primary-500 mb-4">
                          {enrollment.course?.code}: {enrollment.course?.name}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">{t('Lecture Materials')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                <li className="flex items-center">
                                  <i className="fas fa-file-pdf text-red-500 mr-2"></i>
                                  <a href="#" className="text-sm hover:underline">Lecture 1 - Introduction.pdf</a>
                                </li>
                                <li className="flex items-center">
                                  <i className="fas fa-file-pdf text-red-500 mr-2"></i>
                                  <a href="#" className="text-sm hover:underline">Lecture 2 - Basic Concepts.pdf</a>
                                </li>
                                <li className="flex items-center">
                                  <i className="fas fa-file-powerpoint text-orange-500 mr-2"></i>
                                  <a href="#" className="text-sm hover:underline">Week 1 Slides.pptx</a>
                                </li>
                              </ul>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">{t('Assignments & Projects')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                <li className="flex items-center">
                                  <i className="fas fa-file-alt text-blue-500 mr-2"></i>
                                  <a href="#" className="text-sm hover:underline">Assignment 1 - Due Oct 15.docx</a>
                                </li>
                                <li className="flex items-center">
                                  <i className="fas fa-file-alt text-blue-500 mr-2"></i>
                                  <a href="#" className="text-sm hover:underline">Assignment 2 Guidelines.docx</a>
                                </li>
                                <li className="flex items-center">
                                  <i className="fas fa-file-code text-green-500 mr-2"></i>
                                  <a href="#" className="text-sm hover:underline">Project Template.zip</a>
                                </li>
                              </ul>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
