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