import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["/api/notifications"],
    enabled: !!user && isOpen,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("PATCH", `/api/notifications/${id}/read`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", "/api/notifications/read-all");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  if (!isOpen) return null;

  const newNotifications = notifications?.filter(notification => !notification.isRead) || [];
  const oldNotifications = notifications?.filter(notification => notification.isRead) || [];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'academic':
        return 'fas fa-book';
      case 'financial':
        return 'fas fa-money-bill';
      case 'general':
      default:
        return 'fas fa-bell';
    }
  };

  const getTimeAgo = (date: string) => {
    try {
      const notificationDate = new Date(date);
      return formatDistanceToNow(notificationDate, { addSuffix: true });
    } catch (error) {
      return date;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50">
      <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-bold font-heading">{t('Notifications')}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="overflow-y-auto h-full pb-32">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{t('New')}</span>
                  {newNotifications.length > 0 && (
                    <button 
                      onClick={() => markAllAsReadMutation.mutate()}
                      className="text-sm text-primary-500 hover:underline"
                    >
                      {t('Mark all as read')}
                    </button>
                  )}
                </div>
                {newNotifications.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4 text-center">{t('No new notifications')}</p>
                ) : (
                  <ul className="space-y-4">
                    {newNotifications.map((notification) => (
                      <li 
                        key={notification.id} 
                        className="bg-blue-50 p-3 rounded-lg"
                        onClick={() => markAsReadMutation.mutate(notification.id)}
                      >
                        <div className="flex items-start">
                          <div className="bg-primary-100 text-primary-500 rounded-full p-2 mr-3">
                            <i className={getNotificationIcon(notification.type)}></i>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <span>{getTimeAgo(notification.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div className="p-4">
                <div className="mb-2">
                  <span className="font-medium">{t('Earlier')}</span>
                </div>
                {oldNotifications.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4 text-center">{t('No earlier notifications')}</p>
                ) : (
                  <ul className="space-y-4">
                    {oldNotifications.map((notification) => (
                      <li key={notification.id} className="p-3 rounded-lg hover:bg-gray-50">
                        <div className="flex items-start">
                          <div className="bg-gray-100 text-gray-500 rounded-full p-2 mr-3">
                            <i className={getNotificationIcon(notification.type)}></i>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <span>{getTimeAgo(notification.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
