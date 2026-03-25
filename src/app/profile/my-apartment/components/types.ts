import type { OwnerApartmentResponse } from '@/types/apartment'

export type OwnerApartmentItem = NonNullable<OwnerApartmentResponse['data']>[number]

export type OwnerApartmentExtra = OwnerApartmentItem & {
    maxConcurrentViewings?: number | null
    latitude?: string | null
    longitude?: string | null
    usableArea?: string | number | null
    yearBuilt?: string | number | null
    ownerId?: string | null
    approvedByOperatorId?: string | null
    approvedAt?: string | null
    videoTourUrl?: string | null
    amenities?: unknown[] | null
    rooms?: unknown[] | null
    iotDevices?: unknown[] | null
    utilityMeters?: unknown[] | null
    owner?: {
        fullName?: string | null
        companyName?: string | null
    } | null
}
