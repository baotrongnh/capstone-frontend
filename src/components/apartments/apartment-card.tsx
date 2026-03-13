'use client'

import { ROUTES } from '@/constants/routes'
import { ApartmentItem } from '@/types/apartment'
import { formatVND } from '@/utils/format'
import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

export default function ApartmentCard({ apartment }: { apartment: ApartmentItem }) {
     const t = useTranslations('ApartmentLabels')
     const imageSrc = apartment.images?.[0] ?? '/images/phongtro.jpg'

     return (
          <Link href={`${ROUTES.APARTMENT}/${apartment.id}`} className='bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer group block'>
               {/* Image */}
               <div className='relative h-48 overflow-hidden'>
                    <Image
                         src={imageSrc}
                         width={500}
                         height={500}
                         alt={apartment.buildingName ?? apartment.apartmentNumber}
                         className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                         priority
                    />
               </div>

               {/* Content */}
               <div className='p-4'>
                    {/* Title */}
                    <h3 className='font-semibold text-base text-gray-800 mb-3 line-clamp-2 leading-snug min-h-11'>
                         {apartment.buildingName ?? apartment.apartmentNumber}
                    </h3>

                    {/* Features */}
                    <div className='space-y-2 mb-3'>
                         <div className='flex items-center gap-2 text-sm text-muted'>
                              <Icon icon="lucide:maximize-2" width={16} className='shrink-0' />
                              <span>{apartment.totalArea} m²</span>
                         </div>
                         <div className='flex items-center gap-2 text-sm text-muted'>
                              <Icon icon="lucide:bed-double" width={16} className='shrink-0' />
                              <span>{apartment.numberOfBedrooms} phòng ngủ · {apartment.numberOfBathrooms} WC</span>
                         </div>
                         <div className='flex items-center gap-2 text-sm text-muted'>
                              <Icon icon="lucide:sofa" width={16} className='shrink-0' />
                              <span className='line-clamp-1'>{t(`furnishing.${apartment.furnishingStatus}`)}</span>
                         </div>
                    </div>

                    {/* Price */}
                    <div className='pt-3 border-t border-gray-100'>
                         <div className='flex items-baseline gap-1'>
                              <span className='text-xl font-bold text-primary'>{formatVND(apartment.baseRentPrice)}</span>
                              <span className='text-sm text-muted'>/tháng</span>
                         </div>
                    </div>
               </div>
          </Link>
     )
}

