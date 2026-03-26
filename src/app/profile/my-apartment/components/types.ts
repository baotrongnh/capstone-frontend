import type { OwnerApartmentResponse } from '@/lib/services/apartment.service'

export type OwnerApartmentItem = NonNullable<OwnerApartmentResponse['data']>[number]
