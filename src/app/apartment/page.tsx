'use client'

import ApartmentItem from '@/components/apartments/apartment-item'
import Filter from '@/components/apartments/filter'
import SimilarApartments from '@/components/apartments/similar-apartments'
import AppPromoSection from '@/components/sections/app-promo'
import { Pagination } from 'antd'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

const apartment = [
  {
    name: 'Khách sạn Dhanmondi Central RD Grand Circle Inn Dhaka - 1100'
  },
  {
    name: 'Khách sạn Dhanmondi Central RD Grand Circle Inn Dhaka - 1100'
  },
  {
    name: 'Khách sạn Dhanmondi Central RD Grand Circle Inn Dhaka - 1100'
  },
  {
    name: 'Khách sạn Dhanmondi Central RD Grand Circle Inn Dhaka - 1100'
  },
  {
    name: 'Khách sạn Dhanmondi Central RD Grand Circle Inn Dhaka - 1100'
  },
]

export default function ApartmentList() {
  const t = useTranslations('ApartmentList')
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <>
      <div className='container grid grid-cols-5'>
        <Filter />
        <div className='col-span-4 pl-7 space-y-6'>
          {apartment?.map((item, index) => (
            <ApartmentItem
              key={index}
              apartment={item}
            />
          ))}

          {/* Pagination */}
          <div className='flex justify-center mt-8'>
            <Pagination
              current={currentPage}
              total={50}
              pageSize={10}
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>

      <SimilarApartments />
      <AppPromoSection />
    </>
  )
}
