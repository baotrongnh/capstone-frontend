'use client'

import { Icon } from '@iconify/react'
import { Checkbox, Collapse, CollapseProps, Slider } from 'antd'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

export default function Filter() {
     const t = useTranslations('ApartmentList')
     const [priceRange, setPriceRange] = useState([2000, 10000])
     const [showMoreFilters, setShowMoreFilters] = useState(false)

     const handleChangePriceRange = (value: number | number[]) => {
          if (Array.isArray(value)) {
               setPriceRange(value)
          }
     }

     const popularFilters = [
          { label: 'Tuyệt vời 9+', value: 'excellent' },
          { label: '4 sao', value: '4star' },
          { label: 'Phòng tắm riêng', value: 'privateBath' },
          { label: 'WiFi miễn phí', value: 'freeWifi' },
          { label: 'Căn hộ', value: 'apartment' },
          { label: 'Khu nghỉ dưỡng', value: 'resort' },
          { label: 'Âm thực', value: 'food' },
     ]

     const amenities = [
          { label: 'Ban công', value: 'balcony' },
          { label: 'Bếp', value: 'kitchen' },
          { label: 'Phòng tắm riêng', value: 'privateBath' },
          { label: 'Máy giặt', value: 'washingMachine' },
          { label: 'Đồ nội thất', value: 'furniture' },
     ]

     const formatPrice = (value: number) => {
          return new Intl.NumberFormat('vi-VN').format(value * 1000) + ' Vnd'
     }

     const popularFiltersItems: CollapseProps['items'] = [
          {
               key: '1',
               label: <h3 className='font-semibold text-base text-gray-800'>Các Bộ Lọc Phổ Biến</h3>,
               children: (
                    <div className='space-y-3 px-1'>
                         {popularFilters.slice(0, showMoreFilters ? undefined : 5).map((filter) => (
                              <div key={filter.value}>
                                   <Checkbox className='text-sm text-gray-700'>
                                        {filter.label}
                                   </Checkbox>
                              </div>
                         ))}
                         <button
                              onClick={() => setShowMoreFilters(!showMoreFilters)}
                              className='text-primary text-sm font-medium hover:underline mt-2'
                         >
                              {showMoreFilters ? 'Thu gọn' : 'Hiển thị thêm điểm đến'}
                         </button>
                    </div>
               ),
          },
     ]

     const amenitiesItems: CollapseProps['items'] = [
          {
               key: '1',
               label: <h3 className='font-semibold text-base text-gray-800'>Tiện Nghi Phòng</h3>,
               children: (
                    <div className='space-y-3 px-1'>
                         {amenities.map((amenity) => (
                              <div key={amenity.value}>
                                   <Checkbox className='text-sm text-gray-700'>
                                        {amenity.label}
                                   </Checkbox>
                              </div>
                         ))}
                    </div>
               ),
          },
     ]

     return (
          <div className='space-y-6'>
               {/* Header */}
               <h2 className='text-primary font-bold text-2xl'>
                    {t('filterTitle')}
               </h2>

               {/* Price Range Section */}
               <div className='bg-white shadow-sm rounded-lg p-5 border border-gray-100'>
                    <h3 className='font-semibold text-base mb-4 text-gray-800'>
                         Khoảng Giá
                    </h3>
                    <Slider
                         range
                         value={priceRange}
                         min={1000}
                         max={50000}
                         step={500}
                         onChange={handleChangePriceRange}
                         tooltip={{
                              formatter: (value) => formatPrice(value || 0)
                         }}
                    />
                    <p className='text-sm text-gray-600 mt-3 font-medium'>
                         {formatPrice(priceRange[0])}
                    </p>
               </div>

               {/* Popular Filters Section */}
               <div className='bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden'>
                    <Collapse
                         defaultActiveKey={['1']}
                         ghost
                         expandIconPlacement='end'
                         expandIcon={({ isActive }) => (
                              <Icon
                                   icon="lucide:chevron-down"
                                   width={18}
                                   className={`transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}
                              />
                         )}
                         items={popularFiltersItems}
                    />
               </div>

               {/* Amenities Section */}
               <div className='bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden'>
                    <Collapse
                         defaultActiveKey={['1']}
                         ghost
                         expandIconPlacement='end'
                         expandIcon={({ isActive }) => (
                              <Icon
                                   icon="lucide:chevron-down"
                                   width={18}
                                   className={`transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}
                              />
                         )}
                         items={amenitiesItems}
                    />
               </div>
          </div>
     )
}
