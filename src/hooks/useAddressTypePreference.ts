'use client'

import type { ApartmentQueryParams } from '@/types/apartment'
import { useEffect, useState } from 'react'

export type AddressTypePreference = Extract<NonNullable<ApartmentQueryParams['addressType']>, 'new' | 'old'>

const STORAGE_KEY = 'apartment-address-type'
const SYNC_EVENT = 'apartment-address-type-change'
const DEFAULT_ADDRESS_TYPE: AddressTypePreference = 'old'

function getAddressTypeFromStorage(): AddressTypePreference {
     if (typeof window === 'undefined') {
          return DEFAULT_ADDRESS_TYPE
     }

     const saved = window.localStorage.getItem(STORAGE_KEY)
     return saved === 'new' ? 'new' : DEFAULT_ADDRESS_TYPE
}

export function useAddressTypePreference() {
     const [addressType, setAddressTypeState] = useState<AddressTypePreference>(getAddressTypeFromStorage)

     useEffect(() => {
          if (typeof window === 'undefined') {
               return
          }

          const syncFromStorage = () => {
               setAddressTypeState(getAddressTypeFromStorage())
          }

          window.addEventListener('storage', syncFromStorage)
          window.addEventListener(SYNC_EVENT, syncFromStorage)

          return () => {
               window.removeEventListener('storage', syncFromStorage)
               window.removeEventListener(SYNC_EVENT, syncFromStorage)
          }
     }, [])

     const setAddressType = (next: AddressTypePreference) => {
          setAddressTypeState(next)

          if (typeof window === 'undefined') {
               return
          }

          window.localStorage.setItem(STORAGE_KEY, next)
          window.dispatchEvent(new Event(SYNC_EVENT))
     }

     const setAfterMerge = (checked: boolean) => {
          setAddressType(checked ? 'new' : 'old')
     }

     return {
          addressType,
          isAfterMerge: addressType === 'new',
          setAddressType,
          setAfterMerge,
     }
}
