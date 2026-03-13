import { IMG_URL, ROUTES } from '@/constants/routes'
import type { ApartmentItem } from '@/types/apartment'
import { Icon } from '@iconify/react'
import { Rate } from 'antd'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

function InfoChip({ icon, children }: { icon: string; children: React.ReactNode }) {
     return (
          <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium'>
               <Icon icon={icon} width={13} className='shrink-0' />
               {children}
          </span>
     )
}

export default function ApartmentItem({ apartment }: { apartment: ApartmentItem }) {
     const tFurnishing = useTranslations('ApartmentLabels.furnishing')
     const t = useTranslations('ApartmentListPage')

     return (
          <Link
               href={`${ROUTES.APARTMENT}/${apartment?.id}`}
               className='flex flex-col md:flex-row shadow-sm rounded-md hover:opacity-80 hover:shadow-md transition duration-150 overflow-hidden'>
               <Image
                    src={apartment.images?.[0] ?? IMG_URL.APARTMENT_PLACEHOLDER}
                    width={500}
                    height={500}
                    alt={apartment.buildingName ?? 'No information'}
                    className='w-full md:w-33 aspect-square object-cover'
                    priority
               />

               <div className='p-3 flex-1 min-w-0'>
                    <div className='flex items-center gap-2 mb-1.5 flex-wrap'>
                         <span className='inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-primary/40 text-white border'>
                              Chưa có thông tin
                         </span>
                         <span className='text-gray-300'>|</span>
                         <Rate allowHalf defaultValue={4.5} />
                         <span className='text-gray-400 text-xs'>({5} lượt đánh giá)</span>
                    </div>

                    {/* Title */}
                    <h1 className='font-bold text-base md:text-xl text-primary line-clamp-1 mb-2'>
                         {apartment.buildingName}
                    </h1>

                    <div className='flex flex-wrap gap-2'>
                         <InfoChip icon="lucide:map-pin">{apartment.district}, {apartment.city}</InfoChip>
                         <InfoChip icon="lucide:maximize-2">{apartment.totalArea} m²</InfoChip>
                         <InfoChip icon="lucide:bed-double">{apartment.numberOfBedrooms} PN · {apartment.numberOfBathrooms} WC</InfoChip>
                         <InfoChip icon="lucide:sofa">{tFurnishing(apartment.furnishingStatus)}</InfoChip>
                    </div>
               </div>

               {/* Price */}
               <div className='flex md:flex-col justify-between md:justify-center items-center md:items-end p-3 md:p-4 bg-gray-50 md:bg-transparent border-t md:border-t-0 shrink-0'>
                    <div className='flex md:flex-col items-baseline md:items-end gap-1'>
                         <p className='font-semibold text-primary text-lg md:text-xl whitespace-nowrap'>
                              {apartment.baseRentPrice
                                   ? `${Number(apartment.baseRentPrice).toLocaleString('vi-VN')} vnđ`
                                   : 'Liên hệ'}
                         </p>
                         <p className='text-muted font-light text-sm md:text-base'>
                              /{t('month')}
                         </p>
                    </div>
               </div>
          </Link>
     )
}


