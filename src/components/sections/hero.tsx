"use client";

import { Button, Form, Image, Input } from "antd";
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
import banner9 from "../../../public/img/banner9.jpg";

import { useRouter } from "next/navigation";
export default function HeroSection() {
  const t = useTranslations("HomePage");
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const route = useRouter();
  // const [typeRoom, setTypeRoom] = useState("");
  // const [area, setArea] = useState("");
  // const [people, setPeople] = useState("");
  // const [price, setPrice] = useState("");

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

  // const handleSearch = async () => {
  //   try {
  //     const values = await form.validateFields();
  //     console.log("Search payload:", values);
  //     setTypeRoom(values.roomType || "");
  //     setArea(values.area || "");
  //     setPeople(values.people || "");
  //     setPrice(values.price || "");

  //     form.resetFields();
  //   } catch (error) {
  //     console.log("Validation failed:", error);
  //   }
  // };

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
                  <Form.Item name="roomType" className="m-0" rules={[]}>
                    <Input
                      placeholder={t("searchForm.roomTypePlaceholder")}
                      className="w-full text-gray-500 text-sm"
                      variant="borderless"
                    />
                  </Form.Item>
                </div>

                <div className="flex-1 border-r border-gray-200 px-4 last:border-r-0">
                  <label className="flex items-center gap-2 text-md text-[#334155] font-bold mb-1">
                    <EnvironmentOutlined className="text-[#334155]" />
                    {t("searchForm.area")}
                  </label>
                  <Form.Item name="area" className="m-0" rules={[]}>
                    <Input
                      placeholder={t("searchForm.areaPlaceholder")}
                      className="w-full text-gray-500 text-sm"
                      variant="borderless"
                    />
                  </Form.Item>
                </div>

                <div className="flex-1 border-r border-gray-200 px-4 last:border-r-0">
                  <label className="flex items-center gap-2 text-md text-[#334155] font-bold mb-1">
                    <UserOutlined className="text-[#334155]" />
                    {t("searchForm.people")}
                  </label>
                  <Form.Item name="people" className="m-0" rules={[]}>
                    <Input
                      placeholder={t("searchForm.peoplePlaceholder")}
                      className="w-full text-gray-500 text-sm"
                      variant="borderless"
                    />
                  </Form.Item>
                </div>

                <div className="flex-1 px-4">
                  <label className="flex items-center gap-2 text-md text-[#334155] font-bold mb-1">
                    <DollarOutlined className="text-[#334155]" />
                    {t("searchForm.price")}
                  </label>
                  <Form.Item name="price" className="m-0" rules={[]}>
                    <Input
                      placeholder={t("searchForm.pricePlaceholder")}
                      className="w-full text-gray-500 text-sm"
                      variant="borderless"
                    />
                  </Form.Item>
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
                className="px-4 py-2 bg-gray-100 border-2 border-blue-300 text-[#909090] hover:bg-[#3980F3] hover:text-white transition"
              >
                {t(`cities.${key}`)}
              </Button>
            ))}
          </div>

          <div className="w-full">
            <div className="relative rounded-[3px] h-87.5 w-full overflow-hidden">
              <Image
                src={
                  banner9?.src ||
                  "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2000&auto=format&fit=crop"
                }
                alt="City Banner"
                preview={false}
                className="w-full h-full object-cover"
                rootClassName="w-full h-full block"
              />
              <div className="absolute inset-0 bg-black/10"></div>
            </div>

            <div className="relative  z-10 -mt-22 w-[95%] max-w-7xl mx-auto px-4 pb-12">
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
