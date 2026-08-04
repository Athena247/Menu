import { useTranslations } from "next-intl";
import { Locale } from "@/i18n";
import { getCategories, getProducts, getSettings } from "@/lib/api";
import MenuBrowser from "@/components/MenuBrowser";
import ProductCard from "@/components/ProductCard";

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const [categories, products, settings] = await Promise.all([
    getCategories(),
    getProducts(),
    getSettings(),
  ]);

  const featured = products.filter((p) => p.isFeatured).slice(0, 3);

  return (
    <>
      <Hero locale={locale} />

      {featured.length > 0 && <FeaturedSection featured={featured} locale={locale} />}

      <section id="menu" className="mx-auto max-w-content px-6 py-24 md:px-10">
        <SectionHeading eyebrowKey="menu.eyebrow" titleKey="menu.title" />
        <MenuBrowser categories={categories} products={products} locale={locale} />
      </section>

      {settings?.aboutText?.[locale] && (
        <AboutSection text={settings.aboutText[locale]} />
      )}
    </>
  );
}

function Hero({ locale }: { locale: Locale }) {
  const t = useTranslations("hero");
  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Zemine derinlik veren cok hafif radial gold isik */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(184,147,91,0.12), transparent 60%)",
        }}
      />
      <p className="relative z-10 text-xs tracking-widest2 text-gilt-light">{t("eyebrow")}</p>
      <h1 className="relative z-10 mt-6 max-w-3xl font-display text-4xl italic leading-tight text-sand sm:text-5xl md:text-6xl">
        {t("title")}
      </h1>
      <p className="relative z-10 mt-6 max-w-md text-sand/60">{t("subtitle")}</p>
      <a
        href="#menu"
        className="relative z-10 mt-10 border border-gilt/60 px-8 py-3 text-xs tracking-widest2 text-gilt-light transition-colors hover:bg-gilt/10"
      >
        {t("cta")}
      </a>
    </section>
  );
}

function SectionHeading({ eyebrowKey, titleKey }: { eyebrowKey: string; titleKey: string }) {
  const t = useTranslations();
  return (
    <div className="mb-16 text-center">
      <p className="text-xs tracking-widest2 text-gilt-light">{t(eyebrowKey)}</p>
      <h2 className="mt-4 font-display text-3xl italic text-sand sm:text-4xl">{t(titleKey)}</h2>
      <div className="gilt-divider mt-6">
        <span className="dot" />
      </div>
    </div>
  );
}

function FeaturedSection({
  featured,
  locale,
}: {
  featured: Awaited<ReturnType<typeof getProducts>>;
  locale: Locale;
}) {
  const t = useTranslations("menu");
  return (
    <section className="border-y border-ink-line/60 bg-ink-soft/50">
      <div className="mx-auto max-w-content px-6 py-20 md:px-10">
        <p className="mb-10 text-center text-xs tracking-widest2 text-gilt-light">
          {t("featured")}
        </p>
        <div className="mx-auto max-w-2xl">
          {featured.map((product) => (
            <ProductCard key={product._id} product={product} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection({ text }: { text: string }) {
  const t = useTranslations("nav");
  return (
    <section id="hakkimizda" className="mx-auto max-w-content px-6 py-24 text-center md:px-10">
      <p className="text-xs tracking-widest2 text-gilt-light">{t("about")}</p>
      <p className="mx-auto mt-6 max-w-xl font-display text-xl italic leading-relaxed text-sand/80">
        {text}
      </p>
    </section>
  );
}
