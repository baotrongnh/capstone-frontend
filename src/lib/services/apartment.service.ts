import { ApartmentDetail } from "@/types/apartment";
import { apiClient } from "../apis/client";
import { endpoints } from "../apis/endpoints";

export const apartmentService = {
     getList: async (params?: string) => {
          const { data } = await apiClient.get(endpoints.apartments, { params })
          return data
     },

     getById: async (id: string | number): Promise<ApartmentDetail> => {
          const { data } = await apiClient.get(`${endpoints.apartments}/${id}`)
          return data
     },

     create: async (apartmentData: string) => {
          const { data } = await apiClient.post(endpoints.apartments, apartmentData)
          return data
     },

     update: async (id: string | number, apartmentData: string) => {
          const { data } = await apiClient.put(`${endpoints.apartments}/${id}`, apartmentData)
          return data
     },

     delete: async (id: string | number) => {
          const { data } = await apiClient.delete(`${endpoints.apartments}/${id}`)
          return data
     }
}