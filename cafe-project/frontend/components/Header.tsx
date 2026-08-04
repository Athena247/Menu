import Link from "next/link";
import { useTranslations } from "next-intl";
import { Locale } from "@/i18n";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-40 border-b border-ink-line/60 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-5 md:px-10">
        <Link
          href={`/${locale}`}
          className="font-display text-xl tracking-widest2 text-sand"
        >
          KAFE
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#menu" className="text-sm text-sand/70 transition-colors hover:text-gilt-light">
            {t("menu")}
          </a>
          <a href="#hakkimizda" className="text-sm text-sand/70 transition-colors hover:text-gilt-light">
            {t("about")}
          </a>
          <a href="#iletisim" className="text-sm text-sand/70 transition-colors hover:text-gilt-light">
            {t("contact")}
          </a>
        </nav>

        <LanguageSwitcher locale={locale} />
      </div>
    </header>
  );
}
