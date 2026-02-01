"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { ChevronUp, ChevronDown, Quote } from "lucide-react";
import banner3 from "../../../public/img/banner5.jpg";
import { Button } from "antd";
import { StarOutlined } from "@ant-design/icons";

// --- COMPONENT CARD ---
const TestimonialCard = ({
  item,
  type,
}: {
  item: any;
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
        className={`absolute -top-6 -left-6 rounded-full border-[4px] border-white overflow-hidden shadow-md bg-gray-200 transition-all
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
        {" "}
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

  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const projects = [
    {
      id: 1,
      name: "Vinhomes Golden River",
      location: "Trung tâm Hồ Chí Minh",
      description:
        "Vinhomes Golden River Residences là dự án bất động sản hạng A tại trung tâm thành phố...",
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      name: "Vinhomes Riverside",
      location: "Quận 7, TP.HCM",
      description: "Dự án căn hộ cao cấp với view sông, đầy đủ tiện ích...",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=400&fit=crop",
    },
  ];
  const handlePrevProject = () =>
    setCurrentProjectIndex(
      (prev) => (prev - 1 + projects.length) % projects.length,
    );
  const handleNextProject = () =>
    setCurrentProjectIndex((prev) => (prev + 1) % projects.length);
  const project = projects[currentProjectIndex];

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Minh T",
      role: "Người thuê",
      time: "10 tháng",
      review:
        "Mình đã ở căn hộ này gần một năm và nhìn chung trải nghiệm khá tốt. Không gian thoáng, ánh sáng tự nhiên nhiều nên ở lâu không bị bí. Bố trí phòng hợp lý, sinh hoạt hằng ngày rất tiện.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    },
    {
      id: 2,
      name: "Trần Hoàng A",
      role: "Người thuê",
      time: "1 năm",
      review:
        "Dịch vụ quản lý rất chuyên nghiệp, mọi yêu cầu sửa chữa đều được đáp ứng nhanh chóng. Vị trí thuận lợi để di chuyển vào trung tâm, tiết kiệm được rất nhiều thời gian đi lại hàng ngày.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    },
    {
      id: 3,
      name: "Lê Văn C",
      role: "Khách ngắn hạn",
      time: "2 tháng",
      review:
        "Căn hộ sạch sẽ, đầy đủ tiện nghi như mô tả. Chủ nhà thân thiện và hỗ trợ nhiệt tình. Sẽ quay lại nếu có dịp công tác dài ngày tại thành phố này.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    },
  ];

  const handleNextTestimonial = () =>
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  const handlePrevTestimonial = () =>
    setActiveTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  const nextTestimonialIndex = (activeTestimonial + 1) % testimonials.length;

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
          <div className="flex items-center justify-between gap-4 md:gap-8">
            <button
              onClick={handlePrevProject}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition backdrop-blur-sm"
            >
              ←
            </button>

            <div className="flex-1 flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-white flex-1 text-center md:text-left">
                <div className="inline-block bg-[#AFFFF0] text-teal-900 px-3 py-1 rounded-full text-xs font-bold mb-3 tracking-wide">
                  DỰ ÁN NỔI BẬT
                </div>
                <h3 className="text-2xl md:text-4xl font-bold mb-2">
                  {project.name}
                </h3>
                <p className="text-sm text-white/80 mb-4 flex items-center justify-center md:justify-start gap-1">
                  <span className="opacity-70">📍</span> {project.location}
                </p>
                <p className="text-sm md:text-base leading-relaxed mb-5 line-clamp-3 text-gray-100 max-w-2xl">
                  {project.description}
                </p>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <StarOutlined
                        key={i}
                        className={
                          i < Math.floor(project.rating)
                            ? "text-yellow-400 text-lg"
                            : "text-gray-500 text-lg"
                        }
                      />
                    ))}
                    <span className="text-sm text-white/90 ml-2 font-medium">
                      ({project.rating}/5)
                    </span>
                  </div>
                  <Button
                    type="primary"
                    size="large"
                    className="!bg-[#FFDA32] hover:!bg-yellow-400 !text-gray-900 !border-0 !font-bold rounded-full px-8 shadow-lg shadow-yellow-500/20"
                  >
                    Xem chi tiết
                  </Button>
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
        </div>
      </div>

      <div className="bg-white py-24 relative overflow-hidden">
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
                    className={`h-3 rounded-full transition-all duration-300 ${index === activeTestimonial ? "w-8 bg-blue-500" : "w-3 bg-gray-200 hover:bg-gray-300"}`}
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
                    item={testimonials[activeTestimonial]}
                    type="active"
                  />

                  <TestimonialCard
                    item={testimonials[nextTestimonialIndex]}
                    type="next"
                  />
                </div>

                <div className="flex flex-col gap-4 pt-8 sticky top-24 hidden sm:flex">
                  <button
                    onClick={handlePrevTestimonial}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition duration-200"
                  >
                    <ChevronUp size={28} />
                  </button>
                  <button
                    onClick={handleNextTestimonial}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition duration-200"
                  >
                    <ChevronDown size={28} />
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
