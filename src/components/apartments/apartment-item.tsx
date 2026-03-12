import { FURNISHING } from '@/constants/apartment'
import { ROUTES } from '@/constants/routes'
import type { ApartmentItem } from '@/types/apartment'
import { Icon } from '@iconify/react'
import { Rate } from 'antd'
import Image from 'next/image'
import Link from 'next/link'

type MockAmenity = { icon: string; label: string }
type TypeMock = { residentialArea: string; rating: number; viewCount: number; amenities: [MockAmenity, MockAmenity] }

const MOCK_BY_TYPE: Record<string, TypeMock> = {
     PREMIUM: { residentialArea: 'Saigon Pearl', rating: 4.8, viewCount: 312, amenities: [{ icon: 'lucide:car', label: 'Hầm xe cao cấp' }, { icon: 'lucide:shield-check', label: 'An ninh 24/7' }] },
     LUXURY: { residentialArea: 'Vinhomes Central Park', rating: 4.9, viewCount: 521, amenities: [{ icon: 'lucide:dumbbell', label: 'Gym & Spa' }, { icon: 'lucide:concierge-bell', label: 'Dịch vụ phòng cao cấp' }] },
     STANDARD: { residentialArea: 'Khu dân cư Him Lam', rating: 4.2, viewCount: 198, amenities: [{ icon: 'lucide:car', label: 'Cơ sở nhà để xe' }, { icon: 'lucide:users', label: 'An toàn cho gia đình' }] },
     BASIC: { residentialArea: 'Khu dân cư Bình Dương', rating: 3.9, viewCount: 84, amenities: [{ icon: 'lucide:parking-circle', label: 'Bãi đỗ xe' }, { icon: 'lucide:leaf', label: 'Môi trường trong lành' }] },
     STUDIO: { residentialArea: 'Masteri Thảo Điền', rating: 4.5, viewCount: 267, amenities: [{ icon: 'lucide:wifi', label: 'WiFi tốc độ cao' }, { icon: 'lucide:user', label: 'Phù hợp người độc thân' }] },
     PENTHOUSE: { residentialArea: 'The Landmark 81', rating: 5.0, viewCount: 743, amenities: [{ icon: 'lucide:binoculars', label: 'View toàn thành phố' }, { icon: 'lucide:crown', label: 'Đẳng cấp 5 sao' }] },
}

const DEFAULT_MOCK: TypeMock = {
     residentialArea: 'Khu dân cư nội thành',
     rating: 4.0,
     viewCount: 120,
     amenities: [
          { icon: 'lucide:car', label: 'Cơ sở nhà để xe' },
          { icon: 'lucide:users', label: 'An toàn cho gia đình' },
     ],
}

function getMock(type?: string | null): TypeMock {
     if (!type) return DEFAULT_MOCK
     return MOCK_BY_TYPE[type.toUpperCase()] ?? DEFAULT_MOCK
}

export default function ApartmentItem({ apartment }: { apartment: ApartmentItem }) {
     const imageSrc = apartment.images?.[0] ?? '/images/phongtro.jpg'
     const { residentialArea, rating, viewCount, amenities } = getMock(apartment.apartmentType)
     const priceFormatted = apartment.baseRentPrice
          ? Number(apartment.baseRentPrice).toLocaleString('vi-VN')
          : 'Liên hệ'

     return (
          <Link href={`${ROUTES.APARTMENT}/${apartment?.id}`} className='flex flex-col md:flex-row shadow-sm rounded-md hover:opacity-80 hover:shadow-md duration-150 overflow-hidden'>
               <Image
                    src={imageSrc}
                    width={500}
                    height={500}
                    alt={apartment.buildingName ?? apartment.apartmentNumber}
                    className='w-full md:w-33 aspect-square object-cover'
                    priority
               />

               <div className='p-3 flex-1 min-w-0'>
                    {/* Row 1: residential area pill | stars + viewer count */}
                    <div className='flex items-center gap-2 mb-1.5 flex-wrap'>
                         <span className='inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-600 border border-sky-200'>
                              {residentialArea}
                         </span>
                         <span className='text-gray-300'>|</span>
                         <Rate allowHalf defaultValue={rating} />
                         <span className='text-gray-400 text-xs'>({viewCount} Người xem)</span>
                    </div>

                    {/* Title */}
                    <h1 className='font-bold text-base md:text-lg text-primary line-clamp-1 mb-2'>
                         {apartment.buildingName ?? apartment.apartmentNumber}
                    </h1>

                    {/* Flat info chips separated by | */}
                    <div className='flex items-center flex-wrap text-xs text-gray-500'>
                         <span className='inline-flex items-center gap-1.5 pr-3'>
                              <Icon icon='lucide:layout-list' width={12} className='shrink-0 text-gray-400' />
                              Loại hình: {FURNISHING[apartment.furnishingStatus] ?? apartment.furnishingStatus}
                         </span>
                         {amenities.map((a, i) => (
                              <span key={i} className='inline-flex items-center'>
                                   <span className='text-gray-300 mr-3'>|</span>
                                   <span className='inline-flex items-center gap-1.5 pr-3'>
                                        <Icon icon={a.icon} width={12} className='shrink-0 text-gray-400' />
                                        {a.label}
                                   </span>
                              </span>
                         ))}
                    </div>
               </div>

               {/* Price */}
               <div className='flex md:flex-col justify-between md:justify-center items-center md:items-end p-3 md:p-4 bg-gray-50 md:bg-transparent border-t md:border-t-0 shrink-0'>
                    <div className='flex md:flex-col items-baseline md:items-end gap-1'>
                         <p className='font-semibold text-primary text-lg md:text-xl whitespace-nowrap'>
                              {priceFormatted} <span className='text-sm font-medium'>vnd</span>
                         </p>
                         <p className='text-muted font-light text-sm md:text-base'>
                              /tháng
                         </p>
                    </div>
               </div>
          </Link>
     )
}


