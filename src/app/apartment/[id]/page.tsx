"use client"

import ApartmentMediaCarousel from "@/components/apartments/apartment-media-carousel"
import SimilarApartments from "@/components/apartments/similar-apartments"
import ModalBooking from "@/components/modal/modal-booking"
import ModalBookingSchedule from "@/components/modal/modal-booking-schedule"
import ModalLoginRequired from "@/components/modal/modal-login-required"
import { APARTMENT_STATUS } from "@/constants/apartment"
import { ROUTES } from "@/constants/routes"
import { useFullAddress } from "@/hooks/query/useAddress"
import { useApartment, useApartmentRating } from "@/hooks/query/useApartments"
import { useAuthStore } from "@/stores/auth.store"
import { formatVND } from "@/utils/format"
import {
  Breadcrumb,
  Button,
  Divider,
  Input,
  Modal,
  Rate,
  Result,
  Spin,
  Tag,
  Typography,
} from "antd"
import {
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  Map,
  MapPin,
  Maximize2,
  PlayCircle,
  Sofa,
  Users,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { use, useState } from "react"

export default function ApartmentDetail({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations("ApartmentDetailPage")
  const tLabels = useTranslations("ApartmentLabels")

  const { id } = use(params)
  const { data: apartmentData, isLoading, isError } = useApartment(id)
  const apt = apartmentData?.data
  const fullAddress = useFullAddress(
    apt?.streetAddress ?? undefined,
    apt?.provinceCode ?? undefined,
    apt?.wardCode ?? undefined,
  )

  const [isModalLoginRequiredOpen, setIsModalLoginRequiredLogin] = useState(false)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [isModalBookingApartmentOpen, setIsModalBookingApartmentOpen] = useState(false)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [ratingValue, setRatingValue] = useState(0)
  const [ratingComment, setRatingComment] = useState("")

  const user = useAuthStore((s) => s.user)
  const { mutate: submitRating, isPending: isSubmittingRating } = useApartmentRating()

  const handleButtonBooking = () => {
    if (!user) {
      setIsModalLoginRequiredLogin(true)
      return
    }
    setIsModalBookingApartmentOpen(true)
  }

  const handleBookingSchedule = () => {
    if (!user) {
      setIsModalLoginRequiredLogin(true)
      return
    }

    setIsScheduleModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="container h-screen flex items-center justify-center">
        <Spin size="large">
          <div className="p-10 text-gray-400">Đang tải thông tin căn hộ...</div>
        </Spin>
      </div>
    )
  }

  if (isError || !apartmentData) {
    return (
      <div className="container h-screen flex items-center justify-center">
        <Result
          status="404"
          title={t("notFoundTitle")}
          subTitle={t("notFoundDesc")}
        />
      </div>
    )
  }

  const images = apt?.images?.length ? apt.images : []
  const hasMedia = images.length > 0 || !!apt?.videoTourUrl
  const status = apt?.status ? APARTMENT_STATUS[apt.status] : null
  const averageRating = Number(apt?.rating ?? 0)
  const isHomeIqOwner = apt?.owner?.email?.toLowerCase() === "homeiq@gmail.com"
  const partnerCompanyName = apt?.owner?.companyName?.trim()

  const handleFindDirection = () => {
    if (apt?.latitude && apt?.longitude) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${apt.latitude},${apt.longitude}`,
        "_blank",
      )
    } else if (fullAddress) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`,
        "_blank",
      )
    }
  }

  const handleSubmitRating = () => {
    if (!user) {
      setIsModalLoginRequiredLogin(true)
      return
    }

    if (!ratingValue) {
      return
    }

    submitRating(
      {
        id,
        payload: {
          rating: ratingValue,
          comment: ratingComment.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          setRatingValue(0)
          setRatingComment("")
        },
      },
    )
  }

  return (
    <div className="container px-4 sm:px-6 lg:px-8">
      <ModalLoginRequired
        isModalOpen={isModalLoginRequiredOpen}
        setIsModalOpen={setIsModalLoginRequiredLogin}
      />
      <ModalBookingSchedule
        open={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        apartmentId={id}
      />

      <Modal
        open={isVideoModalOpen}
        onCancel={() => setIsVideoModalOpen(false)}
        footer={null}
        centered
        width={900}
        destroyOnHidden
      >
        {apt?.videoTourUrl ? (
          <video
            src={apt.videoTourUrl}
            controls
            autoPlay
            className="h-auto max-h-[72vh] w-full rounded-lg bg-black"
          />
        ) : null}
      </Modal>

      <ModalBooking apartmentData={apartmentData?.data} open={isModalBookingApartmentOpen} apartmentId={id} onClose={() => setIsModalBookingApartmentOpen(false)} />

      <Breadcrumb
        className="py-4"
        items={[
          { title: t("breadcrumbHome"), href: ROUTES.HOME },
          { title: t("breadcrumbList"), href: ROUTES.APARTMENT },
          { title: apt?.buildingName },
        ]}
      />

      {/* Gallery */}
      {hasMedia ? (
        <ApartmentMediaCarousel
          images={images}
          videoTourUrl={apt?.videoTourUrl ?? undefined}
          morePhotosText={(count) => t("morePhotos", { count })}
          imageAltText={(index) => `apartment-${index + 1}`}
          videoSlideTitle={t("videoTourTitle")}
          onOpenVideo={() => setIsVideoModalOpen(true)}
        />
      ) : (
        <div className="mt-5 w-full rounded-2xl border border-gray-200 bg-gray-100 h-64 md:h-96 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <p>{t("noPhotos")}</p>
            {apt?.videoTourUrl ? (
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="mt-3 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <PlayCircle size={16} className="text-primary" />
                {t("watchVideo")}
              </button>
            ) : null}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="pt-6 md:pt-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-primary">
                {apt?.buildingName}
              </h1>
              {status && (
                <Tag color={status.color}>
                  {tLabels(`status.${apt?.status}`)}
                </Tag>
              )}
            </div>
            <p className="text-muted text-sm mt-1">
              {t("unitCode")}: {apt?.apartmentNumber}
              {apt?.floorNumber
                ? ` · ${t("floorLabel")} ${apt.floorNumber}`
                : ""}
            </p>
          </div>
          <div className="flex flex-col md:items-end gap-1">
            <p className="text-2xl font-bold text-primary">
              {formatVND(apt?.baseRentPrice || 0)}
              <span className="text-sm font-normal text-muted">
                {t("perMonth")}
              </span>
            </p>
            {apt?.depositAmount && (
              <p className="text-sm text-muted">
                {t("deposit")}: {formatVND(apt.depositAmount)}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              <Button
                size="middle"
                shape="round"
                style={{ minWidth: 170, height: 40 }}
                onClick={handleBookingSchedule}
              >
                {t("scheduleBtn")}
              </Button>
              <Button
                size="middle"
                type="primary"
                shape="round"
                style={{ minWidth: 170, height: 40 }}
                onClick={() => handleButtonBooking()}
              >
                {t("rentBtn")}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 mt-3">
          <span className="text-muted flex items-center gap-1 text-sm md:text-base">
            <MapPin size={16} className="shrink-0" />
            <span className="line-clamp-1">
              {fullAddress || t("noAddress")}
            </span>
          </span>
          <Divider orientation="vertical" className="hidden sm:block" />
          <span className="text-muted flex gap-1 items-center text-sm md:text-base">
            <Rate disabled allowHalf value={averageRating} size="small" />
            {averageRating > 0
              ? `(${averageRating.toFixed(1)}/5)`
              : `(${t("noReview")})`}
          </span>
        </div>
      </div>

      <div className="mt-6 md:mt-8 rounded-2xl border border-gray-200 bg-gray-50/70 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="font-semibold text-lg md:text-xl">{t("rating.title")}</h2>
            <p className="text-sm text-gray-500 mt-1">{t("rating.subtitle")}</p>
          </div>
          <div className="rounded-xl bg-white border border-gray-100 px-4 py-3 min-w-52">
            <p className="text-xs uppercase tracking-wide text-gray-500">{t("rating.average")}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-primary">
                {averageRating > 0 ? averageRating.toFixed(1) : "-"}
              </span>
              <Rate disabled allowHalf value={averageRating} />
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-xl bg-white border border-gray-100 p-4 md:p-5">
          <p className="text-sm font-medium text-gray-700 mb-2">{t("rating.yourRating")}</p>
          <Rate value={ratingValue} onChange={setRatingValue} />

          <Input.TextArea
            value={ratingComment}
            onChange={(e) => setRatingComment(e.target.value)}
            rows={4}
            maxLength={250}
            showCount
            placeholder={t("rating.placeholder")}
            className="mt-4"
          />

          <div className="mt-4 flex justify-end">
            <Button
              type="primary"
              shape="round"
              size="large"
              disabled={!ratingValue}
              loading={isSubmittingRating}
              onClick={handleSubmitRating}
            >
              {isSubmittingRating ? t("rating.submitting") : t("rating.submit")}
            </Button>
          </div>
        </div>
      </div>

      {/* Specs */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
          <BedDouble size={22} className="text-primary shrink-0" />
          <div>
            <p className="text-xs text-gray-500">{t("specs.bedrooms")}</p>
            <p className="font-semibold">{apt?.numberOfBedrooms}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
          <Bath size={22} className="text-primary shrink-0" />
          <div>
            <p className="text-xs text-gray-500">{t("specs.bathrooms")}</p>
            <p className="font-semibold">{apt?.numberOfBathrooms}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
          <Maximize2 size={22} className="text-primary shrink-0" />
          <div>
            <p className="text-xs text-gray-500">{t("specs.totalArea")}</p>
            <p className="font-semibold">{apt?.totalArea} m²</p>
          </div>
        </div>
        {apt?.usableArea && (
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
            <Maximize2 size={22} className="text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted">{t("specs.usableArea")}</p>
              <p className="font-semibold">{apt.usableArea} m²</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
          <Building2 size={22} className="text-primary shrink-0" />
          <div>
            <p className="text-xs text-gray-500">{t("specs.floor")}</p>
            <p className="font-semibold">
              {apt?.floorNumber || "Chưa có thông tin"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
          <Sofa size={22} className="text-primary shrink-0" />
          <div>
            <p className="text-xs text-gray-500">{t("specs.furnishing")}</p>
            <p className="font-semibold text-xs">
              {tLabels(`furnishing.${apt?.furnishingStatus ?? ""}`) ||
                apt?.furnishingStatus}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
          <CalendarDays size={22} className="text-primary shrink-0" />
          <div>
            <p className="text-xs text-gray-500">{t("specs.yearBuilt")}</p>
            <p className="font-semibold">
              {apt?.yearBuilt || "Chưa có thông tin"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
          <Users size={22} className="text-primary shrink-0" />
          <div>
            <p className="text-xs text-muted">{t("specs.concurrentViews")}</p>
            <p className="font-semibold">
              {apt?.maxConcurrentViewings} {t("specs.concurrentViewsUnit")}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      {apt?.description && (
        <div className="mt-6 md:mt-8 space-y-3">
          <h2 className="font-semibold text-lg md:text-xl">
            {t("descriptionTitle")}
          </h2>
          <Typography.Paragraph className="text-justify text-sm md:text-base">
            {apt.description}
          </Typography.Paragraph>
        </div>
      )}

      {/* Video Tour */}
      {apt?.videoTourUrl && (
        <div className="mt-8 md:mt-10">
          <h2 className="font-semibold text-lg md:text-xl mb-3">
            {t("videoTourTitle")}
          </h2>
          <button
            type="button"
            onClick={() => setIsVideoModalOpen(true)}
            className="group relative w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-black text-left"
          >
            <video
              src={apt.videoTourUrl}
              muted
              playsInline
              preload="metadata"
              className="aspect-video w-full object-cover opacity-80 transition group-hover:opacity-90"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
            <PlayCircle className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 text-white" />
            <p className="absolute bottom-4 left-4 rounded-full bg-black/45 px-3 py-1 text-sm font-medium text-white">
              {t("watchVideo")}
            </p>
          </button>
        </div>
      )}

      {/* Amenities */}
      {apt?.amenities && apt.amenities.length > 0 && (
        <div className="mt-8 md:mt-10">
          <h2 className="font-semibold text-lg md:text-xl mb-3">
            {t("amenitiesTitle")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {apt.amenities.map((item, i) => (
              <Tag key={i} className="px-3 py-1 text-sm">
                {item.name}
              </Tag>
            ))}
          </div>
        </div>
      )}

      {/* Partner */}
      {apt?.owner && (
        <div className="mt-8 md:mt-10">
          <h2 className="font-semibold text-lg md:text-xl mb-3">
            {t("partnerTitle")}
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 size={20} className="text-primary" />
            </div>
            <div>
              {isHomeIqOwner ? (
                <Tag color="green" className="m-0! font-semibold">
                  Chính chủ HomeIQ
                </Tag>
              ) : (
                <p className="font-semibold">
                  {partnerCompanyName || "Thiếu chủ sở hữu"}
                </p>
              )}
              <p className="text-sm text-gray-500">
                {apt?.owner?.fullName || apt?.owner?.email || "Chưa có thông tin chủ sở hữu"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Rooms */}
      {apt?.rooms && apt.rooms.length > 0 && (
        <div className="mt-8 md:mt-10">
          <h2 className="font-semibold text-lg md:text-xl mb-3">
            {t("roomsTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {apt.rooms.map((room) => (
              <div
                key={room.id}
                className="border border-gray-100 rounded-lg p-4 bg-white"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">
                    {tLabels(`roomType.${room.roomType}`) || room.roomType}
                    {room.roomNumber ? ` · ${room.roomNumber}` : ""}
                  </span>
                  <Tag
                    color={APARTMENT_STATUS[room.status]?.color || "default"}
                  >
                    {tLabels(`status.${room.status}`) || room.status}
                  </Tag>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {room.area && (
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                      {room.area} m²
                    </span>
                  )}
                  {room.maxOccupancy > 1 && (
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                      {room.maxOccupancy} {t("room.occupancyUnit")}
                    </span>
                  )}
                  {room.hasAirConditioning && (
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                      {t("room.airCon")}
                    </span>
                  )}
                  {room.hasWindow && (
                    <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded">
                      {t("room.window")}
                    </span>
                  )}
                  {room.hasPrivateBathroom && (
                    <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded">
                      {t("room.privateBath")}
                    </span>
                  )}
                </div>
                {room.rentPrice && (
                  <p className="text-sm font-semibold text-primary">
                    {formatVND(room.rentPrice)}
                    {t("room.perMonth")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Location */}
      <div className="mt-8 md:mt-10 mb-8 md:mb-10">
        <div className="flex items-center gap-2 mb-3 md:mb-4">
          <Map className="text-gray-700 shrink-0" size={20} />
          <h2 className="font-semibold text-lg md:text-xl">
            {t("location.title")}
          </h2>
        </div>
        {fullAddress && (
          <p className="text-sm md:text-base text-gray-600 mb-3">
            <strong>{t("location.address")}:</strong> {fullAddress}
          </p>
        )}
        {apt?.latitude && apt?.longitude ? (
          <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-120 rounded-lg overflow-hidden">
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(apt.longitude) - 0.002},
              ${Number(apt.latitude) - 0.005},
              ${Number(apt.longitude) + 0.005},
              ${Number(apt.latitude) + 0.005}&layer=mapnik&marker=${apt.latitude},${apt.longitude}`}
              className="w-full h-full border-0"
              loading="lazy"
            />
            <button
              onClick={handleFindDirection}
              className="absolute top-3 right-3 bg-white text-sm font-medium px-3 py-1.5 rounded-full shadow flex items-center gap-1.5 hover:bg-gray-50 transition-colors cursor-pointer border-0 z-10"
            >
              <MapPin size={14} className="text-primary" />
              {t("location.openGoogleMaps")}
            </button>
          </div>
        ) : (
          <button
            className="w-full h-48 rounded-lg bg-gray-100 flex flex-col items-center justify-center gap-2 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer border-0"
            onClick={handleFindDirection}
          >
            <MapPin size={32} />
            <span className="text-sm">{t("location.searchOnMaps")}</span>
            <span className="text-xs text-gray-400">{fullAddress}</span>
          </button>
        )}
      </div>

      <SimilarApartments />
    </div>
  );
}
