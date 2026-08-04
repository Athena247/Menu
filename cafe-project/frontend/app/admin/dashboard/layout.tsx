"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminApi, clearToken, getToken } from "@/lib/adminApi";

const links = [
  { href: "/admin/dashboard", label: "Genel Bakış" },
  { href: "/admin/dashboard/products", label: "Ürünler" },
  { href: "/admin/dashboard/categories", label: "Kategoriler" },
  { href: "/admin/dashboard/settings", label: "Site Ayarları" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    adminApi
      .me()
      .then(() => setChecking(false))
      .catch(() => {
        clearToken();
        router.replace("/admin/login");
      });
  }, [router]);

  const handleLogout = () => {
    clearToken();
    router.push("/admin/login");
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sand/50">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 border-r border-ink-line/60 bg-ink-soft p-6 md:block">
        <p className="mb-10 text-xs tracking-widest2 text-gilt-light">KAFE · ADMIN</p>
        <nav className="space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-sm px-3 py-2 text-sm transition-colors ${
                pathname === link.href
                  ? "bg-gilt/10 text-gilt-light"
                  : "text-sand/60 hover:bg-ink-line/40 hover:text-sand"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-10 w-full rounded-sm border border-ink-line px-3 py-2 text-left text-sm text-sand/50 transition-colors hover:border-red-400/40 hover:text-red-400"
        >
          Çıkış Yap
        </button>
      </aside>

      <div className="flex-1 p-6 md:p-10">{children}</div>
    </div>
  );
}
