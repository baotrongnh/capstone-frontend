'use client'

import { partnerService } from '@/lib/services/partner.service'
import { UpdatePartnerDto } from '@/types/partner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'

// QUERIES
export const usePartnerProfile = (enabled = true) => {
    return useQuery({
        queryKey: ['partner', 'profile'],
        queryFn: () => partnerService.getProfile(),
        enabled,
    })
}

export const usePartnerById = (id: string, enabled = true) => {
    return useQuery({
        queryKey: ['partner', id],
        queryFn: () => partnerService.getById(id),
        enabled: !!id && enabled,
    })
}

export const useUpdatePartnerProfile = () => {
    const { message } = App.useApp()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdatePartnerDto) => partnerService.updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['partner', 'profile'] })
            message.success('Profile updated successfully!')
        },
        onError: (error: Error) => {
            message.error(error?.message || 'Failed to update profile')
        },
    })
}
