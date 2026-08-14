export const API_BASE = "https://whitesmoke-jaguar-842419.hostingersite.com/api";

const TOKEN_KEY = "admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface Product {
  id: number;
  image_url: string;
  title: string;
  description: string;
  price: number;
  is_featured: boolean;
}

export interface Settings {
  paper_price: number;
  delivery_price: number;
  whatsapp_number: string;
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;
  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean; isForm?: boolean } = {},
): Promise<ApiResponse<T>> {
  const { method = "GET", body, auth = false, isForm = false } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  let payload: BodyInit | undefined;
  if (body !== undefined) {
    if (isForm && body instanceof FormData) {
      payload = body;
    } else {
      headers["Content-Type"] = "application/json";
      payload = JSON.stringify(body);
    }
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: payload,
  });

  let json: ApiResponse<T>;
  try {
    json = (await res.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError(`Request failed (${res.status})`, res.status);
  }

  if (!res.ok || json.success === false) {
    if (res.status === 401) setToken(null);
    throw new ApiError(json.message || "Request failed", res.status, json.errors);
  }
  return json;
}

// Auth
export const login = (email: string, password: string) =>
  request<{ token: string; token_type: string }>("/dashboard/login", {
    method: "POST",
    body: { email, password },
  });

export const logout = () =>
  request<null>("/dashboard/logout", { method: "POST", auth: true });

// Settings
export const getSettings = () => request<Settings>("/settings");

export const updateSettings = (data: Settings) =>
  request<Settings>("/dashboard/settings", { method: "PUT", body: data, auth: true });

// Products
export const listProducts = (page = 1) =>
  request<Product[]>(`/products?page=${page}`);

export const getProduct = (id: number) => request<Product>(`/products/${id}`);

export const createProduct = (form: FormData) =>
  request<Product>("/dashboard/products", {
    method: "POST",
    body: form,
    auth: true,
    isForm: true,
  });

export const updateProduct = (id: number, form: FormData) => {
  // Laravel-friendly: spoof PUT via POST + _method
  form.append("_method", "PUT");
  return request<Product>(`/dashboard/products/${id}`, {
    method: "POST",
    body: form,
    auth: true,
    isForm: true,
  });
};

export const deleteProduct = (id: number) =>
  request<null>(`/dashboard/products/${id}`, { method: "DELETE", auth: true });
