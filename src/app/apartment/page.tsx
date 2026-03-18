"use client"

import ApartmentItem from '@/components/apartments/apartment-item'
import ApartmentItemSkeleton from '@/components/apartments/apartment-item-skeleton'
import Filter from '@/components/apartments/filter'
import SimilarApartments from '@/components/apartments/similar-apartments'
import AppPromoSection from '@/components/sections/app-promo'
import { APARTMENT_SORT_OPTIONS, DEFAULT_APARTMENT_FILTERS } from '@/constants/apartment'
import { ROUTES } from '@/constants/routes'
import { useAddressTypePreference } from '@/hooks/useAddressTypePreference'
import { useApartments } from '@/hooks/query/useApartments'
import { ApartmentQueryParams } from '@/types/apartment'
import { Icon } from '@iconify/react'
import { Breadcrumb, Button, Drawer, Pagination, Select } from 'antd'
import { useTranslations } from 'next-intl'
import { useCallback, useMemo, useState } from 'react'

type ApartmentFilterPatch = Partial<Omit<ApartmentQueryParams, 'addressType'>>

export default function ApartmentList() {
  const { addressType } = useAddressTypePreference()
  const [filters, setFilters] = useState<ApartmentQueryParams>(DEFAULT_APARTMENT_FILTERS)
  const [filterOpen, setFilterOpen] = useState(false)
  const queryFilters = useMemo<ApartmentQueryParams>(
    () => ({ ...filters, addressType }),
    [filters, addressType],
  )
  const { data, isLoading, isError, refetch } = useApartments(queryFilters)
  const t = useTranslations('ApartmentListPage')

  const apartments = data?.data ?? []
  const meta = data?.meta

  const updateFilters = useCallback((patch: ApartmentFilterPatch | null) => {
    if (!patch) {
      setFilters(DEFAULT_APARTMENT_FILTERS)
      return
    }

    setFilters(prev => ({ ...prev, ...patch, page: 1 }))
  }, [])

  function handleSortChange(val: string) {
    const [sortBy, sortOrder] = val.split('-') as [ApartmentQueryParams['sortBy'], ApartmentQueryParams['sortOrder']]
    setFilters(prev => ({ ...prev, sortBy, sortOrder }))
  }

  function handlePageChange(page: number, pageSize: number) {
    setFilters(prev => ({ ...prev, page, limit: pageSize }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const sortOptions = APARTMENT_SORT_OPTIONS.map(opt => ({
    label: t(`sort.${opt.key}`),
    value: opt.value,
  }))

  return (
    <div className='container'>
      <Breadcrumb
        className='py-4'
        items={[
          { title: 'Trang chủ', href: ROUTES.HOME },
          { title: 'Danh sách căn hộ' }
        ]}
      />

      {/* Mobile Filter Button */}
      <div className='lg:hidden mb-4'>
        <Button icon={<Icon icon="lucide:filter" width={18} />} onClick={() => setFilterOpen(true)}>
          Bộ lọc
        </Button>
      </div>

      <Drawer title='Bộ lọc' placement="left" open={filterOpen} onClose={() => setFilterOpen(false)}>
        <Filter onFilterChange={updateFilters} />
      </Drawer>

      <div className='grid grid-cols-1 lg:grid-cols-5 gap-6 mt-5'>

        {/* Sidebar Filter (desktop) */}
        <div className='hidden lg:block'>
          <div className='sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto pr-2'>
            <Filter onFilterChange={updateFilters} />
          </div>
        </div>

        {/* Main Content */}
        <div className='lg:col-span-4 lg:pl-7'>

          {/* Sort & Count Bar */}
          {!isLoading && !isError && meta && (
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6'>
              <span className='text-sm text-gray-600'>
                {t('showing')} {apartments.length} / {meta.total} {t('apartments')}
              </span>
              <Select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={handleSortChange}
                style={{ width: 200 }}
                options={sortOptions}
              />
            </div>
          )}

          {/* Loading */}
          {isLoading && <ApartmentItemSkeleton />}

          {/* Error */}
          {isError && (
            <div className='text-center py-20'>
              <Icon icon="lucide:wifi-off" className="text-red-500 mx-auto mb-4" width={40} />
              <h3 className='text-xl font-semibold mb-2'>Lỗi kết nối</h3>
              <p className='text-gray-500 mb-6'>Không thể tải dữ liệu, vui lòng thử lại.</p>
              <Button type="primary" onClick={() => refetch()}>Thử lại</Button>
            </div>
          )}

          {/* Apartment List */}
          {!isLoading && !isError && apartments.length > 0 && (
            <div className='space-y-6'>
              {apartments.map(apt => <ApartmentItem key={apt.id} apartment={apt} addressType={addressType} />)}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && apartments.length === 0 && (
            <div className='text-center py-20'>
              <Icon icon="lucide:search-x" className="text-gray-400 mx-auto mb-4" width={64} />
              <h3 className='text-xl font-semibold mb-2'>Không tìm thấy căn hộ</h3>
              <p className='text-gray-500 mb-6'>Thử thay đổi bộ lọc tìm kiếm.</p>
              <Button
                onClick={() => setFilters(DEFAULT_APARTMENT_FILTERS)}
              >
                Xóa bộ lọc
              </Button>
            </div>
          )}

          {/* Pagination */}
          {(meta?.totalPages ?? 0) > 1 && (
            <Pagination
              className='flex justify-center mt-8'
              current={meta?.page ?? 1}
              total={meta?.total ?? 0}
              pageSize={meta?.limit ?? 10}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={['10', '20', '30', '50']}
              showTotal={(total, range) => `${range[0]}-${range[1]} / ${total}`}
            />
          )}

        </div>
      </div>

      <SimilarApartments />
      <AppPromoSection />
    </div>
  )
}
