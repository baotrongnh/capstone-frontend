import { components, paths } from "@/types/api";
import { apiClient } from "../apis/client";
import { endpoints } from "../apis/endpoints";

export type GetContractsResponse =
  paths["/api/v1/contracts"]["get"]["responses"]["200"]["content"]["application/json"];

export interface Address {
  wardCode: number;
  wardName: string;
  districtCode: number | null;
  districtName: string | null;
  provinceCode: number;
  provinceName: string;
  fullAddress: string;
}

export type ContractWithMembers = Omit<
  components["schemas"]["ContractListItemDto"],
  "apartment"
> & {
  apartment: {
    id: string;
    apartmentNumber: string;
    address: string;
    city: string;
    newAddress: Address;
    streetAddress: string;
  };
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
  create: async (id: string, contractData: object) => {
    const { data } = await apiClient.post(
      `${endpoints.contracts}/${id}/upload`,
      contractData,
    );
    return data;
  },
  cancel: async (id: string, reason: string) => {
    const { data } = await apiClient.patch(
      `${endpoints.contracts}/${id}/cancel`,
      { reason },
    );
    return data;
  },
  cancelCooperation: async (id: string, reason: string) => {
    const { data } = await apiClient.patch(
      `${endpoints.contracts}/cooperation/${id}/cancel`,
      { reason },
    );
    return data;
  },
  signCooperationContract: async (id: string, signatureData: object) => {
    const { data } = await apiClient.post(
      `${endpoints.contracts}/cooperation/${id}/sign`,
      signatureData,
    );
    return data;
  },
  renew: async (id: string, extensionMonths: number) => {
    const { data } = await apiClient.post(
      `${endpoints.contracts}/${id}/renew`,
      { extensionMonths },
    );
    return data;
  },
  addMember: async (nationalId: string, payload: object) => {
    const { data } = await apiClient.post(
      `${endpoints.contracts}/${nationalId}/members`,
      payload,
    );
    return data;
  },
};
