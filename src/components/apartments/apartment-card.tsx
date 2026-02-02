import { ApartmentProps } from '@/types/apartment'
import { Icon } from '@iconify/react'
import { Rate } from 'antd'
import Image from 'next/image'

export default function ApartmentCard({ apartment }: { apartment: ApartmentProps }) {
     return (
          <div className='bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer group'>
               {/* Image */}
               <div className='relative h-48 overflow-hidden'>
                    <Image
                         src='/images/phongtro.jpg'
                         width={500}
                         height={500}
                         alt='apartment'
                         className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                    />
               </div>

               {/* Content */}
               <div className='p-4'>
                    {/* Title */}
                    <h3 className='font-semibold text-base text-gray-800 mb-3 line-clamp-2 leading-snug min-h-11'>
                         {apartment.name}
                    </h3>

                    {/* Features */}
                    <div className='space-y-2 mb-3'>
                         <div className='flex items-center gap-2 text-sm text-muted'>
                              <Icon icon="lucide:home" width={16} className='shrink-0' />
                              <span>50 m2</span>
                         </div>
                         <div className='flex items-center gap-2 text-sm text-muted'>
                              <Icon icon="lucide:users" width={16} className='shrink-0' />
                              <span>Hầm gửi xe</span>
                         </div>
                         <div className='flex items-center gap-2 text-sm text-muted'>
                              <Icon icon="lucide:users" width={16} className='shrink-0' />
                              <span className='line-clamp-1'>Khu dân cư an toàn và thân thiện</span>
                         </div>
                    </div>

                    {/* Rating & Reviews */}
                    <div className='flex items-center gap-2 mb-3'>
                         <Rate
                              disabled
                              defaultValue={5}
                              className='text-xs'
                              style={{ color: '#FFA432', fontSize: '14px' }}
                         />
                         <span className='text-xs text-gray-500'>758 lượt đánh giá</span>
                    </div>

                    {/* Price */}
                    <div className='pt-3 border-t border-gray-100'>
                         <div className='flex items-baseline gap-1'>
                              <span className='text-xl font-bold text-primary'>13.000.000 vnd</span>
                              <span className='text-sm text-muted'>/tháng</span>
                         </div>
                    </div>
               </div>
          </div>
     )
}
