'use client'

import ApartmentActivities from '@/components/apartment-detail/apartment-activities'
import ApartmentAmenities from '@/components/apartment-detail/apartment-amenities'
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
  const { data: apartment, isLoading, isError } = useApartment(id)

  if (isLoading) {
    return (
      <div className='container h-screen flex items-center justify-center'>
        <Spin size="large" tip="Đang tải thông tin căn hộ..." />
      </div>
    )
  }

  if (isError || !apartment) {
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
  const images = apartment.images && apartment.images.length > 0
    ? apartment.images
    : ['/img/auth/phongtro.jpg', '/img/auth/phongtro.jpg', '/img/auth/phongtro.jpg']

  return (
    <div className='container h-min-screen px-4 sm:px-6 lg:px-8'>
      <Breadcrumb
        className='py-4'
        items={[
          { title: 'Trang chủ', href: ROUTES.HOME },
          { title: 'Danh sách căn hộ', href: ROUTES.APARTMENT },
          { title: apartment.buildingName }
        ]}
      />

      <ApartmentGallery images={images} />

      <ApartmentHeader apartmentData={apartment} />

      <ApartmentDescription description={apartment.description || 'Chưa có mô tả.'} />

      <ApartmentAmenities amenities={apartment.amenities} />

      <ApartmentActivities />

      <ApartmentLocation
        address={apartment.address}
        city={apartment.city}
        district={apartment.district}
        ward={apartment.ward}
        latitude={apartment.latitude}
        longitude={apartment.longitude}
      />

      <SimilarApartments />
    </div>
  )
}
