"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";

interface CategoryForm {
  _id?: string;
  name: { tr: string; en: string; ar: string };
  slug: string;
  order: number;
  isActive: boolean;
}

const emptyForm: CategoryForm = {
  name: { tr: "", en: "", ar: "" },
  slug: "",
  order: 0,
  isActive: true,
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryForm[]>([]);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    adminApi.getCategoriesAll().then(setCategories).catch(() => {});
  };

  useEffect(load, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (cat: CategoryForm) => {
    setForm(cat);
    setEditingId(cat._id || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (editingId) {
        await adminApi.updateCategory(editingId, form);
      } else {
        await adminApi.createCategory(form);
      }
      resetForm();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kaydedilemedi");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;
    try {
      await adminApi.deleteCategory(id);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Silinemedi");
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl italic text-sand">Kategoriler</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        {/* Liste */}
        <div className="space-y-3">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="flex items-center justify-between rounded-sm border border-ink-line bg-ink-soft px-4 py-3"
            >
              <div>
                <p className="text-sand">{cat.name.tr}</p>
                <p className="text-xs text-sand/40">
                  /{cat.slug} · {cat.name.en} · {cat.name.ar}
                </p>
              </div>
              <div className="flex gap-3 text-xs">
                <button onClick={() => handleEdit(cat)} className="text-gilt-light hover:underline">
                  Düzenle
                </button>
                <button
                  onClick={() => cat._id && handleDelete(cat._id)}
                  className="text-red-400 hover:underline"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-sand/40">Henüz kategori eklenmedi.</p>
          )}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="h-fit space-y-4 rounded-sm border border-ink-line bg-ink-soft p-6"
        >
          <h2 className="text-sm text-gilt-light">
            {editingId ? "Kategoriyi Düzenle" : "Yeni Kategori"}
          </h2>

          <Field label="Ad (Türkçe)" value={form.name.tr} onChange={(v) => setForm({ ...form, name: { ...form.name, tr: v } })} />
          <Field label="Ad (İngilizce)" value={form.name.en} onChange={(v) => setForm({ ...form, name: { ...form.name, en: v } })} />
          <Field label="Ad (Arapça)" value={form.name.ar} onChange={(v) => setForm({ ...form, name: { ...form.name, ar: v } })} dir="rtl" />
          <Field
            label="Slug (URL için, örn: sicak-icecekler)"
            value={form.slug}
            onChange={(v) => setForm({ ...form, slug: v.toLowerCase().replace(/\s+/g, "-") })}
          />
          <Field
            label="Sıra"
            type="number"
            value={String(form.order)}
            onChange={(v) => setForm({ ...form, order: Number(v) || 0 })}
          />

          <label className="flex items-center gap-2 text-sm text-sand/60">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Sitede görünür
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 border border-gilt/60 py-2 text-xs tracking-widest2 text-gilt-light hover:bg-gilt/10 disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : editingId ? "GÜNCELLE" : "EKLE"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="border border-ink-line px-4 py-2 text-xs text-sand/50 hover:text-sand"
              >
                Vazgeç
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  dir,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  dir?: "rtl" | "ltr";
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-sand/50">{label}</label>
      <input
        type={type}
        dir={dir}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-sm border border-ink-line bg-ink px-3 py-2 text-sm text-sand outline-none focus:border-gilt"
      />
    </div>
  );
}
