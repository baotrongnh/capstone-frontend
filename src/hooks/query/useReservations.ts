import { reservationService } from "@/lib/services/reservations.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";

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
  });
};
