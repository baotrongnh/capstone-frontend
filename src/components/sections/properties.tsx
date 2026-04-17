"use client";

import { useApartments } from "@/hooks/query/useApartments";
import {
  ApartmentItem,
  ApartmentQueryParams,
} from "@/lib/services/apartment.service";
import { useAuthStore } from "@/stores/auth.store";
import { StarFilled } from "@ant-design/icons";
import { Button, Image } from "antd";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import ModalBooking from "../modal/modal-booking";
import ModalBookingSchedule from "../modal/modal-booking-schedule";
import ModalLoginRequired from "../modal/modal-login-required";
export default function PropertiesSection() {
  const router = useRouter();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [modalReservation, setModalReservation] = useState(false);
  const [isModalLoginRequiredOpen, setIsModalLoginRequiredLogin] =
    useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const [selectedApartmentId, setSelectedApartmentId] = useState<
    string | number | null
  >(null);

  const [selectedApartmentData, setSelectedApartmentData] = useState<
    ApartmentItem | undefined
  >();

  const params = useMemo<ApartmentQueryParams>(
    () => ({
      sortBy: "baseRentPrice",
      sortOrder: "asc",
      status: "available",
    }),
    [],
  );

  const user = useAuthStore((s) => s.user);

  const { data: apartments } = useApartments(params);

  console.log("ĐA", apartments);

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
    console.log("Navigate to apartment detail with ID:", id);
    router.push(`/apartment/${id}`);
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

  const handleButtonRedirect = () => {
    if (!user) {
      setIsModalLoginRequiredLogin(true);
    } else {
      setIsBookingModalOpen(true);
    }
  };

  const handleReservation = (apartmentId: string | number) => {
    setSelectedApartmentId(apartmentId);
    if (!user) {
      setIsModalLoginRequiredLogin(true);
    } else {
      setModalReservation(true);
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
            {apartmentsList.map((apartment: ApartmentItem) => {
              return (
                <div
                  key={apartment.id}
                  className="shrink-0 w-65 bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden cursor-pointer"
                >
                  <div className="h-40 overflow-hidden relative">
                    <Image
                      src={
                        apartment.images?.[0] ??
                        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop"
                      }
                      alt={apartment.buildingName ?? "Apartment"}
                      className="object-cover"
                    />
                  </div>

                  <div className="p-3">
                    <div onClick={() => handleDetail(apartment.id)}>
                      <h4 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 mb-2">
                        {apartment.buildingName} – {apartment.apartmentNumber}
                      </h4>

                      <div className="space-y-1 text-xs text-gray-500 mb-2">
                        <div>Diện tích: {apartment.totalArea} m²</div>
                        <div>
                          Không gian: {apartment.numberOfBedrooms} PN ·{" "}
                          {apartment.numberOfBathrooms} WC
                        </div>
                        <div>
                          Tầng {apartment.floorNumber} ·{" "}
                          {apartment.streetAddress}, {apartment.wardName}
                        </div>

                        <div>
                          Nội thất:{" "}
                          {apartment.furnishingStatus === "fully_furnished" &&
                            "Đầy đủ"}
                          {apartment.furnishingStatus === "semi_furnished" &&
                            "Bán đạo"}
                          {apartment.furnishingStatus === "unfurnished" &&
                            "Không"}
                        </div>
                        <div>
                          Cọc:{" "}
                          {Number(apartment.depositAmount).toLocaleString(
                            "vi-VN",
                          )}{" "}
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
                          {Number(apartment.baseRentPrice).toLocaleString(
                            "vi-VN",
                          )}{" "}
                          ₫
                        </p>
                      </div>

                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{0} đánh giá</span>
                        <span>/tháng</span>
                      </div>
                    </div>
                    <div className="flex mt-3 gap-2">
                      <Button
                        size="middle"
                        shape="round"
                        style={{ minWidth: 110, height: 30 }}
                        onClick={() => handleButtonRedirect()}
                      >
                        Đặt lịch xem
                      </Button>

                      <Button
                        size="middle"
                        shape="round"
                        type="primary"
                        onClick={() => {
                          handleReservation(apartment.id);
                          setSelectedApartmentData(apartment);
                        }}
                        style={{ minWidth: 110, height: 30 }}
                      >
                        Đặt thuê
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
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

        <ModalBooking
          open={modalReservation}
          onClose={() => setModalReservation(false)}
          apartmentId={selectedApartmentId}
          apartmentData={selectedApartmentData}
        />

        <ModalBookingSchedule
          open={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          apartmentId={String(selectedApartmentId)}
        />

        <ModalLoginRequired
          isModalOpen={isModalLoginRequiredOpen}
          setIsModalOpen={setIsModalLoginRequiredLogin}
        />
      </div>
    </div>
  );
}
