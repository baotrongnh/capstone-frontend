'use client'

import { getMyUserApartments, updateMyHousePassword } from '@/lib/services/userApartment.service'
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

export const useUpdateMyHousePassword = () => {
    const { message } = App.useApp()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateMyHousePassword,
        onSuccess: (res) => {
            message.success(res?.message || 'House password updated successfully')
            queryClient.invalidateQueries({ queryKey: ['user-apartments', 'my'] })
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
