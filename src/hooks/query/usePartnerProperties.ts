'use client'

import { getPartnerPropertiesByOwner, getPartnerPropertyDetailById } from '@/lib/services/partnerProperties.service'
import { useQuery } from '@tanstack/react-query'

export const usePartnerProperties = (ownerId: string) => {
    return useQuery({
        queryKey: ['partner-properties', 'owner', ownerId],
        queryFn: () => getPartnerPropertiesByOwner(ownerId),
        enabled: Boolean(ownerId),
    })
}

export const usePartnerPropertyDetail = (id: string) => {
    return useQuery({
        queryKey: ['partner-properties', 'detail', id],
        queryFn: () => getPartnerPropertyDetailById(id),
        enabled: Boolean(id),
    })
}
