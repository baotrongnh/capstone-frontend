import { apiClient } from "../apis/client";
import { endpoints } from "../apis/endpoints";

export const viewApartmentPoliciesService = {
  get: async (apartmentId: string) => {
    const { data } = await apiClient.get(
      `${endpoints.apartmentPolicies}/${apartmentId}`,
    );
    return data;
  },
};
