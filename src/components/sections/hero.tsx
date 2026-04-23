"use client";

import { useState } from "react";
import type { StaticImageData } from "next/image";
import {
  BankOutlined,
  CarOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  SyncOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Form } from "antd";
import { useTranslations } from "next-intl";
import banner9 from "../../../public/img/banner9.jpg";
import hanoi from "../../../public/img/hanoi.jpg";
import danang from "../../../public/img/danang.jpg";
import dalat from "../../../public/img/dalat.jpg";
import nhatrang from "../../../public/img/nhatrang.jpg";

import { useRouter } from "next/navigation";

type CityKey = "hcm" | "hanoi" | "danang" | "dalat" | "nhatrang";
type ColorKey = "purple" | "teal" | "yellow" | "red" | "blue";

interface CityData {
  image: StaticImageData;
  tags: Array<{ icon: React.ReactNode; key: string; color: ColorKey }>;
}

const COLOR_CLASSES: Record<ColorKey, { text: string; textIcon: string }> = {
  purple: { text: "text-purple-500", textIcon: "text-purple-500" },
  teal: { text: "text-teal-500", textIcon: "text-teal-500" },
  yellow: { text: "text-yellow-500", textIcon: "text-yellow-500" },
  red: { text: "text-red-500", textIcon: "text-red-500" },
  blue: { text: "text-blue-500", textIcon: "text-blue-500" },
};

const CITIES_DATA: Record<CityKey, CityData> = {
  hcm: {
    image: banner9,
    tags: [
      { icon: <CarOutlined />, key: "publicTransport", color: "purple" },
      { icon: <GlobalOutlined />, key: "nearUtilities", color: "teal" },
      { icon: <DollarOutlined />, key: "nightlife", color: "yellow" },
      { icon: <BankOutlined />, key: "economicCenter", color: "red" },
      { icon: <SyncOutlined />, key: "manyChoices", color: "blue" },
    ],
  },
  hanoi: {
    image: hanoi,
    tags: [
      { icon: <CarOutlined />, key: "publicTransport", color: "purple" },
      { icon: <GlobalOutlined />, key: "convenientLife", color: "teal" },
      { icon: <GlobalOutlined />, key: "safeArea", color: "teal" },
      { icon: <CarOutlined />, key: "easyMove", color: "yellow" },
      { icon: <BankOutlined />, key: "economicCenter", color: "red" },
      { icon: <SyncOutlined />, key: "manyChoices", color: "blue" },
    ],
  },
  danang: {
    image: danang,
    tags: [
      { icon: <CarOutlined />, key: "publicTransport", color: "purple" },
      { icon: <GlobalOutlined />, key: "convenientLife", color: "teal" },
      { icon: <CarOutlined />, key: "easyMove", color: "yellow" },
      { icon: <GlobalOutlined />, key: "seasideLife", color: "teal" },
      { icon: <BankOutlined />, key: "tourismHub", color: "red" },
    ],
  },
  dalat: {
    image: dalat,
    tags: [
      { icon: <GlobalOutlined />, key: "convenientLife", color: "teal" },
      { icon: <GlobalOutlined />, key: "greenSpace", color: "teal" },
      { icon: <CarOutlined />, key: "safeArea", color: "yellow" },
      { icon: <SyncOutlined />, key: "manyChoices", color: "blue" },
      { icon: <BankOutlined />, key: "tourismHub", color: "red" },
    ],
  },

  nhatrang: {
    image: nhatrang,
    tags: [
      { icon: <GlobalOutlined />, key: "convenientLife", color: "teal" },
      { icon: <CarOutlined />, key: "easyMove", color: "yellow" },
      { icon: <GlobalOutlined />, key: "seasideLife", color: "teal" },
      { icon: <BankOutlined />, key: "tourismHub", color: "red" },
      { icon: <SyncOutlined />, key: "manyChoices", color: "blue" },
    ],
  },
};

