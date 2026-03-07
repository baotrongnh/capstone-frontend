"use client"

import ApartmentItem from '@/components/apartments/apartment-item'
import ApartmentItemSkeleton from '@/components/apartments/apartment-item-skeleton'
import Filter from '@/components/apartments/filter'
import SimilarApartments from '@/components/apartments/similar-apartments'
import AppPromoSection from '@/components/sections/app-promo'
import { APARTMENT_SORT_OPTIONS, DEFAULT_APARTMENT_FILTERS } from '@/constants/apartment'
import { ROUTES } from '@/constants/routes'
import { useApartments } from '@/hooks/query/useApartments'
import { ApartmentQueryParams } from '@/types/apartment'
import { Icon } from '@iconify/react'
import { Breadcrumb, Button, Drawer, Pagination, Select } from 'antd'
import { useCallback, useState } from 'react'

export default function ApartmentList() {
  const [filters, setFilters] = useState(DEFAULT_APARTMENT_FILTERS)
  const [filterOpen, setFilterOpen] = useState(false)
  const { data, isLoading, isError, refetch } = useApartments(filters)

  const updateFilters = useCallback((patch: Partial<ApartmentQueryParams>) => {
    setFilters((prev: ApartmentQueryParams) =>
      Object.keys(patch).length === 0 ? DEFAULT_APARTMENT_FILTERS : { ...prev, ...patch, page: 1 }
    )
  }, [])

  const apartments = data?.data ?? []
  const meta = data?.meta

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
        <Filter onFilterChange={updateFilters} />
      </Drawer>

      <div className='grid grid-cols-1 lg:grid-cols-5 gap-6 mt-5'>
        <div className='hidden lg:block'>
          <div className='sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto pr-2'>
            <Filter onFilterChange={updateFilters} />
          </div>
        </div>

        <div className='lg:col-span-4 lg:pl-7'>
          {!isLoading && !isError && meta && (
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6'>
              <span className='text-sm text-gray-600'>
                Hiển thị <strong>{apartments.length}</strong> / <strong>{meta.total}</strong> căn hộ
              </span>
              <Select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(val: string) => {
                  const [sortBy, sortOrder] = val.split('-')
                  updateFilters({ sortBy, sortOrder } as Partial<ApartmentQueryParams>)
                }}
                style={{ width: 200 }}
                options={APARTMENT_SORT_OPTIONS}
              />
            </div>
          )}

          {isLoading && <ApartmentItemSkeleton />}

          {isError && (
            <div className='text-center py-20'>
              <Icon icon="lucide:wifi-off" className="text-red-500 mx-auto mb-4" width={40} />
              <h3 className='text-xl font-semibold mb-2'>Không thể tải dữ liệu</h3>
              <p className='text-gray-500 mb-6'>Đã xảy ra lỗi. Vui lòng thử lại.</p>
              <Button type="primary" onClick={() => refetch()}>Thử lại</Button>
            </div>
          )}

          {!isLoading && !isError && (
            apartments.length > 0 ? (
              <div className='space-y-6'>
                {apartments.map(apt => <ApartmentItem key={apt.id} apartment={apt} />)}
              </div>
            ) : (
              <div className='text-center py-20'>
                <Icon icon="lucide:search-x" className="text-gray-400 mx-auto mb-4" width={64} />
                <h3 className='text-xl font-semibold mb-2'>Không tìm thấy căn hộ</h3>
                <p className='text-gray-500 mb-6'>Thử điều chỉnh bộ lọc.</p>
                <Button onClick={() => setFilters(DEFAULT_APARTMENT_FILTERS)}>Xóa bộ lọc</Button>
              </div>
            )
          )}

          {meta?.totalPages && meta?.totalPages > 1 && (
            <Pagination
              className='flex justify-center mt-8'
              current={meta.page}
              total={meta.total}
              pageSize={meta.limit}
              onChange={(page: number, pageSize: number) => {
                setFilters((prev: ApartmentQueryParams) => ({ ...prev, page, limit: pageSize }))
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              showSizeChanger
              pageSizeOptions={['10', '20', '30', '50']}
              showTotal={(total: number, range: [number, number]) => `${range[0]}-${range[1]} / ${total}`}
            />
          )}
        </div>
      </div>

      <SimilarApartments />
      <AppPromoSection />
    </div>
  )
}
