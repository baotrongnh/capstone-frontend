import { ApartmentListResponse } from "@/lib/services/apartment.service";

// Enums
export enum FurnishingStatus {
     FULLY_FURNISHED = 'fully_furnished',
     SEMI_FURNISHED = 'semi_furnished',
     UNFURNISHED = 'unfurnished'
}

export enum ApartmentStatus {
     AVAILABLE = 'available',
     OCCUPIED = 'occupied',
     MAINTENANCE = 'maintenance',
     RESERVED = 'reserved',
     INACTIVE = 'inactive'
}

export enum RoomType {
     BEDROOM = 'bedroom',
     LIVING_ROOM = 'living_room',
     KITCHEN = 'kitchen',
     BATHROOM = 'bathroom',
     DINING_ROOM = 'dining_room',
     BALCONY = 'balcony',
     OTHER = 'other'
}

export enum RoomStatus {
     AVAILABLE = 'available',
     OCCUPIED = 'occupied',
     MAINTENANCE = 'maintenance'
}

export enum DeviceType {
     LIGHT = 'light',
     CAMERA = 'camera',
     DOOR_LOCK = 'door_lock',
     THERMOSTAT = 'thermostat',
     SENSOR = 'sensor',
     OTHER = 'other'
}

export enum DeviceStatus {
     ACTIVE = 'active',
     INACTIVE = 'inactive',
     OFFLINE = 'offline'
}

export type ApartmentItem = NonNullable<ApartmentListResponse['data']>[number]
export type ApartmenList = ApartmentItem[]

export interface ApartmentQueryParams {
     page?: number
     limit?: number
     keyword?: string
     city?: string
     district?: string
     minBedrooms?: number
     maxBedrooms?: number
     minPrice?: number
     maxPrice?: number
     minArea?: number
     maxArea?: number
     furnishingStatus?: 'unfurnished' | 'semi_furnished' | 'fully_furnished'
     status?: 'available' | 'occupied' | 'maintenance' | 'reserved' | 'inactive'
     sortBy?: 'baseRentPrice' | 'totalArea' | 'createdAt' | 'numberOfBedrooms'
     sortOrder?: 'asc' | 'desc'
}
