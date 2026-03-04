import { apiClient } from "../apis/client";
import { endpoints } from "../apis/endpoints";

export const contractsService = {
  get: async () => {
    const { data } = await apiClient.get(endpoints.contracts);
    return data;
  },
};
