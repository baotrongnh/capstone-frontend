import { components, paths } from "@/types/api";
import { apiClient } from "../apis/client";
import { endpoints } from "../apis/endpoints";

export type GetContractsResponse =
  paths["/api/v1/contracts"]["get"]["responses"]["200"]["content"]["application/json"];

export type ContractWithMembers =
  components["schemas"]["ContractListItemDto"] & {
    members: components["schemas"]["ContractMemberDto"][];
    hasPdf?: boolean;
    pdfUrl?: string;
  };

export const contractsService = {
  get: async (): Promise<GetContractsResponse> => {
    const { data } = await apiClient.get<GetContractsResponse>(
      endpoints.contracts,
    );
    return data;
  },
  create: async (id: string, contractData: Object) => {
    const { data } = await apiClient.post(
      `${endpoints.contracts}/${id}/upload`,
      contractData,
    );
    return data;
  },
};
