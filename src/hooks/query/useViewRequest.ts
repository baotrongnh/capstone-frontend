import { viewRequestService } from "@/lib/services/viewRequest.service";
import type { ListMyViewingRequestsQuery } from "@/types/viewRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";

export const useCreateViewRequest = () => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: viewRequestService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["viewRequests"] });
      message.success("Yêu cầu xem nhà đã được gửi thành công!");
    },
    onError: (error) => {
      console.error("Error creating view request:", error);
      message.error("Có lỗi xảy ra khi gửi yêu cầu xem nhà.");
    },
  });
};

export const useGetViewRequests = () => {
  return useQuery({
    queryKey: ["viewRequests"],
    queryFn: viewRequestService.get,
  });
};

export const useMyViewingRequests = (params?: ListMyViewingRequestsQuery) => {
  return useQuery({
    queryKey: ["my-viewing-requests", params],
    queryFn: () => viewRequestService.getMyViewingRequests(params),
  });
};
