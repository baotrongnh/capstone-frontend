import { ROUTES } from '@/constants/routes'
import { ApartmentProps } from '@/types/apartment'
import { Icon } from '@iconify/react'
import { Divider, Rate } from 'antd'
import Image from 'next/image'
import Link from 'next/link'

export default function ApartmentItem({ apartment }
     : { apartment: ApartmentProps }) {

     return (
          <Link href={`${ROUTES.APARTMENT}/${apartment.id}`} className='flex shadow-sm rounded-md items-center hover:opacity-80 hover:shadow-md duration-150'>
               <Image
                    src='/images/phongtro.jpg'
                    width={500}
                    height={500}
                    alt='phongtro'
                    className='w-33 aspect-square object-cover rounded-bl-sm rounded-tl-sm'
               />
               <div className='p-3'>
                    <div className='flex items-center'>
                         <span className='bg-secondary py-1 px-5 rounded-full text-[12px]/5 text-white font-bold'>
                              KHU DÂN CƯ
                         </span>

                         <Divider vertical />

                         <Rate
                              disabled
                              defaultValue={2}
                              size='small'
                              style={{ color: '#FFA432' }}
                         />
                         <span className='text-muted ml-2'>(584 người xem)</span>
                    </div>

                    <h1 className='font-semibold text-xl text-[#1c2b38] pt-1.5 pb-2.5'>
                         {apartment.name}
                    </h1>

                    <div className='flex items-center'>
                         <span className='flex items-center gap-1 text-sm text-muted'>
                              <Icon icon="lucide:clock" width={16} />
                              Loại hình: Căn hộ
                         </span>
                         <Divider vertical />
                         <span className='flex items-center gap-1 text-sm text-muted'>
                              <Icon icon="lucide:car" width={16} />
                              Cơ sở nhà để xe
                         </span>
                         <Divider vertical />
                         <span className='flex items-center gap-1 text-sm text-muted'>
                              <Icon icon="lucide:users" width={16} />
                              An toàn cho các bé gái và gia đình lưu trú
                         </span>
                    </div>
               </div>

               <div className='flex flex-1 flex-col justify-center items-end p-4'>
                    <p className='font-bold text-[#0C4A6E] text-xl'>
                         {apartment.price}
                    </p>
                    <p className='text-muted font-light'>
                         /tháng
                    </p>
               </div>
          </Link>
     )
}
