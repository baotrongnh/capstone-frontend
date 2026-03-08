import { APARTMENT_STATUS, formatPrice, FURNISHING } from '@/constants/apartment'
import { ROUTES } from '@/constants/routes'
import type { ApartmentItem } from '@/types/apartment'
import { Icon } from '@iconify/react'
import { Tag } from 'antd'
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
     const statusConfig = APARTMENT_STATUS[apartment.status] ?? { label: apartment.status, color: 'default' }
     const imageSrc = apartment.images?.[0] ?? '/images/phongtro.jpg'

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
               <div className='p-3 flex-1'>
                    <div className='flex flex-wrap items-center gap-2 mb-1'>
                         <Tag color={statusConfig.color}>{statusConfig.label}</Tag>
                         {apartment.apartmentType && (
                              <Tag>{apartment.apartmentType}</Tag>
                         )}
                    </div>

                    <h1 className='font-semibold text-base md:text-lg lg:text-xl text-[#1c2b38] line-clamp-2 mb-2'>
                         {apartment.buildingName ?? apartment.apartmentNumber}
                    </h1>

                    <div className='flex flex-wrap gap-2'>
                         <InfoChip icon="lucide:map-pin">{apartment.district}, {apartment.city}</InfoChip>
                         <InfoChip icon="lucide:maximize-2">{apartment.totalArea} m²</InfoChip>
                         <InfoChip icon="lucide:bed-double">{apartment.numberOfBedrooms} PN · {apartment.numberOfBathrooms} WC</InfoChip>
                         <InfoChip icon="lucide:sofa">{FURNISHING[apartment.furnishingStatus] ?? apartment.furnishingStatus}</InfoChip>
                    </div>
               </div>

               <div className='flex md:flex-col justify-between md:justify-center items-center md:items-end p-3 md:p-4 bg-gray-50 md:bg-transparent border-t md:border-t-0'>
                    <div className='flex md:flex-col items-baseline md:items-end gap-1'>
                         <p className='font-bold text-[#0C4A6E] text-lg md:text-xl'>
                              {formatPrice(apartment.baseRentPrice)}
                         </p>
                         <p className='text-muted font-light text-sm md:text-base'>
                              /tháng
                         </p>
                    </div>
               </div>
          </Link>
     )
}


