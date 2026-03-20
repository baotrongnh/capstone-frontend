import { PartnerDetail, UpdatePartnerDto } from "@/types/partner";
import { apiClient } from "../apis/client";
import { endpoints } from "../apis/endpoints";

export const partnerService = {
    getProfile: async (): Promise<PartnerDetail> => {
        const { data } = await apiClient.get(`${endpoints.partners}/profile`);
        return data.data;
    },

    getById: async (id: string): Promise<PartnerDetail> => {
        const { data } = await apiClient.get(`${endpoints.partners}/${id}`);
        return data.data;
    },

    updateProfile: async (partnerData: UpdatePartnerDto): Promise<PartnerDetail> => {
        const { data } = await apiClient.patch(`${endpoints.partners}/profile`, partnerData);
        return data.data;
    },
};
