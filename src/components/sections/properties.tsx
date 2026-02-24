"use client";

import { useTranslations } from "next-intl";
import { useState, useRef } from "react";
import { StarFilled } from "@ant-design/icons";
import { useApartments } from "@/hooks/query/useApartments";
import { Apartment } from "@/types/apartment";
export default function PropertiesSection() {
  const t = useTranslations("HomePage");
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { data: apartments } = useApartments();

  if (!apartments) {
    return <div>Loading...</div>;
  }

  const apartmentsList = Array.isArray(apartments)
    ? apartments
    : apartments?.data && Array.isArray(apartments.data)
      ? apartments.data
      : [];

  if (!Array.isArray(apartmentsList) || apartmentsList.length === 0) {
    return <div>No apartments found</div>;
  }

  const handleDetail = (id: string | number) => {
    // Implement navigation to apartment detail page
    console.log("Navigate to apartment detail with ID:", id);
  };

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;

    if (container) {
      const scrollAmount = 300;

      if (direction === "left") {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="bg-white relative ">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-1">
          <div
            ref={scrollContainerRef}
            className="flex gap-2 overflow-x-auto scroll-smooth pb-4"
            style={{
              scrollBehavior: "smooth",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {/* {properties.map((property) => (
              <div
                key={property.id}
                className="shrink-0 w-65 bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
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
                          className="text-[11px]  text-yellow-400!"
                        />
                      ))}
                    </div>
                    <p className="text-xl font-semibold text-[#A3D5FF]">
                      {property.price} vnđ
                    </p>
                  </div>

                  <div className="flex justify-between space-y-1 text-xs text-gray-500 mb-2">
                    <div className="flex items-center gap-2">
                      <span>758 đánh giá</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{property.period}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))} */}
            {apartmentsList.map((apartment: Apartment) => (
              <div
                key={apartment.id}
                className="shrink-0 w-65 bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden cursor-pointer"
                onClick={() => handleDetail(apartment.id)}
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={
                      apartment.images?.[0] ??
                      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop"
                    }
                    alt={apartment.buildingName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-3">
                  <h4 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 mb-2">
                    {apartment.buildingName} – {apartment.apartmentNumber}
                  </h4>

                  <div className="space-y-1 text-xs text-gray-500 mb-2">
                    <div>{apartment.totalArea} m²</div>
                    <div>
                      {apartment.district}, {apartment.city}
                    </div>
                    <div>
                      {apartment.numberOfBedrooms} PN ·{" "}
                      {apartment.numberOfBathrooms} WC
                    </div>
                    <div>Tầng {apartment.floorNumber}</div>
                    <div>
                      Nội thất:{" "}
                      {apartment.furnishingStatus === "fully_furnished" &&
                        "Đầy đủ"}
                      {apartment.furnishingStatus === "semi_furnished" &&
                        "Bán đạo"}
                      {apartment.furnishingStatus === "unfurnished" && "Không"}
                    </div>
                    <div>
                      Cọc:{" "}
                      {Number(apartment.depositAmount).toLocaleString("vi-VN")}{" "}
                      ₫
                    </div>
                  </div>

                  <div className="flex justify-between w-full border-t border-gray-200 pt-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <StarFilled
                          key={i}
                          className="text-[11px] text-yellow-400!"
                        />
                      ))}
                    </div>

                    <p className="text-xl font-semibold text-[#A3D5FF]">
                      {Number(apartment.baseRentPrice).toLocaleString("vi-VN")}{" "}
                      ₫
                    </p>
                  </div>

                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>758 đánh giá</span>
                    <span>/tháng</span>
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
