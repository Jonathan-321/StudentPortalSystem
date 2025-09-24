import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getApiUrl } from './api-config';

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
  // Ensure URL is properly formatted with the API base URL
  const fullUrl = getApiUrl(url);

  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

export async function processOfflineRequests() {
  // Placeholder - no offline processing needed with Supabase
  console.log('Offline requests processing skipped - using Supabase');
}

const createQueryFn =
  <T>({ 
    path, 
    zodSchema,
  }: {
    path: string;
    zodSchema?: any;
  }): QueryFunction<T> =>
  async () => {
    const url = `${path}`;
    const res = await apiRequest("GET", url);
    const result = await res.json();

    if (zodSchema) {
      const parsed = zodSchema.safeParse(result);
      
      if (!parsed.success) {
        console.error('Validation error:', parsed.error.flatten());
        throw new Error("Validation error: " + parsed.error.message);
      }
      
      return parsed.data;
    }
    
    return result;
  };

// Create a query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: createQueryFn({ path: "" }),
      refetchOnMount: false,
      refetchOnWindowFocus: false, 
      refetchOnReconnect: true,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Helper function for auth queries that return null on 401
export const getQueryFn = ({ on401 }: { on401?: string }) => {
  return async () => {
    try {
      const res = await apiRequest("GET", "/api/user");
      if (!res.ok && res.status === 401 && on401 === "returnNull") {
        return null;
      }
      return await res.json();
    } catch (error) {
      if (on401 === "returnNull") {
        return null;
      }
      throw error;
    }
  };
};

export { createQueryFn };