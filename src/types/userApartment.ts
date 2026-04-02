import type { paths } from './api'
import type { ReactNode } from 'react'

export type ListMyUserApartmentsRes = paths['/api/v1/user-apartments/my']['get']['responses']['200']['content']['application/json']
export type ListMyUserApartmentsPayload = NonNullable<ListMyUserApartmentsRes['data']>
export type UserApartmentItem = ListMyUserApartmentsPayload[number]
export type UserApartmentData = NonNullable<UserApartmentItem['apartment']>

export type UpdateMyHousePasswordPathParams = paths['/api/v1/user-apartments/{id}/house-password']['patch']['parameters']['path']
export type UpdateMyHousePasswordPayload = paths['/api/v1/user-apartments/{id}/house-password']['patch']['requestBody']['content']['application/json']
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
