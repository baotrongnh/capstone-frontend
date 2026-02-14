import { Button, Divider, Rate } from 'antd'
import { MapPin } from 'lucide-react'

interface ApartmentHeaderProps {
  title: string
  location: string
  rating: number
  totalReviews: number
}

export default function ApartmentHeader({ title, location, rating, totalReviews }: ApartmentHeaderProps) {
  return (
    <div className='pt-6 md:pt-10'>
      <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4'>
        <h1 className='text-xl md:text-2xl lg:text-3xl font-semibold'>{title}</h1>
        <Button size='large' type='primary' shape='round' className='w-full md:w-auto' style={{ minWidth: 200, height: 50 }}>
          Lên lịch xem nhà
        </Button>
      </div>

      <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 mt-3'>
        <span className='text-muted flex items-center gap-1 text-sm md:text-base'>
          <MapPin size={16} className='shrink-0' />
          <span className='line-clamp-1'>{location}</span>
        </span>
        <Divider orientation="vertical" className='hidden sm:block' />
        <span className='text-muted flex gap-1 items-center text-sm md:text-base'>
          <Rate disabled value={rating} size='small' />
          ({totalReviews} lượt đánh giá)
        </span>
      </div>
    </div>
  )
}
