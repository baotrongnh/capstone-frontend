'use client'

import { partnerService } from '@/lib/services/partner.service'
import { useQuery } from '@tanstack/react-query'

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
