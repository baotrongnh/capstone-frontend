import { ApartmentQueryParams } from "@/lib/services/apartment.service";

export const FILTER_PRICE_RANGE = {
  MIN: 1_000_000,
  MAX: 50_000_000,
  STEP: 500_000,
};
export const FILTER_AREA_RANGE = { MIN: 10, MAX: 200, STEP: 5 };
export const BEDROOM_OPTIONS = [1, 2, 3, 4, 5];
export const DEBOUNCE_DELAY = 400;
export const BOOKING_ADVANCE_DAYS_LIMIT = 15;

export const DEFAULT_APARTMENT_FILTERS: ApartmentQueryParams = {
  page: 1,
  limit: 10,
  sortBy: "createdAt",
  sortOrder: "desc",
  status: "available",
};

export const APARTMENT_SORT_OPTIONS = [
  { key: "priceAsc", value: "baseRentPrice-asc" },
  { key: "priceDesc", value: "baseRentPrice-desc" },
  { key: "areaAsc", value: "totalArea-asc" },
  { key: "areaDesc", value: "totalArea-desc" },
  { key: "newest", value: "createdAt-desc" },
  { key: "oldest", value: "createdAt-asc" },
  { key: "bedroomsAsc", value: "numberOfBedrooms-asc" },
  { key: "bedroomsDesc", value: "numberOfBedrooms-desc" },
];

export const APARTMENT_STATUS: Record<
  string,
  { label: string; color: string }
> = {
  available: { label: "Còn trống", color: "green" },
  occupied: { label: "Đã thuê", color: "red" },
  maintenance: { label: "Bảo trì", color: "orange" },
  reserved: { label: "Đã đặt cọc", color: "blue" },
  inactive: { label: "Không hoạt động", color: "default" },
};

export const ROOM_TYPE: Record<string, string> = {
  bedroom: "Phòng ngủ",
  living_room: "Phòng khách",
  kitchen: "Bếp",
  bathroom: "Phòng tắm",
  dining_room: "Phòng ăn",
  balcony: "Ban công",
  other: "Khác",
};
