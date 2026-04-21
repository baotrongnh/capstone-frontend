"use client";

import { ROUTES } from "@/constants/routes";
import { useApartments } from "@/hooks/query/useApartments";
import type { components } from "@/types/api";
import { StarOutlined } from "@ant-design/icons";
import { ChevronDown, ChevronUp, Quote } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import banner3 from "../../../public/img/banner5.jpg";
import out3 from "../../../public/img/out3.jpg";
import out5 from "../../../public/img/out5.jpg";
import outfit from "../../../public/img/outfit.jpg";
type Testimonial = {
  id: number;
  name: string;
  role: string;
  time: string;
  review: string;
  image: string;
};

type ApartmentItem = components["schemas"]["ApartmentListItemDto"];

const TestimonialCard = ({
  item,
  type,
}: {
  item: Testimonial;
  type: "active" | "next";
}) => {
  const isActive = type === "active";

  return (
    <div
      className={`relative rounded-xl p-8 md:p-10 transition-all duration-500 ease-in-out
        ${
          isActive
            ? "bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] z-20 scale-100 border border-transparent"
            : "bg-white z-10 scale-[0.96] -mt-6 pt-14 border border-teal-200 opacity-100"
        }
      `}
    >
      <div
        className={`absolute -top-6 -left-6 rounded-full border-4 border-white overflow-hidden shadow-md bg-gray-200 transition-all
         ${isActive ? "w-16 h-16 md:w-20 md:h-20 opacity-100" : "w-12 h-12 opacity-0"} 
      `}
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className={`${!isActive ? "opacity-70 grayscale-0" : ""}`}>
        <p
          className={`text-gray-700 font-medium leading-relaxed italic mb-6 
            ${isActive ? "text-base md:text-lg" : "text-sm line-clamp-2"}
        `}
        >
          “{item.review}”
        </p>
        <div
          className={`border-t pt-4 ${isActive ? "border-gray-100" : "border-teal-100"}`}
        >
          <h4 className="text-gray-900 font-bold text-lg">{item.name}</h4>
          <p className="text-gray-500 text-sm font-medium mt-1">
            {item.role} • {item.time}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function TestimonialsSection() {
  const t = useTranslations("HomePage");

  // Lấy dữ liệu từ API
  const { data: apartmentsResponse } = useApartments({ limit: 4 });
  const projects: ApartmentItem[] = apartmentsResponse?.data || [];

  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);

  // Fallback an toàn nếu projects rỗng (đang loading hoặc API lỗi)
  const project = projects[currentProjectIndex] || null;

  const handlePrevProject = () =>
    setCurrentProjectIndex(
      (prev) => (prev - 1 + projects.length) % projects.length,
    );
  const handleNextProject = () =>
    setCurrentProjectIndex((prev) => (prev + 1) % projects.length);

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Hồ Khôi",
      role: "Người thuê",
      time: "10 tháng",
      review:
        "Mình đã ở căn hộ này gần một năm và nhìn chung trải nghiệm khá tốt. Không gian thoáng, ánh sáng tự nhiên nhiều nên ở lâu không bị bí. Bố trí phòng hợp lý, sinh hoạt hằng ngày rất tiện.",
      image: out3.src,
    },
    {
      id: 2,
      name: "Trần Hoàng ",
      role: "Người thuê",
      time: "1 năm",
      review:
        "Dịch vụ quản lý rất chuyên nghiệp, mọi yêu cầu sửa chữa đều được đáp ứng nhanh chóng. Vị trí thuận lợi để di chuyển vào trung tâm, tiết kiệm được rất nhiều thời gian đi lại hàng ngày.",
      image: outfit.src,
    },
    {
      id: 3,
      name: "Lê Thanh Huyền",
      role: "Khách ngắn hạn",
      time: "2 tháng",
      review:
        "Căn hộ sạch sẽ, đầy đủ tiện nghi như mô tả. Chủ nhà thân thiện và hỗ trợ nhiệt tình. Sẽ quay lại nếu có dịp công tác dài ngày tại thành phố này.",
      image: out5.src,
    },
  ];

  const router = useRouter();

  const handleNextTestimonial = () =>
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  const handlePrevTestimonial = () =>
    setActiveTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );

  // Fix lỗi loop nếu activeTestimonial không tồn tại do mảng thay đổi
  const validActiveTestimonial = activeTestimonial % testimonials.length;
  const nextTestimonialIndex =
    (validActiveTestimonial + 1) % testimonials.length;

  return (
    <div>
      <div
        className="relative bg-gray-900 bg-center py-12 overflow-hidden"
        style={{
          backgroundImage: `url(${banner3.src})`,
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {project ? (
            <div className="flex items-center justify-between gap-4 md:gap-8">
              <button
                onClick={handlePrevProject}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition backdrop-blur-sm"
              >
                ←
              </button>

              <div className="flex-1 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl">
                  <img
                    src={
                      project.images?.[0] ||
                      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=400&fit=crop"
                    }
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-white flex-1 text-center md:text-left">
                  <div className="inline-block bg-[#AFFFF0] text-teal-900 px-3 py-1 rounded-full text-xs font-bold mb-3 tracking-wide">
                    DỰ ÁN NỔI BẬT
                  </div>
                  <h3 className="text-2xl md:text-4xl font-bold mb-2">
                    {project.buildingName} - {project.apartmentNumber}
                  </h3>
                  <p className="text-sm text-white/80 mb-4 flex items-center justify-center md:justify-start gap-1">
                    <span className="opacity-70">📍</span>
                    {project.streetAddress ||
                      `Phường/Xã: ${project.wardCode || "Đang cập nhật"}`}
                  </p>

                  {/* Generate mô tả từ dữ liệu thực */}
                  <p className="text-sm md:text-base leading-relaxed mb-5 line-clamp-3 text-gray-100 max-w-2xl">
                    Căn hộ cao cấp với diện tích {project.totalArea}m², thiết kế
                    bao gồm {project.numberOfBedrooms} phòng ngủ và{" "}
                    {project.numberOfBathrooms} phòng tắm. Tình trạng nội thất:{" "}
                    {project.furnishingStatus === "unfurnished"
                      ? "Cơ bản/Trống"
                      : "Đầy đủ"}
                    .
                    {project.baseRentPrice &&
                      ` Giá thuê cơ bản: ${project.baseRentPrice} triệu.`}
                  </p>

                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <button
                      onClick={() => {
                        router.push(`${ROUTES.APARTMENT}`);
                      }}
                      className="bg-[#FFDA32] py-2 hover:bg-yellow-400 text-gray-900 border-0 font-bold rounded-full px-8 shadow-lg shadow-yellow-500/20"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleNextProject}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition backdrop-blur-sm"
              >
                →
              </button>
            </div>
          ) : (
            // Skeleton / Loading state khi dữ liệu chưa về
            <div className="text-center text-white py-20">
              Đang tải dữ liệu dự án...
            </div>
          )}
        </div>
      </div>

      <div className="bg-white py-24 relative overflow-hidden ">
        <div className="absolute top-0 left-0 w-full z-1">
          <img src="/vector1.svg" alt="logo" className="w-full h-auto" />
        </div>
        <div className="absolute top-0 right-0 w-[40%] h-full bg-cyan-50/30 -skew-x-12 translate-x-1/4 -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-4 flex flex-col items-start space-y-8 sticky top-24">
              <h2 className="text-4xl font-medium text-gray-900 leading-[1.15]">
                {t("testimonialsTitle")}
              </h2>
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`h-3 rounded-full transition-all duration-300 ${index === validActiveTestimonial ? "w-8 bg-blue-500" : "w-3 bg-gray-200 hover:bg-gray-300"}`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 relative mt-12 lg:mt-0 lg:pl-10">
              <Quote className="absolute -top-12 right-20 text-cyan-50 w-40 h-40 -z-10 rotate-12 opacity-80" />

              <div className="flex items-start gap-6">
                <div className="flex-1 flex flex-col">
                  <TestimonialCard
                    item={testimonials[validActiveTestimonial]}
                    type="active"
                  />

                  <TestimonialCard
                    item={testimonials[nextTestimonialIndex]}
                    type="next"
                  />
                </div>

                <div className="flex flex-col gap-4 pt-8">
                  <button
                    onClick={handlePrevTestimonial}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white bg-gray-300 hover:bg-gray-600 transition duration-200 shadow-md hover:shadow-lg cursor-pointer z-20 active:scale-95"
                  >
                    <ChevronUp size={24} />
                  </button>
                  <button
                    onClick={handleNextTestimonial}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white bg-gray-300 hover:bg-gray-600 transition duration-200 shadow-md hover:shadow-lg cursor-pointer z-20 active:scale-95"
                  >
                    <ChevronDown size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
