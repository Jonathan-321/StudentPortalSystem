import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import CampusMap from "@/components/CampusMap";
import FacilityBooking from "@/components/FacilityBooking";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Book, BookOpen, Calendar, Clock, Download, ExternalLink, FileText, Laptop, Library, MapPin, Phone, Search, Share, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";

interface Resource {
  id: number;
  title: string;
  type: string;
  description: string;
  url?: string;
  fileType?: string;
  category: string;
  tags: string[];
  addedDate: string;
  isNew?: boolean;
}

const resources: Resource[] = [
  {
    id: 1,
    title: "University Library Catalogue",
    type: "link",
    description: "Search for books, journals, and other resources in the university library collection.",
    url: "https://library.ur.ac.rw",
    category: "library",
    tags: ["books", "research", "journals"],
    addedDate: "2023-09-15",
  },
  {
    id: 2,
    title: "Academic Calendar 2023-2024",
    type: "file",
    description: "Official academic calendar with semester dates, holidays, and exam periods.",
    fileType: "pdf",
    category: "academic",
    tags: ["calendar", "schedule", "exams"],
    addedDate: "2023-08-28",
  },
  {
    id: 3,
    title: "Student Handbook",
    type: "file",
    description: "Comprehensive guide to student policies, procedures, and resources.",
    fileType: "pdf",
    category: "student",
    tags: ["policies", "rules", "guidelines"],
    addedDate: "2023-09-01",
  },
  {
    id: 4,
    title: "Career Development Resources",
    type: "link",
    description: "Tools and guidance for career planning, resume building, and job searching.",
    url: "https://careers.ur.ac.rw",
    category: "career",
    tags: ["jobs", "internships", "resume"],
    addedDate: "2023-09-10",
    isNew: true,
  },
  {
    id: 5,
    title: "Research Databases Access",
    type: "link",
    description: "Portal to access various academic and research databases.",
    url: "https://research.ur.ac.rw/databases",
    category: "library",
    tags: ["research", "databases", "journals"],
    addedDate: "2023-09-12",
  },
  {
    id: 6,
    title: "Scholarship Opportunities",
    type: "file",
    description: "Current scholarships available to University of Rwanda students.",
    fileType: "pdf",
    category: "financial",
    tags: ["scholarships", "funding", "grants"],
    addedDate: "2023-09-20",
    isNew: true,
  },
  {
    id: 7,
    title: "University Style Guide",
    type: "file",
    description: "Official formatting guidelines for academic papers and presentations.",
    fileType: "pdf",
    category: "academic",
    tags: ["formatting", "citations", "writing"],
    addedDate: "2023-08-15",
  },
  {
    id: 8,
    title: "Student Clubs Directory",
    type: "link",
    description: "List of all registered student clubs and organizations with contact information.",
    url: "https://ur.ac.rw/student-life/clubs",
    category: "student",
    tags: ["clubs", "organizations", "activities"],
    addedDate: "2023-09-05",
  },
  {
    id: 9,
    title: "Campus Dining Guide",
    type: "file",
    description: "Information about on-campus dining options, hours, and meal plans.",
    fileType: "pdf",
    category: "campus",
    tags: ["food", "dining", "cafeteria"],
    addedDate: "2023-09-08",
  },
  {
    id: 10,
    title: "IT Services Handbook",
    type: "file",
    description: "Guide to IT services, support, and resources available to students.",
    fileType: "pdf",
    category: "technology",
    tags: ["wifi", "email", "software"],
    addedDate: "2023-08-30",
  }
];

