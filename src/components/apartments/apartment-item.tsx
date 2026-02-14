import { ROUTES } from '@/constants/routes'
import { Apartment } from '@/types/apartment'
import { formatVND } from '@/utils/format'
import { Icon } from '@iconify/react'
import { Divider, Rate } from 'antd'
import Image from 'next/image'
import Link from 'next/link'

export default function ApartmentItem({ apartment }: { apartment: Apartment }) {
     return (
          <Link href={`${ROUTES.APARTMENT}/${apartment.id}`} className='flex flex-col md:flex-row shadow-sm rounded-md hover:opacity-80 hover:shadow-md duration-150 overflow-hidden'>
               <Image
                    src='/images/phongtro.jpg'
                    width={500}
                    height={500}
                    alt='phongtro'
                    className='w-full md:w-33 aspect-square object-cover'
                    priority
               />
               <div className='p-3 flex-1'>
                    <div className='flex flex-wrap items-center gap-2'>
                         <span className='bg-secondary py-1 px-3 md:px-5 rounded-full text-[10px] md:text-[12px]/5 text-white font-bold'>
                              KHU DÂN CƯ
                         </span>

                         <Divider vertical className='hidden md:block' />

                         <div className='flex items-center gap-1'>
                              <Rate
                                   disabled
                                   defaultValue={2}
                                   size='small'
                                   style={{ color: '#FFA432' }}
                              />
                              <span className='text-muted text-xs md:text-sm'>(584 người xem)</span>
                         </div>
                    </div>

                    <h1 className='font-semibold text-base md:text-lg lg:text-xl text-[#1c2b38] pt-1.5 pb-2.5 line-clamp-2'>
                         {apartment.buildingName}
                    </h1>

                    <div className='flex flex-col md:flex-row md:items-center gap-2 md:gap-0'>
                         <span className='flex items-center gap-1 text-xs md:text-sm text-muted'>
                              <Icon icon="lucide:clock" width={14} className='md:w-4 md:h-4 shrink-0' />
                              Loại hình: Căn hộ
                         </span>
                         <Divider vertical className='hidden md:block' />
                         <span className='flex items-center gap-1 text-xs md:text-sm text-muted'>
                              <Icon icon="lucide:car" width={14} className='md:w-4 md:h-4 shrink-0' />
                              Cơ sở nhà để xe
                         </span>
                         <Divider vertical className='hidden lg:block' />
                         <span className='hidden lg:flex items-center gap-1 text-xs md:text-sm text-muted'>
                              <Icon icon="lucide:users" width={14} className='md:w-4 md:h-4 shrink-0' />
                              An toàn cho các bé gái và gia đình lưu trú
                         </span>
                    </div>
               </div>

               <div className='flex md:flex-col justify-between md:justify-center items-center md:items-end p-3 md:p-4 bg-gray-50 md:bg-transparent border-t md:border-t-0'>
                    <div className='flex md:flex-col items-baseline md:items-end gap-1'>
                         <p className='font-bold text-[#0C4A6E] text-lg md:text-xl'>
                              {formatVND(apartment.baseRentPrice)}
                         </p>
                         <p className='text-muted font-light text-sm md:text-base'>
                              /tháng
                         </p>
                    </div>
               </div>
          </Link>
     )
}
