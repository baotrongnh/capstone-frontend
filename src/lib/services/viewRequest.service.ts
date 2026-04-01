
import type {
  CreateViewingRequestBody,
  CreateViewingRequestRes,
  ListMyViewingRequestsQuery,
  ListMyViewingRequestsRes,
} from '@/types/viewRequest'
import { apiClient } from '../apis/client'
import { endpoints } from '../apis/endpoints'

export const viewRequestService = {
  create: async (viewRequestData: CreateViewingRequestBody): Promise<CreateViewingRequestRes> => {
    const { data } = await apiClient.post(
      `${endpoints.viewRequest}/user/book`,
      viewRequestData,
    )
    return data
  },
  get: async () => {
    const { data } = await apiClient.get(
      `${endpoints.viewRequest}/my-assigned`,
    )
    return data
  },
  getMyViewingRequests: async (params?: ListMyViewingRequestsQuery): Promise<ListMyViewingRequestsRes> => {
    const { data } = await apiClient.get(`${endpoints.viewRequest}/my`, {
      params,
    })
    return data
  },
}
