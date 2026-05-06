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
      HOME: "sections.mainMenu.home",
      FIND: "sections.mainMenu.find",
      BOOKING: "sections.mainMenu.booking",
      RENTAL: "sections.mainMenu.rental",
      PARTNER: "sections.mainMenu.partner",
    },
    CATEGORIES: {
      TITLE: "sections.categories.title",
      SERVICE_APARTMENT: "sections.categories.serviceApartment",
      MINI_APARTMENT: "sections.categories.miniApartment",
      PARTNER_APARTMENT: "sections.categories.partnerApartment",
      IOT: "sections.categories.iot",
      MAINTENANCE: "sections.categories.maintenance",
    },
    ABOUT: {
      TITLE: "sections.about.title",
      GUIDE: "sections.about.guide",
      CONTRACTS: "sections.about.contracts",
      INVOICES: "sections.about.invoices",
      MAINTENANCE: "sections.about.maintenance",
      CHAT: "sections.about.chat",
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
