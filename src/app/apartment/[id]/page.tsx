'use client'

import SimilarApartments from '@/components/apartments/similar-apartments'
import { ROUTES } from '@/constants/routes'
import { useApartment } from '@/hooks/query/useApartments'
import { Breadcrumb, Button, Divider, Image, Rate, Result, Spin, Tag, Typography } from 'antd'
import { Bath, BedDouble, Building2, CalendarDays, ExternalLink, Map, MapPin, Maximize2, Sofa, Users, Video } from 'lucide-react'
import { use, useState } from 'react'
import { useAuthStore } from '@/stores/auth.store'
import ModalLoginRequired from '@/components/modal/modalLoginRequired'
import ModalBookingSchedule, { type BookingScheduleData } from '@/components/modal/modal-booking-schedule'
import { APARTMENT_STATUS, FURNISHING, ROOM_TYPE, formatPrice } from '@/constants/apartment'
import { useTranslations } from 'next-intl'

export default function ApartmentDetail({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('ApartmentDetailPage')
  const tLabels = useTranslations('ApartmentLabels')
  const { id } = use(params)
  const { data, isLoading, isError } = useApartment(id)
  const [isModalLoginRequiredOpen, setIsModalLoginRequiredLogin] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const user = useAuthStore(s => s.user)

  const handleButtonRedirect = (onSuccess: () => void) => {
    if (!user) {
      setIsModalLoginRequiredLogin(true)
      return
    }
    onSuccess()
  }

  if (isLoading) {
    return (
      <div className='container h-screen flex items-center justify-center'>
        <Spin size='large'>
          <div className='p-10 text-gray-400'>Đang tải thông tin căn hộ...</div>
        </Spin>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className='container h-screen flex items-center justify-center'>
        <Result status='404' title={t('notFoundTitle')} subTitle={t('notFoundDesc')} />
      </div>
    )
  }

  const apt = data.data

  const handleBookingSubmit = (bookingData: BookingScheduleData) => {
    console.log('Booking data:', { ...bookingData, apartment: apt })
  }

  const images = apt?.images?.length ? apt.images : []
  const location = [apt?.district, apt?.city].filter(Boolean).join(', ')
  const fullAddress = [apt?.address, apt?.ward, apt?.district, apt?.city].filter(Boolean).join(', ')
  const status = apt?.status ? APARTMENT_STATUS[apt.status] : null

  const handleFindDirection = () => {
    if (apt?.latitude && apt?.longitude) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${apt.latitude},${apt.longitude}`, '_blank')
    } else if (fullAddress) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`, '_blank')
    }
  }

  return (
    <div className='container px-4 sm:px-6 lg:px-8'>
      <ModalLoginRequired isModalOpen={isModalLoginRequiredOpen} setIsModalOpen={setIsModalLoginRequiredLogin} />
      <ModalBookingSchedule open={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} onSubmit={handleBookingSubmit} />

      <Breadcrumb
        className='py-4'
        items={[
          { title: t('breadcrumbHome'), href: ROUTES.HOME },
          { title: t('breadcrumbList'), href: ROUTES.APARTMENT },
          { title: apt?.buildingName || apt?.apartmentNumber },
        ]}
      />

      {/* Gallery */}
      {images.length > 0 ? (
        <div className='w-full grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-2 md:gap-4 mt-5'>
          <div className='col-span-2 md:col-span-3 row-span-2 overflow-hidden rounded-lg h-64 md:h-96'>
            <Image height='100%' width='100%' alt='main' src={images[0]} style={{ objectFit: 'cover' }} />
          </div>
          {images[1] && (
            <div className='overflow-hidden rounded-lg h-30 md:h-46.25'>
              <Image height='100%' width='100%' alt='side1' src={images[1]} style={{ objectFit: 'cover' }} />
            </div>
          )}
          {images[2] && (
            <div className='relative overflow-hidden rounded-lg h-30 md:h-46.25'>
              <Image height='100%' width='100%' alt='side2' src={images[2]} style={{ objectFit: 'cover' }} />
              {images.length > 3 && (
                <div className='bg-black/50 text-center p-3 absolute bottom-0 w-full'>
                  <span className='font-semibold text-white'>{t('morePhotos', { count: images.length - 3 })}</span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className='w-full rounded-lg bg-gray-100 h-64 md:h-96 mt-5 flex items-center justify-center text-gray-400'>
          {t('noPhotos')}
        </div>
      )}

      {/* Header */}
      <div className='pt-6 md:pt-10'>
        <div className='flex flex-col md:flex-row md:justify-between md:items-start gap-4'>
          <div>
            <div className='flex items-center gap-2 flex-wrap'>
              <h1 className='text-xl md:text-2xl lg:text-3xl font-semibold'>{apt?.buildingName || apt?.apartmentNumber}</h1>
              {status && <Tag color={status.color}>{tLabels(`status.${apt?.status}`)}</Tag>}
              {apt?.apartmentType && <Tag>{apt.apartmentType}</Tag>}
            </div>
            <p className='text-gray-500 text-sm mt-1'>
              {t('unitCode')}: {apt?.apartmentNumber}
              {apt?.floorNumber ? ` · ${t('floorLabel')} ${apt.floorNumber}` : ''}
            </p>
          </div>
          <div className='flex flex-col md:items-end gap-1'>
            <p className='text-2xl font-bold text-primary'>
              {formatPrice(apt?.baseRentPrice)}
              <span className='text-sm font-normal text-gray-500'>{t('perMonth')}</span>
            </p>
            {apt?.depositAmount && (
              <p className='text-sm text-gray-500'>{t('deposit')}: {formatPrice(apt.depositAmount)}</p>
            )}
            <div className='flex flex-wrap gap-2 mt-2'>
              <Button size='middle' shape='round' style={{ minWidth: 170, height: 40 }} onClick={() => handleButtonRedirect(() => setIsBookingModalOpen(true))}>
                {t('scheduleBtn')}
              </Button>
              <Button size='middle' type='primary' shape='round' style={{ minWidth: 170, height: 40 }} onClick={() => handleButtonRedirect(() => console.log('rent'))}>
                {t('rentBtn')}
              </Button>
            </div>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 mt-3'>
          <span className='text-muted flex items-center gap-1 text-sm md:text-base'>
            <MapPin size={16} className='shrink-0' />
            <span className='line-clamp-1'>{location || t('noAddress')}</span>
          </span>
          <Divider orientation='vertical' className='hidden sm:block' />
          <span className='text-muted flex gap-1 items-center text-sm md:text-base'>
            <Rate disabled value={0} size='small' />
            ({t('noReview')})
          </span>
        </div>
      </div>

      {/* Specs */}
      <div className='mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
        <div className='flex items-center gap-2 bg-gray-50 rounded-lg p-3'>
          <BedDouble size={18} className='text-primary shrink-0' />
          <div>
            <p className='text-xs text-gray-500'>{t('specs.bedrooms')}</p>
            <p className='font-semibold'>{apt?.numberOfBedrooms}</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-gray-50 rounded-lg p-3'>
          <Bath size={18} className='text-primary shrink-0' />
          <div>
            <p className='text-xs text-gray-500'>{t('specs.bathrooms')}</p>
            <p className='font-semibold'>{apt?.numberOfBathrooms}</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-gray-50 rounded-lg p-3'>
          <Maximize2 size={18} className='text-primary shrink-0' />
          <div>
            <p className='text-xs text-gray-500'>{t('specs.totalArea')}</p>
            <p className='font-semibold'>{apt?.totalArea} m²</p>
          </div>
        </div>
        {apt?.usableArea && (
          <div className='flex items-center gap-2 bg-gray-50 rounded-lg p-3'>
            <Maximize2 size={18} className='text-primary shrink-0' />
            <div>
              <p className='text-xs text-gray-500'>{t('specs.usableArea')}</p>
              <p className='font-semibold'>{apt.usableArea} m²</p>
            </div>
          </div>
        )}
        {apt?.floorNumber && (
          <div className='flex items-center gap-2 bg-gray-50 rounded-lg p-3'>
            <Building2 size={18} className='text-primary shrink-0' />
            <div>
              <p className='text-xs text-gray-500'>{t('specs.floor')}</p>
              <p className='font-semibold'>{apt.floorNumber}</p>
            </div>
          </div>
        )}
        <div className='flex items-center gap-2 bg-gray-50 rounded-lg p-3'>
          <Sofa size={18} className='text-primary shrink-0' />
          <div>
            <p className='text-xs text-gray-500'>{t('specs.furnishing')}</p>
            <p className='font-semibold text-xs'>{tLabels(`furnishing.${apt?.furnishingStatus ?? ''}`) || apt?.furnishingStatus}</p>
          </div>
        </div>
        {apt?.yearBuilt && (
          <div className='flex items-center gap-2 bg-gray-50 rounded-lg p-3'>
            <CalendarDays size={18} className='text-primary shrink-0' />
            <div>
              <p className='text-xs text-gray-500'>{t('specs.yearBuilt')}</p>
              <p className='font-semibold'>{apt.yearBuilt}</p>
            </div>
          </div>
        )}
        <div className='flex items-center gap-2 bg-gray-50 rounded-lg p-3'>
          <Users size={18} className='text-primary shrink-0' />
          <div>
            <p className='text-xs text-gray-500'>{t('specs.concurrentViews')}</p>
            <p className='font-semibold'>{apt?.maxConcurrentViewings} {t('specs.concurrentViewsUnit')}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      {apt?.description && (
        <div className='mt-6 md:mt-8 space-y-3'>
          <h2 className='font-semibold text-lg md:text-xl'>{t('descriptionTitle')}</h2>
          <Typography.Paragraph className='text-justify text-sm md:text-base'>
            {apt.description}
          </Typography.Paragraph>
        </div>
      )}

      {/* Video Tour */}
      {apt?.videoTourUrl && (
        <div className='mt-8 md:mt-10'>
          <h2 className='font-semibold text-lg md:text-xl mb-3'>{t('videoTourTitle')}</h2>
          <a
            href={apt.videoTourUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-3 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg px-5 py-3 border border-gray-200'
          >
            <Video size={20} className='text-primary' />
            <span className='text-sm font-medium'>{t('watchVideo')}</span>
            <ExternalLink size={14} className='text-gray-400' />
          </a>
        </div>
      )}

      {/* Amenities */}
      {apt?.amenities && apt.amenities.length > 0 && (
        <div className='mt-8 md:mt-10'>
          <h2 className='font-semibold text-lg md:text-xl mb-3'>{t('amenitiesTitle')}</h2>
          <div className='flex flex-wrap gap-2'>
            {apt.amenities.map((item, i) => (
              <Tag key={i} className='px-3 py-1 text-sm'>{item}</Tag>
            ))}
          </div>
        </div>
      )}

      {/* Partner */}
      {apt?.partner && (
        <div className='mt-8 md:mt-10'>
          <h2 className='font-semibold text-lg md:text-xl mb-3'>{t('partnerTitle')}</h2>
          <div className='bg-gray-50 rounded-lg p-4 border border-gray-100 flex items-center gap-4'>
            <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0'>
              <Building2 size={20} className='text-primary' />
            </div>
            <div>
              <p className='font-semibold'>{apt.partner.companyName}</p>
              <p className='text-sm text-gray-500'>{apt.partner.fullName}</p>
            </div>
          </div>
        </div>
      )}

      {/* Rooms */}
      {apt?.rooms && apt.rooms.length > 0 && (
        <div className='mt-8 md:mt-10'>
          <h2 className='font-semibold text-lg md:text-xl mb-3'>{t('roomsTitle')}</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
            {apt.rooms.map((room) => (
              <div key={room.id} className='border border-gray-100 rounded-lg p-4 bg-white'>
                <div className='flex justify-between items-center mb-2'>
                  <span className='font-medium'>
                    {tLabels(`roomType.${room.roomType}`) || room.roomType}
                    {room.roomNumber ? ` · ${room.roomNumber}` : ''}
                  </span>
                  <Tag color={APARTMENT_STATUS[room.status]?.color || 'default'}>
                    {tLabels(`status.${room.status}`) || room.status}
                  </Tag>
                </div>
                <div className='flex flex-wrap gap-1 mb-2'>
                  {room.area && <span className='text-xs bg-gray-100 px-2 py-0.5 rounded'>{room.area} m²</span>}
                  {room.maxOccupancy > 1 && <span className='text-xs bg-gray-100 px-2 py-0.5 rounded'>{room.maxOccupancy} {t('room.occupancyUnit')}</span>}
                  {room.hasAirConditioning && <span className='text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded'>{t('room.airCon')}</span>}
                  {room.hasWindow && <span className='text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded'>{t('room.window')}</span>}
                  {room.hasPrivateBathroom && <span className='text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded'>{t('room.privateBath')}</span>}
                </div>
                {room.rentPrice && (
                  <p className='text-sm font-semibold text-primary'>{formatPrice(room.rentPrice)}{t('room.perMonth')}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Location */}
      <div className='mt-8 md:mt-10 mb-8 md:mb-10'>
        <div className='flex items-center gap-2 mb-3 md:mb-4'>
          <Map className='text-gray-700 shrink-0' size={20} />
          <h2 className='font-semibold text-lg md:text-xl'>{t('location.title')}</h2>
        </div>
        {fullAddress && (
          <p className='text-sm md:text-base text-gray-600 mb-3'>
            <strong>{t('location.address')}:</strong> {fullAddress}
          </p>
        )}
        {apt?.latitude && apt?.longitude ? (
          <div className='relative w-full h-64 sm:h-80 md:h-96 lg:h-120 rounded-lg overflow-hidden'>
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(apt.longitude) - 0.005},${Number(apt.latitude) - 0.005},${Number(apt.longitude) + 0.005},${Number(apt.latitude) + 0.005}&layer=mapnik&marker=${apt.latitude},${apt.longitude}`}
              className='w-full h-full border-0'
              loading='lazy'
            />
            <button
              onClick={handleFindDirection}
              className='absolute top-3 right-3 bg-white text-sm font-medium px-3 py-1.5 rounded-full shadow flex items-center gap-1.5 hover:bg-gray-50 transition-colors cursor-pointer border-0 z-10'
            >
              <MapPin size={14} className='text-primary' />
              {t('location.openGoogleMaps')}
            </button>
          </div>
        ) : (
          <button
            className='w-full h-48 rounded-lg bg-gray-100 flex flex-col items-center justify-center gap-2 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer border-0'
            onClick={handleFindDirection}
          >
            <MapPin size={32} />
            <span className='text-sm'>{t('location.searchOnMaps')}</span>
            <span className='text-xs text-gray-400'>{fullAddress}</span>
          </button>
        )}
      </div>

      <SimilarApartments />
    </div>
  )
}
