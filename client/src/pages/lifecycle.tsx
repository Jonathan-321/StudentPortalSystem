import { useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  AcademicCap, 
  Award, 
  BookOpen, 
  Calendar, 
  Check, 
  CheckCircle, 
  ClipboardList, 
  Download, 
  FileText, 
  GraduationCap, 
  History, 
  Info, 
  Layers, 
  Loader2, 
  Lock, 
  School, 
  User 
} from "lucide-react";
import { format } from "date-fns";

// Define the lifecycle stages
const lifecycleStages = [
  {
    id: "application",
    name: "Application",
    icon: <FileText className="h-5 w-5" />,
    description: "Initial application to the university"
  },
  {
    id: "admission",
    name: "Admission",
    icon: <ClipboardList className="h-5 w-5" />,
    description: "Official acceptance to the university"
  },
  {
    id: "enrollment",
    name: "Enrollment",
    icon: <BookOpen className="h-5 w-5" />,
    description: "Course registration and program enrollment"
  },
  {
    id: "academic_progress",
    name: "Academic Progress",
    icon: <Layers className="h-5 w-5" />,
    description: "Tracking your academic journey"
  },
  {
    id: "graduation",
    name: "Graduation",
    icon: <GraduationCap className="h-5 w-5" />,
    description: "Completion of your academic program"
  }
];

// Example data for a student's lifecycle
const studentLifecycle = {
  currentStage: "academic_progress",
  stages: {
    application: {
      status: "completed",
      completedAt: "2022-08-15",
      details: {
        applicationNumber: "APP-2022-7591",
        submittedAt: "2022-07-10",
        program: "Computer Science BSc",
        documents: [
          { name: "Academic Transcripts", status: "verified" },
          { name: "Recommendation Letters", status: "verified" },
          { name: "Personal Statement", status: "verified" },
          { name: "Identity Documents", status: "verified" }
        ]
      }
    },
    admission: {
      status: "completed",
      completedAt: "2022-09-01",
      details: {
        admissionNumber: "ADM-2022-3845",
        admissionDate: "2022-09-01",
        program: "Computer Science BSc",
        conditions: [
          { description: "Submit original academic certificates", status: "completed" },
          { description: "Pay admission fee", status: "completed" }
        ]
      }
    },
    enrollment: {
      status: "completed",
      completedAt: "2022-09-15",
      details: {
        studentId: "219002134",
        enrollmentDate: "2022-09-15",
        program: "Computer Science BSc",
        academicLevel: "Year 1",
        registeredCourses: [
          { code: "CSC101", name: "Introduction to Computer Science", credits: 3 },
          { code: "MTH101", name: "Calculus I", credits: 4 },
          { code: "PHY101", name: "Physics I", credits: 4 },
          { code: "ENG101", name: "English Composition", credits: 3 },
          { code: "CSC102", name: "Programming Fundamentals", credits: 3 }
        ]
      }
    },
    academic_progress: {
      status: "in_progress",
      details: {
        currentLevel: "Year 2",
        gpa: 3.7,
        creditsCompleted: 32,
        creditsRequired: 120,
        currentSemester: "Semester 1",
        currentCourses: [
          { code: "CSC201", name: "Data Structures", credits: 3, grade: null },
          { code: "MTH201", name: "Linear Algebra", credits: 3, grade: null },
          { code: "CSC203", name: "Computer Architecture", credits: 3, grade: null },
          { code: "PHY201", name: "Electronics", credits: 3, grade: null }
        ],
        completedCourses: [
          { code: "CSC101", name: "Introduction to Computer Science", credits: 3, grade: "A" },
          { code: "MTH101", name: "Calculus I", credits: 4, grade: "A-" },
          { code: "PHY101", name: "Physics I", credits: 4, grade: "B+" },
          { code: "ENG101", name: "English Composition", credits: 3, grade: "A" },
          { code: "CSC102", name: "Programming Fundamentals", credits: 3, grade: "A" },
          { code: "MTH102", name: "Calculus II", credits: 4, grade: "B+" },
          { code: "PHY102", name: "Physics II", credits: 4, grade: "B" },
          { code: "CSC103", name: "Discrete Mathematics", credits: 3, grade: "A-" },
          { code: "CSC104", name: "Object-Oriented Programming", credits: 3, grade: "A" }
        ],
        academicStanding: "Good Standing"
      }
    },
    graduation: {
      status: "pending",
      details: {
        expectedGraduationDate: "2026-06-30",
        remainingCredits: 88,
        remainingRequirements: [
          { description: "Complete all required courses", status: "in_progress" },
          { description: "Complete final year project", status: "not_started" },
          { description: "Achieve minimum CGPA of 2.0", status: "in_progress" },
          { description: "Clear all financial obligations", status: "in_progress" }
        ]
      }
    }
  }
};

