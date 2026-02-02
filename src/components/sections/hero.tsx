/* eslint-disable @next/next/no-img-element */
"use client";

import { Button, Image } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  EnvironmentOutlined,
  UserOutlined,
  DollarOutlined,
  CarOutlined,
  GlobalOutlined,
  BankOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import banner from "../../../public/img/banner2.jpg";

export default function HeroSection() {
  const t = useTranslations("HomePage"); // Hook lấy ngữ liệu

  const [searchData, setSearchData] = useState({
    roomType: "",
    area: "",
    people: "",
    price: "",
  });

  // Danh sách key của các thành phố để map ra button
  const cityKeys = [
    "all",
    "hanoi",
    "danang",
    "hatinh",
    "nhatrang",
    "haiduong",
    "hcm",
    "hatay",
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 uppercase">
            {t("heroTitle")}
          </h2>

          <p className="text-[#909090] text-lg">{t("heroSubtitle")}</p>

          <div className="mt-8 mb-12 w-full max-w-6xl mx-auto px-4">
            <div className="bg-white rounded-2xl px-25 shadow-[0_9px_20px_rgba(95,130,170,0.72)] py-4 flex items-center justify-between gap-4">
              <div className="flex-1 border-r border-gray-200 pr-4 last:border-r-0">
                <label className="flex items-center gap-2 text-md text-[#334155] font-bold mb-1">
                  <EnvironmentOutlined className="text-[#334155]" />
                  {t("searchForm.roomType")}
                </label>
                <input
                  type="text"
                  placeholder={t("searchForm.roomTypePlaceholder")}
                  value={searchData.roomType}
                  onChange={(e) =>
                    setSearchData({ ...searchData, roomType: e.target.value })
                  }
                  className="w-full pl-6 outline-none text-gray-500 text-sm bg-transparent placeholder-gray-400"
                />
              </div>

              <div className="flex-1 border-r border-gray-200 px-4 last:border-r-0">
                <label className="flex items-center gap-2 text-md text-[#334155] font-bold mb-1">
                  <EnvironmentOutlined className="text-[#334155]" />
                  {t("searchForm.area")}
                </label>
                <input
                  type="text"
                  placeholder={t("searchForm.areaPlaceholder")}
                  value={searchData.area}
                  onChange={(e) =>
                    setSearchData({ ...searchData, area: e.target.value })
                  }
                  className="w-full pl-6 outline-none text-gray-500 text-sm bg-transparent placeholder-gray-400"
                />
              </div>

              <div className="flex-1 border-r border-gray-200 px-4 last:border-r-0">
                <label className="flex items-center gap-2 text-md text-[#334155] font-bold mb-1">
                  <UserOutlined className="text-[#334155]" />
                  {t("searchForm.people")}
                </label>
                <input
                  type="text"
                  placeholder={t("searchForm.peoplePlaceholder")}
                  value={searchData.people}
                  onChange={(e) =>
                    setSearchData({ ...searchData, people: e.target.value })
                  }
                  className="w-full pl-6 outline-none text-gray-500 text-sm bg-transparent placeholder-gray-400"
                />
              </div>

              <div className="flex-1 px-4">
                <label className="flex items-center gap-2 text-md text-[#334155] font-bold mb-1">
                  <DollarOutlined className="text-[#334155]" />
                  {t("searchForm.price")}
                </label>
                <input
                  type="text"
                  placeholder={t("searchForm.pricePlaceholder")}
                  value={searchData.price}
                  onChange={(e) =>
                    setSearchData({ ...searchData, price: e.target.value })
                  }
                  className="w-full pl-6 outline-none text-gray-500 text-sm bg-transparent placeholder-gray-400"
                />
              </div>

              <Button
                type="primary"
                size="large"
                className="bg-[#3980F3] hover:bg-[#2a5ec7] h-12 px-8 rounded-full text-white font-bold shadow-md flex items-center justify-center ml-2 border-none"
              >
                {t("searchForm.submit")}
              </Button>
            </div>
          </div>
        </div>

        <div className="">
          <h3 className="flex justify-center text-3xl font-bold text-gray-800 mb-4">
            {t("exploreTitle")}
          </h3>
          <p className="flex justify-center text-[#909090] mb-8">
            {t("exploreSubtitle")}
          </p>

          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {cityKeys.map((key) => (
              <Button
                key={key}
                size="large"
                className="px-4 py-2 bg-gray-100 border-2 border-blue-300 text-[#909090] hover:bg-[#3980F3] hover:text-white transition"
              >
                {t(`cities.${key}`)}
              </Button>
            ))}
          </div>

          <div className="w-full">
            <div className="relative rounded-[3px] h-[350px] w-full overflow-hidden">
              <Image
                src={
                  banner?.src ||
                  "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2000&auto=format&fit=crop"
                }
                alt="City Banner"
                preview={false}
                className="w-full h-full object-cover"
                rootClassName="w-full h-full block"
              />
              <div className="absolute inset-0 bg-black/10"></div>
            </div>

            <div className="relative  z-10 -mt-32 w-[95%] max-w-7xl mx-auto px-4 pb-12">
              <div className="bg-[#F9FFFF] shadow-xl rounded-[3px] p-12 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex-1 w-[80%]">
                  <h4 className="font-bold text-[40px] text-[#1e293b] leading-tight font-sans mb-6">
                    {t("highlightCity.name")}
                  </h4>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {t("highlightCity.description")}
                  </p>
                </div>
                <div className="flex w-[45%] flex-col items-end gap-4">
                  <div className="flex justify-end w-full pr-8">
                    <div className="bg-white px-5 py-2 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.1)] flex items-center gap-3 border border-gray-50">
                      <CarOutlined className="text-purple-500 text-xl" />
                      <span className="text-purple-500 font-semibold text-xs">
                        {t("highlightCity.tags.publicTransport")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-white px-3 py-2 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.1)] flex items-center gap-3 border border-gray-50">
                      <GlobalOutlined className="text-teal-500 text-xl" />
                      <span className="text-teal-500 font-semibold text-xs">
                        {t("highlightCity.tags.convenientLife")}
                      </span>
                    </div>
                    <div className="bg-white px-3 py-2 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.1)] flex items-center gap-3 border border-gray-50">
                      <CarOutlined className="text-yellow-500 text-xl" />
                      <span className="text-yellow-500 font-semibold text-xs">
                        {t("highlightCity.tags.easyMove")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mr-12">
                    <div className="bg-white px-3 py-2 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.1)] flex items-center gap-3 border border-gray-50">
                      <BankOutlined className="text-red-500 text-xl" />
                      <span className="text-red-500 font-semibold text-xs">
                        {t("highlightCity.tags.economicCenter")}
                      </span>
                    </div>
                    <div className="bg-white px-3 py-2 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.1)] flex items-center gap-3 border border-gray-50">
                      <SyncOutlined className="text-blue-500 text-xl" />
                      <span className="text-blue-500 font-semibold text-xs">
                        {t("highlightCity.tags.manyChoices")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
