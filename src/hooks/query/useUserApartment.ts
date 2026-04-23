'use client'

import { getIotBoards, getIotMeters, getMyUserApartments, getUserApartmentById, updateDoorPin } from '@/lib/services/userApartment.service'
import { UserApartmentApiError } from '@/types/userApartment'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { App } from 'antd'

export const useUserApartment = () => {
    return useQuery({
        queryKey: ['user-apartments', 'my'],
        queryFn: getMyUserApartments,
    })
}

export const useUserApartmentDetail = (id: string) => {
    return useQuery({
        queryKey: ['user-apartments', 'detail', id],
        queryFn: () => getUserApartmentById(id),
        enabled: Boolean(id),
    })
}

export const useIotBoardsByApartment = (apartmentId?: string) => {
    return useQuery({
        queryKey: ['iot-boards', 'by-apartment', apartmentId],
        queryFn: () => getIotBoards({ apartmentId }),
        enabled: Boolean(apartmentId),
    })
}

export const useIotMetersByApartment = (apartmentId?: string) => {
    return useQuery({
        queryKey: ['iot-meter', 'by-apartment', apartmentId],
        queryFn: () => getIotMeters({ apartmentId }),
        enabled: Boolean(apartmentId),
    })
}

export const useUpdateDoorPin = () => {
    const { message } = App.useApp()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateDoorPin,
        onSuccess: (res) => {
            const isSuccess = Boolean(res?.data?.success)
            const responseMessage = res?.data?.message || res?.message

            if (!isSuccess) {
                message.error(responseMessage || 'Unable to update house password')
                return
            }

            message.success(responseMessage || 'House password updated successfully')
            queryClient.invalidateQueries({ queryKey: ['user-apartments'] })
        },
        onError: (error: AxiosError<UserApartmentApiError>) => {
            const backendMessage = error.response?.data?.message
            const errorMessage = Array.isArray(backendMessage)
                ? backendMessage[0]
                : backendMessage

            message.error(errorMessage || 'Unable to update house password')
        },
    })
}

export const useUpdateMyHousePassword = useUpdateDoorPin
