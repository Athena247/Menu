"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Category, Product } from "@/types";
import { Locale } from "@/i18n";
import ProductCard from "./ProductCard";

export default function MenuBrowser({
  categories,
  products,
  locale,
}: {
  categories: Category[];
  products: Product[];
  locale: Locale;
}) {
  const t = useTranslations("menu");
  const [activeSlug, setActiveSlug] = useState<string>(categories[0]?.slug ?? "");

  const productsForActive = useMemo(
    () =>
      products.filter((p) => {
        const catId = typeof p.category === "string" ? p.category : p.category._id;
        const activeCat = categories.find((c) => c.slug === activeSlug);
        return activeCat ? catId === activeCat._id : false;
      }),
    [products, categories, activeSlug]
  );

  if (categories.length === 0) {
    return <p className="text-center text-sand/50">{t("empty")}</p>;
  }

  return (
    <div>
      {/* Kategori sekmeleri */}
      <div className="mb-12 flex flex-wrap justify-center gap-x-8 gap-y-3">
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setActiveSlug(cat.slug)}
            aria-current={cat.slug === activeSlug}
            className={`relative pb-2 text-sm tracking-wide transition-colors ${
              cat.slug === activeSlug ? "text-gilt-light" : "text-sand/50 hover:text-sand"
            }`}
          >
            {cat.name[locale]}
            {cat.slug === activeSlug && (
              <span className="absolute inset-x-0 -bottom-px h-px bg-gilt" />
            )}
          </button>
        ))}
      </div>

      {/* Aktif kategoriye ait urunler */}
      <div className="mx-auto max-w-2xl">
        {productsForActive.length > 0 ? (
          productsForActive.map((product) => (
            <ProductCard key={product._id} product={product} locale={locale} />
          ))
        ) : (
          <p className="text-center text-sm text-sand/40">{t("empty")}</p>
        )}
      </div>
    </div>
  );
}
