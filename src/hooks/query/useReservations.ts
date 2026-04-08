import { reservationService } from "@/lib/services/reservations.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { AxiosError } from "axios";

export const useCreateReservations = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  return useMutation({
    mutationFn: async (reservationData: object) =>
      reservationService.create(reservationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      message.success("Gửi thành công!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const statusCode = error?.response?.status;
      const backendMessage = error?.response?.data?.message;

      let displayMessage = "Lỗi khi gửi yêu cầu";

      if (statusCode === 409) {
        displayMessage =
          "Khoảng thời gian bạn chọn hợp đồng bị trùng lặp hoặc đã thuê căn hộ này!";
      } else if (backendMessage) {
        displayMessage = backendMessage;
      }

      message.error(displayMessage);
      console.error("Error creating reservation:", error);
    },
  });
};
