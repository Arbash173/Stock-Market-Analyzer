
export const API_BASE = '/api';

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  } as HeadersInit;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle non-JSON responses or network errors
  if (!response.ok) {
     const errorText = await response.text();
     throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data;
}
