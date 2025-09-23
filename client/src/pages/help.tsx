import { useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth-supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function Help() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [supportCategory, setSupportCategory] = useState("technical");
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  
  // Handle support form submission
  const handleSubmitSupport = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supportSubject.trim() || !supportMessage.trim()) {
      toast({
        title: t("Error"),
        description: t("Please fill in all required fields"),
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: t("Support Request Submitted"),
        description: t("Your support ticket has been created. We'll get back to you soon."),
      });
      
      // Reset form
      setSupportSubject("");
      setSupportMessage("");
    }, 1500);
  };
  
  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    // Simulate search results
    const results = faqItems
      .filter(item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(item => item.question);
    
    setSearchResults(results);
  };
  
  // FAQ Data
  const faqItems = [
    {
      question: t("How do I reset my password?"),
      answer: t("To reset your password, go to the login page and click on 'Forgot Password'. Follow the instructions sent to your email address."),
      category: "account"
    },
    {
      question: t("How do I register for courses?"),
      answer: t("You can register for courses through the Course Registration page. Select the semester, browse available courses, and click 'Register' for each course you want to take."),
      category: "academic"
    },
    {
      question: t("Where can I find my exam schedule?"),
      answer: t("Exam schedules are published on the Timetable page. You can filter by 'Exams Only' to see your upcoming examinations."),
      category: "academic"
    },
    {
      question: t("How do I check my grades?"),
      answer: t("Grades can be viewed on the Results & Transcripts page. You can see your current grades as well as generate a complete transcript."),
      category: "academic"
    },
    {
      question: t("How do I pay my tuition?"),
      answer: t("Tuition payments can be made through the Finance page. We accept bank transfers, mobile money, and credit/debit cards."),
      category: "financial"
    },
    {
      question: t("What do I do if a course I need is full?"),
      answer: t("If a course you need is full, contact your academic advisor or the department offering the course. They may be able to increase capacity or suggest alternatives."),
      category: "academic"
    },
    {
      question: t("How do I contact my professors?"),
      answer: t("You can contact your professors through the Messages page. Select your professor from your enrolled courses to start a conversation."),
      category: "academic"
    },
    {
      question: t("Where do I find information about scholarships?"),
      answer: t("Scholarship information is available on the Finance page under the 'Scholarships & Financial Aid' section."),
      category: "financial"
    },
    {
      question: t("How do I get an official transcript?"),
      answer: t("Official transcripts can be requested through the Results & Transcripts page. Click on 'Request Official Transcript' and follow the instructions."),
      category: "academic"
    },
    {
      question: t("The portal is not loading properly. What should I do?"),
      answer: t("Try clearing your browser cache and cookies, or try a different browser. If the problem persists, contact IT support through the Help page."),
      category: "technical"
    }
  ];
  
  const helpCategories = [
    {
      id: "popular",
      title: t("Popular Topics"),
      icon: "fas fa-star"
    },
    {
      id: "account",
      title: t("Account & Login"),
      icon: "fas fa-user"
    },
    {
      id: "academic",
      title: t("Academic Issues"),
      icon: "fas fa-book"
    },
    {
      id: "financial",
      title: t("Financial Matters"),
      icon: "fas fa-money-bill"
    },
    {
      id: "technical",
      title: t("Technical Support"),
      icon: "fas fa-laptop"
    }
  ];
  
  const supportTopics = [
    {
      id: "technical",
      title: t("Technical Support"),
      options: [
        t("Login Issues"),
        t("Page Not Loading"),
        t("Document Upload Problems"),
        t("Error Messages"),
        t("Mobile App Issues"),
        t("Other Technical Issues")
      ]
    },
    {
      id: "academic",
      title: t("Academic Support"),
      options: [
        t("Course Registration"),
        t("Timetable Issues"),
        t("Grades & Transcripts"),
        t("Exam Schedule"),
        t("Curriculum Questions"),
        t("Other Academic Issues")
      ]
    },
    {
      id: "financial",
      title: t("Financial Support"),
      options: [
        t("Tuition Payment"),
        t("Fee Structure"),
        t("Scholarship Application"),
        t("Payment Confirmation"),
        t("Refund Request"),
        t("Other Financial Issues")
      ]
    },
    {
      id: "account",
      title: t("Account Support"),
      options: [
        t("Password Reset"),
        t("Profile Update"),
        t("Account Security"),
        t("Access Permissions"),
        t("Account Verification"),
        t("Other Account Issues")
      ]
    }
  ];
  
  // Get the selected support topic
  const selectedSupportTopic = supportTopics.find(topic => topic.id === supportCategory);
  
  if (!user) return null;

  return (
    <Layout title="Help & Support">
      <div className="space-y-6">
        {/* Search Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">{t('How can we help you?')}</h2>
              <p className="text-gray-500">{t('Search for answers or browse our help topics')}</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder={t('Search for help topics...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-20"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                />
                <Button 
                  className="absolute right-0 top-0 rounded-l-none"
                  onClick={handleSearch}
                >
                  {t('Search')}
                </Button>
              </div>
              
              {searchResults.length > 0 && (
                <div className="mt-4 border rounded-lg">
                  <div className="p-3 bg-gray-50 border-b">
                    <h3 className="font-medium">{t('Search Results')}</h3>
                  </div>
                  <ScrollArea className="h-64">
                    <ul className="divide-y">
                      {searchResults.map((result, index) => (
                        <li key={index} className="p-3 hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-center">
                            <i className="fas fa-search text-gray-400 mr-2"></i>
                            <span>{result}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </div>
              )}
              
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                {helpCategories.map((category) => (
                  <div 
                    key={category.id}
                    className="flex flex-col items-center p-4 border rounded-lg hover:border-primary-500 hover:bg-primary-50 cursor-pointer transition-colors w-36"
                  >
                    <div className="text-primary-500 mb-2">
                      <i className={`${category.icon} text-2xl`}></i>
                    </div>
                    <span className="text-center">{category.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* FAQ Section */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('Frequently Asked Questions')}</CardTitle>
                <CardDescription>
                  {t('Find answers to our most commonly asked questions')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-600">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Contact Support Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>{t('Contact Support')}</CardTitle>
                <CardDescription>
                  {t('Can\'t find what you\'re looking for? We\'re here to help.')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitSupport} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="support-category">{t('Category')}</Label>
                    <Select
                      value={supportCategory}
                      onValueChange={setSupportCategory}
                    >
                      <SelectTrigger id="support-category">
                        <SelectValue placeholder={t('Select category')} />
                      </SelectTrigger>
                      <SelectContent>
                        {supportTopics.map((topic) => (
                          <SelectItem key={topic.id} value={topic.id}>
                            {topic.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="support-subject">{t('Subject')}</Label>
                    <Select
                      value={supportSubject}
                      onValueChange={setSupportSubject}
                    >
                      <SelectTrigger id="support-subject">
                        <SelectValue placeholder={t('Select subject')} />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedSupportTopic?.options.map((option, index) => (
                          <SelectItem key={index} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="support-message">{t('Message')}</Label>
                    <Textarea
                      id="support-message"
                      placeholder={t('Describe your issue in detail...')}
                      rows={5}
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {t('Submit Request')}
                  </Button>
                </form>

                <div className="mt-6 border-t pt-4">
                  <h3 className="font-medium mb-2">{t('Alternative Contact Methods')}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <i className="fas fa-envelope text-primary-500 w-6"></i>
                      <span>support@ur.ac.rw</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-phone text-primary-500 w-6"></i>
                      <span>+250 788 123 456</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-map-marker-alt text-primary-500 w-6"></i>
                      <span>{t('IT Support Center, Main Campus')}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-clock text-primary-500 w-6"></i>
                      <span>{t('Monday-Friday: 8:00 AM - 5:00 PM')}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Help Resources Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Help Resources')}</CardTitle>
            <CardDescription>
              {t('Additional resources to help you navigate the portal')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border rounded-lg p-4 hover:border-primary-500 cursor-pointer transition-colors">
                <div className="text-primary-500 mb-2">
                  <i className="fas fa-book text-2xl"></i>
                </div>
                <h3 className="font-medium mb-1">{t('User Guides')}</h3>
                <p className="text-sm text-gray-500">{t('Step-by-step guides for using the portal')}</p>
              </div>
              
              <div className="border rounded-lg p-4 hover:border-primary-500 cursor-pointer transition-colors">
                <div className="text-primary-500 mb-2">
                  <i className="fas fa-video text-2xl"></i>
                </div>
                <h3 className="font-medium mb-1">{t('Video Tutorials')}</h3>
                <p className="text-sm text-gray-500">{t('Visual guides for common tasks')}</p>
              </div>
              
              <div className="border rounded-lg p-4 hover:border-primary-500 cursor-pointer transition-colors">
                <div className="text-primary-500 mb-2">
                  <i className="fas fa-calendar-check text-2xl"></i>
                </div>
                <h3 className="font-medium mb-1">{t('Training Sessions')}</h3>
                <p className="text-sm text-gray-500">{t('Upcoming portal training events')}</p>
              </div>
              
              <div className="border rounded-lg p-4 hover:border-primary-500 cursor-pointer transition-colors">
                <div className="text-primary-500 mb-2">
                  <i className="fas fa-question-circle text-2xl"></i>
                </div>
                <h3 className="font-medium mb-1">{t('Knowledge Base')}</h3>
                <p className="text-sm text-gray-500">{t('Articles and tips for common issues')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Support Services */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Student Support Services')}</CardTitle>
            <CardDescription>
              {t('Additional services available to support your academic journey')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium flex items-center">
                  <i className="fas fa-user-graduate text-primary-500 mr-2"></i>
                  {t('Academic Advising')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('Get guidance on course selection, degree requirements, and academic planning.')}
                </p>
                <Button variant="outline" size="sm">
                  {t('Schedule Advising')}
                </Button>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium flex items-center">
                  <i className="fas fa-chalkboard-teacher text-primary-500 mr-2"></i>
                  {t('Learning Support')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('Access tutoring, study groups, and academic resources to improve your learning.')}
                </p>
                <Button variant="outline" size="sm">
                  {t('Access Resources')}
                </Button>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium flex items-center">
                  <i className="fas fa-heart text-primary-500 mr-2"></i>
                  {t('Wellness Services')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('Support for your physical and mental well-being during your studies.')}
                </p>
                <Button variant="outline" size="sm">
                  {t('Learn More')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
