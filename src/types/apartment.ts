// Enums
export enum FurnishingStatus {
     FULLY_FURNISHED = 'fully_furnished',
     SEMI_FURNISHED = 'semi_furnished',
     UNFURNISHED = 'unfurnished'
}

export enum ApartmentStatus {
     AVAILABLE = 'available',
     RENTED = 'rented',
     MAINTENANCE = 'maintenance',
     UNAVAILABLE = 'unavailable'
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

// Interface cho danh sách apartment (list view)
export interface Apartment {
     id: string
     buildingName: string
     apartmentNumber: string
     floorNumber: number
     address: string
     city: string
     district: string
     totalArea: string
     numberOfBedrooms: number
     numberOfBathrooms: number
     furnishingStatus: FurnishingStatus
     baseRentPrice: string
     depositAmount: string
     status: ApartmentStatus
     images: string[] | null
     createdAt: string
}

// Nested interfaces cho apartment detail
export interface Room {
     id: string
     roomNumber: string
     roomType: RoomType
     area: string
     status: RoomStatus
}

export interface Partner {
     id: string
     companyName: string
     fullName: string
}

export interface IotDevice {
     id: string
     deviceName: string
     deviceType: DeviceType
     status: DeviceStatus
}

export interface UtilityMeter {
     id: string
     meterType: string
     meterNumber: string
     status: string
}

// Interface cho apartment detail (chi tiết)
export interface ApartmentDetail {
     id: string
     buildingName: string
     apartmentNumber: string
     apartmentType: string
     maxConcurrentViewings: number
     floorNumber: number
     address: string
     city: string
     district: string
     ward: string
     latitude: string
     longitude: string
     totalArea: string
     usableArea: string | null
     numberOfBedrooms: number
     numberOfBathrooms: number
     furnishingStatus: FurnishingStatus
     amenities: string[]
     baseRentPrice: string
     depositAmount: string
     status: ApartmentStatus
     description: string
     images: string[] | null
     videoTourUrl: string | null
     yearBuilt: number | null
     partnerId: string
     approvedByOperatorId: string
     approvedAt: string
     createdAt: string
     updatedAt: string
     rooms: Room[]
     partner: Partner
     iotDevices: IotDevice[]
     utilityMeters: UtilityMeter[]
}