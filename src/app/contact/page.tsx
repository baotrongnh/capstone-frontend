import { ApartmentCoordinateMap } from "@/components/apartments/apartment-coordinate-map"
import { FOOTER_I18N_KEYS } from "@/constants"
import { ROUTES } from "@/constants/routes"
import { ArrowRight, Clock3, Globe, Mail, MapPin, MessageCircle, PhoneCall } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

const SECONDARY_PHONE = "0346349968"
const BUSINESS_EMAIL = "nhbaotrong@gmail.com"
const ZALO_PHONE = "0332667829"
const WHATSAPP_PHONE = "0332667829"
const FACEBOOK_URL = "https://www.facebook.com/baotrong.nguyenhuynh.52"
const WEBSITE_URL = "https://homeiq.io.vn/"
const CONTACT_LATITUDE = 10.841127
const CONTACT_LONGITUDE = 106.809883

const normalizePhoneHref = (value: string) => value.replace(/[^\d+]/g, "")
const buildPhoneHref = (value: string) => `tel:${normalizePhoneHref(value)}`
const buildMailHref = (value: string, subject: string) => `mailto:${value}?subject=${encodeURIComponent(subject)}`
const buildZaloHref = (value: string) => `https://zalo.me/${normalizePhoneHref(value)}`
const buildWhatsappHref = (value: string) => `https://wa.me/${normalizePhoneHref(value)}`

