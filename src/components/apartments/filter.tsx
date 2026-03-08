'use client'

import { BEDROOM_OPTIONS, DEBOUNCE_DELAY, FILTER_AREA_RANGE, FILTER_PRICE_RANGE, FURNISHING_OPTIONS } from '@/constants/apartment'
import { CITIES, LOCATIONS } from '@/constants/locations'
import { ApartmentQueryParams } from '@/types/apartment'
import { Checkbox, Divider, Input, Select, Slider } from 'antd'
import { Search, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

type FurnishingType = typeof FURNISHING_OPTIONS[number]['value']

// Helper functions
const formatPrice = (price: number) => (price / 1_000_000).toFixed(1) + ' tr'
const formatArea = (area?: number) => area ? `${area} m²` : ''

interface FilterProps {
     onFilterChange: (filters: Partial<ApartmentQueryParams> | null) => void
}

export default function Filter({ onFilterChange }: FilterProps) {
     const t = useTranslations('ApartmentFilter')
     const [keyword, setKeyword] = useState('')
     const [city, setCity] = useState<string>()
     const [district, setDistrict] = useState<string>()
     const [price, setPrice] = useState<[number, number]>([FILTER_PRICE_RANGE.MIN, FILTER_PRICE_RANGE.MAX])
     const [area, setArea] = useState<[number, number]>([FILTER_AREA_RANGE.MIN, FILTER_AREA_RANGE.MAX])
     const [bedrooms, setBedrooms] = useState<number[]>([])
     const [furnishing, setFurnishing] = useState<FurnishingType>()

     // Debounce keyword search
     useEffect(() => {
          const timer = setTimeout(() => {
               onFilterChange({ keyword: keyword || undefined })
          }, DEBOUNCE_DELAY)
          return () => clearTimeout(timer)
     }, [keyword, onFilterChange])

     // Get district options based on selected city
     const districtOptions = city
          ? LOCATIONS[city]?.map(d => ({ label: d, value: d })) || []
          : []

     const resetAll = () => {
          setKeyword('')
          setCity(undefined)
          setDistrict(undefined)
          setPrice([FILTER_PRICE_RANGE.MIN, FILTER_PRICE_RANGE.MAX])
          setArea([FILTER_AREA_RANGE.MIN, FILTER_AREA_RANGE.MAX])
          setBedrooms([])
          setFurnishing(undefined)
          onFilterChange(null)
     }

     const handleCityChange = (value?: string) => {
          setCity(value)
          setDistrict(undefined)
          onFilterChange({ city: value, district: undefined })
     }

     const handleDistrictChange = (value?: string) => {
          setDistrict(value)
          onFilterChange({ district: value })
     }

     const handlePriceChange = (values: number[]) => {
          onFilterChange({ minPrice: values[0], maxPrice: values[1] })
     }

     const handleAreaChange = (values: number[]) => {
          onFilterChange({ minArea: values[0], maxArea: values[1] })
     }

     const handleBedroomToggle = (num: number) => {
          const isSelected = bedrooms.includes(num)
          const updated = isSelected
               ? bedrooms.filter(b => b !== num)
               : [...bedrooms, num]

          setBedrooms(updated)

          if (updated.length > 0) {
               onFilterChange({
                    minBedrooms: Math.min(...updated),
                    maxBedrooms: Math.max(...updated),
               })
          } else {
               onFilterChange({ minBedrooms: undefined, maxBedrooms: undefined })
          }
     }

     const handleFurnishingChange = (value: FurnishingType, checked: boolean) => {
          const newValue = checked ? value : undefined
          setFurnishing(newValue)
          onFilterChange({ furnishingStatus: newValue })
     }

     return (
          <div className="space-y-5 p-2 h-screen overflow-scroll sticky">
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
               <div className="space-y-2">
                    <Label>{t('locationLabel')}</Label>
                    <Select
                         placeholder={t('cityPlaceholder')}
                         className="w-full"
                         value={city}
                         options={CITIES.map(c => ({ label: c, value: c }))}
                         onChange={handleCityChange}
                         allowClear
                    />
                    <div className=''></div>
                    <Select
                         placeholder={t('districtPlaceholder')}
                         className="w-full"
                         value={district}
                         options={districtOptions}
                         onChange={handleDistrictChange}
                         disabled={!city}
                         allowClear
                    />
               </div>

               <Divider className="my-0!" />

               {/* Price Range */}
               <div>
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
                         onChangeComplete={handlePriceChange}
                         tooltip={{ formatter: v => formatPrice(v!) }}
                    />
               </div>

               <Divider className="my-0!" />

               {/* Area Range */}
               <div>
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
                         onChangeComplete={handleAreaChange}
                         tooltip={{ formatter: formatArea }}
                    />
               </div>

               <Divider className="my-0!" />

               {/* Bedrooms */}
               <div>
                    <Label>{t('bedroomsLabel')}</Label>
                    <div className="flex gap-2 mt-2">
                         {BEDROOM_OPTIONS.map(num => {
                              const isSelected = bedrooms.includes(num)
                              return (
                                   <button
                                        key={num}
                                        onClick={() => handleBedroomToggle(num)}
                                        className={`
                                             flex-1 h-9 rounded-md border text-sm font-medium transition-all
                                             ${isSelected
                                                  ? 'bg-primary text-white border-primary'
                                                  : 'border-gray-200 hover:border-primary'
                                             }
                                        `}
                                   >
                                        {num}
                                   </button>
                              )
                         })}
                    </div>
               </div>

               <Divider className="my-0!" />

               {/* Furnishing Status */}
               <div className="space-y-2">
                    <Label>{t('furnishingLabel')}</Label>
                    {FURNISHING_OPTIONS.map(option => (
                         <Checkbox
                              key={option.value}
                              checked={furnishing === option.value}
                              onChange={e => handleFurnishingChange(option.value, e.target.checked)}
                         >
                              <span className="text-sm">{t(`furnishingOptions.${option.value}`)}</span>
                         </Checkbox>
                    ))}
               </div>
          </div>
     )
}

function Label({ children }: { children: React.ReactNode }) {
     return <p className="text-sm font-semibold text-gray-700 mb-1">{children}</p>
}
