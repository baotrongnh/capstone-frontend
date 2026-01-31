/* eslint-disable @next/next/no-img-element */
"use client";

import { useTranslations } from "next-intl";
import { Avatar, Button } from "antd";
import { useState } from "react";
import { StarOutlined } from "@ant-design/icons";
import banner3 from "../../../public/img/banner5.jpg";

export default function TestimonialsSection() {
  const t = useTranslations("HomePage");
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);

  const projects = [
    {
      id: 1,
      name: "Vinhomes Golden River",
      location: "Trung tâm Hồ Chí Minh",
      description:
        "Vinhomes Golden River Residences là dự án bất động sản hạng A tại trung tâm thành phố, với tiện ích đồng bộ, vị trí vàng và tầm nhìn sông Sài Gòn tuyệt đẹp.",
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      name: "Vinhomes Riverside",
      location: "Quận 7, TP.HCM",
      description:
        "Dự án căn hộ cao cấp với view sông, đầy đủ tiện ích, phù hợp cho gia đình trẻ và chuyên gia.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=400&fit=crop",
    },
    {
      id: 3,
      name: "Central Park",
      location: "Trung tâm thành phố",
      description:
        "Dự án căn hộ cao cấp tại trung tâm thành phố với thiết kế kiến trúc độc đáo và hiện đại.",
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop",
    },
  ];

  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      role: "Người đánh giá",
      days: "15 ngày",
      review:
        "Vào đó cấp có người nào do giáo dục nhân tôi. Những giáo sát thật họ rằng tiền bạc từ khi mà chúng tôi đã được tối ưu hóa về các nơi thường xuyên trong thực tế chất lượng cao.",
      rating: 5,
      comment:
        "Tìm kiếm với chúng tôi là được miễn từ với các yêu cầu giúp bạn liên quan với anh chị em khi nào được chu cấp.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    },
  ];

  const handlePrevProject = () => {
    setCurrentProjectIndex(
      (prev) => (prev - 1 + projects.length) % projects.length,
    );
  };

  const handleNextProject = () => {
    setCurrentProjectIndex((prev) => (prev + 1) % projects.length);
  };

  const project = projects[currentProjectIndex];
  const testimonial = testimonials[currentTestimonialIndex];

  return (
    <div>
      <div
        className="relative bg-gray-50 bg-center py-10  overflow-hidden opacity-90"
        style={{
          backgroundImage: `url(${banner3.src})`,
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between gap-8">
            <button
              onClick={handlePrevProject}
              className=" w-10 h-10 rounded-full bg-white/40 hover:bg-white/60 text-white text-xl flex items-center justify-center transition"
            >
              ←
            </button>

            <div className="flex-1 flex items-center gap-12">
              <div className=" w-64 h-64 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-white flex-1">
                <div className="inline-block bg-[#AFFFF0] text-teal-900 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                  DỰ ÁN NỔI BẬT
                </div>

                <h3 className="text-3xl font-bold mb-2">{project.name}</h3>
                <p className="text-sm text-white/90 mb-3">{project.location}</p>

                <p className="text-sm leading-relaxed mb-4 line-clamp-3">
                  {project.description}
                </p>

                <div className="flex items-center gap-2 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <StarOutlined
                      key={i}
                      className={`text-xs ${
                        i < Math.floor(project.rating)
                          ? "text-yellow-300"
                          : "text-white/50"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-white/80 ml-2">
                    {project.rating}/5
                  </span>
                </div>

                <Button
                  type="primary"
                  size="large"
                  className="!bg-[#FFDA32] hover:bg-yellow-500 !text-gray-900 !border-0 !font-bold"
                >
                  Xem ngay
                </Button>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col gap-2">
                {projects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentProjectIndex(index)}
                    className={`w-3 h-3 rounded-full transition ${
                      index === currentProjectIndex ? "bg-white" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNextProject}
                className=" w-10 h-10 rounded-full bg-white/40 hover:bg-white/60 text-white text-xl flex items-center justify-center transition"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative h-96">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-48 h-48 bg-blue-100 rounded-full opacity-50"></div>
                  <div className="absolute -bottom-4 -right-4 w-48 h-48 bg-purple-100 rounded-full opacity-50"></div>

                  <div className="relative z-10 w-64 h-64 rounded-full overflow-hidden border-8 border-white shadow-2xl bg-linear-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <Avatar size={200} src={testimonial.image} />
                  </div>
                </div>

                <div className="flex gap-2 mt-8">
                  {[1, 2, 3, 4, 5].map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition ${
                        index === 0 ? "bg-blue-400" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                {t("testimonialsTitle") || "Đánh Giá Nội Bất Của Khách Hàng"}
              </h2>

              <div className="mb-8">
                <p className="text-gray-700 leading-relaxed mb-6">
                  {testimonial.review}
                </p>

                <div className="mb-6">
                  <div className="font-bold text-gray-800 mb-2">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-600">
                    {testimonial.role} - {testimonial.days}
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
