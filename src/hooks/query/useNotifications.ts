import { NotificationItem, notificationService } from "@/lib/services/notifications.service"
import { useQuery } from "@tanstack/react-query"

export const NOTIFICATIONS_QUERY_KEY = ['notifications'] as const

export const useNotifications = () => {
     return useQuery({
          queryKey: NOTIFICATIONS_QUERY_KEY,
          queryFn: () => notificationService.getAll(),
          select: (response): NotificationItem[] => response.data ?? []
     })
}

export const useNotification = useNotifications