import { Button, Divider, Rate } from 'antd'
import { MapPin } from 'lucide-react'
import React from 'react'

interface ApartmentHeaderProps {
  title: string
  location: string
  rating: number
  totalReviews: number
}

export default function ApartmentHeader({ title, location, rating, totalReviews }: ApartmentHeaderProps) {
  return (
    <div className='pt-10'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-semibold'>{title}</h1>
        <Button size='large' type='primary' shape='round' style={{ width: 200, height: 50 }}>
          Lên lịch xem nhà
        </Button>
      </div>

      <div className='flex items-center'>
        <span className='text-muted flex items-center gap-1'>
          <MapPin size={16} />
          {location}
        </span>
        <Divider orientation="vertical" />
        <span className='text-muted flex gap-1 items-center'>
          <Rate disabled value={rating} size='small' />
          ({totalReviews} lượt đánh giá)
        </span>
      </div>
    </div>
  )
}