export default async function ContactPage() {
     const tFooter = await getTranslations("Footer")
     const t = await getTranslations("ContactPage")

     const addressLine1 = tFooter(FOOTER_I18N_KEYS.CONTACT.ADDRESS_LINE_1)
     const addressLine2 = tFooter(FOOTER_I18N_KEYS.CONTACT.ADDRESS_LINE_2)
     const phone = tFooter(FOOTER_I18N_KEYS.CONTACT.PHONE)
     const email = tFooter(FOOTER_I18N_KEYS.CONTACT.EMAIL)
     const fullAddress = `${addressLine1}, ${addressLine2}`

     const supportItems = [
          { href: buildPhoneHref(phone), label: t("supportPhoneCta"), value: phone, icon: PhoneCall },
          { href: buildPhoneHref(SECONDARY_PHONE), label: t("secondaryPhone"), value: SECONDARY_PHONE, icon: PhoneCall },
          { href: buildMailHref(email, "Yêu cầu hỗ trợ từ website HomeIQ"), label: t("supportEmailCta"), value: email, icon: Mail },
          { href: buildMailHref(BUSINESS_EMAIL, "Liên hệ hợp tác HomeIQ"), label: t("businessEmailCta"), value: BUSINESS_EMAIL, icon: Mail },
          { href: buildZaloHref(ZALO_PHONE), label: t("zaloCta"), value: ZALO_PHONE, icon: MessageCircle },
          { href: buildWhatsappHref(WHATSAPP_PHONE), label: t("whatsappCta"), value: WHATSAPP_PHONE, icon: MessageCircle },
          { href: FACEBOOK_URL, label: t("facebookCta"), value: "Facebook", icon: Globe },
          { href: WEBSITE_URL, label: t("websiteCta"), value: "homeiq.io.vn", icon: Globe },
     ]

     const quickCards = [
          {
               title: t("office"),
               value: (
                    <>
                         {addressLine1}
                         <br />
                         {addressLine2}
                    </>
               ),
               icon: MapPin,
          },
          { title: t("hotline"), value: phone, href: buildPhoneHref(phone), icon: PhoneCall },
          { title: t("supportEmail"), value: email, href: buildMailHref(email, "Yêu cầu hỗ trợ từ website HomeIQ"), icon: Mail },
          {
               title: t("workingHours"),
               value: (
                    <>
                         {t("workingHoursValue")}
                         <br />
                         {t("workingHoursNote")}
                    </>
               ),
               icon: Clock3,
          },
     ]

     const helpfulLinks = [
          { href: ROUTES.APARTMENT, label: t("apartmentLink") },
          { href: ROUTES.PARTNER_REQUEST, label: t("partnerLink") },
          { href: "/policies", label: t("policiesLink") },
     ]

     const openGoogleMapsHref = `https://www.google.com/maps/dir/?api=1&destination=${CONTACT_LATITUDE},${CONTACT_LONGITUDE}`

     return (
          <div className="min-h-screen bg-slate-50 text-slate-800">
               <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-blue-50 via-white to-sky-100">
                    <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-blue-200/40 blur-3xl" />
                    <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl" />

                    <div className="relative mx-auto max-w-7xl px-4 py-18 md:px-6 lg:px-8">
                         <div className="max-w-3xl">
                              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-semibold tracking-[0.24em] text-blue-700">
                                   {t("badge")}
                              </div>

                              <h1 className="mt-6 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
                                   {t("title")}
                              </h1>

                              <p className="mt-5 text-base leading-8 text-slate-600 md:text-lg">
                                   {t("description")}
                              </p>

                              <div className="mt-8 flex flex-wrap gap-3">
                                   <a
                                        href={buildPhoneHref(phone)}
                                        className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                                   >
                                        <PhoneCall className="h-4 w-4" />
                                        {t("callNow")}
                                   </a>

                                   <a
                                        href={buildMailHref(email, "Yêu cầu hỗ trợ từ website HomeIQ")}
                                        className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                                   >
                                        <Mail className="h-4 w-4" />
                                        {t("sendEmail")}
                                   </a>
                              </div>
                         </div>
                    </div>
               </section>

               <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                         {quickCards.map((item) => {
                              const Icon = item.icon

                              return (
                                   <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                        <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">{item.title}</p>
                                        <div className="mt-3 flex items-start gap-2 text-slate-700">
                                             <Icon className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                                             {item.href ? (
                                                  <a href={item.href} className="text-sm font-medium leading-6 hover:text-blue-700">
                                                       {item.value}
                                                  </a>
                                             ) : (
                                                  <p className="text-sm leading-6">{item.value}</p>
                                             )}
                                        </div>
                                   </div>
                              )
                         })}
                    </div>
               </section>

               <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pb-16 md:px-6 lg:grid-cols-12 lg:px-8">
                    <div className="space-y-6 lg:col-span-5">
                         <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                              <h2 className="text-xl font-bold text-slate-900">{t("quickSupportTitle")}</h2>
                              <p className="mt-2 text-sm leading-7 text-slate-600">{t("quickSupportDescription")}</p>

                              <div className="mt-5 space-y-3">
                                   {supportItems.map((item) => {
                                        const Icon = item.icon

                                        return (
                                             <a
                                                  key={`${item.label}-${item.value}`}
                                                  href={item.href}
                                                  target={item.href.startsWith("http") ? "_blank" : undefined}
                                                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                                                  className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-blue-200 hover:bg-blue-50"
                                             >
                                                  <span className="flex items-center gap-2 text-sm font-medium text-slate-800">
                                                       <Icon className="h-4 w-4 text-blue-600" />
                                                       <span>
                                                            {item.label}
                                                            <span className="ml-2 text-slate-500">{item.value}</span>
                                                       </span>
                                                  </span>
                                                  <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:text-blue-600" />
                                             </a>
                                        )
                                   })}
                              </div>
                         </div>

                         <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                              <h3 className="text-lg font-semibold text-slate-900">{t("helpfulLinksTitle")}</h3>

                              <div className="mt-4 space-y-3 text-sm">
                                   {helpfulLinks.map((item) => (
                                        <Link
                                             key={item.href}
                                             href={item.href}
                                             className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                                        >
                                             <ArrowRight className="h-4 w-4" />
                                             {item.label}
                                        </Link>
                                   ))}
                              </div>
                         </div>
                    </div>

                    <div className="lg:col-span-7">
                         <div className="h-full rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
                              <h2 className="text-xl font-bold text-slate-900">{t("mapTitle")}</h2>
                              <p className="mt-2 text-sm leading-7 text-slate-600">{t("mapDescription")}</p>

                              <div className="relative mt-5 h-[360px] overflow-hidden rounded-2xl border border-slate-200">
                                   <ApartmentCoordinateMap
                                        latitude={CONTACT_LATITUDE}
                                        longitude={CONTACT_LONGITUDE}
                                   />
                                   <a
                                        href={openGoogleMapsHref}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow hover:bg-slate-50"
                                   >
                                        <MapPin size={14} className="text-primary" />
                                        {t("openGoogleMaps")}
                                   </a>
                              </div>

                              <p className="mt-4 text-sm text-slate-600">
                                   {t("fullAddressLabel")}: {fullAddress}
                              </p>
                         </div>
                    </div>
               </section>
          </div>
     )
}
