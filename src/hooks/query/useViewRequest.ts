import { viewRequestService } from "@/lib/services/viewRequest.service"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { message } from "antd"

export const useCreateViewRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: viewRequestService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["viewRequests"] })
      message.success("Tạo yêu cầu xem thành công!")
    },
    onError: (error) => {
      message.error(error?.message || "Có lỗi xảy ra!")
    },
  })
}

export const useGetViewRequests = () => {
  return useQuery({
    queryKey: ["viewRequests"],
    queryFn: viewRequestService.get,
  });
};
