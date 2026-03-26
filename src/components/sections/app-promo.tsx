"use client";

import { useTranslations } from "next-intl";
import banner from "../../../public/img/banner7.jpg";
import { Bell, MapPin, Star, Calendar, User } from "lucide-react";
import { APP_PROMO_I18N_KEYS, UI_BRAND } from "@/constants";

import app1 from "../../../public/img/app1.jpg";
import app2 from "../../../public/img/app2.jpg";

export default function AppPromoSection() {
  const t = useTranslations("HomePage.appPromoSection");

  return (
    <div className="relative bg-linear-to-r from-blue-50 to-cyan-50 h-120 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">
          <div className="relative bottom-15 z-10 order-2 lg:order-1">
            <div className="inline-block bg-[#A3D5FF] text-white px-4 py-2 rounded-lg text-sm font-medium mb-6">
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

            <div className="flex gap-4">
              <a
                href="#"
                className="hover:opacity-90 transition transform hover:-translate-y-1 duration-300 bg-black p-2 rounded-[10px]"
              >
                <img src={app1.src} alt="Google Play" className="h-10 w-auto" />
              </a>
              <a
                href="#"
                className="hover:opacity-90 transition transform hover:-translate-y-1 duration-300 bg-black p-2 rounded-[10px]"
              >
                <img src={app2.src} alt="App Store" className="h-10 w-auto" />
              </a>
            </div>
          </div>

          <div className="relative flex items-center justify-center order-1 lg:order-2 h-150 w-full">
            <div className="absolute top-20 left-[-110] bg-[#FC6A8D] backdrop-blur-md p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-w-105 z-20 animate-bounce-slow border border-white/50">
              <div className="flex gap-3 items-start">
                <div className="bg-[#fc8fa8] p-2 rounded-full text-white ">
                  <Bell size={18} fill="currentColor" />
                </div>
                <div>
                  <p className="text-sm  text-white font-light">
                    {t(APP_PROMO_I18N_KEYS.NOTIFICATION.TITLE)}
                  </p>
                  <p className="text-xs text-white mt-1">
                    {t(APP_PROMO_I18N_KEYS.NOTIFICATION.DESCRIPTION)}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative top-15 ml-50 bg-gray-900 p-3 rounded-[3rem] h-137.5 w-70 md:h-155 md:w-87.5 shadow-2xl flex flex-col">
              <div className="absolute top-24 -left-0.5 h-6 w-0.75 bg-gray-700 rounded-l-sm"></div>
              <div className="absolute top-36 -left-0.5 h-10 w-0.75 bg-gray-700 rounded-l-sm"></div>
              <div className="absolute top-48 -left-0.5 h-10 w-0.75 bg-gray-700 rounded-l-sm"></div>
              <div className="absolute top-32 -right-0.5 h-16 w-0.75 bg-gray-700 rounded-r-sm"></div>

              <div className="w-full h-full bg-white rounded-[2.3rem] overflow-hidden flex flex-col relative z-0">
                <div className="flex-1 relative bg-gray-100 overflow-hidden shadow-inner">
                  <img
                    src={banner.src}
                    alt="City Landscape"
                    className="w-full h-full object-cover block"
                  />

                  <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/30"></div>
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
