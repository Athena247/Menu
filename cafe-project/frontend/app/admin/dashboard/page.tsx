"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/adminApi";

export default function DashboardHome() {
  const [stats, setStats] = useState({ products: 0, categories: 0 });

  useEffect(() => {
    Promise.all([adminApi.getProductsAll(), adminApi.getCategoriesAll()])
      .then(([products, categories]) => {
        setStats({ products: products.length, categories: categories.length });
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl italic text-sand">Genel Bakış</h1>
      <p className="mt-2 text-sm text-sand/50">
        Hoş geldiniz. Buradan menünüzü, kategorilerinizi ve site ayarlarınızı yönetebilirsiniz.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Link
          href="/admin/dashboard/products"
          className="rounded-sm border border-ink-line bg-ink-soft p-6 transition-colors hover:border-gilt/50"
        >
          <p className="text-xs text-sand/40">Toplam Ürün</p>
          <p className="mt-2 font-display text-3xl text-gilt-light">{stats.products}</p>
          <p className="mt-3 text-sm text-sand/60">Ürünleri yönet →</p>
        </Link>

        <Link
          href="/admin/dashboard/categories"
          className="rounded-sm border border-ink-line bg-ink-soft p-6 transition-colors hover:border-gilt/50"
        >
          <p className="text-xs text-sand/40">Toplam Kategori</p>
          <p className="mt-2 font-display text-3xl text-gilt-light">{stats.categories}</p>
          <p className="mt-3 text-sm text-sand/60">Kategorileri yönet →</p>
        </Link>
      </div>
    </div>
  );
}
