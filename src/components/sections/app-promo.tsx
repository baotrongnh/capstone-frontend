/* eslint-disable @next/next/no-img-element */
"use client";

import { useTranslations } from "next-intl";
import banner from "../../../public/img/banner7.jpg";
export default function AppPromoSection() {
  const t = useTranslations("HomePage");

  return (
    <div className="bg-linear-to-r from-blue-50 to-cyan-50 py-16">
      <div className="max-w-7xl mx-auto px-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 px-16  gap-12 items-center relative">
          <div className="relative w-[80%] z-10">
            <div>
              <div className="inline-block bg-[#A3D5FF] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                TẢI ỨNG DỤNG
              </div>

              <h2 className="text-4xl w-[80%] font-bold text-gray-800 mb-4">
                {t("appPromoTitle") || "Tải ứng dụng ToletX "}
                <span className="text-[#0D4E73]">miễn phí</span>
              </h2>

              <p className="text-gray-600 mb-8 leading-relaxed text-sm max-w-lg">
                {t("appPromoSubtitle") ||
                  "Có thể quy là những phối hợp Lương cấp nước dữ liệu, trạm các trực quản lý được cập nhật."}
              </p>
            </div>

            <div className="absolute top-0 right-[-300] bg-[#FC6A8D] h-12 text-white px-4 py-3 rounded-lg shadow-lg text-xs font-semibold max-w-xs">
              <div className="flex items-start gap-2">
                <span className="text-lg">🔔</span>
                <div>
                  <p>Nhận ngay cơ hội để tìm nhân sự hiểu</p>
                  <p>người bạn mỗi ngày</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-96 flex items-center ml-10 justify-center">
            <div className="relative w-56 h-full rounded-3xl overflow-hidden shadow-2xl bg-black border-8 border-gray-900">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-30"></div>

              <div className="w-full h-full">
                <img
                  src={banner.src}
                  alt="App Screenshot"
                  className="w-full h-full object-cover "
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
