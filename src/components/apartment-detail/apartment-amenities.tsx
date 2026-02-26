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
  Home,
} from 'lucide-react'

interface ApartmentAmenitiesProps {
  amenities?: string[]
}

// Icon mapping for amenities
const amenityIcons: Record<string, any> = {
  'wifi': Wifi,
  'điều hòa': AirVent,
  'tv': Tv,
  'giường': Bed,
  'sân phơi': Shirt,
  'rèm': Sun,
  'bếp': Utensils,
  'sách': BookOpen,
  'thú cưng': PawPrint,
  'bình cứu hỏa': FlaskConical,
  'default': Home
}

// Get icon based on amenity name
const getAmenityIcon = (amenity: string) => {
  const lowerAmenity = amenity.toLowerCase()
  for (const [key, icon] of Object.entries(amenityIcons)) {
    if (lowerAmenity.includes(key)) {
      return icon
    }
  }
  return amenityIcons.default
}

export default function ApartmentAmenities({ amenities = [] }: ApartmentAmenitiesProps) {
  // Fallback data if no amenities provided
  const defaultAmenities = [
    'Wifi',
    'Điều hòa',
    'TV',
    'Giường',
    'Sân phơi',
    'Rèm chắn sáng',
    'Bếp',
    'Sách và tài liệu học',
    'Cho phép thú cưng',
    'Bình cứu hỏa'
  ]

  const displayAmenities = amenities.length > 0 ? amenities : defaultAmenities

  return (
    <div className='mt-8 md:mt-10 bg-gray-50 rounded-lg p-4 md:p-6 lg:p-8'>
      <h2 className='font-semibold text-lg md:text-xl mb-4 md:mb-6'>Nơi Này Có Gì?</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
        {displayAmenities.map((amenity, index) => {
          const IconComponent = getAmenityIcon(amenity)
          return (
            <div key={index} className='flex items-center gap-2 md:gap-3'>
              <IconComponent className='text-blue-600 shrink-0' size={20} />
              <span className='text-xs md:text-sm'>{amenity}</span>
            </div>
          )
        })}
      </div>
      <div className='mt-4 md:mt-6 text-center'>
        <Button type='primary' size='large' className='w-full sm:w-auto px-8 md:px-12'>
          Xem Chi Tiết Khác
        </Button>
      </div>
    </div>
  )
}
