import { useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Download, GraduationCap, Loader2, Plus, TrendingUp } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useLocation } from "wouter";
import { queryClient } from "../lib/queryClient";
import { apiRequest } from "../lib/queryClient";
import type { Academic, Course } from "@shared/schema";

export default function Academics() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [location] = useLocation();
  const { toast } = useToast();
  const [enrollOpen, setEnrollOpen] = useState(false);
  
  // Extract course ID if it exists in the URL
  const searchParams = new URLSearchParams(location.split("?")[1]);
  const courseId = searchParams.get("course") ? parseInt(searchParams.get("course")!) : null;
  
  const { data: enrollments, isLoading: isLoadingEnrollments } = useQuery({
    queryKey: ["/api/enrollments"],
    enabled: !!user,
  });

  const { data: academics = [], isLoading: isLoadingAcademics } = useQuery<(Academic & { course: Course })[]>({
    queryKey: ["/api/academics"],
    enabled: !!user,
  });

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
    enabled: !!user,
  });

  const enrollMutation = useMutation({
    mutationFn: async (data: { courseId: number; semester: string; academicYear: string }) => {
      const res = await apiRequest("POST", "/api/enrollments", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/academics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/enrollments"] });
      setEnrollOpen(false);
      toast({
        title: t("Success"),
        description: t("Successfully enrolled in course"),
      });
    },
    onError: () => {
      toast({
        title: t("Error"),
        description: t("Failed to enroll in course"),
        variant: "destructive",
      });
    },
  });

  if (!user) return null;

  const isLoading = isLoadingEnrollments || isLoadingAcademics;

  // Filter to show specific course if courseId is provided
  const filteredEnrollments = courseId 
    ? enrollments?.filter(enrollment => enrollment.courseId === courseId)
    : enrollments;

  const filteredAcademics = courseId
    ? academics.filter(academic => academic.courseId === courseId)
    : academics;

  const calculateGPA = () => {
    const graded = academics.filter((a) => a.score);
    if (graded.length === 0) return "N/A";
    
    const totalPoints = graded.reduce((sum, a) => {
      const gradePoint = getGradePoint(a.score || 0);
      return sum + gradePoint * (a.course?.credits || 0);
    }, 0);
    
    const totalCredits = graded.reduce((sum, a) => sum + (a.course?.credits || 0), 0);
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "N/A";
  };

  const getGradePoint = (score: number) => {
    if (score >= 80) return 4.0;
    if (score >= 70) return 3.0;
    if (score >= 60) return 2.0;
    if (score >= 50) return 1.0;
    return 0.0;
  };

  const getGradeLetter = (score?: number | null) => {
    if (!score) return "-";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    return "F";
  };

  const availableCourses = courses.filter(
    (course) => !academics.some((a) => a.courseId === course.id)
  );

  return (
    <Layout title="Academics">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            <h2 className="text-2xl font-bold">{t("Academic Records")}</h2>
          </div>
          <Dialog open={enrollOpen} onOpenChange={setEnrollOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t("Enroll in Course")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("Enroll in a New Course")}</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  enrollMutation.mutate({
                    courseId: parseInt(formData.get("courseId") as string),
                    semester: formData.get("semester") as string,
                    academicYear: formData.get("academicYear") as string,
                  });
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="courseId">{t("Course")}</Label>
                  <Select name="courseId" required>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select a course")} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCourses.map((course) => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.code} - {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="semester">{t("Semester")}</Label>
                  <Input
                    name="semester"
                    defaultValue="Fall 2023"
                    placeholder="e.g., Fall 2023"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="academicYear">{t("Academic Year")}</Label>
                  <Input
                    name="academicYear"
                    defaultValue="2023-2024"
                    placeholder="e.g., 2023-2024"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={enrollMutation.isPending}>
                  {enrollMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {t("Enroll")}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("Current GPA")}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculateGPA()}</div>
              <p className="text-xs text-muted-foreground">{t("Out of 4.0")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("Enrolled Courses")}</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {academics.filter((a) => a.status === "in-progress").length}
              </div>
              <p className="text-xs text-muted-foreground">{t("Active courses")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("Completed")}</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {academics.filter((a) => a.status === "completed").length}
              </div>
              <p className="text-xs text-muted-foreground">{t("Courses completed")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("Total Credits")}</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {academics.reduce((sum, a) => sum + (a.course?.credits || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">{t("Credits earned")}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="records" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="records">{t('Academic Records')}</TabsTrigger>
            <TabsTrigger value="courses">{t('Current Courses')}</TabsTrigger>
            <TabsTrigger value="schedule">{t('Schedule')}</TabsTrigger>
            <TabsTrigger value="materials">{t('Course Materials')}</TabsTrigger>
          </TabsList>

          <TabsContent value="records">
            <Card>
              <CardHeader>
                <CardTitle>{t('Academic Records')}</CardTitle>
                <CardDescription>
                  {t('Your complete academic history and current enrollments')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredAcademics.length === 0 ? (
                  <Alert variant="default" className="bg-blue-50 text-blue-700 border-blue-200">
                    <AlertTitle>{t('No Academic Records')}</AlertTitle>
                    <AlertDescription>
                      {t('No academic records yet. Enroll in a course to get started.')}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">{t('Course')}</th>
                          <th className="text-left p-2">{t('Semester')}</th>
                          <th className="text-center p-2">{t('Credits')}</th>
                          <th className="text-center p-2">{t('Score')}</th>
                          <th className="text-center p-2">{t('Grade')}</th>
                          <th className="text-center p-2">{t('Status')}</th>
                          <th className="text-center p-2">{t('Grade Point')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAcademics.map((record) => (
                          <tr key={record.id} className="border-b hover:bg-muted/50">
                            <td className="p-2">
                              <div>
                                <div className="font-medium">
                                  {record.course?.code} - {record.course?.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {record.course?.instructorName}
                                </div>
                              </div>
                            </td>
                            <td className="p-2">
                              <div className="text-sm">{record.semester}</div>
                              <div className="text-xs text-muted-foreground">
                                {record.academicYear}
                              </div>
                            </td>
                            <td className="text-center p-2">{record.course?.credits}</td>
                            <td className="text-center p-2">{record.score || "-"}</td>
                            <td className="text-center p-2">
                              <Badge
                                variant={
                                  record.score && record.score >= 50 ? "default" : "secondary"
                                }
                              >
                                {getGradeLetter(record.score)}
                              </Badge>
                            </td>
                            <td className="text-center p-2">
                              <Badge
                                variant={
                                  record.status === "completed"
                                    ? "default"
                                    : record.status === "in-progress"
                                    ? "outline"
                                    : "secondary"
                                }
                              >
                                {t(record.status || 'in-progress')}
                              </Badge>
                            </td>
                            <td className="text-center p-2">
                              {record.score ? getGradePoint(record.score).toFixed(1) : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

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
                    {filteredEnrollments?.map((enrollment: any) => (
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
                                {enrollment.currentWeek || 0}/{enrollment.course?.totalWeeks || 15} {t('Weeks')}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary-500 h-2 rounded-full" 
                                style={{ width: `${enrollment.progress || 0}%` }}
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
                    {filteredEnrollments?.map((enrollment: any) => (
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

        {/* Transcript Actions */}
        <div className="flex gap-4">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t("Download Transcript")}
          </Button>
          <Button variant="outline">
            {t("Request Official Transcript")}
          </Button>
        </div>
      </div>
    </Layout>
  );
}