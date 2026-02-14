'use client'

import SimilarApartments from '@/components/apartments/similar-apartments'
import ApartmentActivities from '@/components/apartment-detail/apartment-activities'
import ApartmentAmenities from '@/components/apartment-detail/apartment-amenities'
import ApartmentDescription from '@/components/apartment-detail/apartment-description'
import ApartmentGallery from '@/components/apartment-detail/apartment-gallery'
import ApartmentHeader from '@/components/apartment-detail/apartment-header'
import ApartmentLocation from '@/components/apartment-detail/apartment-location'
import { Breadcrumb } from 'antd'
import React from 'react'

export default function ApartmentDetail() {
  // Temporary data - replace with actual API data
  const apartmentData = {
    title: 'Căn hộ Dhanmondi Central RD Grand Circle Inn Dhaka - 1100',
    location: 'Dhanmondi, Dhaka - 1100',
    rating: 5,
    totalReviews: 540,
    images: [
      '/img/auth/phongtro.jpg',
      '/img/auth/phongtro.jpg',
      '/img/auth/phongtro.jpg'
    ],
    description: `Khám phá những điểm nổi bật của London qua 2 phương tiện giao thông cổ điển trong chuyến phiêu lưu nửa ngày này. Đầu tiên, bạn sẽ được chiêm ngưỡng khung cảnh tuyệt đẹp của Tu viện Westminster, Tòa nhà Quốc hội và Vòng quay London Eye khi dạo quanh những con phố lịch sử trên một chiếc xe buýt hai tầng cổ điển.

Tiếp tục tham quan Nhà thờ St. Paul, kiệt tác kiến ​​trúc của Sir Christopher Wren, nơi an táng các Đô đốc Nelson và Wellington, và nơi Công chúa Diana và Hoàng tử Charles kết hôn. Tiếp tục đến Tháp London, được xây dựng cách đây gần 1000 năm dưới thời trị vì của William Kẻ chinh phục.

Là nơi cất giữ Vương miện Hoàng gia, Tháp London được bảo vệ bởi đội cận vệ Beefeaters nổi tiếng, và cung điện hùng vĩ này đã được sử dụng như một pháo đài và nhà tù trong suốt lịch sử của nó. Hướng dẫn viên sẽ đưa bạn đến Cổng Kẻ phản bội, nơi các tù nhân bước vào Tháp lần cuối cùng`
  }

  return (
    <div className='container h-min-screen'>
      <Breadcrumb
        items={[
          { title: 'Home' },
          { title: 'Apartment' }
        ]}
      />

      <ApartmentGallery images={apartmentData.images} />

      <ApartmentHeader
        title={apartmentData.title}
        location={apartmentData.location}
        rating={apartmentData.rating}
        totalReviews={apartmentData.totalReviews}
      />

      <ApartmentDescription description={apartmentData.description} />

      <ApartmentAmenities />

      <ApartmentActivities />

      <ApartmentLocation />

      <SimilarApartments />
    </div>
  )
}
