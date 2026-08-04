import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Desteklenen diller
export const locales = ["tr", "en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "tr";

// Arapca gibi sagdan sola (RTL) yazilan diller
export const rtlLocales: Locale[] = ["ar"];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
