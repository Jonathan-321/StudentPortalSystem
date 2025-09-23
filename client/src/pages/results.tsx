import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth-supabase";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function Results() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedSemester, setSelectedSemester] = useState("Current");
  
  const { data: academics, isLoading: isLoadingAcademics } = useQuery({
    queryKey: ["/api/academics"],
    enabled: !!user,
  });

  if (!user) return null;

  // Sample GPA data for visualization
  const semesterGPA = [
    { name: 'Sem 1, Year 1', gpa: 3.7 },
    { name: 'Sem 2, Year 1', gpa: 3.8 },
    { name: 'Sem 1, Year 2', gpa: 3.6 },
    { name: 'Sem 2, Year 2', gpa: 3.9 },
    { name: 'Sem 1, Year 3', gpa: 3.8 },
  ];

  // Sample grade distribution for visualization
  const gradeDistribution = [
    { name: 'A', value: 7 },
    { name: 'B', value: 4 },
    { name: 'C', value: 2 },
    { name: 'D', value: 0 },
    { name: 'F', value: 0 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF0000'];

  return (
    <Layout title="Results & Transcripts">
      <div className="space-y-6">
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="current">{t('Current Results')}</TabsTrigger>
            <TabsTrigger value="transcript">{t('Full Transcript')}</TabsTrigger>
            <TabsTrigger value="analytics">{t('Performance Analytics')}</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>{t('Current Semester Results')}</CardTitle>
                    <CardDescription>
                      {t('Academic Year 2023-2024, Semester 1')}
                    </CardDescription>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{t('Semester GPA')}:</span>
                      <Badge className="bg-green-100 text-green-800">3.8/4.0</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingAcademics ? (
                  <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : academics?.length === 0 ? (
                  <Alert variant="default" className="bg-blue-50 text-blue-700 border-blue-200">
                    <AlertTitle>{t('No Results Available')}</AlertTitle>
                    <AlertDescription>
                      {t('Results for the current semester are not yet available')}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('Course Code')}</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('Course Name')}</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('Credits')}</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('Grade')}</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('Score')}</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('Status')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {academics?.slice(0, 5).map((academic, index) => (
                          <tr key={academic.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{academic.course?.code}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{academic.course?.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{academic.course?.credits}</td>
                            <td className="px-4 py-3 text-sm font-medium">
                              <Badge className={
                                !academic.grade ? "bg-gray-100 text-gray-500" :
                                academic.grade === "A" ? "bg-green-100 text-green-800" :
                                academic.grade === "B" ? "bg-blue-100 text-blue-800" :
                                academic.grade === "C" ? "bg-yellow-100 text-yellow-800" :
                                academic.grade === "D" ? "bg-orange-100 text-orange-800" :
                                "bg-red-100 text-red-800"
                              }>
                                {academic.grade || t('Pending')}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">{academic.score || '-'}/100</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                academic.status === 'completed' ? 'bg-green-100 text-green-800' :
                                academic.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {academic.status}
                              </span>
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

          <TabsContent value="transcript">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>{t('Academic Transcript')}</CardTitle>
                    <CardDescription>
                      {t('Complete record of your academic performance')}
                    </CardDescription>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col md:flex-row md:items-center gap-2">
                    <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t('Select Semester')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Current">{t('Current Semester')}</SelectItem>
                        <SelectItem value="2023-Sem1">{t('2023 - Semester 1')}</SelectItem>
                        <SelectItem value="2022-Sem2">{t('2022 - Semester 2')}</SelectItem>
                        <SelectItem value="2022-Sem1">{t('2022 - Semester 1')}</SelectItem>
                        <SelectItem value="All">{t('All Semesters')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <i className="fas fa-download mr-2"></i>
                      {t('Download PDF')}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">{t('Student Name')}</p>
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('Student ID')}</p>
                      <p className="font-medium">{user.studentId || '219002134'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('Cumulative GPA')}</p>
                      <p className="font-medium">3.78/4.0</p>
                    </div>
                  </div>
                </div>

                {isLoadingAcademics ? (
                  <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-bold mb-4">{t('Academic Year 2023-2024, Semester 1')}</h3>
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('Course Code')}</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('Course Name')}</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('Credits')}</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('Grade')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">CSC301</td>
                            <td className="px-4 py-3 text-sm text-gray-500">Data Structures and Algorithms</td>
                            <td className="px-4 py-3 text-sm text-gray-500">3</td>
                            <td className="px-4 py-3 text-sm">
                              <Badge className="bg-green-100 text-green-800">A</Badge>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">MTH241</td>
                            <td className="px-4 py-3 text-sm text-gray-500">Linear Algebra</td>
                            <td className="px-4 py-3 text-sm text-gray-500">3</td>
                            <td className="px-4 py-3 text-sm">
                              <Badge className="bg-green-100 text-green-800">A</Badge>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">CSC325</td>
                            <td className="px-4 py-3 text-sm text-gray-500">Database Systems</td>
                            <td className="px-4 py-3 text-sm text-gray-500">4</td>
                            <td className="px-4 py-3 text-sm">
                              <Badge className="bg-blue-100 text-blue-800">B+</Badge>
                            </td>
                          </tr>
                          <tr className="border-t-2 border-gray-200 font-medium">
                            <td className="px-4 py-3 text-sm"></td>
                            <td className="px-4 py-3 text-sm text-right">{t('Semester GPA')}:</td>
                            <td className="px-4 py-3 text-sm">10</td>
                            <td className="px-4 py-3 text-sm">3.8</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-4">{t('Academic Year 2022-2023, Semester 2')}</h3>
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('Course Code')}</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('Course Name')}</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('Credits')}</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('Grade')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">CSC215</td>
                            <td className="px-4 py-3 text-sm text-gray-500">Computer Organization</td>
                            <td className="px-4 py-3 text-sm text-gray-500">3</td>
                            <td className="px-4 py-3 text-sm">
                              <Badge className="bg-green-100 text-green-800">A-</Badge>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">CSC250</td>
                            <td className="px-4 py-3 text-sm text-gray-500">Discrete Mathematics</td>
                            <td className="px-4 py-3 text-sm text-gray-500">3</td>
                            <td className="px-4 py-3 text-sm">
                              <Badge className="bg-green-100 text-green-800">A</Badge>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">CSC260</td>
                            <td className="px-4 py-3 text-sm text-gray-500">Object-Oriented Programming</td>
                            <td className="px-4 py-3 text-sm text-gray-500">3</td>
                            <td className="px-4 py-3 text-sm">
                              <Badge className="bg-blue-100 text-blue-800">B+</Badge>
                            </td>
                          </tr>
                          <tr className="border-t-2 border-gray-200 font-medium">
                            <td className="px-4 py-3 text-sm"></td>
                            <td className="px-4 py-3 text-sm text-right">{t('Semester GPA')}:</td>
                            <td className="px-4 py-3 text-sm">9</td>
                            <td className="px-4 py-3 text-sm">3.9</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>{t('Performance Analytics')}</CardTitle>
                <CardDescription>
                  {t('Visual representation of your academic performance')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">{t('GPA Trend')}</CardTitle>
                    </CardHeader>
                    <CardContent className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={semesterGPA}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 4]} />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="gpa" 
                            stroke="#005A87" 
                            activeDot={{ r: 8 }} 
                            name={t('GPA')}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">{t('Grade Distribution')}</CardTitle>
                    </CardHeader>
                    <CardContent className="h-72 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={gradeDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {gradeDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">{t('Academic Standing')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                        <div className="flex items-start">
                          <div className="bg-green-100 p-3 rounded-full mr-4">
                            <i className="fas fa-award text-green-600"></i>
                          </div>
                          <div>
                            <h4 className="font-semibold text-green-800">{t('Dean\'s List')}</h4>
                            <p className="text-sm text-green-700 mt-1">
                              {t('Congratulations! You have been placed on the Dean\'s List for the previous semester for maintaining a GPA above 3.5.')}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-3xl font-bold text-primary-500">3.78</div>
                            <p className="text-sm text-gray-500">{t('Cumulative GPA')}</p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-3xl font-bold text-primary-500">43</div>
                            <p className="text-sm text-gray-500">{t('Credits Completed')}</p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-3xl font-bold text-primary-500">77%</div>
                            <p className="text-sm text-gray-500">{t('Program Completion')}</p>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
