import { paths } from "@/types/api"
import { apiClient } from "../apis/client"
import { endpoints } from "../apis/endpoints"

type notificationResponse = paths['/api/v1/notifications/my']['get']['responses']['200']['content']['application/json']

export const notificationService = {
     getAll: async (): Promise<notificationResponse> => {
          const { data } = await apiClient.get(`${endpoints.notifications}/my`)
          return data.data
     }
}