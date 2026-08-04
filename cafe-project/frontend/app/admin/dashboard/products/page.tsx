"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { adminApi } from "@/lib/adminApi";

interface Cat {
  _id: string;
  name: { tr: string; en: string; ar: string };
}

interface ProductForm {
  _id?: string;
  name: { tr: string; en: string; ar: string };
  description: { tr: string; en: string; ar: string };
  price: number;
  currency: string;
  category: string;
  image: { url: string; publicId?: string };
  isFeatured: boolean;
  isAvailable: boolean;
  order: number;
}

const emptyForm: ProductForm = {
  name: { tr: "", en: "", ar: "" },
  description: { tr: "", en: "", ar: "" },
  price: 0,
  currency: "TRY",
  category: "",
  image: { url: "" },
  isFeatured: false,
  isAvailable: true,
  order: 0,
};

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Cat[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = () => {
    adminApi.getProductsAll().then(setProducts).catch(() => {});
    adminApi.getCategoriesAll().then(setCategories).catch(() => {});
  };

  useEffect(load, []);

  const resetForm = () => {
    setForm({ ...emptyForm, category: categories[0]?._id || "" });
    setEditingId(null);
  };

  const handleEdit = (p: any) => {
    setForm({
      ...p,
      category: typeof p.category === "string" ? p.category : p.category._id,
    });
    setEditingId(p._id);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const res = await adminApi.uploadImage(file);
      setForm((f) => ({ ...f, image: { url: res.url, publicId: res.publicId } }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Resim yüklenemedi");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.category) {
      setError("Lütfen önce bir kategori seçin (kategori yoksa önce Kategoriler sayfasından ekleyin).");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await adminApi.updateProduct(editingId, form);
      } else {
        await adminApi.createProduct(form);
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
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    try {
      await adminApi.deleteProduct(id);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Silinemedi");
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl italic text-sand">Ürünler</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_420px]">
        {/* Liste */}
        <div className="space-y-3">
          {products.map((p) => (
            <div
              key={p._id}
              className="flex items-center justify-between gap-4 rounded-sm border border-ink-line bg-ink-soft px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-sm bg-ink-line">
                  {p.image?.url && (
                    <Image src={p.image.url} alt={p.name.tr} fill className="object-cover" />
                  )}
                </div>
                <div>
                  <p className="text-sand">
                    {p.name.tr} {!p.isAvailable && <span className="text-xs text-red-400">(gizli)</span>}
                    {p.isFeatured && <span className="ml-1 text-xs text-gilt-light">★</span>}
                  </p>
                  <p className="text-xs text-sand/40">
                    {p.category?.name?.tr || "Kategori yok"} · {p.price} {p.currency}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 gap-3 text-xs">
                <button onClick={() => handleEdit(p)} className="text-gilt-light hover:underline">
                  Düzenle
                </button>
                <button onClick={() => handleDelete(p._id)} className="text-red-400 hover:underline">
                  Sil
                </button>
              </div>
            </div>
          ))}
          {products.length === 0 && <p className="text-sm text-sand/40">Henüz ürün eklenmedi.</p>}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="h-fit space-y-4 rounded-sm border border-ink-line bg-ink-soft p-6"
        >
          <h2 className="text-sm text-gilt-light">{editingId ? "Ürünü Düzenle" : "Yeni Ürün"}</h2>

          <div>
            <label className="mb-1 block text-xs text-sand/50">Kategori</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-sm border border-ink-line bg-ink px-3 py-2 text-sm text-sand outline-none focus:border-gilt"
            >
              <option value="">Kategori seçin</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name.tr}
                </option>
              ))}
            </select>
          </div>

          <Field label="Ürün Adı (Türkçe)" value={form.name.tr} onChange={(v) => setForm({ ...form, name: { ...form.name, tr: v } })} />
          <Field label="Ürün Adı (İngilizce)" value={form.name.en} onChange={(v) => setForm({ ...form, name: { ...form.name, en: v } })} />
          <Field label="Ürün Adı (Arapça)" value={form.name.ar} onChange={(v) => setForm({ ...form, name: { ...form.name, ar: v } })} dir="rtl" />

          <TextArea label="Açıklama (Türkçe)" value={form.description.tr} onChange={(v) => setForm({ ...form, description: { ...form.description, tr: v } })} />
          <TextArea label="Açıklama (İngilizce)" value={form.description.en} onChange={(v) => setForm({ ...form, description: { ...form.description, en: v } })} />
          <TextArea label="Açıklama (Arapça)" value={form.description.ar} onChange={(v) => setForm({ ...form, description: { ...form.description, ar: v } })} dir="rtl" />

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Fiyat"
              type="number"
              value={String(form.price)}
              onChange={(v) => setForm({ ...form, price: Number(v) || 0 })}
            />
            <Field
              label="Para Birimi"
              value={form.currency}
              onChange={(v) => setForm({ ...form, currency: v.toUpperCase() })}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-sand/50">Ürün Görseli</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="text-xs text-sand/60" />
            {uploading && <p className="mt-1 text-xs text-gilt-light">Yükleniyor...</p>}
            {form.image?.url && (
              <div className="relative mt-2 h-24 w-24 overflow-hidden rounded-sm">
                <Image src={form.image.url} alt="Önizleme" fill className="object-cover" />
              </div>
            )}
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-sand/60">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              />
              Öne çıkan
            </label>
            <label className="flex items-center gap-2 text-sm text-sand/60">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
              />
              Sitede görünür
            </label>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving || uploading}
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

function TextArea({
  label,
  value,
  onChange,
  dir,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  dir?: "rtl" | "ltr";
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-sand/50">{label}</label>
      <textarea
        dir={dir}
        rows={2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-none rounded-sm border border-ink-line bg-ink px-3 py-2 text-sm text-sand outline-none focus:border-gilt"
      />
    </div>
  );
}
