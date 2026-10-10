import { Effect } from "effect";

const getHeaders = (token?: string | null) => {
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const REFRESH_ENDPOINT = "/api/v1/auth/refresh";
const EXPIRY_SKEW_MS = 60_000;

// Decode the exp claim (seconds → ms) of a JWT without verifying it server-side
const decodeTokenExp = (token: string): number | null => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
    const json = JSON.parse(new TextDecoder().decode(bytes));
    return typeof json.exp === "number" ? json.exp * 1000 : null;
  } catch {
    return null;
  }
};

const isTokenFresh = (token: string | null): boolean => {
  if (!token) return false;
  const exp = decodeTokenExp(token);
  if (exp === null) return true;
  return exp - EXPIRY_SKEW_MS > Date.now();
};

// Single-flight refresh: concurrent 401s share one refresh round-trip
// (refresh tokens are rotated server-side, so parallel refreshes would fail)
let refreshInFlight: Promise<string | null> | null = null;

const refreshSession = (): Promise<string | null> => {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    try {
      const refreshToken = apiClient.getRefreshToken();
      if (!refreshToken) return null;
      const res = await fetch(REFRESH_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      if (!res.ok) {
        apiClient.removeToken();
        return null;
      }
      const body = await res.json();
      const newToken = body.token || body.data?.token;
      const newRefreshToken = body.refresh_token || body.data?.refresh_token;
      if (!newToken) return null;
      apiClient.setToken(newToken);
      if (newRefreshToken) apiClient.setRefreshToken(newRefreshToken);
      return newToken;
    } catch {
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
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
  // Session is alive if either token exists — an expired access token is silently renewed
  isAuthenticated: () =>
    !!localStorage.getItem("admin_token") || !!localStorage.getItem("admin_refresh_token"),

  request: <T = unknown>(url: string, options: RequestInit = {}): Effect.Effect<T, Error> =>
    Effect.tryPromise({
      try: async () => {
        const isAuthUrl = url.includes("/api/v1/auth/");
        let token = apiClient.getToken();

        // Proactive refresh: renew before the access token expires (or when only a refresh token remains)
        if (!isAuthUrl && apiClient.getRefreshToken() && !isTokenFresh(token)) {
          token = (await refreshSession()) ?? token;
        }

        const buildHeaders = (accessToken: string | null) => {
          const headers = {
            ...getHeaders(accessToken),
            ...options.headers,
          } as Record<string, string>;
          if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
            headers["Content-Type"] = "application/json";
          }
          return headers;
        };

        let response = await fetch(url, { ...options, headers: buildHeaders(token) });

        // Reactive refresh: on 401, rotate tokens once and retry the request
        if (response.status === 401 && !isAuthUrl && apiClient.getRefreshToken()) {
          const newToken = await refreshSession();
          if (newToken) {
            response = await fetch(url, { ...options, headers: buildHeaders(newToken) });
          }
        }

        if (!response.ok) {
          if (response.status === 401 && !isAuthUrl) {
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
