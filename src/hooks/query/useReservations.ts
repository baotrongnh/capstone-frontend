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
        if (backendMessage?.includes("already exists")) {
          displayMessage =
            "Khoảng thời gian bạn chọn hợp đồng bị trùng lặp. Vui lòng chọn thời gian khác.";
        } else {
          displayMessage = backendMessage || displayMessage;
        }
      } else if (backendMessage) {
        displayMessage = backendMessage;
      }

      message.error(displayMessage);
      console.error("Error creating reservation:", error);
    },
  });
};
