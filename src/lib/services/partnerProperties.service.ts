import type { GetPartnerPropertiesByOwnerRes, GetPartnerPropertyDetailRes } from '@/types/partnerProperties'
import { apiClient } from '../apis/client'
import { endpoints } from '../apis/endpoints'

export const getPartnerPropertiesByOwner = async (ownerId: string): Promise<GetPartnerPropertiesByOwnerRes> => {
    const res = await apiClient.get(`${endpoints.apartments}/owner/${ownerId}`)
    return res.data
}

export const getPartnerPropertyDetailById = async (id: string): Promise<GetPartnerPropertyDetailRes> => {
    const res = await apiClient.get(`${endpoints.apartments}/${id}`)
    return res.data
}
