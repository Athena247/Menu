// Backend API ile iletisim icin yardimci fonksiyonlar (herkese acik veri - SSR uyumlu)
import { Category, Product, Settings } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function safeFetch<T>(url: string, fallback: T, revalidate = 60): Promise<T> {
  try {
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) throw new Error(`API hatasi: ${res.status}`);
    return (await res.json()) as T;
  } catch (error) {
    console.error(`Veri cekilemedi (${url}):`, error);
    return fallback;
  }
}

export const getCategories = () => safeFetch<Category[]>(`${API_URL}/categories`, []);

export const getProducts = () => safeFetch<Product[]>(`${API_URL}/products`, []);

export const getSettings = () =>
  safeFetch<Settings | null>(`${API_URL}/settings`, null);
