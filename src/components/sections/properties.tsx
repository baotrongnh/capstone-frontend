"use client";

import { useTranslations } from "next-intl";
import { useState, useRef } from "react";
import { StarFilled } from "@ant-design/icons";
export default function PropertiesSection() {
  const t = useTranslations("HomePage");
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef(null);

  const properties = [
    {
      id: 1,
      name: "Dhanmondi: Hotel Grand Circle tại Dhak Sài Gòn",
      area: "50 m²",
      amenities: "Hầm gửi xe",
      description: "Không gian an toàn và thân thiện",
      rating: 5,
      price: "13.000.000",
      period: "/tháng",
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      name: "Dhanmondi: Hotel Grand Circle tại Dhak Sài Gòn",
      area: "50 m²",
      amenities: "Hầm gửi xe",
      description: "Không gian an toàn và thân thiện",
      rating: 5,
      price: "13.000.000",
      period: "/tháng",
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      name: "Dhanmondi: Hotel Grand Circle tại Dhak Sài Gòn",
      area: "50 m²",
      amenities: "Hầm gửi xe",
      description: "Không gian an toàn và thân thiện",
      rating: 5,
      price: "13.000.000",
      period: "/tháng",
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      name: "Dhanmondi: Hotel Grand Circle tại Dhak Sài Gòn",
      area: "50 m²",
      amenities: "Hầm gửi xe",
      description: "Không gian an toàn và thân thiện",
      rating: 5,
      price: "13.000.000",
      period: "/tháng",
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    },
    {
      id: 5,
      name: "Vinhomes Riverside - Căn hộ hiện đại",
      area: "85 m²",
      amenities: "Full nội thất",
      description: "Hướng sông, view tuyệt đẹp",
      rating: 5,
      price: "18.000.000",
      period: "/tháng",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
    },
    {
      id: 6,
      name: "Central Park - Căn hộ cao cấp",
      area: "75 m²",
      amenities: "Đầy đủ tiện ích",
      description: "Vị trí trung tâm",
      rating: 4,
      price: "16.000.000",
      period: "/tháng",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
    },
  ];

  const handleScroll = (direction) => {
    const container = scrollContainerRef.current;
    const scrollAmount = 320; // Card width + gap

    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white ">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-2 overflow-x-auto scroll-smooth pb-4"
            style={{
              scrollBehavior: "smooth",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {properties.map((property) => (
              <div
                key={property.id}
                className="flex-shrink-0 w-[260px] bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-3">
                  <h4 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 mb-2">
                    {property.name}
                  </h4>

                  <div className="space-y-1 text-xs text-gray-500 mb-2">
                    <div className="flex items-center gap-2">
                      <span>{property.area}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{property.amenities}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{property.description}</span>
                    </div>
                  </div>

                  <div className="flex justify-between  w-full  border-t border-gray-200 ">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <StarFilled
                          key={i}
                          className="text-[11px]  !text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-xl font-semibold text-[#A3D5FF]">
                      {property.price} vnđ
                    </p>
                  </div>

                  <div className="flex justify-between space-y-1 text-xs text-gray-500 mb-2">
                    <div className="flex items-center gap-2">
                      <span>758 lượt đánh giá</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{property.period}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleScroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center text-xl text-gray-700 hover:text-blue-500 transition"
          >
            ←
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center text-xl text-gray-700 hover:text-blue-500 transition"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
