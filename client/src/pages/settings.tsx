import { useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import ThemeCustomizer from "@/components/ThemeCustomizer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Profile form schema
const profileFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
});

// Password form schema
const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required." }),
  newPassword: z.string().min(6, { message: "New password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Confirm password must be at least 6 characters." }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function Settings() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { toast } = useToast();
  const [profileSaved, setProfileSaved] = useState(false);
  
  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phoneNumber: "",
      address: "",
      bio: "",
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const res = await apiRequest("PATCH", "/api/user/profile", values);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
      toast({
        title: t("Profile updated"),
        description: t("Your profile information has been updated successfully."),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t("Error"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: async (values: PasswordFormValues) => {
      const res = await apiRequest("PATCH", "/api/user/password", values);
      return await res.json();
    },
    onSuccess: () => {
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast({
        title: t("Password updated"),
        description: t("Your password has been updated successfully."),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t("Error"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Submit profile form
  const onProfileSubmit = (values: ProfileFormValues) => {
    updateProfileMutation.mutate(values);
  };

  // Submit password form
  const onPasswordSubmit = (values: PasswordFormValues) => {
    updatePasswordMutation.mutate(values);
  };

  // Notification types
  const notificationTypes = [
    { id: "email_notifications", label: t("Email Notifications"), description: t("Receive notifications via email") },
    { id: "assignment_reminders", label: t("Assignment Reminders"), description: t("Get reminded about upcoming assignments") },
    { id: "course_updates", label: t("Course Updates"), description: t("Be notified when course content is updated") },
    { id: "grade_alerts", label: t("Grade Alerts"), description: t("Receive alerts when new grades are posted") },
    { id: "system_announcements", label: t("System Announcements"), description: t("Important announcements from the university") },
  ];
  
  if (!user) return null;

  return (
    <Layout title="Settings">
      <div className="space-y-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="profile">{t('Profile')}</TabsTrigger>
            <TabsTrigger value="account">{t('Account')}</TabsTrigger>
            <TabsTrigger value="appearance">{t('Appearance')}</TabsTrigger>
            <TabsTrigger value="notifications">{t('Notifications')}</TabsTrigger>
            <TabsTrigger value="privacy">{t('Privacy')}</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>{t('Profile Settings')}</CardTitle>
                <CardDescription>
                  {t('Manage your personal information and how it appears on your profile')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Profile Avatar */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="" alt={user.firstName} />
                      <AvatarFallback className="text-2xl bg-primary-100 text-primary-700">
                        {user.firstName[0]}{user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="font-medium">{t('Profile Picture')}</h3>
                      <p className="text-sm text-gray-500">{t('This will be displayed on your profile and in your messages')}</p>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm">
                          <i className="fas fa-upload mr-2"></i>
                          {t('Upload')}
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500">
                          <i className="fas fa-trash-alt mr-2"></i>
                          {t('Remove')}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Profile Form */}
                  {profileSaved && (
                    <Alert className="bg-green-50 text-green-800 border-green-200">
                      <Check className="h-4 w-4 text-green-500" />
                      <AlertTitle>{t('Success')}</AlertTitle>
                      <AlertDescription>{t('Your profile has been updated successfully')}</AlertDescription>
                    </Alert>
                  )}

                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('First Name')}</FormLabel>
                              <FormControl>
                                <Input placeholder={t('First Name')} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('Last Name')}</FormLabel>
                              <FormControl>
                                <Input placeholder={t('Last Name')} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('Email')}</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder={t('Email')} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('Phone Number')}</FormLabel>
                              <FormControl>
                                <Input placeholder={t('Phone Number')} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={profileForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('Address')}</FormLabel>
                            <FormControl>
                              <Input placeholder={t('Address')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('Bio')}</FormLabel>
                            <FormControl>
                              <textarea 
                                className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                placeholder={t('Tell us a little about yourself')} 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          disabled={updateProfileMutation.isPending}
                        >
                          {updateProfileMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : null}
                          {t('Save Changes')}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>{t('Account Settings')}</CardTitle>
                <CardDescription>
                  {t('Manage your account credentials and authentication preferences')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Account Information */}
                  <div className="border p-4 rounded-lg">
                    <h3 className="font-medium mb-2">{t('Account Information')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">{t('Username')}</p>
                        <p className="font-medium">{user.username}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t('Student ID')}</p>
                        <p className="font-medium">{user.studentId || '219002134'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t('Account Status')}</p>
                        <p className="text-green-600 font-medium">{t('Active')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t('Last Login')}</p>
                        <p className="font-medium">{new Date().toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Change Password */}
                  <div>
                    <h3 className="font-medium mb-3">{t('Change Password')}</h3>
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('Current Password')}</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={passwordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('New Password')}</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={passwordForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('Confirm New Password')}</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <Button 
                            type="submit" 
                            disabled={updatePasswordMutation.isPending}
                          >
                            {updatePasswordMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            {t('Update Password')}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>

                  {/* Language Settings */}
                  <div>
                    <h3 className="font-medium mb-3">{t('Language Settings')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">{t('Preferred Language')}</Label>
                        <Select
                          value={currentLanguage}
                          onValueChange={changeLanguage}
                        >
                          <SelectTrigger id="language">
                            <SelectValue placeholder={t('Select language')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="rw">Kinyarwanda</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">{t('This will change the language for the entire portal')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Session Management */}
                  <div>
                    <h3 className="font-medium mb-3">{t('Session Management')}</h3>
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>{t('Important')}</AlertTitle>
                      <AlertDescription>
                        {t('Logging out from all devices will terminate all your active sessions and require you to log in again.')}
                      </AlertDescription>
                    </Alert>
                    <Button variant="destructive">
                      <i className="fas fa-sign-out-alt mr-2"></i>
                      {t('Log Out From All Devices')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>{t('Appearance')}</CardTitle>
                <CardDescription>
                  {t('Customize how the portal looks and feels')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Theme Selection */}
                  <div>
                    <h3 className="font-medium mb-3">{t('Theme')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-lg p-4 flex flex-col items-center cursor-pointer hover:border-primary-500 transition-colors">
                        <div className="h-20 w-full rounded bg-white border mb-3"></div>
                        <p className="font-medium">{t('Light')}</p>
                        <p className="text-xs text-gray-500">{t('Default')}</p>
                      </div>
                      <div className="border rounded-lg p-4 flex flex-col items-center cursor-pointer hover:border-primary-500 transition-colors">
                        <div className="h-20 w-full rounded bg-gray-900 border border-gray-700 mb-3"></div>
                        <p className="font-medium">{t('Dark')}</p>
                        <p className="text-xs text-gray-500">{t('Easier on the eyes')}</p>
                      </div>
                      <div className="border rounded-lg p-4 flex flex-col items-center cursor-pointer hover:border-primary-500 transition-colors">
                        <div className="h-20 w-full rounded bg-gradient-to-r from-gray-200 to-white border mb-3"></div>
                        <p className="font-medium">{t('System')}</p>
                        <p className="text-xs text-gray-500">{t('Follows system preference')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Color Scheme */}
                  <div>
                    <h3 className="font-medium mb-3">{t('Color Scheme')}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="border rounded-lg p-2 flex flex-col items-center cursor-pointer hover:border-primary-500 transition-colors">
                        <div className="h-10 w-full rounded bg-primary-500 mb-2"></div>
                        <p className="text-sm font-medium">{t('Default Blue')}</p>
                      </div>
                      <div className="border rounded-lg p-2 flex flex-col items-center cursor-pointer hover:border-primary-500 transition-colors">
                        <div className="h-10 w-full rounded bg-green-600 mb-2"></div>
                        <p className="text-sm font-medium">{t('Green')}</p>
                      </div>
                      <div className="border rounded-lg p-2 flex flex-col items-center cursor-pointer hover:border-primary-500 transition-colors">
                        <div className="h-10 w-full rounded bg-purple-600 mb-2"></div>
                        <p className="text-sm font-medium">{t('Purple')}</p>
                      </div>
                      <div className="border rounded-lg p-2 flex flex-col items-center cursor-pointer hover:border-primary-500 transition-colors">
                        <div className="h-10 w-full rounded bg-red-600 mb-2"></div>
                        <p className="text-sm font-medium">{t('Red')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Text Size */}
                  <div>
                    <h3 className="font-medium mb-3">{t('Text Size')}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="text-size">{t('Size')}</Label>
                        <span className="text-sm text-gray-500">{t('Normal')}</span>
                      </div>
                      <input
                        id="text-size"
                        type="range"
                        min="0"
                        max="2"
                        step="1"
                        defaultValue="1"
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{t('Small')}</span>
                        <span>{t('Normal')}</span>
                        <span>{t('Large')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Motion and Animations */}
                  <div>
                    <h3 className="font-medium mb-3">{t('Motion & Animations')}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="reduced-motion" defaultChecked={false} />
                        <Label htmlFor="reduced-motion">{t('Reduce motion')}</Label>
                      </div>
                      <p className="text-sm text-gray-500">
                        {t('When enabled, this reduces the amount of animations and transitions in the interface')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>{t('Save Preferences')}</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>{t('Notification Preferences')}</CardTitle>
                <CardDescription>
                  {t('Choose how and when you want to be notified')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Notification Channels */}
                  <div>
                    <h3 className="font-medium mb-3">{t('Notification Channels')}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-notifications">{t('Email')}</Label>
                          <p className="text-sm text-gray-500">{t('Receive notifications via email')}</p>
                        </div>
                        <Switch id="email-notifications" defaultChecked={true} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="sms-notifications">{t('SMS')}</Label>
                          <p className="text-sm text-gray-500">{t('Receive notifications via text message')}</p>
                        </div>
                        <Switch id="sms-notifications" defaultChecked={false} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="browser-notifications">{t('Browser Notifications')}</Label>
                          <p className="text-sm text-gray-500">{t('Receive notifications in your browser')}</p>
                        </div>
                        <Switch id="browser-notifications" defaultChecked={true} />
                      </div>
                    </div>
                  </div>

                  {/* Notification Types */}
                  <div>
                    <h3 className="font-medium mb-3">{t('Notification Types')}</h3>
                    <div className="space-y-4">
                      {notificationTypes.map((type) => (
                        <div key={type.id} className="flex items-center justify-between">
                          <div>
                            <Label htmlFor={type.id}>{type.label}</Label>
                            <p className="text-sm text-gray-500">{type.description}</p>
                          </div>
                          <Switch id={type.id} defaultChecked={true} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notification Frequency */}
                  <div>
                    <h3 className="font-medium mb-3">{t('Notification Frequency')}</h3>
                    <div className="space-y-2">
                      <Label htmlFor="notification-frequency">{t('Digest Frequency')}</Label>
                      <Select defaultValue="instant">
                        <SelectTrigger id="notification-frequency">
                          <SelectValue placeholder={t('Select frequency')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instant">{t('Instant - As they happen')}</SelectItem>
                          <SelectItem value="daily">{t('Daily Digest')}</SelectItem>
                          <SelectItem value="weekly">{t('Weekly Digest')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        {t('Important notifications will always be sent immediately')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>{t('Save Notification Preferences')}</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>{t('Privacy Settings')}</CardTitle>
                <CardDescription>
                  {t('Control your privacy and data sharing preferences')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Profile Visibility */}
                  <div>
                    <h3 className="font-medium mb-3">{t('Profile Visibility')}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="show-email">{t('Show Email Address')}</Label>
                          <p className="text-sm text-gray-500">{t('Allow others to see your email address')}</p>
                        </div>
                        <Switch id="show-email" defaultChecked={false} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="show-phone">{t('Show Phone Number')}</Label>
                          <p className="text-sm text-gray-500">{t('Allow others to see your phone number')}</p>
                        </div>
                        <Switch id="show-phone" defaultChecked={false} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="show-activity">{t('Show Activity Status')}</Label>
                          <p className="text-sm text-gray-500">{t('Show when you are active on the portal')}</p>
                        </div>
                        <Switch id="show-activity" defaultChecked={true} />
                      </div>
                    </div>
                  </div>

                  {/* Data Usage */}
                  <div>
                    <h3 className="font-medium mb-3">{t('Data Usage')}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="analytics">{t('Usage Analytics')}</Label>
                          <p className="text-sm text-gray-500">{t('Allow collection of anonymized usage data to improve the portal')}</p>
                        </div>
                        <Switch id="analytics" defaultChecked={true} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="personalization">{t('Personalization')}</Label>
                          <p className="text-sm text-gray-500">{t('Allow personalization of content based on your activity')}</p>
                        </div>
                        <Switch id="personalization" defaultChecked={true} />
                      </div>
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div>
                    <h3 className="font-medium mb-3">{t('Security')}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="two-factor">{t('Two-Factor Authentication')}</Label>
                          <p className="text-sm text-gray-500">{t('Add an extra layer of security to your account')}</p>
                        </div>
                        <div>
                          <Button variant="outline">{t('Set Up 2FA')}</Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="login-history">{t('Login History')}</Label>
                          <p className="text-sm text-gray-500">{t('View your recent login activity')}</p>
                        </div>
                        <div>
                          <Button variant="outline">{t('View History')}</Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Data */}
                  <div>
                    <h3 className="font-medium mb-3">{t('Your Data')}</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {t('You can request a copy of all your personal data, or request deletion of certain information')}
                    </p>
                    <div className="flex flex-col md:flex-row gap-2">
                      <Button variant="outline">
                        <i className="fas fa-download mr-2"></i>
                        {t('Download Your Data')}
                      </Button>
                      <Button variant="outline" className="text-red-500">
                        <i className="fas fa-trash-alt mr-2"></i>
                        {t('Delete Account Data')}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>{t('Save Privacy Settings')}</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
