import { notificationService } from "@/lib/services/notifications.service"
import { useQuery } from "@tanstack/react-query"

export const useNotification = () => {
     return useQuery({
          queryKey: ['notifications'],
          queryFn: () => notificationService.getAll()
     })
}