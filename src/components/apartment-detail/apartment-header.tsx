import { ApartmentDetailResponse } from '@/lib/services/apartment.service'
import { ApartmentDetail } from '@/types/apartment'
import { Button, Divider, Rate } from 'antd'
import { MapPin } from 'lucide-react'


export default function ApartmentHeader({ apartmentData }: { apartmentData: ApartmentDetailResponse }) {
  // Build location string
  const location = [apartmentData?.data?.district, apartmentData?.data?.city].filter(Boolean).join(', ')

  return (
    <div className='pt-6 md:pt-10'>
      <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4'>
        <h1 className='text-xl md:text-2xl lg:text-3xl font-semibold'>{apartmentData?.data?.buildingName}</h1>
        <Button size='large' type='primary' shape='round' className='w-full md:w-auto' style={{ minWidth: 200, height: 50 }}>
          Đặt lịch xem căn hộ
        </Button>
        <Button size='large' type='primary' shape='round' className='w-full md:w-auto' style={{ minWidth: 200, height: 50 }}>
          Đặt thuê căn hộ
        </Button>
      </div>

      <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 mt-3'>
        <span className='text-muted flex items-center gap-1 text-sm md:text-base'>
          <MapPin size={16} className='shrink-0' />
          <span className='line-clamp-1'>{location || 'Chưa có địa chỉ'}</span>
        </span>
        <Divider orientation="vertical" className='hidden sm:block' />
        <span className='text-muted flex gap-1 items-center text-sm md:text-base'>
          <Rate disabled value={0} size='small' />
          (Chưa có đánh giá)
        </span>
      </div>
    </div>
  )
}
