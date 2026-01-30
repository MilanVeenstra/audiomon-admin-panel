// Backend API client - Wrapper voor alle backend calls

import { API_CONFIG } from "./config";

interface FetchOptions extends RequestInit {
  token?: string;
}

// Maak een request naar de backend API
export async function backendFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const url = `${API_CONFIG.BACKEND_BASE_URL}${path}`;

  const headers: HeadersInit = {
    ...fetchOptions.headers,
  };

  // Voeg authenticatie header toe als token aanwezig is
  if (token) {
    headers[API_CONFIG.AUTH_HEADER_NAME] = token;
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  // Voor binaire responses (zoals audio downloads)
  if (fetchOptions.method === "GET" && path.includes("audioDownload")) {
    return response as unknown as T;
  }

  // Parse JSON voor alle andere responses
  const data = await response.json();

  return data as T;
}

// Helper voor GET requests
export async function backendGet<T>(
  path: string,
  token?: string
): Promise<T> {
  return backendFetch<T>(path, { method: "GET", token });
}

// Helper voor POST requests
export async function backendPost<T>(
  path: string,
  body?: unknown,
  token?: string
): Promise<T> {
  return backendFetch<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    token,
  });
}

// Helper voor PUT requests
export async function backendPut<T>(
  path: string,
  body?: unknown,
  token?: string
): Promise<T> {
  return backendFetch<T>(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    token,
  });
}

// Helper voor DELETE requests
export async function backendDelete<T>(
  path: string,
  token?: string
): Promise<T> {
  return backendFetch<T>(path, { method: "DELETE", token });
}
