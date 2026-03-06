import { apiClient } from "../apis/client";
import { endpoints } from "../apis/endpoints";
import type { GetContractsResponse } from "@/types/contracts"; // Import your nice type

export const contractsService = {
  // Change the return type from ContractListResponse to your GetContractsResponse
  get: async (): Promise<GetContractsResponse> => {
    const { data } = await apiClient.get(endpoints.contracts);
    return data;
  },
};
