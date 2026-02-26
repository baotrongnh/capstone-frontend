"use client";

import ApartmentItem from '@/components/apartments/apartment-item'
import ApartmentItemSkeleton from '@/components/apartments/apartment-item-skeleton'
import Filter from '@/components/apartments/filter'
import SimilarApartments from '@/components/apartments/similar-apartments'
import AppPromoSection from '@/components/sections/app-promo'
import { ROUTES } from '@/constants/routes'
import { useApartments } from '@/hooks/query/useApartments'
import { ApartmentQueryParams } from '@/types/apartment'
import { Icon } from '@iconify/react'
import { Breadcrumb, Button, Drawer, Pagination, Select } from 'antd'
import { useState } from 'react'

const DEFAULT_FILTERS: ApartmentQueryParams = {
  page: 1,
  limit: 10,
  status: 'available',
  sortBy: 'createdAt',
  sortOrder: 'desc'
}

const SORT_OPTIONS = [
  { label: 'Giá tăng dần', value: 'baseRentPrice-asc' },
  { label: 'Giá giảm dần', value: 'baseRentPrice-desc' },
  { label: 'Diện tích tăng dần', value: 'totalArea-asc' },
  { label: 'Diện tích giảm dần', value: 'totalArea-desc' },
  { label: 'Mới nhất', value: 'createdAt-desc' },
  { label: 'Cũ nhất', value: 'createdAt-asc' },
  { label: 'Số phòng tăng dần', value: 'numberOfBedrooms-asc' },
  { label: 'Số phòng giảm dần', value: 'numberOfBedrooms-desc' },
]

export default function ApartmentList() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [filterOpen, setFilterOpen] = useState(false)

  const { data, isLoading, isError, refetch } = useApartments(filters)

  const handleFilterChange = (newFilters: Partial<ApartmentQueryParams>) => {
    setFilters(Object.keys(newFilters).length === 0
      ? DEFAULT_FILTERS
      : { ...filters, ...newFilters, page: 1 }
    )
  }

  const handlePageChange = (page: number, pageSize: number) => {
    setFilters({ ...filters, page, limit: pageSize })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-')
    setFilters({
      ...filters,
      sortBy: sortBy as ApartmentQueryParams['sortBy'],
      sortOrder: sortOrder as ApartmentQueryParams['sortOrder']
    })
  }

  const hasData = (data?.data?.length || 0) > 0
  const showContent = !isLoading && !isError

  return (
    <div className='container'>
      <Breadcrumb
        className='py-4'
        items={[
          { title: 'Trang chủ', href: ROUTES.HOME },
          { title: 'Danh sách căn hộ' }
        ]}
      />

      {/* Mobile Filter */}
      <div className='lg:hidden mb-4'>
        <Button icon={<Icon icon="lucide:filter" width={18} />} onClick={() => setFilterOpen(true)}>
          Bộ lọc
        </Button>
      </div>

      <Drawer title="Bộ lọc" placement="left" open={filterOpen} onClose={() => setFilterOpen(false)}>
        <Filter onFilterChange={handleFilterChange} />
      </Drawer>

      <div className='grid grid-cols-1 lg:grid-cols-5 gap-6 mt-5'>
        {/* Desktop Filter */}
        <div className='hidden lg:block'>
          <div className='sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto pr-2'>
            <Filter onFilterChange={handleFilterChange} />
          </div>
        </div>

        <div className='lg:col-span-4 lg:pl-7'>
          {/* Header with Sort */}
          {showContent && data?.meta && (
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6'>
              <span className='text-sm text-gray-600'>
                Hiển thị <strong>{data.data.length}</strong> / <strong>{data.meta.total}</strong> căn hộ
              </span>
              <Select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={handleSortChange}
                style={{ width: 200 }}
                options={SORT_OPTIONS}
              />
            </div>
          )}

          {/* Loading */}
          {isLoading && <ApartmentItemSkeleton />}

          {/* Error */}
          {isError && (
            <div className='text-center py-20'>
              <div className='w-20 h-20 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center'>
                <Icon icon="lucide:wifi-off" className="text-red-500" width={40} />
              </div>
              <h3 className='text-xl font-semibold mb-2'>Không thể tải dữ liệu</h3>
              <p className='text-gray-500 mb-6'>Đã xảy ra lỗi. Vui lòng thử lại.</p>
              <Button type="primary" onClick={() => refetch()}>
                <Icon icon="lucide:refresh-cw" width={18} /> Thử lại
              </Button>
            </div>
          )}

          {/* Content */}
          {showContent && data && (
            <>
              {hasData ? (
                <div className='space-y-6'>
                  {data.data.map(apartment => (
                    <ApartmentItem key={apartment.id} apartment={apartment} />
                  ))}
                </div>
              ) : (
                <div className='text-center py-20'>
                  <Icon icon="lucide:search-x" className="text-gray-400 mx-auto mb-4" width={64} />
                  <h3 className='text-xl font-semibold mb-2'>Không tìm thấy căn hộ</h3>
                  <p className='text-gray-500 mb-6'>Thử điều chỉnh bộ lọc.</p>
                  <Button onClick={() => setFilters(DEFAULT_FILTERS)}>Xóa bộ lọc</Button>
                </div>
              )}

              {/* Pagination */}
              {data.meta && data.meta.totalPages > 1 && (
                <Pagination
                  className='flex justify-center mt-8'
                  current={data.meta.page}
                  total={data.meta.total}
                  pageSize={data.meta.limit}
                  onChange={handlePageChange}
                  showSizeChanger
                  pageSizeOptions={['10', '20', '30', '50']}
                  showTotal={(total, range) => `${range[0]}-${range[1]} / ${total}`}
                />
              )}
            </>
          )}
        </div>
      </div>

      <SimilarApartments />
      <AppPromoSection />
    </div>
  );
}
