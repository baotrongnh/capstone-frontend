import { Button } from 'antd'
import {
  AirVent,
  Bed,
  BookOpen,
  FlaskConical,
  PawPrint,
  Shirt,
  Sun,
  Tv,
  Utensils,
  Wifi,
} from 'lucide-react'

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
    <div className='mt-8 md:mt-10 bg-gray-50 rounded-lg p-4 md:p-6 lg:p-8'>
      <h2 className='font-semibold text-lg md:text-xl mb-4 md:mb-6'>Nơi Này Có Gì?</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
        {amenities.map((amenity, index) => (
          <div key={index} className='flex items-center gap-2 md:gap-3'>
            <amenity.icon className='text-blue-600 flex-shrink-0' size={20} />
            <span className='text-xs md:text-sm'>{amenity.label}</span>
          </div>
        ))}
      </div>
      <div className='mt-4 md:mt-6 text-center'>
        <Button type='primary' size='large' className='w-full sm:w-auto px-8 md:px-12'>
          Xem Chi Tiết Khác
        </Button>
      </div>
    </div>
  )
}
