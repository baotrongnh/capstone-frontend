'use client'

import SimilarApartments from '@/components/apartments/similar-apartments'
import { ROUTES } from '@/constants/routes'
import { useApartment } from '@/hooks/query/useApartments'
import { Breadcrumb, Button, Divider, Image, Rate, Result, Spin, Typography } from 'antd'
import Link from 'next/link'
import { Map, MapPin } from 'lucide-react'
import { use } from 'react'

export default function ApartmentDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data, isLoading, isError } = useApartment(id)

  if (isLoading) {
    return (
      <div className='container h-screen flex items-center justify-center'>
        <Spin size="large">
          <div className='p-10 text-gray-400'>Đang tải thông tin căn hộ...</div>
        </Spin>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className='container h-screen flex items-center justify-center'>
        <Result status="404" title="Không tìm thấy căn hộ" subTitle="Căn hộ không tồn tại hoặc đã bị xóa." />
      </div>
    )
  }

  const apt = data.data
  const fallbackImages = ['/img/auth/phongtro.jpg', '/img/auth/phongtro.jpg', '/img/auth/phongtro.jpg']
  const images = apt?.images && apt.images.length > 0 ? apt.images : fallbackImages

  const location = [apt?.district, apt?.city].filter(Boolean).join(', ')
  const fullAddress = [apt?.address, apt?.ward, apt?.district, apt?.city].filter(Boolean).join(', ')

  const handleFindDirection = () => {
    if (apt?.latitude && apt?.longitude) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${apt.latitude},${apt.longitude}`, '_blank')
    } else if (fullAddress) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`, '_blank')
    }
  }

  const activities = [
    'Dhanmondi là một khu vực cư trú thượng hạng tại 8 Dhaka, Bangladesh.',
    'Dhanmondi cũng là trung tâm văn hóa của thành phố Dhaka.',
    'Hồ Dhanmondi và Rabindra Sarobor những địa điểm không gian xanh rất thư giãn.',
    'Khu đây cũng nổi tiếng với nhiều nhà hàng, trường học và cửa hàng.',
    'Một số đô thị Hồi giáo Dhanmondi sẵn gần quanh sành cho các hoạt động.',
  ]

  return (
    <div className='container px-4 sm:px-6 lg:px-8'>
      <Breadcrumb
        className='py-4'
        items={[
          { title: 'Trang chủ', href: ROUTES.HOME },
          { title: 'Danh sách căn hộ', href: ROUTES.APARTMENT },
          { title: apt?.buildingName }
        ]}
      />

      {/* Gallery */}
      <div className='w-full grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-2 md:gap-4 mt-5'>
        <div className='col-span-2 md:col-span-3 row-span-2 overflow-hidden rounded-lg h-62.5 md:h-100'>
          <Image height='100%' width='100%' alt='main' src={images[0]} style={{ objectFit: 'cover' }} />
        </div>
        <div className='overflow-hidden rounded-lg h-30 md:h-48.75'>
          <Image height='100%' width='100%' alt='side1' src={images[1]} style={{ objectFit: 'cover' }} />
        </div>
        <div className='relative overflow-hidden rounded-lg h-30 md:h-48.75'>
          <Image height='100%' width='100%' alt='side2' src={images[2]} style={{ objectFit: 'cover' }} />
          <div className='bg-primary text-center p-3 absolute bottom-0 w-full'>
            <Link href={ROUTES.HOME} className='underline font-semibold text-white'>Xem thêm</Link>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className='pt-6 md:pt-10'>
        <div className='flex md:flex-row md:justify-between md:items-center gap-4'>
          <h1 className='text-xl md:text-2xl lg:text-3xl font-semibold'>{apt?.buildingName}</h1>
          <div className='space-x-2'>
            <Button size='middle' shape='round' style={{ minWidth: 170, height: 40 }}>Đặt lịch xem căn hộ</Button>
            <Button size='middle' type='primary' shape='round' style={{ minWidth: 170, height: 40 }}>Đặt thuê căn hộ</Button>
          </div>
        </div>
        <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 mt-3'>
          <span className='text-muted flex items-center gap-1 text-sm md:text-base'>
            <MapPin size={16} className='shrink-0' />
            <span className='line-clamp-1'>{location || 'Chưa có địa chỉ'}</span>
          </span>
          <Divider orientation='vertical' className='hidden sm:block' />
          <span className='text-muted flex gap-1 items-center text-sm md:text-base'>
            <Rate disabled value={0} size='small' />
            (Chưa có đánh giá)
          </span>
        </div>
      </div>

      {/* Description */}
      <div className='mt-6 md:mt-7 space-y-3'>
        <h2 className='font-semibold text-lg md:text-xl'>Mô tả</h2>
        <Typography.Paragraph className='text-justify text-sm md:text-base'>
          {apt?.description || 'Chưa có mô tả.'}
        </Typography.Paragraph>
      </div>

      {/* Activities */}
      <div className='mt-8 md:mt-10'>
        <div className='flex items-center gap-2 mb-3 md:mb-4'>
          <Map className='text-gray-700 shrink-0' size={20} />
          <h2 className='font-semibold text-lg md:text-xl'>Hoạt Động</h2>
        </div>
        <div className='bg-white rounded-lg p-4 md:p-6 border border-gray-100'>
          <p className='font-medium mb-2 md:mb-3 text-sm md:text-base'>Bạn Có Thể Làm Gì?</p>
          <ul className='space-y-2 text-xs md:text-sm text-gray-700'>
            {activities.map((activity, index) => (
              <li key={index} className='flex gap-2'><span>•</span><span>{activity}</span></li>
            ))}
          </ul>
        </div>
      </div>

      {/* Location */}
      <div className='mt-8 md:mt-10 mb-8 md:mb-10'>
        <div className='flex items-center gap-2 mb-3 md:mb-4'>
          <Map className='text-gray-700 shrink-0' size={20} />
          <h2 className='font-semibold text-lg md:text-xl'>Tìm Đường Đi</h2>
        </div>
        {fullAddress && (
          <p className='text-sm md:text-base text-gray-600 mb-3'>
            <strong>Địa chỉ:</strong> {fullAddress}
          </p>
        )}
        <div className='relative w-full h-75 md:h-100 lg:h-125 bg-gray-200 rounded-lg overflow-hidden'>
          <div className='absolute inset-0 flex items-center justify-center bg-gray-300'>
            <div className='text-center'>
              <Map size={48} className='mx-auto mb-2 text-gray-500' />
              <p className='text-gray-600'>Map Component Here</p>
              {apt?.latitude && apt?.longitude && (
                <p className='text-xs text-gray-500 mt-2'>Lat: {apt.latitude}, Long: {apt.longitude}</p>
              )}
            </div>
          </div>
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <Button type='primary' size='large' icon={<Map size={16} />} onClick={handleFindDirection}>
              Tìm Đường Đi
            </Button>
          </div>
        </div>
      </div>

      <SimilarApartments />
    </div>
  )
}
