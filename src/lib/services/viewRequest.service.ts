import { ViewingRequestBody, ViewingRequestRespone } from "@/types/apartment";
import { apiClient } from "../apis/client";
import { endpoints } from "../apis/endpoints";

export const viewRequestService = {
  create: async (viewRequestData: ViewingRequestBody): Promise<ViewingRequestRespone> => {
    const { data } = await apiClient.post(
      `${endpoints.viewRequest}/user/book`,
      viewRequestData,
    )
    return data
  },
  get: async () => {
    const { data } = await apiClient.get(
      `${endpoints.viewRequest}/my-assigned`,
    );
    return data;
  },
}
