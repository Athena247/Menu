export type Locale = "tr" | "en" | "ar";

export interface LocalizedText {
  tr: string;
  en: string;
  ar: string;
}

export interface Category {
  _id: string;
  name: LocalizedText;
  slug: string;
  order: number;
  isActive: boolean;
}

export interface Product {
  _id: string;
  name: LocalizedText;
  description: LocalizedText;
  price: number;
  currency: string;
  image: { url: string; publicId?: string };
  category: Category | string;
  isFeatured: boolean;
  isAvailable: boolean;
  order: number;
}

export interface Settings {
  _id?: string;
  cafeName: string;
  aboutText: LocalizedText;
  workingHoursText: LocalizedText;
  googleMapsUrl: string;
  phone: string;
  address: LocalizedText;
  instagramUrl: string;
  onlineOrderUrl: string;
  onlineOrderLabel: string;
}
