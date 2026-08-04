// Admin panel icin backend istekleri - JWT token localStorage'da tutulur
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "cafe_admin_token";

export const getToken = () => (typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null);
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body && !(options.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Bir hata olustu");
  }
  return data;
}

export const adminApi = {
  login: (username: string, password: string) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ username, password }) }),
  me: () => request("/auth/me"),

  getCategoriesAll: () => request("/categories/all"),
  createCategory: (payload: unknown) =>
    request("/categories", { method: "POST", body: JSON.stringify(payload) }),
  updateCategory: (id: string, payload: unknown) =>
    request(`/categories/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteCategory: (id: string) => request(`/categories/${id}`, { method: "DELETE" }),

  getProductsAll: () => request("/products/all"),
  createProduct: (payload: unknown) =>
    request("/products", { method: "POST", body: JSON.stringify(payload) }),
  updateProduct: (id: string, payload: unknown) =>
    request(`/products/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteProduct: (id: string) => request(`/products/${id}`, { method: "DELETE" }),

  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return request("/upload", { method: "POST", body: formData });
  },

  getSettings: () => request("/settings"),
  updateSettings: (payload: unknown) =>
    request("/settings", { method: "PUT", body: JSON.stringify(payload) }),
};
