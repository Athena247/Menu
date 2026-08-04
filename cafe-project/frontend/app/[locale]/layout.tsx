import type { Metadata } from "next";
import { Fraunces, Manrope, Cairo } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { locales, rtlLocales, Locale } from "@/i18n";
import { getSettings } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../globals.css";

// Latin alfabesi icin zarif serif baslik fontu
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

// Latin alfabesi icin sade govde fontu
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

// Arapca icin hem baslik hem govde olarak kullanilan zarif font
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const messages = await getMessages({ locale });
  const meta = messages.meta as { title: string; description: string };
  return {
    title: meta.title,
    description: meta.description,
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const messages = await getMessages();
  const settings = await getSettings();
  const dir = rtlLocales.includes(locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className={`${fraunces.variable} ${manrope.variable} ${cairo.variable}`}>
      <body
        className={`bg-ink text-sand antialiased ${
          locale === "ar" ? "font-arabic" : "font-body"
        }`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header locale={locale} />
          <main>{children}</main>
          <Footer locale={locale} settings={settings} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