export default function LifecyclePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeStage, setActiveStage] = useState(studentLifecycle.currentStage);
  
  if (!user) return null;
  
  // Calculate overall progress percentage
  const totalStages = lifecycleStages.length;
  const completedStages = Object.values(studentLifecycle.stages).filter(
    stage => stage.status === "completed"
  ).length;
  const progressPercentage = Math.round((completedStages / totalStages) * 100);
  
  // Get the current stage data
  const currentStageData = studentLifecycle.stages[activeStage as keyof typeof studentLifecycle.stages];
  
  return (
    <Layout title="Student Lifecycle">
      <div className="space-y-6">
        {/* Overall Progress Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>{t('Student Lifecycle')}</CardTitle>
              <CardDescription>
                {t('Track your academic journey from application to graduation')}
              </CardDescription>
            </div>
            <GraduationCap className="h-8 w-8 text-primary opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">{t('Overall Progress')}</span>
              <span className="text-sm font-medium">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2 w-full" />
            
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-3">{t('Current Status')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                {lifecycleStages.map((stage) => {
                  const stageData = studentLifecycle.stages[stage.id as keyof typeof studentLifecycle.stages];
                  const isCurrentStage = studentLifecycle.currentStage === stage.id;
                  
                  let statusColor = "bg-gray-100 text-gray-800"; // default - not started
                  if (stageData.status === "completed") {
                    statusColor = "bg-green-100 text-green-800";
                  } else if (stageData.status === "in_progress") {
                    statusColor = "bg-blue-100 text-blue-800";
                  } else if (stageData.status === "pending") {
                    statusColor = "bg-orange-100 text-orange-800";
                  }
                  
                  return (
                    <button
                      key={stage.id}
                      className={`flex flex-col items-center p-4 rounded-lg border transition-all
                        ${activeStage === stage.id ? "border-primary ring-1 ring-primary" : "border-gray-200 hover:border-gray-300"}
                        ${stageData.status === "pending" ? "opacity-70" : ""}
                      `}
                      onClick={() => setActiveStage(stage.id)}
                    >
                      <div className={`p-2 rounded-full mb-2 ${isCurrentStage ? "bg-primary-100 text-primary-600" : "bg-gray-100"}`}>
                        {stage.icon}
                      </div>
                      <span className="text-sm font-medium text-center">{t(stage.name)}</span>
                      <Badge className={`mt-2 ${statusColor}`} variant="outline">
                        {stageData.status === "completed" && t('Completed')}
                        {stageData.status === "in_progress" && t('In Progress')}
                        {stageData.status === "pending" && t('Pending')}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Stage Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t(lifecycleStages.find(stage => stage.id === activeStage)?.name || '')}
            </CardTitle>
            <CardDescription>
              {t(lifecycleStages.find(stage => stage.id === activeStage)?.description || '')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeStage === "application" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('Application Number')}</h3>
                    <p className="font-medium">{currentStageData.details.applicationNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('Submitted Date')}</h3>
                    <p className="font-medium">{format(new Date(currentStageData.details.submittedAt), 'PP')}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('Application Status')}</h3>
                    <p className="font-medium text-green-600 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {t('Approved on')} {format(new Date(currentStageData.completedAt), 'PP')}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('Program Applied')}</h3>
                    <p className="font-medium">{currentStageData.details.program}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-3">{t('Submitted Documents')}</h3>
                  <div className="border rounded-lg divide-y">
                    {currentStageData.details.documents.map((doc, index) => (
                      <div key={index} className="p-3 flex items-center justify-between">
                        <span>{doc.name}</span>
                        <Badge className="bg-green-100 text-green-800" variant="outline">
                          <Check className="h-3 w-3 mr-1" />
                          {t('Verified')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    {t('Download Application')}
                  </Button>
                </div>
              </div>
            )}
            
            {activeStage === "admission" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('Admission Number')}</h3>
                    <p className="font-medium">{currentStageData.details.admissionNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('Admission Date')}</h3>
                    <p className="font-medium">{format(new Date(currentStageData.details.admissionDate), 'PP')}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('Admission Status')}</h3>
                    <p className="font-medium text-green-600 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {t('Completed on')} {format(new Date(currentStageData.completedAt), 'PP')}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('Program Admitted')}</h3>
                    <p className="font-medium">{currentStageData.details.program}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-3">{t('Admission Conditions')}</h3>
                  <div className="border rounded-lg divide-y">
                    {currentStageData.details.conditions.map((condition, index) => (
                      <div key={index} className="p-3 flex items-center justify-between">
                        <span>{condition.description}</span>
                        <Badge className="bg-green-100 text-green-800" variant="outline">
                          <Check className="h-3 w-3 mr-1" />
                          {t('Completed')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    {t('Download Admission Letter')}
                  </Button>
                </div>
              </div>
            )}
            
            {activeStage === "enrollment" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('Student ID')}</h3>
                    <p className="font-medium">{currentStageData.details.studentId}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('Enrollment Date')}</h3>
                    <p className="font-medium">{format(new Date(currentStageData.details.enrollmentDate), 'PP')}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('Program')}</h3>
                    <p className="font-medium">{currentStageData.details.program}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('Academic Level')}</h3>
                    <p className="font-medium">{currentStageData.details.academicLevel}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-3">{t('Initial Course Registration')}</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('Code')}
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('Course Name')}
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('Credits')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentStageData.details.registeredCourses.map((course, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                              {course.code}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              {course.name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              {course.credits}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    {t('Download Enrollment Certificate')}
                  </Button>
                </div>
              </div>
            )}
            
            {activeStage === "academic_progress" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-blue-100">
                    <h3 className="text-sm font-medium text-gray-500">{t('Current Level')}</h3>
                    <p className="text-xl font-bold text-blue-700">{currentStageData.details.currentLevel}</p>
                  </div>
                  <div className="border rounded-lg p-4 bg-gradient-to-br from-green-50 to-green-100">
                    <h3 className="text-sm font-medium text-gray-500">{t('Current GPA')}</h3>
                    <p className="text-xl font-bold text-green-700">{currentStageData.details.gpa}</p>
                  </div>
                  <div className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-purple-100">
                    <h3 className="text-sm font-medium text-gray-500">{t('Credits Completed')}</h3>
                    <p className="text-xl font-bold text-purple-700">
                      {currentStageData.details.creditsCompleted}/{currentStageData.details.creditsRequired}
                    </p>
                  </div>
                  <div className="border rounded-lg p-4 bg-gradient-to-br from-orange-50 to-orange-100">
                    <h3 className="text-sm font-medium text-gray-500">{t('Academic Standing')}</h3>
                    <p className="text-xl font-bold text-orange-700">{currentStageData.details.academicStanding}</p>
                  </div>
                </div>
                
                <Tabs defaultValue="current_semester" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="current_semester">{t('Current Semester')}</TabsTrigger>
                    <TabsTrigger value="academic_history">{t('Academic History')}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="current_semester">
                    <Card>
                      <CardHeader>
                        <CardTitle>{currentStageData.details.currentSemester}</CardTitle>
                        <CardDescription>{t('Your current courses and performance')}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="border rounded-lg overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Code')}</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Course Name')}</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Credits')}</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Status')}</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {currentStageData.details.currentCourses.map((course, index) => (
                                <tr key={index}>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{course.code}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm">{course.name}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm">{course.credits}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                                    <Badge className="bg-blue-100 text-blue-800" variant="outline">{t('In Progress')}</Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="academic_history">
                    <Card>
                      <CardHeader>
                        <CardTitle>{t('Completed Courses')}</CardTitle>
                        <CardDescription>{t('Your academic history and achievements')}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="border rounded-lg overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Code')}</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Course Name')}</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Credits')}</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Grade')}</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {currentStageData.details.completedCourses.map((course, index) => (
                                <tr key={index}>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{course.code}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm">{course.name}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm">{course.credits}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                    <span className={`${
                                      course.grade === 'A' || course.grade === 'A-' ? 'text-green-600' : 
                                      course.grade === 'B+' || course.grade === 'B' ? 'text-blue-600' :
                                      'text-gray-500'
                                    }`}>
                                      {course.grade}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button variant="outline" className="flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          {t('Download Transcript')}
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
            
            {activeStage === "graduation" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('Expected Graduation Date')}</h3>
                    <p className="font-medium">{format(new Date(currentStageData.details.expectedGraduationDate), 'PP')}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('Graduation Status')}</h3>
                    <p className="font-medium text-orange-600 flex items-center">
                      <Info className="h-4 w-4 mr-1" />
                      {t('Pending - Complete required courses')}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('Remaining Credits')}</h3>
                    <p className="font-medium">{currentStageData.details.remainingCredits} {t('credits')}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('Progress')}</h3>
                    <div className="mt-1 flex items-center">
                      <Progress value={27} className="h-2 w-full mr-3" />
                      <span className="text-sm font-medium">27%</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-3">{t('Graduation Requirements')}</h3>
                  <div className="border rounded-lg divide-y">
                    {currentStageData.details.remainingRequirements.map((requirement, index) => {
                      let badgeClass = "bg-gray-100 text-gray-800";
                      let statusText = t('Not Started');
                      let icon = <Lock className="h-3 w-3 mr-1" />;
                      
                      if (requirement.status === "completed") {
                        badgeClass = "bg-green-100 text-green-800";
                        statusText = t('Completed');
                        icon = <Check className="h-3 w-3 mr-1" />;
                      } else if (requirement.status === "in_progress") {
                        badgeClass = "bg-blue-100 text-blue-800";
                        statusText = t('In Progress');
                        icon = <Loader2 className="h-3 w-3 mr-1 animate-spin" />;
                      }
                      
                      return (
                        <div key={index} className="p-3 flex items-center justify-between">
                          <span>{requirement.description}</span>
                          <Badge className={badgeClass} variant="outline">
                            {icon}
                            {statusText}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg bg-amber-50 mt-6">
                  <div className="flex items-start">
                    <School className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-amber-800">{t('Graduation Eligibility')}</h3>
                      <p className="text-sm text-amber-700 mt-1">
                        {t('You are on track to graduate in June 2026. Continue to maintain good academic standing and complete all program requirements to graduate on time.')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}