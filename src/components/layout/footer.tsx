"use client"

import { FOOTER_I18N_KEYS } from "@/constants"
import { IMG_URL, ROUTES } from "@/constants/routes"
import { Mail, MapPin, Phone } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"

const normalizePhoneHref = (value: string) => value.replace(/[^\d+]/g, "")

export default function Footer() {
  const t = useTranslations("Footer")
  const currentYear = new Date().getFullYear()

  const addressLine1 = t(FOOTER_I18N_KEYS.CONTACT.ADDRESS_LINE_1)
  const addressLine2 = t(FOOTER_I18N_KEYS.CONTACT.ADDRESS_LINE_2)
  const phone = t(FOOTER_I18N_KEYS.CONTACT.PHONE)
  const email = t(FOOTER_I18N_KEYS.CONTACT.EMAIL)

  const mainMenuLinks = [
    { href: ROUTES.HOME, label: t(FOOTER_I18N_KEYS.SECTIONS.MAIN_MENU.HOME) },
    { href: ROUTES.APARTMENT, label: t(FOOTER_I18N_KEYS.SECTIONS.MAIN_MENU.FIND) },
    { href: "/profile/my-schedule", label: t(FOOTER_I18N_KEYS.SECTIONS.MAIN_MENU.BOOKING) },
    { href: "/profile/contracts", label: t(FOOTER_I18N_KEYS.SECTIONS.MAIN_MENU.RENTAL) },
    { href: ROUTES.PARTNER_REQUEST, label: t(FOOTER_I18N_KEYS.SECTIONS.MAIN_MENU.PARTNER) },
  ]

  const categoryLinks = [
    {
      href: ROUTES.APARTMENT,
      label: t(FOOTER_I18N_KEYS.SECTIONS.CATEGORIES.SERVICE_APARTMENT),
    },
    {
      href: ROUTES.APARTMENT,
      label: t(FOOTER_I18N_KEYS.SECTIONS.CATEGORIES.MINI_APARTMENT),
    },
    {
      href: ROUTES.APARTMENT,
      label: t(FOOTER_I18N_KEYS.SECTIONS.CATEGORIES.PARTNER_APARTMENT),
    },
    {
      href: ROUTES.APP_GUIDE,
      label: t(FOOTER_I18N_KEYS.SECTIONS.CATEGORIES.IOT),
    },
    {
      href: ROUTES.CONTACT,
      label: t(FOOTER_I18N_KEYS.SECTIONS.CATEGORIES.MAINTENANCE),
    },
  ]

  const aboutLinks = [
    { href: ROUTES.APP_GUIDE, label: t(FOOTER_I18N_KEYS.SECTIONS.ABOUT.GUIDE) },
    { href: "/profile/contracts", label: t(FOOTER_I18N_KEYS.SECTIONS.ABOUT.CONTRACTS) },
    { href: "/profile/invoices", label: t(FOOTER_I18N_KEYS.SECTIONS.ABOUT.INVOICES) },
    { href: ROUTES.CONTACT, label: t(FOOTER_I18N_KEYS.SECTIONS.ABOUT.MAINTENANCE) },
    { href: ROUTES.CONTACT, label: t(FOOTER_I18N_KEYS.SECTIONS.ABOUT.CHAT) },
  ]

  return (
    <footer className="site-footer mt-16 bg-[#0B1020] pb-8 pt-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="space-y-6">
            <Link href={ROUTES.HOME} className="inline-flex items-center gap-3">
              <Image alt="HomeIQ Logo" src={IMG_URL.LOGO} width={150} height={80} />
            </Link>

            <div className="max-w-md space-y-4 text-sm leading-relaxed text-slate-50">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-white" strokeWidth={1.5} />
                <p>
                  {addressLine1}
                  <br />
                  {addressLine2}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-white" strokeWidth={1.5} />
                <a
                  href={`tel:${normalizePhoneHref(phone)}`}
                  className="underline decoration-white/70 underline-offset-4 transition hover:decoration-white"
                >
                  {phone}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-white" strokeWidth={1.5} />
                <a
                  href={`mailto:${email}`}
                  className="underline decoration-white/70 underline-offset-4 transition hover:decoration-white"
                >
                  {email}
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium uppercase tracking-[0.16em] text-white">
              {t(FOOTER_I18N_KEYS.SECTIONS.MAIN_MENU.TITLE)}
            </h3>
            <ul className="space-y-3 text-sm">
              {mainMenuLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="underline font-light decoration-transparent underline-offset-4 transition hover:decoration-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium uppercase tracking-[0.16em] text-white">
              {t(FOOTER_I18N_KEYS.SECTIONS.CATEGORIES.TITLE)}
            </h3>
            <ul className="space-y-3 text-sm">
              {categoryLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="underline font-light decoration-transparent underline-offset-4 transition hover:decoration-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium uppercase tracking-[0.16em] text-white">
              {t(FOOTER_I18N_KEYS.SECTIONS.ABOUT.TITLE)}
            </h3>
            <ul className="space-y-3 text-sm">
              {aboutLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="underline font-light decoration-transparent underline-offset-4 transition hover:decoration-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-6">
          <Link
            href={ROUTES.PARTNER_REQUEST}
            className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide transition hover:border-white/40 hover:bg-white/10"
          >
            {t(FOOTER_I18N_KEYS.SECTIONS.MAIN_MENU.PARTNER)}
          </Link>
          <Link
            href={ROUTES.CONTACT}
            className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide transition hover:border-white/40 hover:bg-white/10"
          >
            {t(FOOTER_I18N_KEYS.SECTIONS.ABOUT.CHAT)}
          </Link>
        </div>
        <div className="mt-14 border-t border-white/15 pt-6 text-center text-xs text-slate-200">
          {t(FOOTER_I18N_KEYS.COPYRIGHT, { year: currentYear })}
        </div>
      </div>
    </footer>
  )
}
