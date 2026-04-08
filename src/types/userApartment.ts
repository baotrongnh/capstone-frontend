import type { paths } from './api'
import type { ReactNode } from 'react'

export type ListMyUserApartmentsRes = paths['/api/v1/user-apartments/my']['get']['responses']['200']['content']['application/json']

export type GetUserApartmentByIdRes = paths['/api/v1/user-apartments/{id}']['get']['responses']['200']['content']['application/json']
export type UserApartmentDetailItem = NonNullable<GetUserApartmentByIdRes['data']>

type UpdateMyHousePasswordPayload = paths['/api/v1/user-apartments/{id}/house-password']['patch']['requestBody']['content']['application/json']
export type UpdateMyHousePasswordRes = paths['/api/v1/user-apartments/{id}/house-password']['patch']['responses']['200']['content']['application/json']

export type UpdateMyHousePasswordParams = {
    id: string
    payload: UpdateMyHousePasswordPayload
}

export type UserApartmentApiError = {
    message?: string | string[]
}

export type ApartmentImageSliderProps = {
    buildingName: string
    images: string[] | null
}

export type ApartmentVideoTourProps = {
    videoTourUrl: unknown
    title: string
    unavailableText: string
}

export type ChangeHousePasswordFormValues = {
    oldPassword: string
    newPassword: string
    confirmNewPassword: string
}

export type ChangeHousePasswordModalProps = {
    open: boolean
    isSubmitting: boolean
    currentPassword?: string
    onClose: () => void
    onSubmit: (newPassword: string) => void
}

export type MyApartmentDetailRow = {
    key: string
    label: string
    value: ReactNode
}

export type TranslationFn = ((key: string) => string) & {
    has?: (key: string) => boolean
}

export type QuickSummaryRow = {
    key: string
    label: string
    value: string
}

export type BuildMyApartmentQuickSummaryRowsParams = {
    t: TranslationFn
    apartment: UserApartmentDetailItem['apartment'] | undefined
    rawApartment: UserApartmentDetailItem | undefined
    totalArea: number
    depositAmount: number
    locale: string
}

export type MyApartmentHeroProps = {
    t: TranslationFn
    locale: string
    apartmentName: string
    displayAddress: string
    apartmentNumber: unknown
    floorNumber: unknown
    rentPrice: number
    apartmentImages: string[]
    quickSummaryRows: QuickSummaryRow[]
}

export type MyApartmentInformationTabsProps = {
    t: TranslationFn
    locale: string
    rawApartment: UserApartmentDetailItem
    apartment: UserApartmentDetailItem['apartment'] | undefined
    displayAddress: string
    totalArea: number
    depositAmount: number
    amenities: string[]
    hiddenDoorPassword: string
    showDoorPassword: boolean
    onToggleDoorPassword: () => void
    onOpenChangePasswordModal: () => void
}

export type ApartmentStatus = 'available' | 'occupied' | 'rented' | 'maintenance' | 'reserved' | 'unavailable' | 'inactive'
