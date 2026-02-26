'use client'

import { CITIES, LOCATIONS } from '@/constants/locations'
import { ApartmentQueryParams } from '@/types/apartment'
import { Checkbox, Divider, Input, Select, Slider } from 'antd'
import { Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'

// Constants
const PRICE_RANGE = { MIN: 1_000_000, MAX: 50_000_000, STEP: 500_000 }
const AREA_RANGE = { MIN: 10, MAX: 200, STEP: 5 }
const BEDROOM_OPTIONS = [1, 2, 3, 4, 5]
const DEBOUNCE_DELAY = 400

const FURNISHING_OPTIONS = [
     { value: 'unfurnished' as const, label: 'Không nội thất' },
     { value: 'semi_furnished' as const, label: 'Nội thất cơ bản' },
     { value: 'fully_furnished' as const, label: 'Đầy đủ nội thất' },
]

type FurnishingType = typeof FURNISHING_OPTIONS[number]['value']

// Helper functions
const formatPrice = (price: number) => (price / 1_000_000).toFixed(1) + ' tr'
const formatArea = (area?: number) => area ? `${area} m²` : ''

interface FilterProps {
     onFilterChange: (filters: Partial<ApartmentQueryParams>) => void
}

export default function Filter({ onFilterChange }: FilterProps) {
     const [keyword, setKeyword] = useState('')
     const [city, setCity] = useState<string>()
     const [district, setDistrict] = useState<string>()
     const [price, setPrice] = useState<[number, number]>([PRICE_RANGE.MIN, PRICE_RANGE.MAX])
     const [area, setArea] = useState<[number, number]>([AREA_RANGE.MIN, AREA_RANGE.MAX])
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
          setPrice([PRICE_RANGE.MIN, PRICE_RANGE.MAX])
          setArea([AREA_RANGE.MIN, AREA_RANGE.MAX])
          setBedrooms([])
          setFurnishing(undefined)
          onFilterChange({})
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
                    <h3 className="font-bold text-lg">Bộ lọc</h3>
                    <button
                         onClick={resetAll}
                         className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1"
                    >
                         <X size={12} /> Xóa lọc
                    </button>
               </div>

               {/* Keyword Search */}
               <Input
                    placeholder="Tìm kiếm..."
                    prefix={<Search size={14} className="text-gray-400" />}
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    allowClear
               />

               <Divider className="my-0!" />

               {/* Location */}
               <div className="space-y-2">
                    <Label>Khu vực</Label>
                    <Select
                         placeholder="Thành phố"
                         className="w-full"
                         value={city}
                         options={CITIES.map(c => ({ label: c, value: c }))}
                         onChange={handleCityChange}
                         allowClear
                    />
                    <div className=''></div>
                    <Select
                         placeholder="Quận / Huyện"
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
                         Giá thuê{' '}
                         <span className="font-normal text-gray-400">
                              ({formatPrice(price[0])} – {formatPrice(price[1])})
                         </span>
                    </Label>
                    <Slider
                         range
                         value={price}
                         min={PRICE_RANGE.MIN}
                         max={PRICE_RANGE.MAX}
                         step={PRICE_RANGE.STEP}
                         onChange={v => setPrice(v as [number, number])}
                         onChangeComplete={handlePriceChange}
                         tooltip={{ formatter: v => formatPrice(v!) }}
                    />
               </div>

               <Divider className="my-0!" />

               {/* Area Range */}
               <div>
                    <Label>
                         Diện tích{' '}
                         <span className="font-normal text-gray-400">
                              ({area[0]} – {area[1]} m²)
                         </span>
                    </Label>
                    <Slider
                         range
                         value={area}
                         min={AREA_RANGE.MIN}
                         max={AREA_RANGE.MAX}
                         step={AREA_RANGE.STEP}
                         onChange={v => setArea(v as [number, number])}
                         onChangeComplete={handleAreaChange}
                         tooltip={{ formatter: formatArea }}
                    />
               </div>

               <Divider className="my-0!" />

               {/* Bedrooms */}
               <div>
                    <Label>Phòng ngủ</Label>
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
                    <Label>Nội thất</Label>
                    {FURNISHING_OPTIONS.map(option => (
                         <Checkbox
                              key={option.value}
                              checked={furnishing === option.value}
                              onChange={e => handleFurnishingChange(option.value, e.target.checked)}
                         >
                              <span className="text-sm">{option.label}</span>
                         </Checkbox>
                    ))}
               </div>
          </div>
     )
}

function Label({ children }: { children: React.ReactNode }) {
     return <p className="text-sm font-semibold text-gray-700 mb-1">{children}</p>
}
