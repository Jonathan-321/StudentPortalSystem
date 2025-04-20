import { QueryClient, QueryFunction } from "@tanstack/react-query";
import offlineStorage from './offlineStorage';

// Network status check
let isOnline = navigator.onLine;
window.addEventListener('online', () => { isOnline = true; });
window.addEventListener('offline', () => { isOnline = false; });

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  if (!isOnline) {
    // If we're offline, store the request for later syncing
    if (method !== 'GET') {
      console.log('Storing offline request for later:', { method, url, data });
      await offlineStorage.storeOfflineRequest(url, method, data);
    }
    
    // For GET requests, throw an error that we can handle in the UI
    throw new Error('You are currently offline. This request will be processed when you reconnect.');
  }

  try {
    const res = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    await throwIfResNotOk(res);
    
    // If this is a GET request for data we want to cache, store it for offline use
    if (method === 'GET' && res.ok) {
      const clonedRes = res.clone(); // Clone the response to avoid consuming it
      const responseData = await clonedRes.json();
      
      // Determine the storage key based on the URL path
      if (url.includes('/api/user')) {
        await offlineStorage.cacheUser(responseData);
      } else if (url.includes('/api/courses')) {
        await offlineStorage.cacheItems('courses', Array.isArray(responseData) ? responseData : [responseData]);
      } else if (url.includes('/api/academics')) {
        await offlineStorage.cacheItems('academics', Array.isArray(responseData) ? responseData : [responseData]);
      } else if (url.includes('/api/tasks')) {
        await offlineStorage.cacheItems('tasks', Array.isArray(responseData) ? responseData : [responseData]);
      } else if (url.includes('/api/notifications')) {
        await offlineStorage.cacheItems('notifications', Array.isArray(responseData) ? responseData : [responseData]);
      } else if (url.includes('/api/finances')) {
        await offlineStorage.cacheItems('finances', Array.isArray(responseData) ? responseData : [responseData]);
      } else if (url.includes('/api/announcements')) {
        await offlineStorage.cacheItems('announcements', Array.isArray(responseData) ? responseData : [responseData]);
      }
    }
    
    return res;
  } catch (error) {
    if (!isOnline && method !== 'GET') {
      // If we're offline and it's not a GET request, store it for later
      console.log('Storing failed request for later:', { method, url, data });
      await offlineStorage.storeOfflineRequest(url, method, data);
      
      // Create a fake "ok" response
      const fakeResponse = new Response(JSON.stringify({ 
        offlineQueued: true, 
        message: 'Your request has been queued and will be processed when you are back online.' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
      
      return fakeResponse;
    }
    
    throw error;
  }
}

// Function to process offline requests when online
export async function processOfflineRequests() {
  if (!isOnline) return;
  
  const requests = await offlineStorage.getOfflineRequests();
  if (requests.length === 0) return;
  
  console.log(`Processing ${requests.length} offline requests...`);
  
  for (const request of requests) {
    try {
      console.log('Processing request:', request);
      await fetch(request.url, {
        method: request.method,
        headers: request.body ? { "Content-Type": "application/json" } : {},
        body: request.body ? JSON.stringify(request.body) : undefined,
        credentials: "include",
      });
      
      await offlineStorage.deleteOfflineRequest(request.id);
    } catch (error) {
      console.error('Failed to process offline request:', error);
    }
  }
  
  // Invalidate queries to refresh data
  queryClient.invalidateQueries();
}

// Set up listener for coming back online
window.addEventListener('online', () => {
  console.log('Back online, processing queued requests...');
  processOfflineRequests();
});

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // If we're offline, try to get data from cache
    if (!isOnline) {
      console.log('Offline: Attempting to load from cache for', queryKey[0]);
      
      // Get data from the appropriate store based on the query key
      const path = queryKey[0] as string;
      
      if (path.includes('/api/user')) {
        const userData = await offlineStorage.getCachedUser();
        if (userData) {
          console.log('Loaded user data from cache');
          return userData;
        }
      } else if (path.includes('/api/courses')) {
        const courses = await offlineStorage.getAllItems('courses');
        if (courses.length > 0) {
          console.log('Loaded courses from cache:', courses.length);
          return courses;
        }
      } else if (path.includes('/api/academics')) {
        const academics = await offlineStorage.getAllItems('academics');
        if (academics.length > 0) {
          console.log('Loaded academics from cache:', academics.length);
          return academics;
        }
      } else if (path.includes('/api/tasks')) {
        const tasks = await offlineStorage.getAllItems('tasks');
        if (tasks.length > 0) {
          console.log('Loaded tasks from cache:', tasks.length);
          return tasks;
        }
      } else if (path.includes('/api/notifications')) {
        const notifications = await offlineStorage.getAllItems('notifications');
        if (notifications.length > 0) {
          console.log('Loaded notifications from cache:', notifications.length);
          return notifications;
        }
      } else if (path.includes('/api/finances')) {
        const finances = await offlineStorage.getAllItems('finances');
        if (finances.length > 0) {
          console.log('Loaded finances from cache:', finances.length);
          return finances;
        }
      } else if (path.includes('/api/announcements')) {
        const announcements = await offlineStorage.getAllItems('announcements');
        if (announcements.length > 0) {
          console.log('Loaded announcements from cache:', announcements.length);
          return announcements;
        }
      }
      
      // If we didn't find cached data, throw a user-friendly error
      throw new Error('You are currently offline and the requested data is not available offline.');
    }
    
    // If we're online, proceed with the normal fetch
    try {
      const res = await fetch(queryKey[0] as string, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      const data = await res.json();
      
      // Cache the data for offline use
      if (res.ok) {
        const path = queryKey[0] as string;
        
        if (path.includes('/api/user')) {
          await offlineStorage.cacheUser(data);
        } else if (path.includes('/api/courses')) {
          await offlineStorage.cacheItems('courses', Array.isArray(data) ? data : [data]);
        } else if (path.includes('/api/academics')) {
          await offlineStorage.cacheItems('academics', Array.isArray(data) ? data : [data]);
        } else if (path.includes('/api/tasks')) {
          await offlineStorage.cacheItems('tasks', Array.isArray(data) ? data : [data]);
        } else if (path.includes('/api/notifications')) {
          await offlineStorage.cacheItems('notifications', Array.isArray(data) ? data : [data]);
        } else if (path.includes('/api/finances')) {
          await offlineStorage.cacheItems('finances', Array.isArray(data) ? data : [data]);
        } else if (path.includes('/api/announcements')) {
          await offlineStorage.cacheItems('announcements', Array.isArray(data) ? data : [data]);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      
      // If we had an error and we're offline, try to get from cache as fallback
      if (!isOnline) {
        // Same cache-fetching logic as above
        const path = queryKey[0] as string;
        
        if (path.includes('/api/user')) {
          const userData = await offlineStorage.getCachedUser();
          if (userData) return userData;
        } else if (path.includes('/api/courses')) {
          const courses = await offlineStorage.getAllItems('courses');
          if (courses.length > 0) return courses;
        } else if (path.includes('/api/academics')) {
          const academics = await offlineStorage.getAllItems('academics');
          if (academics.length > 0) return academics;
        } else if (path.includes('/api/tasks')) {
          const tasks = await offlineStorage.getAllItems('tasks');
          if (tasks.length > 0) return tasks;
        } else if (path.includes('/api/notifications')) {
          const notifications = await offlineStorage.getAllItems('notifications');
          if (notifications.length > 0) return notifications;
        } else if (path.includes('/api/finances')) {
          const finances = await offlineStorage.getAllItems('finances');
          if (finances.length > 0) return finances;
        } else if (path.includes('/api/announcements')) {
          const announcements = await offlineStorage.getAllItems('announcements');
          if (announcements.length > 0) return announcements;
        }
      }
      
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
