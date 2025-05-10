const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4567';



import { getAuthToken } from './auth';


export const apiFetch = async (
  path: string,
  method: string = 'GET',
  body?: any
) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Errore di rete' }));
    throw new Error(error.error || 'Errore');
  }

  return res.json();

};
