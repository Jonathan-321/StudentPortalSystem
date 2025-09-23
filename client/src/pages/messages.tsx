import { useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth-supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Messages() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [activeConversationId, setActiveConversationId] = useState<number | null>(1);
  
  if (!user) return null;

  // Sample conversations data
  const conversations = [
    {
      id: 1,
      recipient: "Dr. Emmanuel Niyibizi",
      avatar: null,
      initials: "EN",
      role: "Instructor",
      course: "CSC301: Data Structures and Algorithms",
      lastMessage: "Please let me know if you have any questions about the assignment.",
      unread: true,
      time: "10:45 AM",
      messages: [
        {
          id: 1,
          sender: "Dr. Emmanuel Niyibizi",
          text: "Hello John, I wanted to check if you have any questions about the upcoming algorithm assignment?",
          time: "Yesterday, 3:45 PM",
          isMe: false
        },
        {
          id: 2,
          sender: "Me",
          text: "Hi Dr. Niyibizi, I was actually wondering about the time complexity analysis part. Could you clarify what level of detail is expected?",
          time: "Yesterday, 4:30 PM",
          isMe: true
        },
        {
          id: 3,
          sender: "Dr. Emmanuel Niyibizi",
          text: "Good question. I'm looking for a thorough analysis - big O notation, explanation of the dominant operations, and justification for your conclusions. Any edge cases should also be discussed.",
          time: "Yesterday, 5:15 PM",
          isMe: false
        },
        {
          id: 4,
          sender: "Dr. Emmanuel Niyibizi",
          text: "Please let me know if you have any questions about the assignment.",
          time: "Today, 10:45 AM",
          isMe: false
        }
      ]
    },
    {
      id: 2,
      recipient: "Academic Office",
      avatar: null,
      initials: "AO",
      role: "Administration",
      lastMessage: "Your transcript request has been processed.",
      unread: false,
      time: "Yesterday",
      messages: [
        {
          id: 1,
          sender: "Me",
          text: "Hello, I submitted a request for my transcript last week. Could you please provide an update on the status?",
          time: "2 days ago, 11:20 AM",
          isMe: true
        },
        {
          id: 2,
          sender: "Academic Office",
          text: "Good day! We have received your request and it is currently being processed. Transcripts typically take 3-5 business days to prepare.",
          time: "2 days ago, 2:45 PM",
          isMe: false
        },
        {
          id: 3,
          sender: "Academic Office",
          text: "Your transcript request has been processed. You can collect it from the Academic Office during working hours.",
          time: "Yesterday, 9:30 AM",
          isMe: false
        }
      ]
    },
    {
      id: 3,
      recipient: "Prof. Alice Mukashema",
      avatar: null,
      initials: "AM",
      role: "Instructor",
      course: "MTH241: Linear Algebra",
      lastMessage: "The study session will be in Room 302 at 4:00 PM tomorrow.",
      unread: false,
      time: "Monday",
      messages: [
        {
          id: 1,
          sender: "Me",
          text: "Hello Professor Mukashema, I'm having trouble with the eigenvalue problems from last week's lecture. Would it be possible to schedule a brief meeting to discuss?",
          time: "Monday, 10:15 AM",
          isMe: true
        },
        {
          id: 2,
          sender: "Prof. Alice Mukashema",
          text: "Hello John, I'm actually organizing a study session for several students who had similar questions. Would you like to join?",
          time: "Monday, 11:30 AM",
          isMe: false
        },
        {
          id: 3,
          sender: "Me",
          text: "That would be perfect. When and where will it be held?",
          time: "Monday, 12:05 PM",
          isMe: true
        },
        {
          id: 4,
          sender: "Prof. Alice Mukashema",
          text: "The study session will be in Room 302 at 4:00 PM tomorrow. Please bring your textbook and the exercise sheet.",
          time: "Monday, 2:20 PM",
          isMe: false
        }
      ]
    },
    {
      id: 4,
      recipient: "IT Support",
      avatar: null,
      initials: "IT",
      role: "Support",
      lastMessage: "Your account has been updated with the new email address.",
      unread: false,
      time: "Oct 5",
      messages: [
        {
          id: 1,
          sender: "Me",
          text: "I need to update my email address in the system. My current address has a typo.",
          time: "Oct 5, 9:10 AM",
          isMe: true
        },
        {
          id: 2,
          sender: "IT Support",
          text: "Hello, we'd be happy to help with that. Could you please provide your correct email address and student ID for verification?",
          time: "Oct 5, 9:45 AM",
          isMe: false
        },
        {
          id: 3,
          sender: "Me",
          text: "My student ID is 219002134 and the correct email should be john.doe@example.com",
          time: "Oct 5, 10:20 AM",
          isMe: true
        },
        {
          id: 4,
          sender: "IT Support",
          text: "Thank you for the information. We have verified your identity and will make the change shortly.",
          time: "Oct 5, 11:05 AM",
          isMe: false
        },
        {
          id: 5,
          sender: "IT Support",
          text: "Your account has been updated with the new email address.",
          time: "Oct 5, 11:30 AM",
          isMe: false
        }
      ]
    },
    {
      id: 5,
      recipient: "Student Group",
      avatar: null,
      initials: "SG",
      role: "Group",
      course: "CSC325: Database Systems Project",
      lastMessage: "I've pushed the schema changes to our repository.",
      unread: false,
      time: "Sep 28",
      messages: [
        {
          id: 1,
          sender: "Marie K.",
          text: "Hey team, when are we meeting to discuss the database project?",
          time: "Sep 28, 8:30 AM",
          isMe: false
        },
        {
          id: 2,
          sender: "David N.",
          text: "I'm available after 3 PM tomorrow. How about everyone else?",
          time: "Sep 28, 9:15 AM",
          isMe: false
        },
        {
          id: 3,
          sender: "Me",
          text: "3 PM works for me too. Should we meet in the library or online?",
          time: "Sep 28, 9:45 AM",
          isMe: true
        },
        {
          id: 4,
          sender: "Marie K.",
          text: "Let's meet in the library, study room 3. I'll book it now.",
          time: "Sep 28, 10:20 AM",
          isMe: false
        },
        {
          id: 5,
          sender: "Me",
          text: "I've pushed the schema changes to our repository.",
          time: "Sep 28, 4:15 PM",
          isMe: true
        }
      ]
    }
  ];

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation => 
    searchQuery === "" || 
    conversation.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (conversation.course && conversation.course.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Get active conversation
  const activeConversation = conversations.find(conv => conv.id === activeConversationId);

  // Handle send message
  const handleSendMessage = () => {
    if (messageText.trim() === "") return;
    
    // In a real application, this would send the message to the server
    console.log("Sending message:", messageText);
    
    // Clear the input
    setMessageText("");
  };

  return (
    <Layout title="Messages">
      <div className="flex flex-col md:flex-row md:space-x-4 h-[calc(100vh-12rem)]">
        {/* Conversations List */}
        <div className="md:w-1/3 mb-4 md:mb-0">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>{t('Messages')}</CardTitle>
                <Button variant="outline" size="sm">
                  <i className="fas fa-pen mr-2"></i>
                  {t('New')}
                </Button>
              </div>
              <div className="relative mt-2">
                <Input
                  type="text"
                  placeholder={t('Search messages...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <i className="fas fa-search text-gray-400"></i>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4 w-full justify-start">
                  <TabsTrigger value="all" className="flex-1">{t('All')}</TabsTrigger>
                  <TabsTrigger value="unread" className="flex-1">{t('Unread')}</TabsTrigger>
                  <TabsTrigger value="faculty" className="flex-1">{t('Faculty')}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="m-0">
                  <div className="space-y-2">
                    {filteredConversations.map((conversation) => (
                      <div 
                        key={conversation.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          activeConversationId === conversation.id 
                            ? 'bg-primary-100 border-l-4 border-primary-500' 
                            : 'hover:bg-gray-100 border'
                        }`}
                        onClick={() => setActiveConversationId(conversation.id)}
                      >
                        <div className="flex items-start">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={conversation.avatar || undefined} alt={conversation.recipient} />
                            <AvatarFallback className="bg-primary-200 text-primary-700">
                              {conversation.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium truncate">{conversation.recipient}</h4>
                              <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{conversation.time}</span>
                            </div>
                            {conversation.course && (
                              <p className="text-xs text-gray-600 truncate">{conversation.course}</p>
                            )}
                            <p className={`text-sm mt-1 truncate ${conversation.unread ? 'font-semibold' : 'text-gray-600'}`}>
                              {conversation.lastMessage}
                            </p>
                          </div>
                          {conversation.unread && (
                            <span className="h-2 w-2 bg-primary-500 rounded-full ml-2 mt-2"></span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="unread" className="m-0">
                  <div className="space-y-2">
                    {filteredConversations
                      .filter(conversation => conversation.unread)
                      .map((conversation) => (
                        <div 
                          key={conversation.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            activeConversationId === conversation.id 
                              ? 'bg-primary-100 border-l-4 border-primary-500' 
                              : 'hover:bg-gray-100 border'
                          }`}
                          onClick={() => setActiveConversationId(conversation.id)}
                        >
                          <div className="flex items-start">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={conversation.avatar || undefined} alt={conversation.recipient} />
                              <AvatarFallback className="bg-primary-200 text-primary-700">
                                {conversation.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium truncate">{conversation.recipient}</h4>
                                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{conversation.time}</span>
                              </div>
                              {conversation.course && (
                                <p className="text-xs text-gray-600 truncate">{conversation.course}</p>
                              )}
                              <p className="text-sm font-semibold mt-1 truncate">
                                {conversation.lastMessage}
                              </p>
                            </div>
                            <span className="h-2 w-2 bg-primary-500 rounded-full ml-2 mt-2"></span>
                          </div>
                        </div>
                      ))}
                  </div>
                  {filteredConversations.filter(c => c.unread).length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                      <i className="fas fa-check-circle text-3xl mb-2"></i>
                      <p>{t('No unread messages')}</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="faculty" className="m-0">
                  <div className="space-y-2">
                    {filteredConversations
                      .filter(conversation => conversation.role === "Instructor")
                      .map((conversation) => (
                        <div 
                          key={conversation.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            activeConversationId === conversation.id 
                              ? 'bg-primary-100 border-l-4 border-primary-500' 
                              : 'hover:bg-gray-100 border'
                          }`}
                          onClick={() => setActiveConversationId(conversation.id)}
                        >
                          <div className="flex items-start">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={conversation.avatar || undefined} alt={conversation.recipient} />
                              <AvatarFallback className="bg-primary-200 text-primary-700">
                                {conversation.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium truncate">{conversation.recipient}</h4>
                                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{conversation.time}</span>
                              </div>
                              {conversation.course && (
                                <p className="text-xs text-gray-600 truncate">{conversation.course}</p>
                              )}
                              <p className={`text-sm mt-1 truncate ${conversation.unread ? 'font-semibold' : 'text-gray-600'}`}>
                                {conversation.lastMessage}
                              </p>
                            </div>
                            {conversation.unread && (
                              <span className="h-2 w-2 bg-primary-500 rounded-full ml-2 mt-2"></span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                  {filteredConversations.filter(c => c.role === "Instructor").length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                      <i className="fas fa-user-tie text-3xl mb-2"></i>
                      <p>{t('No faculty messages')}</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Conversation View */}
        <div className="md:w-2/3">
          <Card className="h-full flex flex-col">
            {activeConversation ? (
              <>
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={activeConversation.avatar || undefined} alt={activeConversation.recipient} />
                      <AvatarFallback className="bg-primary-200 text-primary-700">
                        {activeConversation.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{activeConversation.recipient}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {activeConversation.role}
                        </Badge>
                        {activeConversation.course && (
                          <CardDescription className="text-xs">
                            {activeConversation.course}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {activeConversation.messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.isMe 
                              ? 'bg-primary-100 text-primary-950' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {!message.isMe && (
                            <p className="font-medium text-xs text-gray-500 mb-1">{message.sender}</p>
                          )}
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs text-gray-500 mt-1 text-right">{message.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t p-3">
                  <div className="flex w-full gap-2">
                    <Button variant="outline" size="icon" className="shrink-0">
                      <i className="fas fa-paperclip"></i>
                    </Button>
                    <Textarea 
                      placeholder={t('Type a message...')} 
                      className="resize-none min-h-10"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      size="icon" 
                      className="shrink-0"
                      onClick={handleSendMessage}
                      disabled={messageText.trim() === ""}
                    >
                      <i className="fas fa-paper-plane"></i>
                    </Button>
                  </div>
                </CardFooter>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-center p-8">
                  <div className="bg-gray-100 p-6 rounded-full inline-block mb-4">
                    <i className="fas fa-comments text-4xl text-gray-400"></i>
                  </div>
                  <h3 className="text-xl font-medium mb-2">{t('No conversation selected')}</h3>
                  <p className="text-gray-500">{t('Select a conversation or start a new one')}</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}
