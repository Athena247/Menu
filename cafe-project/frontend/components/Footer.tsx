import { useTranslations } from "next-intl";
import { Locale } from "@/i18n";
import { Settings } from "@/types";

export default function Footer({
  locale,
  settings,
}: {
  locale: Locale;
  settings: Settings | null;
}) {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  const hoursText = settings?.workingHoursText?.[locale] || "";
  const cafeName = settings?.cafeName || "Kafe";

  return (
    <footer id="iletisim" className="border-t border-ink-line/60 bg-ink-soft">
      <div className="mx-auto max-w-content px-6 py-16 md:px-10">
        <div className="gilt-divider mb-14">
          <span className="dot" />
        </div>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Calisma Saatleri - haritaya yonlendirir */}
          <div>
            <h3 className="mb-3 text-xs tracking-widest2 text-gilt-light">{t("hours")}</h3>
            {settings?.googleMapsUrl ? (
              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sand/80 transition-colors hover:text-sand"
              >
                {hoursText}
                <span className="mt-1 block text-xs text-sand/40">{t("hoursCta")} →</span>
              </a>
            ) : (
              <p className="text-sand/80">{hoursText}</p>
            )}
          </div>

          {/* Telefon - tel: linki */}
          <div>
            <h3 className="mb-3 text-xs tracking-widest2 text-gilt-light">{t("contact")}</h3>
            {settings?.phone ? (
              <a
                href={`tel:${settings.phone.replace(/\s/g, "")}`}
                className="block text-sand/80 transition-colors hover:text-sand"
              >
                {settings.phone}
                <span className="mt-1 block text-xs text-sand/40">{t("callCta")} →</span>
              </a>
            ) : null}
          </div>

          {/* Sosyal medya */}
          <div>
            <h3 className="mb-3 text-xs tracking-widest2 text-gilt-light">{t("follow")}</h3>
            {settings?.instagramUrl ? (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sand/80 transition-colors hover:text-sand"
              >
                Instagram →
              </a>
            ) : null}
          </div>

          {/* Online siparis */}
          <div>
            <h3 className="mb-3 text-xs tracking-widest2 text-gilt-light">{t("order")}</h3>
            {settings?.onlineOrderUrl ? (
              <a
                href={settings.onlineOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sand/80 transition-colors hover:text-sand"
              >
                {settings?.onlineOrderLabel || t("order")} →
              </a>
            ) : null}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-ink-line/60 pt-8 text-xs text-sand/40 sm:flex-row">
          <span>
            © {year} {cafeName}. {t("rights")}
          </span>
        </div>
      </div>
    </footer>
  );
}
