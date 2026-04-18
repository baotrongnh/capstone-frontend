import { FOOTER_I18N_KEYS } from "@/constants";
import { ROUTES } from "@/constants/routes";
import {
     ArrowRight,
     Building2,
     Clock3,
     Mail,
     MapPin,
     MessageCircleQuestion,
     PhoneCall,
     ShieldCheck,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

const normalizePhoneHref = (value: string) => value.replace(/[^\d+]/g, "");

export default async function ContactPage() {
     const tFooter = await getTranslations("Footer");

     const addressLine1 = tFooter(FOOTER_I18N_KEYS.CONTACT.ADDRESS_LINE_1);
     const addressLine2 = tFooter(FOOTER_I18N_KEYS.CONTACT.ADDRESS_LINE_2);
     const phone = tFooter(FOOTER_I18N_KEYS.CONTACT.PHONE);
     const email = tFooter(FOOTER_I18N_KEYS.CONTACT.EMAIL);

     const fullAddress = `${addressLine1}, ${addressLine2}`;
     const phoneHref = `tel:${normalizePhoneHref(phone)}`;
     const mailHref = `mailto:${email}?subject=${encodeURIComponent("Yeu cau ho tro tu website")}`;
     const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;

     return (
          <div className="min-h-screen bg-slate-50 text-slate-800">
               <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-blue-50 via-white to-sky-100">
                    <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-blue-200/40 blur-3xl" />
                    <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl" />

                    <div className="relative mx-auto max-w-7xl px-4 py-18 md:px-6 lg:px-8">
                         <div className="max-w-3xl">
                              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-semibold tracking-[0.24em] text-blue-700">
                                   CONTACT INTELLISERVOPS
                              </div>

                              <h1 className="mt-6 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
                                   Liên hệ đội ngũ hỗ trợ của chúng tôi
                              </h1>

                              <p className="mt-5 text-base leading-8 text-slate-600 md:text-lg">
                                   Cần hỗ trợ tìm căn hộ, lịch xem, hợp đồng, hoặc thông tin vận hành? Chúng tôi luôn sẵn sàng phản hồi
                                   nhanh để bạn xử lý công việc thuận tiện hơn.
                              </p>

                              <div className="mt-8 flex flex-wrap gap-3">
                                   <a
                                        href={phoneHref}
                                        className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                                   >
                                        <PhoneCall className="h-4 w-4" />
                                        Gọi ngay
                                   </a>

                                   <a
                                        href={mailHref}
                                        className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                                   >
                                        <Mail className="h-4 w-4" />
                                        Gửi email
                                   </a>
                              </div>
                         </div>
                    </div>
               </section>

               <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                              <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">ĐỊA CHỈ</p>
                              <div className="mt-3 flex items-start gap-2 text-slate-700">
                                   <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                                   <p className="text-sm leading-6">
                                        {addressLine1}
                                        <br />
                                        {addressLine2}
                                   </p>
                              </div>
                         </div>

                         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                              <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">HOTLINE</p>
                              <div className="mt-3 flex items-center gap-2 text-slate-700">
                                   <PhoneCall className="h-5 w-5 shrink-0 text-blue-600" />
                                   <a href={phoneHref} className="text-sm font-medium hover:text-blue-700">
                                        {phone}
                                   </a>
                              </div>
                         </div>

                         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                              <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">EMAIL</p>
                              <div className="mt-3 flex items-center gap-2 text-slate-700">
                                   <Mail className="h-5 w-5 shrink-0 text-blue-600" />
                                   <a href={mailHref} className="truncate text-sm font-medium hover:text-blue-700">
                                        {email}
                                   </a>
                              </div>
                         </div>

                         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                              <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">GIỜ LÀM VIỆC</p>
                              <div className="mt-3 flex items-start gap-2 text-slate-700">
                                   <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                                   <p className="text-sm leading-6">
                                        Thứ 2 - Thứ 7: 08:00 - 21:00
                                        <br />
                                        Chủ nhật: 08:00 - 17:00
                                   </p>
                              </div>
                         </div>
                    </div>
               </section>

               <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pb-16 md:px-6 lg:grid-cols-12 lg:px-8">
                    <div className="space-y-6 lg:col-span-5">
                         <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                              <h2 className="text-xl font-bold text-slate-900">Kênh hỗ trợ nhanh</h2>
                              <p className="mt-2 text-sm leading-7 text-slate-600">
                                   Chọn kênh phù hợp theo nhu cầu để được hỗ trợ nhanh và chính xác hơn.
                              </p>

                              <div className="mt-5 space-y-3">
                                   <a
                                        href={phoneHref}
                                        className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-blue-200 hover:bg-blue-50"
                                   >
                                        <span className="flex items-center gap-2 text-sm font-medium text-slate-800">
                                             <PhoneCall className="h-4 w-4 text-blue-600" />
                                             Hotline tư vấn trực tiếp
                                        </span>
                                        <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:text-blue-600" />
                                   </a>

                                   <a
                                        href={mailHref}
                                        className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-blue-200 hover:bg-blue-50"
                                   >
                                        <span className="flex items-center gap-2 text-sm font-medium text-slate-800">
                                             <Mail className="h-4 w-4 text-blue-600" />
                                             Email hỗ trợ và phản hồi
                                        </span>
                                        <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:text-blue-600" />
                                   </a>
                              </div>
                         </div>

                         <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                              <h3 className="text-lg font-semibold text-slate-900">Bạn có thể cần</h3>

                              <div className="mt-4 space-y-3 text-sm">
                                   <Link
                                        href={ROUTES.APARTMENT}
                                        className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                                   >
                                        <Building2 className="h-4 w-4" />
                                        Xem danh sách căn hộ đang mở
                                   </Link>

                                   <Link
                                        href={ROUTES.PARTNER_REQUEST}
                                        className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                                   >
                                        <ShieldCheck className="h-4 w-4" />
                                        Gửi yêu cầu trở thành đối tác
                                   </Link>

                                   <Link
                                        href="/policies"
                                        className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                                   >
                                        <MessageCircleQuestion className="h-4 w-4" />
                                        Xem chính sách và câu hỏi thường gặp
                                   </Link>
                              </div>
                         </div>
                    </div>

                    <div className="lg:col-span-7">
                         <div className="h-full rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
                              <h2 className="text-xl font-bold text-slate-900">Vị trí văn phòng</h2>
                              <p className="mt-2 text-sm leading-7 text-slate-600">
                                   Bạn có thể ghé văn phòng trong giờ làm việc để được hỗ trợ trực tiếp.
                              </p>

                              <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
                                   <iframe
                                        title="INTELLISERVOPS office map"
                                        src={mapSrc}
                                        className="h-[360px] w-full"
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                   />
                              </div>

                              <p className="mt-4 text-sm text-slate-600">
                                   Địa chỉ: {fullAddress}
                              </p>
                         </div>
                    </div>
               </section>
          </div>
     );
}
