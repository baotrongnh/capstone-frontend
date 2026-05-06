"use client";

import { APP_PROMO_I18N_KEYS } from "@/constants";
import { Bell } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import aboveFooter1 from "../../../public/img/above-footer-1.png";
import aboveFooter2 from "../../../public/img/above-footer-2.png";
import app2 from "../../../public/img/app2.jpg";

export default function AppPromoSection() {
  const t = useTranslations("HomePage.appPromoSection");

  return (
    <div className="relative bg-linear-to-r from-blue-50 to-cyan-50 overflow-hidden">
      <div className="pointer-events-none select-none absolute -left-24 bottom-0 w-72 sm:w-80 lg:w-96 h-48 sm:h-56 lg:h-64 opacity-60">
        <Image
          src={aboveFooter1}
          alt=""
          aria-hidden="true"
          fill
          sizes="(max-width: 640px) 288px, (max-width: 1024px) 320px, 384px"
          className="object-cover object-bottom scale-300"
          priority
        />
      </div>
      <div className="pointer-events-none select-none absolute right-100 bottom-8 w-72 sm:w-80 lg:w-96 h-48 sm:h-56 lg:h-64 opacity-60">
        <Image
          src={aboveFooter2}
          alt=""
          aria-hidden="true"
          fill
          sizes="(max-width: 640px) 288px, (max-width: 1024px) 320px, 384px"
          className="object-cover object-bottom scale-300"
          priority
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">
          <div className="relative  z-10 order-2 lg:order-1">
            <div className="inline-block bg-[#A3D5FF] text-white px-4 py-2 rounded-lg text-sm font-medium mb-3">
              {t(APP_PROMO_I18N_KEYS.BADGE)}
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {t(APP_PROMO_I18N_KEYS.TITLE)}
              <span className="text-[#0D4E73]">
                {t(APP_PROMO_I18N_KEYS.FREE) || "Miễn phí"}
              </span>
            </h2>

            <p className="text-gray-600 mb-8 leading-relaxed text-base md:text-lg max-w-lg">
              {t(APP_PROMO_I18N_KEYS.SUBTITLE) ||
                "Tìm kiếm và đặt phòng dễ dàng hơn bao giờ hết với ứng dụng di động của chúng tôi. Trải nghiệm mượt mà, ưu đãi độc quyền."}
            </p>

            <div className="flex gap-4 px-2 py-1 w-40 bg-black hover:-translate-y-1 duration-300 rounded-[10px]">
              <a href="#" className="hover:opacity-90 transition transform ">
                <Image src={app2} alt="Google Play" className="h-10 w-auto" />
              </a>
            </div>
          </div>

          <div className="relative flex items-center justify-center order-1 lg:order-2 w-full">
            <div className="relative w-full max-w-xl lg:max-w-2xl flex justify-center">
              <div className="relative w-full h-96 sm:h-112 lg:h-128 overflow-hidden flex justify-center">
                <div className="absolute top-6 left-4 sm:left-2 lg:top-10 lg:left-0 bg-[#FC6A8D] backdrop-blur-md p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-w-[20rem] lg:max-w-105 z-20 animate-bounce-slow border border-white/50">
                  <div className="flex gap-3 items-start">
                    <div className="bg-[#fc8fa8] p-2 rounded-full text-white ">
                      <Bell size={18} fill="currentColor" />
                    </div>
                    <div>
                      <p className="text-sm text-white font-light">
                        {t(APP_PROMO_I18N_KEYS.NOTIFICATION.TITLE)}
                      </p>
                      <p className="text-xs text-white mt-1">
                        {t(APP_PROMO_I18N_KEYS.NOTIFICATION.DESCRIPTION)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 translate-y-24 sm:translate-y-20 lg:translate-y-16">
                  {/* Phone Shell */}
                  <div className="relative w-70 sm:w-75 h-147.5 sm:h-155 rounded-[3rem] p-1.25 bg-[#1c1c1e] shadow-[0_40px_100px_rgba(0,0,0,0.2)] ring-1 ring-gray-800/50">
                    {/* ===== Physical Buttons ===== */}
                    {/* Silent switch */}
                    <div className="absolute -left-0.75 top-25 w-0.75 h-6 rounded-l-md bg-linear-to-r from-gray-700 to-gray-900 shadow-[inset_1px_0_2px_rgba(255,255,255,0.1)]"></div>
                    {/* Volume Up */}
                    <div className="absolute -left-0.75 top-35 w-0.75 h-12.5 rounded-l-md bg-linear-to-r from-gray-700 to-gray-900 shadow-[inset_1px_0_2px_rgba(255,255,255,0.1)]"></div>
                    {/* Volume Down */}
                    <div className="absolute -left-0.75 top-50 w-0.75 h-12.5 rounded-l-md bg-linear-to-r from-gray-700 to-gray-900 shadow-[inset_1px_0_2px_rgba(255,255,255,0.1)]"></div>
                    {/* Power button */}
                    <div className="absolute -right-0.75 top-40 w-0.75 h-12.5 rounded-r-md bg-linear-to-r from-gray-700 to-gray-900 shadow-[inset_-1px_0_2px_rgba(255,255,255,0.1)]"></div>

                    {/* ===== Subtle edge light ===== */}
                    <div className="absolute inset-0 rounded-[3rem] bg-[linear-gradient(145deg,rgba(255,255,255,0.15),transparent_35%,transparent_65%,rgba(255,255,255,0.05))] pointer-events-none" />

                    {/* ===== Inner frame & Screen ===== */}
                    <div className="relative w-full h-full rounded-[2.6rem] overflow-hidden bg-black">
                      {/* App Image */}
                      <Image
                        src="/img/mobile2.PNG"
                        alt="App UI"
                        fill
                        sizes="(max-width: 640px) 280px, 320px"
                        className="block object-cover object-top select-none"
                        priority
                        style={{
                          imageRendering: "auto",
                          transform: "translate3d(0,0,0)",
                          backfaceVisibility: "hidden",
                          willChange: "transform",
                          filter: "contrast(1.08) brightness(1.02) saturate(1.05)",
                        }}
                      />

                      {/* Giảm glare vì lớp này làm cảm giác mờ */}
                      <div className="absolute top-0 left-[-50%] w-[200%] h-[18%] bg-linear-to-b from-white/6 to-transparent -rotate-12 pointer-events-none z-10" />

                      {/* Dynamic Island */}
                      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-20 shadow-[0_1px_4px_rgba(0,0,0,0.9)] flex justify-end items-center pr-2">
                        <div className="w-3 h-3 rounded-full bg-[#111] border border-white/10 flex items-center justify-center">
                          <div className="w-1 h-1 rounded-full bg-blue-400/50" />
                        </div>
                      </div>

                      {/* Home indicator */}
                      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/20 rounded-full z-20" />
                    </div>

                    {/* Outer glow (Tạo cảm giác máy nổi bật trên nền) */}
                    <div className="absolute -inset-4 rounded-[50px] bg-black/20 blur-2xl -z-10" />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-87.5 h-87.5 bg-cyan-200 rounded-full blur-3xl opacity-20 -z-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
