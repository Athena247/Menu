"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";

const empty = {
  cafeName: "",
  aboutText: { tr: "", en: "", ar: "" },
  workingHoursText: { tr: "", en: "", ar: "" },
  googleMapsUrl: "",
  phone: "",
  instagramUrl: "",
  onlineOrderUrl: "",
  onlineOrderLabel: "",
};

export default function SettingsPage() {
  const [form, setForm] = useState<any>(empty);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.getSettings().then((data) => setForm({ ...empty, ...data })).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    setSaved(false);
    try {
      await adminApi.updateSettings(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kaydedilemedi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl italic text-sand">Site Ayarları</h1>
      <p className="mt-2 text-sm text-sand/50">
        Ana sayfa ve site altında (footer) görünen bilgileri buradan güncelleyin.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-8">
        <Section title="Genel">
          <Field label="Kafe Adı" value={form.cafeName} onChange={(v) => setForm({ ...form, cafeName: v })} />
        </Section>

        <Section title="Hakkımızda Metni">
          <TextArea label="Türkçe" value={form.aboutText.tr} onChange={(v) => setForm({ ...form, aboutText: { ...form.aboutText, tr: v } })} />
          <TextArea label="İngilizce" value={form.aboutText.en} onChange={(v) => setForm({ ...form, aboutText: { ...form.aboutText, en: v } })} />
          <TextArea label="Arapça" dir="rtl" value={form.aboutText.ar} onChange={(v) => setForm({ ...form, aboutText: { ...form.aboutText, ar: v } })} />
        </Section>

        <Section title="Çalışma Saatleri">
          <Field label="Türkçe (örn: Her gün 08:00 - 23:00)" value={form.workingHoursText.tr} onChange={(v) => setForm({ ...form, workingHoursText: { ...form.workingHoursText, tr: v } })} />
          <Field label="İngilizce" value={form.workingHoursText.en} onChange={(v) => setForm({ ...form, workingHoursText: { ...form.workingHoursText, en: v } })} />
          <Field label="Arapça" dir="rtl" value={form.workingHoursText.ar} onChange={(v) => setForm({ ...form, workingHoursText: { ...form.workingHoursText, ar: v } })} />
          <Field
            label="Google Maps Konum Linki"
            value={form.googleMapsUrl}
            onChange={(v) => setForm({ ...form, googleMapsUrl: v })}
            placeholder="https://maps.app.goo.gl/..."
          />
        </Section>

        <Section title="İletişim">
          <Field
            label="Telefon (uluslararası format, örn: +905551234567)"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
          />
          <Field label="Instagram Linki" value={form.instagramUrl} onChange={(v) => setForm({ ...form, instagramUrl: v })} />
        </Section>

        <Section title="Online Satış">
          <Field
            label="Sipariş Linki (Trendyol, Getir vb.)"
            value={form.onlineOrderUrl}
            onChange={(v) => setForm({ ...form, onlineOrderUrl: v })}
          />
          <Field
            label="Buton Etiketi (örn: Getir'den Sipariş Ver)"
            value={form.onlineOrderLabel}
            onChange={(v) => setForm({ ...form, onlineOrderLabel: v })}
          />
        </Section>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {saved && <p className="text-sm text-green-400">Ayarlar kaydedildi.</p>}

        <button
          type="submit"
          disabled={saving}
          className="border border-gilt/60 px-8 py-2.5 text-xs tracking-widest2 text-gilt-light hover:bg-gilt/10 disabled:opacity-50"
        >
          {saving ? "Kaydediliyor..." : "KAYDET"}
        </button>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-ink-line bg-ink-soft p-6">
      <h2 className="mb-4 text-sm text-gilt-light">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  dir,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  dir?: "rtl" | "ltr";
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-sand/50">{label}</label>
      <input
        dir={dir}
        placeholder={placeholder}
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
