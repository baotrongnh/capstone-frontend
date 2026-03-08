import { paths } from "@/types/api";
import { apiClient } from "../apis/client";
import { endpoints } from "../apis/endpoints";

export type GetContractsResponse =
  paths["/api/v1/contracts"]["get"]["responses"]["200"]["content"]["application/json"];

export const contractsService = {
  get: async (): Promise<GetContractsResponse> => {
    const { data } = await apiClient.get(endpoints.contracts);
    return data;
  },
};
