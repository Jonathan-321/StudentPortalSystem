// API configuration for different environments
export const API_BASE_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.PROD 
    ? '' // In production, use same origin
    : 'http://localhost:3000' // In development, use local server
);

export function getApiUrl(path: string) {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}