export default function HeroSection() {
  const t = useTranslations("HomePage");
  const [form] = Form.useForm();
  const route = useRouter();
  const [selectedCity, setSelectedCity] = useState<CityKey>("hanoi");

  const cityKeys: CityKey[] = ["hcm", "hanoi", "danang", "dalat", "nhatrang"];
  const cityData = CITIES_DATA[selectedCity];

  return (
    <div className="min-h-screen relative">
      <div className="absolute top-0 left-0 w-full z-1">
        <img src="/vector1.svg" alt="logo" className="w-full h-auto" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-2 relative">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 uppercase">
            {t("heroTitle")}
          </h2>

          <p className="text-[#909090] text-lg">{t("heroSubtitle")}</p>

          <div className="mt-8 mb-12 w-full max-w-6xl mx-auto px-4">
            <div className="bg-white rounded-2xl px-25 shadow-[0_9px_20px_rgba(95,130,170,0.72)] py-4 flex items-center justify-between gap-4">
              <Form
                form={form}
                layout="inline"
                className="flex-1 flex items-center gap-4"
              >
                <div className="flex-1 border-r border-gray-200 pr-4 last:border-r-0">
                  <label className="flex items-center gap-2 text-md text-[#334155] font-bold mb-1">
                    <EnvironmentOutlined className="text-[#334155]" />
                    {t("searchForm.roomType")}
                  </label>
                </div>

                <div className="flex-1 border-r border-gray-200 px-4 last:border-r-0">
                  <label className="flex items-center gap-2 text-md text-[#334155] font-bold mb-1">
                    <EnvironmentOutlined className="text-[#334155]" />
                    {t("searchForm.area")}
                  </label>
                </div>

                <div className="flex-1 border-r border-gray-200 px-4 last:border-r-0">
                  <label className="flex items-center gap-2 text-md text-[#334155] font-bold mb-1">
                    <UserOutlined className="text-[#334155]" />
                    {t("searchForm.people")}
                  </label>
                </div>

                <div className="flex-1 px-4">
                  <label className="flex items-center gap-2 text-md text-[#334155] font-bold mb-1">
                    <DollarOutlined className="text-[#334155]" />
                    {t("searchForm.price")}
                  </label>
                </div>

                <Button
                  type="primary"
                  onClick={() => {
                    const area = form.getFieldValue("area") || "";
                    const roomType = form.getFieldValue("roomType") || "";
                    const people = form.getFieldValue("people") || "";
                    const price = form.getFieldValue("price") || "";

                    const searchParams = new URLSearchParams({
                      city: area,
                      roomType: roomType,
                      people: people,
                      price: price,
                    });

                    route.push(`/apartment?${searchParams.toString()}`);
                  }}
                  size="large"
                  className="bg-[#3980F3] hover:bg-[#2a5ec7] h-12 px-8 rounded-full text-white font-bold shadow-md flex items-center justify-center ml-2 border-none"
                >
                  {t("searchForm.submit")}
                </Button>
              </Form>
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
                onClick={() => setSelectedCity(key)}
                className={`px-4 py-2 border-2 transition ${
                  selectedCity === key
                    ? "bg-[#3980F3] text-white border-[#3980F3]"
                    : "bg-gray-100 border-blue-300 text-[#909090] hover:bg-[#3980F3] hover:text-white"
                }`}
              >
                {t(`cities.${key}`)}
              </Button>
            ))}
          </div>

          <div className="w-full">
            <div className="relative rounded-[3px] h-107.5 w-full overflow-hidden">
              <img
                src={cityData.image?.src}
                alt="City Banner"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/10"></div>
            </div>

            <div className="relative  z-10 -mt-22 w-[95%] max-w-7xl mx-auto px-4 pb-12">
              <div className="bg-[#F9FFFF] shadow-xl rounded-[3px] p-12 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex-1 w-[80%]">
                  <h4 className="font-bold text-[40px] text-[#1e293b] leading-tight font-sans mb-6">
                    {t(`highlightCity.${selectedCity}.name`)}
                  </h4>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {t(`highlightCity.${selectedCity}.description`)}
                  </p>
                </div>
                <div className="flex w-[45%] flex-col items-end gap-4">
                  <div className="flex flex-wrap justify-end gap-4">
                    {cityData.tags.map((tag, index) => (
                      <div
                        key={index}
                        className={`bg-white px-3 py-2 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.1)] flex items-center gap-3 border border-gray-50`}
                      >
                        <span
                          className={`${COLOR_CLASSES[tag.color].textIcon} text-xl`}
                        >
                          {tag.icon}
                        </span>
                        <span
                          className={`${COLOR_CLASSES[tag.color].text} font-semibold text-xs`}
                        >
                          {t(`highlightCity.tags.${tag.key}`)}
                        </span>
                      </div>
                    ))}
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
