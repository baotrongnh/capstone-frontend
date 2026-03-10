import { apiClient } from "../apis/client";
import { endpoints } from "../apis/endpoints";

export const viewRequestService = {
  create: async (viewRequestData: object) => {
    const { data } = await apiClient.post(
      endpoints.viewRequest,
      viewRequestData,
    );
    return data;
  },
  get: async () => {
    const { data } = await apiClient.get(
      `${endpoints.viewRequest}/my-assigned`,
    );
    return data;
  },
};
