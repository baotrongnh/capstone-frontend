'use client'

import ApartmentActivities from '@/components/apartment-detail/apartment-activities'
import ApartmentDescription from '@/components/apartment-detail/apartment-description'
import ApartmentGallery from '@/components/apartment-detail/apartment-gallery'
import ApartmentHeader from '@/components/apartment-detail/apartment-header'
import ApartmentLocation from '@/components/apartment-detail/apartment-location'
import SimilarApartments from '@/components/apartments/similar-apartments'
import { ROUTES } from '@/constants/routes'
import { useApartment } from '@/hooks/query/useApartments'
import { Breadcrumb, Spin, Result } from 'antd'
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
        <Result
          status="404"
          title="Không tìm thấy căn hộ"
          subTitle="Căn hộ không tồn tại hoặc đã bị xóa."
        />
      </div>
    )
  }

  // Prepare image array with fallback
  const images = data?.data?.images && data?.data?.images.length > 0
    ? data?.data.images
    : ['/img/auth/phongtro.jpg', '/img/auth/phongtro.jpg', '/img/auth/phongtro.jpg']

  return (
    <div className='container h-min-screen px-4 sm:px-6 lg:px-8'>
      <Breadcrumb
        className='py-4'
        items={[
          { title: 'Trang chủ', href: ROUTES.HOME },
          { title: 'Danh sách căn hộ', href: ROUTES.APARTMENT },
          { title: data?.data?.buildingName }
        ]}
      />

      <ApartmentGallery images={images} />

      <ApartmentHeader apartmentData={data} />

      <ApartmentDescription description={data?.data?.description || 'Chưa có mô tả.'} />

      {/* <ApartmentAmenities amenities={data?.data?.amenities} /> */}

      <ApartmentActivities />

      <ApartmentLocation {...data.data} />

      <SimilarApartments />
    </div>
  )
}
