import { NotificationItem, notificationService } from "@/lib/services/notifications.service"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const NOTIFICATIONS_QUERY_KEY = ['notifications'] as const
export const NOTIFICATIONS_UNREAD_COUNT_QUERY_KEY = ['notifications', 'unread-count'] as const

export const useNotifications = () => {
     return useQuery<NotificationItem[]>({
          queryKey: NOTIFICATIONS_QUERY_KEY,
          queryFn: () => notificationService.getAll(),
          refetchOnWindowFocus: true,
     })
}

export const useNotificationUnreadCount = () => {
     return useQuery<number>({
          queryKey: NOTIFICATIONS_UNREAD_COUNT_QUERY_KEY,
          queryFn: () => notificationService.getUnreadCount(),
          refetchOnWindowFocus: true,
     })
}

export const useMarkNotificationAsRead = () => {
     const queryClient = useQueryClient()

     return useMutation({
          mutationFn: (id: string) => notificationService.markAsRead({ id }),
          onSuccess: async () => {
               await Promise.all([
                    queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY }),
                    queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_UNREAD_COUNT_QUERY_KEY }),
               ])
          },
     })
}

export const useMarkAllNotificationsAsRead = () => {
     const queryClient = useQueryClient()

     return useMutation({
          mutationFn: () => notificationService.markAllAsRead(),
          onSuccess: async () => {
               await Promise.all([
                    queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY }),
                    queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_UNREAD_COUNT_QUERY_KEY }),
               ])
          },
     })
}

export const useNotification = useNotifications