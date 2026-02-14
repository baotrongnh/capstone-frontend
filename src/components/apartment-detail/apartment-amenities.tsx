import { Button } from 'antd'
import {
  Shirt,
  Utensils,
  AirVent,
  PawPrint,
  Bed,
  Tv,
  FlaskConical,
  Wifi,
  Sun,
  BookOpen,
  ShowerHead
} from 'lucide-react'
import React from 'react'

export default function ApartmentAmenities() {
  const amenities = [
    { icon: Shirt, label: 'Sân Phơi' },
    { icon: Bed, label: 'Xô Phòng Tắm Chất Lượng Quốc Tế' },
    { icon: Sun, label: 'Rèm Chắn Sáng' },
    { icon: Utensils, label: 'Giá Phơi Quần Áo' },
    { icon: Tv, label: 'TV HDTV 43 Inch Với Truyền Hình Cáp Cao Cấp' },
    { icon: BookOpen, label: 'Sách Và Tài Liệu học' },
    { icon: AirVent, label: 'Điều Hòa' },
    { icon: FlaskConical, label: 'Bình Chứa Cháy' },
    { icon: PawPrint, label: 'Cho Phép Mang Theo Thú Cưng' },
    { icon: Wifi, label: 'Wifi - 8 Mbps' }
  ]

  return (
    <div className='mt-10 bg-gray-50 rounded-lg p-8'>
      <h2 className='font-semibold text-xl mb-6'>Nơi Này Có Gì?</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {amenities.map((amenity, index) => (
          <div key={index} className='flex items-center gap-3'>
            <amenity.icon className='text-blue-600' size={20} />
            <span className='text-sm'>{amenity.label}</span>
          </div>
        ))}
      </div>
      <div className='mt-6 text-center'>
        <Button type='primary' size='large' className='w-full md:w-auto px-12'>
          Xem Chi Tiết Khác
        </Button>
      </div>
    </div>
  )
}
