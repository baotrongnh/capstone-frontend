import { apiClient } from "../apis/client";
import { endpoints } from "../apis/endpoints";

export const reservationService = {
  create: async (reservationData: object) => {
    const { data } = await apiClient.post(
      `${endpoints.reservations}`,
      reservationData,
    );
    return data;
  },
};
