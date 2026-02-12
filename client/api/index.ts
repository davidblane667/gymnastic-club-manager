// Get token from localStorage
const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
};

// Get API base URL
const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    const config = useRuntimeConfig();
    return config.public.apiBaseUrl;
  }
  return "http://localhost:3001/api";
};

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  skipAuth = false
): Promise<T> {
  const url = `${getApiBaseUrl()}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add token if available and auth is not skipped
  if (!skipAuth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    headers: {
      ...headers,
      ...(options.headers as Record<string, string>),
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || error.error || `HTTP error: ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, skipAuth = false) => request<T>(endpoint, {}, skipAuth),

  post: <T>(endpoint: string, data: unknown, skipAuth = false) =>
    request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }, skipAuth),

  put: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, {
      method: "DELETE",
    }),
};
