import type { paths } from "@/types/api"
import { apiClient } from "../apis/client"
import { endpoints } from "../apis/endpoints"

export type ApartmentListResponse = paths["/api/v1/apartments/search"]["get"]["responses"]["200"]["content"]["application/json"]
export type ApartmentDetailResponse = paths["/api/v1/apartments/{id}"]["get"]["responses"]["200"]["content"]["application/json"]
export type ApartmentSearchQueryParams = paths["/api/v1/apartments/search"]["get"]["parameters"]["query"]

export type ApartmentItem = NonNullable<ApartmentListResponse['data']>[number]
export type ApartmentQueryParams = NonNullable<ApartmentSearchQueryParams>
export type FurnishingType = NonNullable<ApartmentQueryParams['furnishingStatus']>

export type OwnerApartmentResponse = paths["/api/v1/apartments/owner/{ownerId}"]["get"]["responses"]["200"]["content"]["application/json"]

export type ApartmentRatingPayload = paths['/api/v1/apartments/{id}/rating']['post']['requestBody']['content']['application/json']
export type ApartmentRatingResponse = paths['/api/v1/apartments/{id}/rating']['post']['responses']['201']['content']['application/json']

export const apartmentService = {
  getList: async (
    params?: ApartmentSearchQueryParams,
  ): Promise<ApartmentListResponse> => {
    const { data } = await apiClient.get(`${endpoints.apartments}/search`, {
      params,
    })
    return data
  },

  getById: async (id: string | number): Promise<ApartmentDetailResponse> => {
    const { data } = await apiClient.get(`${endpoints.apartments}/${id}`)
    return data
  },

  create: async (apartmentData: string) => {
    const { data } = await apiClient.post(endpoints.apartments, apartmentData)
    return data
  },

  update: async (id: string | number, apartmentData: string) => {
    const { data } = await apiClient.put(
      `${endpoints.apartments}/${id}`,
      apartmentData,
    );
    return data
  },

  delete: async (id: string | number) => {
    const { data } = await apiClient.delete(`${endpoints.apartments}/${id}`)
    return data
  },

  owner: async (id: string | number): Promise<OwnerApartmentResponse> => {
    const { data } = await apiClient.get(`${endpoints.apartments}/owner/${id}`)
    return data.data
  },

  cooperation: async (body: object) => {
    const { data } = await apiClient.post(
      `${endpoints.apartments}/partner/cooperation`,
      body,
    )
    return data
  },

  rating: async (id: string, payload: ApartmentRatingPayload) => {
    const { data } = await apiClient.post(`${endpoints.apartments}/${id}/rating`, payload)
    return data.data
  }
}
