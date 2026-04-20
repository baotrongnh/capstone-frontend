import type { paths } from './api'
import type { ReactNode } from 'react'

export type ListMyUserApartmentsRes = paths['/api/v1/user-apartments/my']['get']['responses']['200']['content']['application/json']

export type GetUserApartmentByIdRes = paths['/api/v1/user-apartments/{id}']['get']['responses']['200']['content']['application/json']
export type UserApartmentDetailItem = NonNullable<GetUserApartmentByIdRes['data']>

export type GetIotBoardsQuery = paths['/api/v1/iot/boards']['get']['parameters']['query']
export type GetIotBoardsRes = paths['/api/v1/iot/boards']['get']['responses']['200']['content']['application/json']
export type IotBoardListItem = NonNullable<NonNullable<GetIotBoardsRes['data']>[number]>
export type IotBoardDeviceItem = IotBoardListItem['devices'][number]

export type IotDeviceTopic = 'alarm' | 'light' | 'curtain' | 'door' | 'unknown'

export type ApartmentIotDeviceDisplayItem = {
    key: string
    boardId: string
    deviceId: number
    deviceName: string
    state: IotBoardDeviceItem['state']
    topic: IotBoardDeviceItem['topic']
    normalizedTopic: IotDeviceTopic
}

type UpdateDoorPinPayload = paths['/api/v1/iot/doors/{boardId}/{deviceId}/pin']['patch']['requestBody']['content']['application/json']
export type UpdateDoorPinRes = paths['/api/v1/iot/doors/{boardId}/{deviceId}/pin']['patch']['responses']['200']['content']['application/json']

export type DoorPinTarget = {
    boardId: string
    deviceId: number
}

export type UpdateDoorPinParams = {
    boardId: string
    deviceId: number
    payload: UpdateDoorPinPayload
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

export type ChangeHousePasswordSubmitPayload = {
    oldPin: string
    newPin: string
}

export type ChangeHousePasswordModalProps = {
    open: boolean
    isSubmitting: boolean
    onClose: () => void
    onSubmit: (payload: ChangeHousePasswordSubmitPayload) => void
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
    iotDevices: ApartmentIotDeviceDisplayItem[]
    isIotDevicesLoading: boolean
    onOpenChangePasswordModal: () => void
}

export type ApartmentStatus = 'available' | 'occupied' | 'rented' | 'maintenance' | 'reserved' | 'unavailable' | 'inactive'
