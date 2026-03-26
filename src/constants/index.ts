export const APP_NAME = "SEP_APARTMENT";
export const DEFAULT_LOCALE = "vi";

export const LOCALES = [
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "en", name: "English", flag: "🇺🇸" },
] as const;

// UI Constants
export const UI_BRAND = {
  LOGO: "TOLETX",
} as const;

// Translation Keys - Footer
export const FOOTER_I18N_KEYS = {
  CONTACT: {
    ADDRESS_LINE_1: "contact.addressLine1",
    ADDRESS_LINE_2: "contact.addressLine2",
    PHONE: "contact.phone",
    EMAIL: "contact.email",
  },
  SECTIONS: {
    MAIN_MENU: {
      TITLE: "sections.mainMenu.title",
      PARTNER: "sections.mainMenu.partner",
      POST: "sections.mainMenu.post",
      REQUEST: "sections.mainMenu.request",
      VALUATION: "sections.mainMenu.valuation",
    },
    HIVE: {
      TITLE: "sections.hive.title",
      BUY: "sections.hive.buy",
      SELL: "sections.hive.sell",
      BLOG: "sections.hive.blog",
      GROUP: "sections.hive.group",
    },
    CATEGORIES: {
      TITLE: "sections.categories.title",
      RESIDENTIAL: "sections.categories.residential",
      COMMERCIAL: "sections.categories.commercial",
      ENTERTAINMENT: "sections.categories.entertainment",
      AGRICULTURAL: "sections.categories.agricultural",
    },
    ABOUT: {
      TITLE: "sections.about.title",
      TERMS: "sections.about.terms",
      PRIVACY: "sections.about.privacy",
      LEGAL: "sections.about.legal",
      CONTACT: "sections.about.contact",
      ABOUT_US: "sections.about.aboutUs",
      TEAM: "sections.about.team",
      FAQ: "sections.about.faq",
      SUPPORT: "sections.about.support",
    },
  },
  COPYRIGHT: "copyright",
} as const;

// Translation Keys - App Promo
export const APP_PROMO_I18N_KEYS = {
  BADGE: "badge",
  TITLE: "title",
  FREE: "free",
  SUBTITLE: "subtitle",
  NOTIFICATION: {
    TITLE: "notification.title",
    DESCRIPTION: "notification.description",
  },
} as const;
