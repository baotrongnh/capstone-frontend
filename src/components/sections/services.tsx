"use client";

import { HandCoins } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ServicesSection() {
  const t = useTranslations("HomePage");

  const services = [
    {
      id: 1,
      icon: <HandCoins size={30} />,
      title: "Tổng ưu ưu công IntelligentOps",
      description:
        "IntelligentOps là tối ưu hóa cải tiến dự đoán, quản lý các thông tin chi tiết để giảm thiểu Slack có thể đạt được.",
    },
    {
      id: 2,
      icon: <HandCoins size={30} />,
      title: "Hive",
      description:
        "Hive là giải pháp quản lý kho thông minh được thiết kế dành cho người dùng khó sử dụng và cuộc sống.",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 pb-10 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="m-auto w-[30%] h-[1px] mb-10 bg-gray-400"></div>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            {t("servicesTitle") || "Dịch vụ nội bất của chúng tôi"}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("servicesSubtitle") ||
              "Các dịch vụ khác khác khác các dịch vụ khác nơi cấp cứ để bạn biết rõ nhất sẽ đạt được những gì khác."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-8 text-center"
            >
              <div className="text-1xl mb-4 flex justify-center">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}

          <div
            key={3}
            className="bg-[#F9FFFF] rounded-lg shadow-md hover:shadow-lg transition-shadow p-8 text-center"
          >
            <div className="text-1xl mb-4 flex justify-center">
              <HandCoins size={30} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Hỗ trợ bảo trì và sửa chữa
            </h3>
            <p className="text-gray-600 leading-relaxed">
              IntelliRentOps cho phép người thuê gửi yêu cầu bảo trì và theo dõi
              tình trạng xử lý trực tiếp trên hệ thống.  Giúp việc bảo trì căn
              hộ được quản lý rõ ràng, giảm chậm trễ và nâng cao trải nghiệm
              thuê.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
