import { NotificationItem, notificationService } from "@/lib/services/notifications.service"
import { useQuery } from "@tanstack/react-query"

export const NOTIFICATIONS_QUERY_KEY = ['notifications'] as const

export const useNotifications = () => {
     return useQuery<NotificationItem[]>({
          queryKey: NOTIFICATIONS_QUERY_KEY,
          queryFn: () => notificationService.getAll(),
     })
}

export const useNotification = useNotifications