'use client'

import { DEBOUNCE_DELAY, FILTER_AREA_RANGE, FILTER_PRICE_RANGE } from '@/constants/apartment'
import { useProvinces, useWards } from '@/hooks/query/useAddress'
import { ApartmentSearchQueryParams, FurnishingType } from '@/lib/services/apartment.service'
import { formatArea, formatPrice } from '@/utils/format'
import { normalizeVietnamese } from '@/utils/text'
import { Checkbox, Divider, Input, InputNumber, Select, Slider } from 'antd'
import { Search, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

const FURNISHING_TRANSLATION_KEY: Record<FurnishingType, string> = {
     unfurnished: 'furnishingOptions.unfurnished',
     semi_furnished: 'furnishingOptions.semi_furnished',
     fully_furnished: 'furnishingOptions.fully_furnished',
}

export default function Filter({ onFilterChange }:
     { onFilterChange: (filters: ApartmentSearchQueryParams | null) => void }) {
     const t = useTranslations('ApartmentFilter')
     const [keyword, setKeyword] = useState('')

     // Location
     const [provinceCode, setProvinceCode] = useState<number>()
     const [wardCode, setWardCode] = useState<number>()

     // Other filters
     const [price, setPrice] = useState([FILTER_PRICE_RANGE.MIN, FILTER_PRICE_RANGE.MAX])
     const [area, setArea] = useState([FILTER_AREA_RANGE.MIN, FILTER_AREA_RANGE.MAX])
     const [bedrooms, setBedrooms] = useState<number | null>(null)
     const [furnishing, setFurnishing] = useState<FurnishingType>()

     const { data: provinces, isLoading: loadingProvinces } = useProvinces()
     const {
          data: wards,
          isLoading: loadingWards,
          isFetching: fetchingWards,
     } = useWards(provinceCode)

     const isWardSelectLoading = loadingWards || fetchingWards

     const provinceOptions = provinces?.map(p => ({ label: p.name, value: p.code })) ?? []
     const wardOptions = wards?.map(d => ({ label: d.name, value: d.code })) ?? []

     const filterByLabel = (input: string, option?: { label?: string | number }) =>
          normalizeVietnamese(String(option?.label || '')).includes(normalizeVietnamese(input))

     const clearLocationFilter = () => {
          setWardCode(undefined)
          onFilterChange({ wardCode: undefined })
     }

     useEffect(() => {
          const timer = setTimeout(() => {
               onFilterChange({ keyword: keyword || undefined })
          }, DEBOUNCE_DELAY)
          return () => clearTimeout(timer)
     }, [keyword, onFilterChange])

     const resetAll = () => {
          setKeyword('')
          setProvinceCode(undefined)
          setWardCode(undefined)
          setPrice([FILTER_PRICE_RANGE.MIN, FILTER_PRICE_RANGE.MAX])
          setArea([FILTER_AREA_RANGE.MIN, FILTER_AREA_RANGE.MAX])
          setBedrooms(null)
          setFurnishing(undefined)
          onFilterChange(null)
     }

     const handleProvinceChange = (code?: number) => {
          setProvinceCode(code)
          clearLocationFilter()
          onFilterChange({ provinceCode: code })
     }

     const handleWardChange = (value?: number) => {
          setWardCode(value)
          onFilterChange({ wardCode: value })
     }

     const handleBedroomsChange = (value: number | null) => {
          setBedrooms(value)
          onFilterChange({ minBedrooms: value ?? undefined, maxBedrooms: value ?? undefined })
     }

     const handleFurnishingChange = (value: FurnishingType, checked: boolean) => {
          const next = checked ? value : undefined
          setFurnishing(next)
          onFilterChange({ furnishingStatus: next })
     }

     return (
          <div className="space-y-5 p-2 h-screen sticky">
               {/* Header */}
               <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">{t('title')}</h3>
                    <button
                         onClick={resetAll}
                         className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1"
                    >
                         <X size={12} /> {t('clearFilter')}
                    </button>
               </div>

               {/* Keyword Search */}
               <Input
                    placeholder={t('searchPlaceholder')}
                    prefix={<Search size={14} className="text-gray-400" />}
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    allowClear
               />

               <Divider className="my-0!" />

               {/* Location */}
               <div>
                    <Label>{t('locationLabel')}</Label>

                    <Select
                         placeholder={t('cityPlaceholder')}
                         className="w-full"
                         value={provinceCode}
                         options={provinceOptions}
                         onChange={handleProvinceChange}
                         loading={loadingProvinces}
                         showSearch={{ filterOption: filterByLabel }}
                         style={{ marginTop: 15 }}
                         allowClear
                         onClear={() => handleProvinceChange(undefined)}
                    />

                    <Select
                         placeholder={t('wardPlaceholder')}
                         className="w-full"
                         value={wardCode}
                         options={wardOptions}
                         onChange={handleWardChange}
                         disabled={!provinceCode}
                         loading={isWardSelectLoading}
                         notFoundContent={isWardSelectLoading ? <span>Đang tải...</span> : undefined}
                         showSearch={{ filterOption: filterByLabel }}
                         allowClear
                         style={{ marginTop: 15 }}
                    />
               </div>

               <Divider className="my-0!" />

               {/* Price Range */}
               <div className='pt-5'>
                    <Label>
                         {t('priceLabel')}{' '}
                         <span className="font-normal text-gray-400">
                              ({formatPrice(price[0])} – {formatPrice(price[1])})
                         </span>
                    </Label>
                    <Slider
                         range
                         value={price}
                         min={FILTER_PRICE_RANGE.MIN}
                         max={FILTER_PRICE_RANGE.MAX}
                         step={FILTER_PRICE_RANGE.STEP}
                         onChange={v => setPrice(v as [number, number])}
                         onChangeComplete={v => onFilterChange({ minPrice: v[0], maxPrice: v[1] })}
                         tooltip={{ formatter: v => formatPrice(v!) }}
                    />
               </div>

               <Divider className="my-0!" />

               {/* Area Range */}
               <div className='pt-5'>
                    <Label>
                         {t('areaLabel')}{' '}
                         <span className="font-normal text-gray-400">
                              ({area[0]} – {area[1]} m²)
                         </span>
                    </Label>
                    <Slider
                         range
                         value={area}
                         min={FILTER_AREA_RANGE.MIN}
                         max={FILTER_AREA_RANGE.MAX}
                         step={FILTER_AREA_RANGE.STEP}
                         onChange={v => setArea(v as [number, number])}
                         onChangeComplete={v => onFilterChange({ minArea: v[0], maxArea: v[1] })}
                         tooltip={{ formatter: formatArea }}
                    />
               </div>

               <Divider className="my-0!" />

               {/* Bedrooms */}
               <div className='pt-5'>
                    <Label>{t('bedroomsLabel')}</Label>
                    <InputNumber
                         className="mt-1"
                         min={0}
                         max={20}
                         value={bedrooms}
                         onChange={handleBedroomsChange}
                         placeholder="Nhập số phòng ngủ"
                         controls
                         style={{ width: '100%' }}
                    />
               </div>

               <Divider className="my-0!" />

               {/* Furnishing Status */}
               <div className="space-y-2">
                    <Label>{t('furnishingLabel')}</Label>
                    {(Object.keys(FURNISHING_TRANSLATION_KEY) as FurnishingType[]).map(option => (
                         <Checkbox
                              key={option}
                              checked={furnishing === option}
                              onChange={e => handleFurnishingChange(option, e.target.checked)}
                         >
                              <span className="text-sm">{t(FURNISHING_TRANSLATION_KEY[option])}</span>
                         </Checkbox>
                    ))}
               </div>
          </div>
     )
}

function Label({ children }: { children: React.ReactNode }) {
     return <p className="text-sm font-semibold text-gray-700 mb-1">{children}</p>
}
