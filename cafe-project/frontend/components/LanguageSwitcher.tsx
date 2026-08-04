"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, Locale } from "@/i18n";

const labels: Record<Locale, string> = {
  tr: "TR",
  en: "EN",
  ar: "AR",
};

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (target: Locale) => {
    // Mevcut yoldaki dil kodunu hedef dil koduyla degistir
    const segments = pathname.split("/");
    segments[1] = target;
    router.push(segments.join("/") || "/");
  };

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Dil seçimi / Language / اللغة">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center">
          <button
            onClick={() => switchTo(l)}
            aria-current={l === locale}
            className={`text-xs tracking-widest2 px-2 py-1 transition-colors ${
              l === locale ? "text-gilt-light" : "text-sand/50 hover:text-sand"
            }`}
          >
            {labels[l]}
          </button>
          {i < locales.length - 1 && <span className="text-sand/20">/</span>}
        </span>
      ))}
    </div>
  );
}
