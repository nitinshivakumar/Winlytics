const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("winlytics_token");
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (token) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch (e) {
    throw new Error("Cannot reach server. Is the backend running? (e.g. uvicorn on port 8000)");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    const msg = Array.isArray(err.detail) ? err.detail.map((e: { msg?: string }) => e.msg || String(e)).join(", ") : err.detail;
    throw new Error(msg || "Request failed");
  }
  return res.json();
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") localStorage.setItem("winlytics_token", token);
}

export function clearAuthToken() {
  if (typeof window !== "undefined") localStorage.removeItem("winlytics_token");
}

export function getUserFromStorage() {
  if (typeof window === "undefined") return null;
  const u = localStorage.getItem("winlytics_user");
  return u ? JSON.parse(u) : null;
}

export function setUserInStorage(user: { id: number; name: string; email: string }) {
  if (typeof window !== "undefined") localStorage.setItem("winlytics_user", JSON.stringify(user));
}
