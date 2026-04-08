import { NotificationItem, notificationService } from "@/lib/services/notifications.service"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const NOTIFICATIONS_QUERY_KEY = ['notifications'] as const

export const useNotifications = () => {
     return useQuery<NotificationItem[]>({
          queryKey: NOTIFICATIONS_QUERY_KEY,
          queryFn: () => notificationService.getAll(),
     })
}

export const useMarkNotificationAsRead = () => {
     const queryClient = useQueryClient()

     return useMutation({
          mutationFn: (id: string) => notificationService.markAsRead({ id }),
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
          },
     })
}

export const useMarkAllNotificationsAsRead = () => {
     const queryClient = useQueryClient()

     return useMutation({
          mutationFn: () => notificationService.markAllAsRead(),
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
          },
     })
}

export const useNotification = useNotifications