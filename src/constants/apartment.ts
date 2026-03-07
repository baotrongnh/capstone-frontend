import type { ApartmentQueryParams } from '@/types/apartment'

export const FILTER_PRICE_RANGE = { MIN: 1_000_000, MAX: 50_000_000, STEP: 500_000 }
export const FILTER_AREA_RANGE = { MIN: 10, MAX: 200, STEP: 5 }
export const BEDROOM_OPTIONS = [1, 2, 3, 4, 5]
export const DEBOUNCE_DELAY = 400

export const FURNISHING_OPTIONS = [
     { value: 'unfurnished' as const, label: 'Không nội thất' },
     { value: 'semi_furnished' as const, label: 'Nội thất cơ bản' },
     { value: 'fully_furnished' as const, label: 'Đầy đủ nội thất' },
]

export const DEFAULT_APARTMENT_FILTERS: ApartmentQueryParams = {
     page: 1, limit: 10, status: 'available', sortBy: 'createdAt', sortOrder: 'desc'
}

export const APARTMENT_SORT_OPTIONS = [
     { key: 'priceAsc', value: 'baseRentPrice-asc' },
     { key: 'priceDesc', value: 'baseRentPrice-desc' },
     { key: 'areaAsc', value: 'totalArea-asc' },
     { key: 'areaDesc', value: 'totalArea-desc' },
     { key: 'newest', value: 'createdAt-desc' },
     { key: 'oldest', value: 'createdAt-asc' },
     { key: 'bedroomsAsc', value: 'numberOfBedrooms-asc' },
     { key: 'bedroomsDesc', value: 'numberOfBedrooms-desc' },
]

export const FURNISHING: Record<string, string> = {
     fully_furnished: 'Đầy đủ nội thất',
     semi_furnished: 'Nội thất cơ bản',
     unfurnished: 'Không nội thất',
}

export const APARTMENT_STATUS: Record<string, { label: string; color: string }> = {
     available: { label: 'Còn trống', color: 'green' },
     occupied: { label: 'Đã thuê', color: 'red' },
     maintenance: { label: 'Bảo trì', color: 'orange' },
     reserved: { label: 'Đã đặt cọc', color: 'blue' },
     inactive: { label: 'Không hoạt động', color: 'default' },
}

export const ROOM_TYPE: Record<string, string> = {
     bedroom: 'Phòng ngủ',
     living_room: 'Phòng khách',
     kitchen: 'Bếp',
     bathroom: 'Phòng tắm',
     dining_room: 'Phòng ăn',
     balcony: 'Ban công',
     other: 'Khác',
}

export function formatPrice(price: string | number | null | undefined) {
     if (!price) return 'Liên hệ'
     return Number(price).toLocaleString('vi-VN') + ' ₫'
}
