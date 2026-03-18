import type { AddressTypePreference } from '@/hooks/useAddressTypePreference'

type AddressDto = {
     fullAddress?: string | null
     wardName?: string | null
     districtName?: string | null
     provinceName?: string | null
}

type ApartmentAddressSource = Record<string, unknown> & {
     displayAddress?: string | null
     newAddress?: AddressDto | null
     oldAddress?: AddressDto | null
     ward?: string | null
     district?: string | null
     city?: string | null
}

function clean(value?: string | null): string {
     return value?.trim() || ''
}

function fromDto(address?: AddressDto | null): string {
     if (!address) {
          return ''
     }

     const fullAddress = clean(address.fullAddress)
     if (fullAddress) {
          return fullAddress
     }

     return [address.wardName, address.districtName, address.provinceName]
          .map(clean)
          .filter(Boolean)
          .join(', ')
}

function legacyAddress(apartment?: ApartmentAddressSource | null): string {
     if (!apartment) {
          return ''
     }

     return [apartment.ward, apartment.district, apartment.city]
          .map(clean)
          .filter(Boolean)
          .join(', ')
}

export function getApartmentDisplayAddress(
     apartment: ApartmentAddressSource | null | undefined,
     addressType: AddressTypePreference,
): string {
     if (!apartment) {
          return ''
     }

     const preferred = addressType === 'new' ? apartment.newAddress : apartment.oldAddress
     const fallback = addressType === 'new' ? apartment.oldAddress : apartment.newAddress

     return (
          fromDto(preferred)
          || fromDto(fallback)
          || clean(apartment.displayAddress)
          || legacyAddress(apartment)
     )
}
