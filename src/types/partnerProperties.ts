import type { paths } from './api'

export type GetPartnerPropertiesByOwnerRes =
    paths['/api/v1/apartments/owner/{ownerId}']['get']['responses']['200']['content']['application/json']

export type PartnerPropertyListItem = NonNullable<GetPartnerPropertiesByOwnerRes['data']>[number]

export type GetPartnerPropertyDetailRes =
    paths['/api/v1/apartments/{id}']['get']['responses']['200']['content']['application/json']

export type PartnerPropertyDetailItem = NonNullable<GetPartnerPropertyDetailRes['data']>

export type PartnerPropertyStatus =
    | 'available'
    | 'occupied'
    | 'rented'
    | 'maintenance'
    | 'reserved'
    | 'unavailable'
    | 'inactive'
    | 'verified'
    | 'pending'