export default function Resources() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("resources");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  // Parse query parameters
  const params = new URLSearchParams(location.split("?")[1]);
  const documentParam = params.get("document");
  
  // If document param exists, show the relevant document
  // Using useEffect instead of useState for side effects
  React.useEffect(() => {
    if (documentParam) {
      const foundResource = resources.find(r => 
        r.title.toLowerCase().includes(documentParam.toLowerCase())
      );
      
      if (foundResource) {
        setSelectedResource(foundResource);
      }
      
      // Remove the query parameter after handling
      setLocation("/resources");
    }
  }, [documentParam, location, setLocation]);

  // Filter resources based on search and category
  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Group resources by category
  const groupedResources = filteredResources.reduce((acc: Record<string, Resource[]>, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {});

  return (
    <Layout title={t("Resources")}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <TabsList className="mb-4 sm:mb-0">
            <TabsTrigger value="resources">{t("Resources")}</TabsTrigger>
            <TabsTrigger value="facilities">{t("Facilities")}</TabsTrigger>
            <TabsTrigger value="campus-map">{t("Campus Map")}</TabsTrigger>
          </TabsList>
          
          {activeTab === "resources" && (
            <div className="flex w-full sm:w-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder={t("Search resources...")}
                  className="pl-9 w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Student Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          {/* Resource Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button 
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="font-medium"
            >
              {t("All")}
            </Button>
            <Button 
              variant={selectedCategory === "academic" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("academic")}
            >
              {t("Academic")}
            </Button>
            <Button 
              variant={selectedCategory === "library" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("library")}
            >
              {t("Library")}
            </Button>
            <Button 
              variant={selectedCategory === "student" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("student")}
            >
              {t("Student Life")}
            </Button>
            <Button 
              variant={selectedCategory === "career" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("career")}
            >
              {t("Career")}
            </Button>
            <Button 
              variant={selectedCategory === "financial" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("financial")}
            >
              {t("Financial")}
            </Button>
            <Button 
              variant={selectedCategory === "campus" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("campus")}
            >
              {t("Campus")}
            </Button>
            <Button 
              variant={selectedCategory === "technology" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("technology")}
            >
              {t("Technology")}
            </Button>
          </div>
          
          {/* Resource List */}
          {Object.entries(groupedResources).length > 0 ? (
            Object.entries(groupedResources).map(([category, categoryResources]) => (
              <div key={category} className="mb-8">
                <h3 className="text-lg font-bold mb-4 capitalize">
                  {t(category)}
                  <span className="text-gray-500 text-sm font-normal ml-2">
                    ({categoryResources.length})
                  </span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryResources.map(resource => (
                    <Card key={resource.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">
                            {resource.title}
                            {resource.isNew && (
                              <Badge className="ml-2 font-normal" variant="secondary">
                                {t("New")}
                              </Badge>
                            )}
                          </CardTitle>
                          {resource.type === "file" ? (
                            <FileText className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ExternalLink className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                        <CardDescription>
                          {resource.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex flex-wrap gap-1">
                          {resource.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs capitalize">
                              {t(tag)}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(resource.addedDate).toLocaleDateString()}
                        </div>
                        {resource.type === "file" ? (
                          <Button size="sm" className="h-8">
                            <Download className="h-4 w-4 mr-1" />
                            {t("Download")}
                          </Button>
                        ) : (
                          <Button size="sm" className="h-8" asChild>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              {t("Open")}
                            </a>
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-2">{t("No resources found")}</p>
              <p className="text-gray-400 text-sm">{t("Try adjusting your search or filters")}</p>
            </div>
          )}
          
          {/* Library Resources Section */}
          <div className="mt-8 mb-4">
            <h3 className="text-xl font-bold mb-6">{t("Library Resources")}</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-primary" />
                    {t("Digital Collections")}
                  </CardTitle>
                  <CardDescription>{t("Access e-books, journals, and databases")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="journals">
                      <AccordionTrigger>{t("Academic Journals")}</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 text-sm">
                          <li><a href="#" className="text-primary hover:underline">JSTOR</a></li>
                          <li><a href="#" className="text-primary hover:underline">ScienceDirect</a></li>
                          <li><a href="#" className="text-primary hover:underline">IEEE Xplore</a></li>
                          <li><a href="#" className="text-primary hover:underline">ACM Digital Library</a></li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="ebooks">
                      <AccordionTrigger>{t("E-Books")}</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 text-sm">
                          <li><a href="#" className="text-primary hover:underline">ProQuest Ebook Central</a></li>
                          <li><a href="#" className="text-primary hover:underline">EBSCO eBooks</a></li>
                          <li><a href="#" className="text-primary hover:underline">Open Textbook Library</a></li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="databases">
                      <AccordionTrigger>{t("Research Databases")}</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 text-sm">
                          <li><a href="#" className="text-primary hover:underline">Web of Science</a></li>
                          <li><a href="#" className="text-primary hover:underline">Scopus</a></li>
                          <li><a href="#" className="text-primary hover:underline">PubMed</a></li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    {t("Browse Digital Collections")}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Library className="h-5 w-5 mr-2 text-primary" />
                    {t("Library Services")}
                  </CardTitle>
                  <CardDescription>{t("Explore services available to students")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-md p-3 hover:bg-gray-50">
                    <h4 className="font-medium">{t("Research Assistance")}</h4>
                    <p className="text-sm text-gray-600 mt-1">{t("Get help with research from librarians")}</p>
                  </div>
                  <div className="border rounded-md p-3 hover:bg-gray-50">
                    <h4 className="font-medium">{t("Interlibrary Loans")}</h4>
                    <p className="text-sm text-gray-600 mt-1">{t("Borrow resources from other libraries")}</p>
                  </div>
                  <div className="border rounded-md p-3 hover:bg-gray-50">
                    <h4 className="font-medium">{t("Study Spaces")}</h4>
                    <p className="text-sm text-gray-600 mt-1">{t("Reserve quiet study rooms and collaborative spaces")}</p>
                  </div>
                  <div className="border rounded-md p-3 hover:bg-gray-50">
                    <h4 className="font-medium">{t("Printing & Copying")}</h4>
                    <p className="text-sm text-gray-600 mt-1">{t("Print, scan, and copy documents")}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    {t("View Library Hours")}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Book className="h-5 w-5 mr-2 text-primary" />
                    {t("Academic Resources")}
                  </CardTitle>
                  <CardDescription>{t("Tools and guides for academic success")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-md p-3 hover:bg-gray-50">
                      <h4 className="font-medium">{t("Citation Guides")}</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Badge variant="outline">APA</Badge>
                        <Badge variant="outline">MLA</Badge>
                        <Badge variant="outline">Chicago</Badge>
                        <Badge variant="outline">Harvard</Badge>
                      </div>
                    </div>
                    <div className="border rounded-md p-3 hover:bg-gray-50">
                      <h4 className="font-medium">{t("Writing Resources")}</h4>
                      <p className="text-sm text-gray-600 mt-1">{t("Guides for academic writing and research papers")}</p>
                    </div>
                    <div className="border rounded-md p-3 hover:bg-gray-50">
                      <h4 className="font-medium">{t("Plagiarism Checker")}</h4>
                      <p className="text-sm text-gray-600 mt-1">{t("Tools to ensure academic integrity")}</p>
                    </div>
                    <div className="border rounded-md p-3 hover:bg-gray-50">
                      <h4 className="font-medium">{t("Research Guides")}</h4>
                      <p className="text-sm text-gray-600 mt-1">{t("Subject-specific research methodologies")}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    {t("Access Academic Tools")}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="bg-white rounded-lg border p-6 mt-8">
            <h3 className="text-lg font-bold mb-4">{t("Need Help Finding Resources?")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start">
                <div className="bg-primary-50 p-2 rounded-full mr-3 flex-shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{t("Call Us")}</h4>
                  <p className="text-sm text-gray-600 mt-1">+250 788 000 000</p>
                  <p className="text-sm text-gray-600">Mon-Fri, 8AM-5PM</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-primary-50 p-2 rounded-full mr-3 flex-shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{t("Visit Us")}</h4>
                  <p className="text-sm text-gray-600 mt-1">{t("Resource Center, Main Campus")}</p>
                  <p className="text-sm text-gray-600">{t("Ground Floor, Library Building")}</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-primary-50 p-2 rounded-full mr-3 flex-shrink-0">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{t("Schedule an Appointment")}</h4>
                  <p className="text-sm text-gray-600 mt-1">{t("Meet with a resource specialist")}</p>
                  <Button size="sm" className="mt-2">{t("Book Now")}</Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Campus Facilities Tab */}
        <TabsContent value="facilities">
          <FacilityBooking />
        </TabsContent>

        {/* Campus Map Tab */}
        <TabsContent value="campus-map">
          <CampusMap />
        </TabsContent>
      </Tabs>
      
      {/* Resource Document Dialog */}
      <Dialog open={!!selectedResource} onOpenChange={(open) => !open && setSelectedResource(null)}>
        <DialogContent className="max-w-3xl">
          {selectedResource && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedResource.title}</DialogTitle>
                <DialogDescription>
                  {selectedResource.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                {/* Placeholder for document content */}
                <div className="border rounded-lg p-8 flex items-center justify-center bg-gray-50 h-96">
                  <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">{t("Document Preview")}</p>
                    <p className="text-gray-400 text-sm mt-2">{selectedResource.title}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setSelectedResource(null)}>
                  {t("Close")}
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Share className="h-4 w-4 mr-2" />
                    {t("Share")}
                  </Button>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    {t("Download")}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}