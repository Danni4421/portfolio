import { Effect } from "effect";

const getHeaders = (token?: string | null) => {
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const apiClient = {
  getToken: () => localStorage.getItem("admin_token"),
  setToken: (token: string) => localStorage.setItem("admin_token", token),
  getRefreshToken: () => localStorage.getItem("admin_refresh_token"),
  setRefreshToken: (token: string) => localStorage.setItem("admin_refresh_token", token),
  // ponytail: removeToken clears both access and refresh tokens to avoid redundant cleanup calls
  removeToken: () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_refresh_token");
  },
  isAuthenticated: () => !!localStorage.getItem("admin_token"),

  request: <T = unknown>(url: string, options: RequestInit = {}): Effect.Effect<T, Error> =>
    Effect.tryPromise({
      try: async () => {
        const token = apiClient.getToken();
        const headers = {
          ...getHeaders(token),
          ...options.headers,
        } as Record<string, string>;

        if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
          headers["Content-Type"] = "application/json";
        }

        const response = await fetch(url, { ...options, headers });
        if (!response.ok) {
          if (response.status === 401 && !url.includes("/api/v1/auth/refresh")) {
            // ponytail: attempt silent token refresh on 401 using stored refresh token
            const refreshToken = apiClient.getRefreshToken();
            if (refreshToken) {
              try {
                const refreshRes = await fetch("/api/v1/auth/refresh", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ refresh_token: refreshToken }),
                });

                if (refreshRes.ok) {
                  const refreshData = await refreshRes.json();
                  const newToken = refreshData.token || refreshData.data?.token;
                  const newRefreshToken = refreshData.refresh_token || refreshData.data?.refresh_token;

                  if (newToken) {
                    apiClient.setToken(newToken);
                    if (newRefreshToken) {
                      apiClient.setRefreshToken(newRefreshToken);
                    }

                    // Retry original request with the new token
                    const retriedHeaders = {
                      ...headers,
                      ...getHeaders(newToken),
                    };
                    const retryResponse = await fetch(url, { ...options, headers: retriedHeaders });
                    if (retryResponse.ok) {
                      return retryResponse.json() as Promise<T>;
                    }

                    // If retry fails, extract its error and clean up token if unauthorized
                    const errBody = await retryResponse.json().catch(() => ({}));
                    if (retryResponse.status === 401) {
                      apiClient.removeToken();
                    }
                    throw new Error(errBody.message || errBody.error || `Request failed: ${retryResponse.statusText}`);
                  }
                }
              } catch (refreshErr) {
                console.error("Token refresh failed:", refreshErr);
              }
            }
            apiClient.removeToken();
          }
          const errBody = await response.json().catch(() => ({}));
          throw new Error(errBody.message || errBody.error || `Request failed: ${response.statusText}`);
        }
        return response.json() as Promise<T>;
      },
      catch: (unknownError) => new Error(String(unknownError)),
    }),

  get: <T = unknown>(url: string) => apiClient.request<T>(url, { method: "GET" }),

  post: <T = unknown>(url: string, body: unknown) =>
    apiClient.request<T>(url, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: <T = unknown>(url: string, body: unknown) =>
    apiClient.request<T>(url, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: <T = unknown>(url: string, queryParams?: string) =>
    apiClient.request<T>(`${url}${queryParams || ""}`, { method: "DELETE" }),

  uploadFile: (file: File): Effect.Effect<string, Error> =>
    Effect.gen(function* (_) {
      const formData = new FormData();
      formData.append("file", file);
      const res = yield* _(
        apiClient.post<{ success: boolean; data: { url: string } }>("/api/v1/storage/upload", formData)
      );
      return res.data.url;
    }),
};
