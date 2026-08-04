"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi, setToken } from "@/lib/adminApi";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await adminApi.login(username, password);
      setToken(data.token);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Giriş başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="text-center text-xs tracking-widest2 text-gilt-light">KAFE</p>
        <h1 className="mt-3 text-center font-display text-2xl italic text-sand">
          Yönetim Paneli Girişi
        </h1>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div>
            <label className="mb-1.5 block text-xs text-sand/50">Kullanıcı Adı</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-sm border border-ink-line bg-ink-soft px-4 py-2.5 text-sand outline-none focus:border-gilt"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-sand/50">Şifre</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-sm border border-ink-line bg-ink-soft px-4 py-2.5 text-sand outline-none focus:border-gilt"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-gilt/60 py-2.5 text-xs tracking-widest2 text-gilt-light transition-colors hover:bg-gilt/10 disabled:opacity-50"
          >
            {loading ? "Giriş yapılıyor..." : "GİRİŞ YAP"}
          </button>
        </form>
      </div>
    </div>
  );
}
