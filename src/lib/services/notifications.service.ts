import { paths } from "@/types/api"
import { apiClient } from "../apis/client"
import { endpoints } from "../apis/endpoints"

export type NotificationsResponse = paths['/api/v1/notifications/my']['get']['responses']['200']['content']['application/json']
export type NotificationItem = NonNullable<NotificationsResponse['data']>[number]
export type MarkNotificationAsReadParams = paths['/api/v1/notifications/{id}/read']['patch']['parameters']['path']

export const notificationService = {
     getAll: async (): Promise<NotificationItem[]> => {
          const { data } = await apiClient.get<NotificationsResponse>(`${endpoints.notifications}/my`)
          return data.data ?? []
     },
     markAsRead: async ({ id }: MarkNotificationAsReadParams): Promise<void> => {
          await apiClient.patch(`${endpoints.notifications}/${id}/read`)
     },
     markAllAsRead: async (): Promise<void> => {
          await apiClient.patch(`${endpoints.notifications}/read-all`)
     },
}