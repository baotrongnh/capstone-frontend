'use client'

import { DEBOUNCE_DELAY, FILTER_AREA_RANGE, FILTER_PRICE_RANGE } from '@/constants/apartment'
import { useAddressTypePreference } from '@/hooks/useAddressTypePreference'
import { useDistricts, useProvinces } from '@/hooks/query/useProvinces'
import { Province } from '@/lib/services/provinces.service'
import { ApartmentQueryParams, FurnishingType } from '@/types/apartment'
import { formatArea, formatPrice, normalizeText } from '@/utils/format'
import { Checkbox, Divider, Input, InputNumber, Select, Slider } from 'antd'
import { Search, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

type FurnishingStatusOption = NonNullable<ApartmentQueryParams['furnishingStatus']>
type ApartmentFilterPatch = Partial<Omit<ApartmentQueryParams, 'addressType'>>

const FURNISHING_TRANSLATION_KEY: Record<FurnishingStatusOption, string> = {
     unfurnished: 'furnishingOptions.unfurnished',
     semi_furnished: 'furnishingOptions.semi_furnished',
     fully_furnished: 'furnishingOptions.fully_furnished',
}

export default function Filter({ onFilterChange }:
     { onFilterChange: (filters: ApartmentFilterPatch | null) => void }) {
     const t = useTranslations('ApartmentFilter')
     const { isAfterMerge: afterMerge, setAfterMerge } = useAddressTypePreference()
     const [keyword, setKeyword] = useState('')

     // Location
     const [selectedProvince, setSelectedProvince] = useState<Province | null>(null)
     const [wardCode, setWardCode] = useState<number>()

     // Other filters
     const [price, setPrice] = useState([FILTER_PRICE_RANGE.MIN, FILTER_PRICE_RANGE.MAX])
     const [area, setArea] = useState([FILTER_AREA_RANGE.MIN, FILTER_AREA_RANGE.MAX])
     const [bedrooms, setBedrooms] = useState<number | null>(null)
     const [furnishing, setFurnishing] = useState<FurnishingType>()

     const { data: provinces, isLoading: loadingProvinces } = useProvinces(afterMerge)
     const { data: secondaryAddress, isLoading: loadingDistricts } = useDistricts(selectedProvince?.code, afterMerge)

     useEffect(() => {
          const timer = setTimeout(() => {
               onFilterChange({ keyword: keyword || undefined })
          }, DEBOUNCE_DELAY)
          return () => clearTimeout(timer)
     }, [keyword, onFilterChange])

     const resetAll = () => {
          setKeyword('')
          setSelectedProvince(null)
          setWardCode(undefined)
          setPrice([FILTER_PRICE_RANGE.MIN, FILTER_PRICE_RANGE.MAX])
          setArea([FILTER_AREA_RANGE.MIN, FILTER_AREA_RANGE.MAX])
          setBedrooms(null)
          setFurnishing(undefined)
          onFilterChange(null)
     }

     const handleProvinceChange = (code?: number) => {
          const province = (provinces?.find(p => p.code === code) ?? null)
          setSelectedProvince(province)
          setWardCode(undefined)
          onFilterChange({ wardCode: undefined })
     }

     const handleDistrictChange = (value?: number) => {
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

     const handleLocationAfterMerge = (checked: boolean) => {
          setAfterMerge(checked)
          setSelectedProvince(null)
          setWardCode(undefined)
          onFilterChange({ wardCode: undefined })
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

                    <Checkbox
                         checked={afterMerge}
                         onChange={e => handleLocationAfterMerge(e.target.checked)}
                    >
                         {t('afterMergeLabel')}
                    </Checkbox>

                    <Select
                         placeholder={t('cityPlaceholder')}
                         className="w-full"
                         value={selectedProvince?.code}
                         options={provinces?.map(p => ({ label: p.name, value: p.code }))}
                         onChange={handleProvinceChange}
                         loading={loadingProvinces}
                         showSearch={{
                              filterOption: (input, option) =>
                                   normalizeText((option?.label ?? '')
                                        .toLowerCase())
                                        .includes(input.toLowerCase())
                         }}
                         style={{ marginTop: 15 }}
                         allowClear
                         onClear={() => handleProvinceChange(undefined)}
                    />

                    <Select
                         placeholder={afterMerge ? t('wardPlaceholder') : t('districtPlaceholder')}
                         className="w-full"
                         value={wardCode}
                         options={secondaryAddress?.map(d => ({ label: d.name, value: d.code }))}
                         onChange={handleDistrictChange}
                         disabled={!selectedProvince}
                         loading={loadingDistricts}
                         showSearch={{
                              filterOption: (input, option) =>
                                   normalizeText((option?.label ?? '')
                                        .toLowerCase())
                                        .includes(input.toLowerCase())
                         }}
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
                    {(Object.keys(FURNISHING_TRANSLATION_KEY) as FurnishingStatusOption[]).map(option => (
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
