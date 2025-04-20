import { useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Resources() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  if (!user) return null;

  // Filter resources based on search query
  const filterResources = (resources: any[]) => {
    if (!searchQuery.trim()) return resources;
    
    const query = searchQuery.toLowerCase();
    return resources.filter(resource => 
      resource.title.toLowerCase().includes(query) || 
      resource.description.toLowerCase().includes(query)
    );
  };

  // Sample resources data
  const libraryResources = [
    {
      id: 1,
      title: "Introduction to Algorithms",
      author: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
      type: "Textbook",
      description: "Comprehensive introduction to algorithms for undergraduate and graduate students",
      availability: "Available",
      location: "Main Library, Section CS-101"
    },
    {
      id: 2,
      title: "Database System Concepts",
      author: "Abraham Silberschatz, Henry F. Korth, S. Sudarshan",
      type: "Textbook",
      description: "Covers database system concepts and techniques",
      availability: "Available",
      location: "Main Library, Section CS-305"
    },
    {
      id: 3,
      title: "ACM Journal of Computing",
      author: "Association for Computing Machinery",
      type: "Journal",
      description: "Academic journal covering computer science research",
      availability: "Available Online",
      location: "Digital Library"
    },
    {
      id: 4,
      title: "Software Engineering: Principles and Practice",
      author: "Hans van Vliet",
      type: "Textbook",
      description: "Covers software engineering techniques and methodologies",
      availability: "Checked Out (Due: Oct 29, 2023)",
      location: "Main Library, Section SE-201"
    }
  ];

  const digitalResources = [
    {
      id: 1,
      title: "IEEE Xplore Digital Library",
      description: "Access to IEEE journals, conference proceedings, and standards",
      type: "Research Database",
      url: "https://ieeexplore.ieee.org"
    },
    {
      id: 2,
      title: "ACM Digital Library",
      description: "Publications from the Association for Computing Machinery",
      type: "Research Database",
      url: "https://dl.acm.org"
    },
    {
      id: 3,
      title: "ScienceDirect",
      description: "Scientific, technical, and medical research platform with journals and books",
      type: "Research Database",
      url: "https://www.sciencedirect.com"
    },
    {
      id: 4,
      title: "JSTOR",
      description: "Digital library of academic journals, books, and primary sources",
      type: "Research Database",
      url: "https://www.jstor.org"
    },
    {
      id: 5,
      title: "MIT OpenCourseWare",
      description: "Free web-based publication of MIT course content",
      type: "Educational Resource",
      url: "https://ocw.mit.edu"
    }
  ];

  const learningMaterials = [
    {
      id: 1,
      title: "Data Structures and Algorithms - Course Materials",
      description: "Lecture notes, assignments, and supplementary materials for CSC301",
      type: "Course Material",
      format: "PDF, PPT"
    },
    {
      id: 2,
      title: "Linear Algebra Course Pack",
      description: "Comprehensive course materials for MTH241 including practice problems",
      type: "Course Material",
      format: "PDF"
    },
    {
      id: 3,
      title: "Database Systems Laboratory Manuals",
      description: "Lab guides and practical exercises for CSC325",
      type: "Laboratory Guide",
      format: "PDF, ZIP"
    },
    {
      id: 4,
      title: "Programming Practice Problems",
      description: "Collection of programming exercises with solutions",
      type: "Practice Materials",
      format: "PDF, Code Files"
    }
  ];

  const softwareTools = [
    {
      id: 1,
      title: "MATLAB",
      description: "Programming and numeric computing platform",
      license: "University License (On-campus use)",
      category: "Engineering & Mathematics"
    },
    {
      id: 2,
      title: "Visual Studio Code",
      description: "Lightweight but powerful source code editor",
      license: "Free Open Source",
      category: "Development Tool"
    },
    {
      id: 3,
      title: "R Studio",
      description: "Integrated development environment for R, a language for statistical computing",
      license: "Free Open Source",
      category: "Statistics & Data Science"
    },
    {
      id: 4,
      title: "PostgreSQL",
      description: "Advanced open source relational database",
      license: "Free Open Source",
      category: "Database"
    },
    {
      id: 5,
      title: "Microsoft Office 365",
      description: "Productivity suite including Word, Excel, PowerPoint, and more",
      license: "University Student License",
      category: "Productivity"
    }
  ];

  return (
    <Layout title="Resources">
      <div className="space-y-6">
        {/* Search Bar */}
        <Card>
          <CardContent className="py-4">
            <div className="relative">
              <Input
                type="text"
                placeholder={t('Search resources...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="library" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="library">{t('Library Resources')}</TabsTrigger>
            <TabsTrigger value="digital">{t('Digital Resources')}</TabsTrigger>
            <TabsTrigger value="learning">{t('Learning Materials')}</TabsTrigger>
            <TabsTrigger value="software">{t('Software Tools')}</TabsTrigger>
          </TabsList>

          {/* Library Resources Tab */}
          <TabsContent value="library">
            <Card>
              <CardHeader>
                <CardTitle>{t('Library Resources')}</CardTitle>
                <CardDescription>
                  {t('Books, journals, and publications available in the university library')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filterResources(libraryResources).map((resource) => (
                    <Card key={resource.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row">
                          <div className="flex-1">
                            <h3 className="font-bold">{resource.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{resource.author}</p>
                            <p className="text-sm mt-2">{resource.description}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {resource.type}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                resource.availability.includes('Available') 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-orange-100 text-orange-800'
                              }`}>
                                {resource.availability}
                              </span>
                            </div>
                          </div>
                          <div className="mt-3 md:mt-0 md:ml-4 md:text-right">
                            <p className="text-sm text-gray-500">{resource.location}</p>
                            <div className="mt-2 flex md:justify-end gap-2">
                              <Button variant="outline" size="sm">
                                {t('Reserve')}
                              </Button>
                              <Button size="sm">
                                {resource.availability.includes('Online') ? t('Access') : t('Request')}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 justify-between">
                <div className="text-sm text-gray-500">
                  <i className="fas fa-info-circle mr-1"></i>
                  {t('For assistance, contact the library at library@ur.ac.rw')}
                </div>
                <Button variant="outline">
                  {t('View All Library Resources')}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Digital Resources Tab */}
          <TabsContent value="digital">
            <Card>
              <CardHeader>
                <CardTitle>{t('Digital Resources')}</CardTitle>
                <CardDescription>
                  {t('Online databases, journals, and learning platforms')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filterResources(digitalResources).map((resource) => (
                    <Card key={resource.id}>
                      <CardContent className="p-4">
                        <h3 className="font-bold">{resource.title}</h3>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-block mt-2">
                          {resource.type}
                        </span>
                        <p className="text-sm mt-2">{resource.description}</p>
                        <div className="mt-3 flex justify-between items-center">
                          <div className="text-sm text-primary-500 truncate max-w-[60%]">
                            <i className="fas fa-link mr-1"></i>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              {resource.url}
                            </a>
                          </div>
                          <Button size="sm">
                            {t('Access')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="text-sm text-gray-500 w-full">
                  <i className="fas fa-info-circle mr-1"></i>
                  {t('Access to some resources may require VPN connection when off-campus')}
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Learning Materials Tab */}
          <TabsContent value="learning">
            <Card>
              <CardHeader>
                <CardTitle>{t('Learning Materials')}</CardTitle>
                <CardDescription>
                  {t('Course notes, exercises, and supplementary learning resources')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filterResources(learningMaterials).map((resource) => (
                    <Card key={resource.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div>
                            <h3 className="font-bold">{resource.title}</h3>
                            <div className="mt-1 flex space-x-2">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {resource.type}
                              </span>
                              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                {resource.format}
                              </span>
                            </div>
                            <p className="text-sm mt-2">{resource.description}</p>
                          </div>
                          <div className="mt-3 md:mt-0 md:ml-4 flex md:flex-col gap-2 md:justify-center">
                            <Button size="sm">
                              <i className="fas fa-download mr-1"></i>
                              {t('Download')}
                            </Button>
                            <Button variant="outline" size="sm">
                              <i className="fas fa-eye mr-1"></i>
                              {t('Preview')}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Software Tools Tab */}
          <TabsContent value="software">
            <Card>
              <CardHeader>
                <CardTitle>{t('Software Tools')}</CardTitle>
                <CardDescription>
                  {t('Software applications available for academic use')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filterResources(softwareTools).map((software) => (
                    <Card key={software.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold">{software.title}</h3>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-block mt-1">
                              {software.category}
                            </span>
                          </div>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {software.license}
                          </span>
                        </div>
                        <p className="text-sm mt-2">{software.description}</p>
                        <div className="mt-3 flex justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <i className="fas fa-info-circle mr-1"></i>
                            {t('Info')}
                          </Button>
                          <Button size="sm">
                            <i className="fas fa-download mr-1"></i>
                            {t('Download')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="text-sm text-gray-500 w-full">
                  <i className="fas fa-info-circle mr-1"></i>
                  {t('For technical assistance with software installation, contact IT support at itsupport@ur.ac.rw')}
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Support Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Resource Support')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="bg-primary-100 text-primary-500 p-2 rounded-full mr-2">
                    <i className="fas fa-book"></i>
                  </div>
                  <h3 className="font-medium">{t('Library Hours')}</h3>
                </div>
                <ul className="space-y-1 text-sm">
                  <li className="flex justify-between">
                    <span>{t('Monday - Friday')}</span>
                    <span>8:00 AM - 10:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>{t('Saturday')}</span>
                    <span>9:00 AM - 5:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>{t('Sunday')}</span>
                    <span>12:00 PM - 6:00 PM</span>
                  </li>
                  <li className="text-primary-500 mt-1">
                    <i className="fas fa-info-circle mr-1"></i>
                    {t('Extended hours during exam period')}
                  </li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="bg-primary-100 text-primary-500 p-2 rounded-full mr-2">
                    <i className="fas fa-question-circle"></i>
                  </div>
                  <h3 className="font-medium">{t('Resource Help')}</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <i className="fas fa-envelope mr-2 text-gray-500"></i>
                    <span>library@ur.ac.rw</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-phone mr-2 text-gray-500"></i>
                    <span>+250 788 123 456</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-headset mr-2 text-gray-500"></i>
                    <span>{t('Live chat available during library hours')}</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="bg-primary-100 text-primary-500 p-2 rounded-full mr-2">
                    <i className="fas fa-laptop-code"></i>
                  </div>
                  <h3 className="font-medium">{t('IT Support')}</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <i className="fas fa-envelope mr-2 text-gray-500"></i>
                    <span>itsupport@ur.ac.rw</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-phone mr-2 text-gray-500"></i>
                    <span>+250 788 456 789</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-map-marker-alt mr-2 text-gray-500"></i>
                    <span>{t('ICT Building, Room 105')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
