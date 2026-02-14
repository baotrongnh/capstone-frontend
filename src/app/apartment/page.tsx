'use client'

import ApartmentItem from '@/components/apartments/apartment-item'
import Filter from '@/components/apartments/filter'
import SimilarApartments from '@/components/apartments/similar-apartments'
import AppPromoSection from '@/components/sections/app-promo'
import { useApartments } from '@/hooks/query/useApartments'
import { Icon } from '@iconify/react'
import { Button, Drawer, Pagination } from 'antd'
import { useState } from 'react'

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
  const [currentPage, setCurrentPage] = useState(1)
  const [filterOpen, setFilterOpen] = useState(false)

  const { data } = useApartments()

  console.log(data);

  return (
    <div className='container'>
      {/* Mobile Filter Button */}
      <div className='lg:hidden mb-4'>
        <Button
          icon={<Icon icon="lucide:filter" width={18} />}
          onClick={() => setFilterOpen(true)}
          className='flex items-center gap-2'
        >
          Bộ lọc
        </Button>
      </div>

      {/* Mobile Filter Drawer */}
      <Drawer
        title="Bộ lọc"
        placement="left"
        onClose={() => setFilterOpen(false)}
        open={filterOpen}
        className='lg:hidden'
      >
        <Filter />
      </Drawer>

      <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
        {/* Desktop Filter */}
        <div className='hidden lg:block'>
          <Filter />
        </div>
        <div className='lg:col-span-4 lg:pl-7 space-y-6'>
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
              responsive
            />
          </div>
        </div>
      </div>

      <SimilarApartments />
      <AppPromoSection />
    </div>
  )
}
