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

  const quickLinks = [
    { href: ROUTES.APARTMENT, label: t(FOOTER_I18N_KEYS.SECTIONS.MAIN_MENU.POST) },
    { href: ROUTES.PARTNER_REQUEST, label: t(FOOTER_I18N_KEYS.SECTIONS.MAIN_MENU.PARTNER) },
    { href: ROUTES.CONTACT, label: t(FOOTER_I18N_KEYS.SECTIONS.ABOUT.CONTACT) },
    { href: "/policies", label: t(FOOTER_I18N_KEYS.SECTIONS.ABOUT.PRIVACY) },
  ]

  return (
    <footer className="mt-16 bg-[#0F172A] pb-8 pt-14 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <Link href={ROUTES.HOME} className="inline-flex items-center gap-3">
              <Image alt="HomeIQ Logo" src={IMG_URL.LOGO} width={150} height={80} />
              <span className="text-lg font-semibold tracking-wide text-white">HomeIQ</span>
            </Link>

            <div className="max-w-md space-y-4 text-sm leading-relaxed text-white">
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
                  className="text-white underline decoration-white/40 underline-offset-4 transition hover:opacity-80"
                  style={{ color: "#fff" }}
                >
                  {phone}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-white" strokeWidth={1.5} />
                <a
                  href={`mailto:${email}`}
                  className="text-white underline decoration-white/40 underline-offset-4 transition hover:opacity-80"
                  style={{ color: "#fff" }}
                >
                  {email}
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold tracking-wide text-white">
              {t(FOOTER_I18N_KEYS.SECTIONS.ABOUT.TITLE)}
            </h3>
            <ul className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white underline decoration-transparent underline-offset-4 transition hover:opacity-80 hover:decoration-white/40"
                    style={{ color: "#fff" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-slate-400/30 pt-6 text-center text-xs text-white">
          {t(FOOTER_I18N_KEYS.COPYRIGHT, { year: currentYear })}
        </div>
      </div>
    </footer>
  )
}
