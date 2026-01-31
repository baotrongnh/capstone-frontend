/* eslint-disable @next/next/no-img-element */
"use client";

import { Button, Image } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  EnvironmentOutlined,
  UserOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import banner from "../../../public/img/banner2.jpg";
export default function HeroSection() {
  const t = useTranslations("HomePage");
  const [searchData, setSearchData] = useState({
    roomType: "",
    area: "",
    people: "",
    price: "",
  });

  return (
    <div className="min-h-screen ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            GIẢI PHÁP THUÊ <span className="text-[#3980F3]">CĂN HỘ</span> THÔNG
            MINH
          </h2>

          <p className="text-[#909090] text-lg">
            {t("heroSubtitle") ||
              "Nền tảng giải quyết những cần thiết liên quan đến tìm kiếm, dọn dẻp và niêu quý"}
          </p>

          <div className="mt-8 mb-12">
            <div className="bg-white rounded-lg shadow-xl px-40 py-4 flex items-center justify-between gap-6">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-1">
                  <label className="flex gap-2 text-md text-[#334155] font-bold  mb-1">
                    <EnvironmentOutlined className="text-[#334155]  " />
                    Loại căn hộ
                  </label>
                  <input
                    type="text"
                    placeholder="Có loại"
                    value={searchData.roomType}
                    onChange={(e) =>
                      setSearchData({ ...searchData, roomType: e.target.value })
                    }
                    className="w-full ml-6 outline-none text-gray-700 text-xs bg-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 flex-1">
                <div className="flex-1">
                  <label className="flex gap-2 text-md text-[#334155] font-bold  mb-1">
                    <EnvironmentOutlined className="text-[#334155]  " />
                    Khu vực
                  </label>
                  <input
                    type="text"
                    placeholder="Chọn khu vực"
                    value={searchData.area}
                    onChange={(e) =>
                      setSearchData({ ...searchData, area: e.target.value })
                    }
                    className="w-full ml-6 flex justify-center outline-none text-gray-700 text-xs bg-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 flex-1">
                <div className="flex-1">
                  <label className="flex gap-2 text-md text-[#334155] font-bold  mb-1">
                    <UserOutlined className="text-[#334155] text-base " />
                    Số người ở
                  </label>
                  <input
                    type="text"
                    placeholder="Có người"
                    value={searchData.people}
                    onChange={(e) =>
                      setSearchData({ ...searchData, people: e.target.value })
                    }
                    className="w-full ml-6 outline-none text-gray-700 text-xs bg-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 flex-1">
                <div className="flex-1">
                  <label className="flex gap-2 text-md text-[#334155] font-bold  mb-1">
                    <DollarOutlined className="text-[#334155] text-base " />
                    Khoảng giá
                  </label>
                  <input
                    type="text"
                    placeholder="Chọn / tháng"
                    value={searchData.price}
                    onChange={(e) =>
                      setSearchData({ ...searchData, price: e.target.value })
                    }
                    className="w-full ml-6 outline-none text-gray-700 text-xs bg-transparent"
                  />
                </div>
              </div>

              <Button
                type="primary"
                size="large"
                style={{ borderRadius: 19 }}
                className="bg-[#3980F3] hover:bg-[#2a5ec7]  rounded-lg px-6 py-3 text-white font-bold ml-4"
              >
                Tìm kiếm
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h3 className="flex justify-center text-3xl font-bold text-gray-800 mb-4">
            {t("exploreTitle") || "Khám phá căn hộ theo khu vực"}
          </h3>
          <p className="flex justify-center text-[#909090] mb-8">
            {t("exploreSubtitle") ||
              "Có không ít lựa chọn để lựa chọn các loại tiền tệ từ các cơn gió, chi tiêu và mục được cấp phép."}
          </p>

          <div className="flex justify-center gap-2 mb-8">
            {[
              "Cả Thẻ",
              "Hà Nội",
              "Đà Nẵng",
              "Hà Tĩnh",
              "Nha Trang",
              "Hải Dương",
              "Thành phố",
              "Hà Tây",
            ].map((tag) => (
              <Button
                key={tag}
                size="large"
                style={{ borderRadius: 19 }}
                className="px-4 py-2 bg-gray-100 !border-1 !border-blue-300 !text-[#909090] hover:!bg-[#3980F3] hover:!text-white transition"
              >
                {tag}
              </Button>
            ))}
          </div>

          <div className="relative">
            <div className="relative h-120 bg-gradient-to-r from-orange-400 to-blue-500 rounded-xl overflow-hidden">
              <div className=" w-full h-full">
                <Image src={banner.src} alt="City Banner" preview={false} />
              </div>
            </div>
            <div className="absolute w-[90%] px-10 h-50 left-1/2 transform -translate-x-1/2 top-100 bg-[#F9FFFF] rounded-lg shadow-lg p-4 flex items-center gap-4 ">
              <div className="w-[90%]">
                <h4 className="font-bold text-4xl text-gray-800">
                  Thành Phố Hồ Chí Minh
                </h4>
                <p className="text-gray-600 mt-5 text-sm">
                  Thành phố năng động với nhiều lựa chọn căn hộ cho thuê ở đa
                  dạng khu vực, mức giá và diện tích. Vị trí thuận tiện di
                  chuyển, gần các tiện ích thiết yếu, đáp ứng tốt nhu cầu sinh
                  hoạt và làm việc hằng ngày của người thuê.
                </p>
              </div>
              <div className="w-32 h-32 bg-blue-200 rounded-lg ">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop"
                  alt="Building"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
