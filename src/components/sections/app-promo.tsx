/* eslint-disable @next/next/no-img-element */
"use client";

import { useTranslations } from "next-intl";
import banner from "../../../public/img/banner7.jpg";
import { Bell } from "lucide-react";

import app1 from "../../../public/img/app1.jpg";
import app2 from "../../../public/img/app2.jpg";
export default function AppPromoSection() {
  const t = useTranslations("HomePage");

  return (
    <div className="bg-linear-to-r from-blue-50 to-cyan-50 py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative">
          <div className="relative z-10">
            <div className="inline-block bg-[#A3D5FF] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              TẢI ỨNG DỤNG
            </div>

            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Tải ứng dụng ToletX{" "}
              <span className="text-[#0D4E73]">miễn phí</span>
            </h2>

            <p className="text-gray-600 mb-8 leading-relaxed text-sm max-w-md">
              {t("appPromoSubtitle") ||
                "Có thể quy là những phối hợp Lương cấp nước dữ liệu, trạm các trực quản lý được cập nhật."}
            </p>

            <div className="flex gap-4 h-15 w-100">
              <a
                href="#"
                className="flex items-center rounded-2xl gap-3 bg-black text-white px-4 py-3  hover:opacity-90 transition"
              >
                <img src={app1.src} alt="Google Play" />
              </a>

              <a
                href="#"
                className="flex items-center rounded-2xl  gap-3 bg-black text-white px-4 py-3  hover:opacity-90 transition"
              >
                <img src={app2.src} alt="Google Play" />
              </a>
            </div>
          </div>

          <div className="relative h-96 flex items-center justify-end">
            <div className="absolute top-8 left-30 -translate-x-1/2 bg-[#FC6A8D] text-white px-4 py-3 rounded-lg shadow-xl text-xs font-semibold max-w-xs z-20">
              <div className="flex items-start gap-2">
                <Bell />
                <div>
                  <p className="font-semibold mb-1">
                    Nhận ngay cơ hội để tìm nhân sự hiểu
                  </p>
                  <p>người bạn mỗi ngày</p>
                </div>
              </div>
            </div>

            <div className="relative w-56 h-96 rounded-3xl overflow-hidden shadow-2xl bg-black border-[10px] border-gray-900 flex items-center justify-center">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-30"></div>

              <div className="w-full h-full p-2 rounded-2xl overflow-hidden bg-white">
                <img
                  src={banner.src}
                  alt="App Screenshot"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>

            <div className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-200 rounded-full opacity-30 -z-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
