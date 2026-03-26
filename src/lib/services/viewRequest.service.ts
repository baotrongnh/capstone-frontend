
import { paths } from "@/types/api";
import { apiClient } from "../apis/client";
import { endpoints } from "../apis/endpoints";

export type ViewingRequestBody = paths['/api/v1/viewing-requests/user/book']['post']['requestBody']['content']['application/json']
export type ViewingRequestRespone = paths['/api/v1/viewing-requests/user/book']['post']['responses']['201']['content']['application/json']


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
