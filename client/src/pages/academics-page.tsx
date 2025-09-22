import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, getQueryFn } from "../lib/queryClient";
import { Navbar } from "../components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Download, GraduationCap, Plus, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import type { Academic, Course } from "@shared/schema";

export function AcademicsPage() {
  const { toast } = useToast();
  const [enrollOpen, setEnrollOpen] = useState(false);

  const { data: academics = [], isLoading: academicsLoading } = useQuery<(Academic & { course: Course })[]>({
    queryKey: ["/api/academics"],
    queryFn: getQueryFn(),
  });

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
    queryFn: getQueryFn(),
  });

  const enrollMutation = useMutation({
    mutationFn: async (data: { courseId: number; semester: string; academicYear: string }) => {
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to enroll");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/academics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/enrollments"] });
      setEnrollOpen(false);
      toast({
        title: "Success",
        description: "Successfully enrolled in course",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to enroll in course",
        variant: "destructive",
      });
    },
  });

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

  if (academicsLoading) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg">Loading academic records...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <GraduationCap className="h-8 w-8" />
            Academic Records
          </h1>
          <Dialog open={enrollOpen} onOpenChange={setEnrollOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Enroll in Course
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enroll in a New Course</DialogTitle>
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
                  <Label htmlFor="courseId">Course</Label>
                  <Select name="courseId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
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
                  <Label htmlFor="semester">Semester</Label>
                  <Input
                    name="semester"
                    defaultValue="Fall 2023"
                    placeholder="e.g., Fall 2023"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Input
                    name="academicYear"
                    defaultValue="2023-2024"
                    placeholder="e.g., 2023-2024"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Enroll
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculateGPA()}</div>
              <p className="text-xs text-muted-foreground">Out of 4.0</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {academics.filter((a) => a.status === "in-progress").length}
              </div>
              <p className="text-xs text-muted-foreground">Active courses</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {academics.filter((a) => a.status === "completed").length}
              </div>
              <p className="text-xs text-muted-foreground">Courses completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {academics.reduce((sum, a) => sum + (a.course?.credits || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">Credits earned</p>
            </CardContent>
          </Card>
        </div>

        {/* Academic Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Records</CardTitle>
            <CardDescription>
              Your complete academic history and current enrollments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {academics.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No academic records yet. Enroll in a course to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Course</th>
                      <th className="text-left p-2">Semester</th>
                      <th className="text-center p-2">Credits</th>
                      <th className="text-center p-2">Score</th>
                      <th className="text-center p-2">Grade</th>
                      <th className="text-center p-2">Status</th>
                      <th className="text-center p-2">Grade Point</th>
                    </tr>
                  </thead>
                  <tbody>
                    {academics.map((record) => (
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
                            {record.status}
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

        {/* Transcript Actions */}
        <div className="mt-6 flex gap-4">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Transcript
          </Button>
          <Button variant="outline">
            Request Official Transcript
          </Button>
        </div>
      </div>
    </div>
  );
}