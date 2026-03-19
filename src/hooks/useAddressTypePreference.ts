'use client'

import type { ApartmentQueryParams } from '@/types/apartment'
import { useEffect, useState } from 'react'

export type AddressTypePreference = Extract<NonNullable<ApartmentQueryParams['addressType']>, 'new' | 'old'>

const STORAGE_KEY = 'apartment-address-type'
const SYNC_EVENT = 'apartment-address-type-change'
const DEFAULT_ADDRESS_TYPE: AddressTypePreference = 'new'

const getAddressTypeFromStorage = (): AddressTypePreference => {
     const saved = window.localStorage.getItem(STORAGE_KEY)
     return saved === 'old' ? 'old' : DEFAULT_ADDRESS_TYPE
}

export function useAddressTypePreference() {
     // Keep first render stable between server and client to avoid hydration mismatch.
     const [addressType, setAddressTypeState] = useState<AddressTypePreference>(DEFAULT_ADDRESS_TYPE)

     useEffect(() => {
          const syncFromStorage = () => {
               setAddressTypeState(getAddressTypeFromStorage())
          }

          syncFromStorage()
          window.addEventListener('storage', syncFromStorage)
          window.addEventListener(SYNC_EVENT, syncFromStorage)

          return () => {
               window.removeEventListener('storage', syncFromStorage)
               window.removeEventListener(SYNC_EVENT, syncFromStorage)
          }
     }, [])

     const setAddressType = (next: AddressTypePreference) => {
          setAddressTypeState(next)
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
