import Image from "next/image";
import { Product } from "@/types";
import { Locale } from "@/i18n";

export default function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const name = product.name[locale];
  const description = product.description?.[locale];

  return (
    <div className="group flex gap-5 border-b border-ink-line/50 py-6 first:pt-0 last:border-none">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-ink-line/40 sm:h-24 sm:w-24">
        {product.image?.url ? (
          <Image
            src={product.image.url}
            alt={name}
            fill
            sizes="96px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-sand/30">
            {name.slice(0, 1)}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-lg text-sand">{name}</h3>
          <span className="whitespace-nowrap font-display text-lg text-gilt-light">
            {product.price.toLocaleString(locale === "ar" ? "ar" : locale, {
              style: "currency",
              currency: product.currency || "TRY",
              maximumFractionDigits: 0,
            })}
          </span>
        </div>
        {description ? (
          <p className="mt-1 text-sm leading-relaxed text-sand/50">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
