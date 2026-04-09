import { paths } from "@/types/api"
import { apiClient } from "../apis/client"
import { endpoints } from "../apis/endpoints"

export type NotificationsResponse = paths['/api/v1/notifications/my']['get']['responses']['200']['content']['application/json']
export type NotificationItem = NonNullable<NotificationsResponse['data']>[number]
export type MarkNotificationAsReadParams = paths['/api/v1/notifications/{id}/read']['patch']['parameters']['path']

type NotificationsApiEnvelope = {
     data?: unknown
}

const toNotificationList = (payload: unknown): NotificationItem[] => {
     if (Array.isArray(payload)) {
          return payload as NotificationItem[]
     }

     if (payload && typeof payload === 'object') {
          const notifications = (payload as { notifications?: unknown }).notifications
          if (Array.isArray(notifications)) {
               return notifications as NotificationItem[]
          }
     }

     return []
}

const toUnreadCount = (payload: unknown): number => {
     if (typeof payload === 'number') {
          return payload
     }

     if (payload && typeof payload === 'object') {
          const dataField = (payload as { data?: unknown }).data
          if (typeof dataField === 'number') {
               return dataField
          }

          const unreadCount = (payload as { unreadCount?: unknown }).unreadCount
          if (typeof unreadCount === 'number') {
               return unreadCount
          }

          if (dataField && typeof dataField === 'object') {
               const nestedUnreadCount = (dataField as { unreadCount?: unknown }).unreadCount
               if (typeof nestedUnreadCount === 'number') {
                    return nestedUnreadCount
               }
          }
     }

     return 0
}

export const notificationService = {
     getAll: async (): Promise<NotificationItem[]> => {
          const { data } = await apiClient.get<NotificationsResponse | NotificationsApiEnvelope>(
               `${endpoints.notifications}/my`,
          )
          return toNotificationList(data?.data)
     },
     getUnreadCount: async (): Promise<number> => {
          const { data } = await apiClient.get<unknown>(`${endpoints.notifications}/unread-count`)
          return toUnreadCount(data)
     },
     markAsRead: async ({ id }: MarkNotificationAsReadParams): Promise<void> => {
          await apiClient.patch(`${endpoints.notifications}/${id}/read`)
     },
     markAllAsRead: async (): Promise<void> => {
          await apiClient.patch(`${endpoints.notifications}/read-all`)
     },
}