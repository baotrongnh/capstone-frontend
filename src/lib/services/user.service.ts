import { UpdateUserDto, UpdateUserResponse, UserDetail } from "@/types/user";
import { apiClient } from "../apis/client";
import { endpoints } from "../apis/endpoints";

export const userService = {
    getProfile: async (): Promise<UserDetail> => {
        const { data } = await apiClient.get(`${endpoints.users}/profile`);
        return data.data;
    },

    getById: async (id: string): Promise<UserDetail> => {
        const { data } = await apiClient.get(`${endpoints.users}/${id}`);
        return data.data;
    },

    update: async (id: string, userData: UpdateUserDto): Promise<UpdateUserResponse> => {
        const { data } = await apiClient.patch(`${endpoints.users}/${id}`, userData);
        return data.data;
    },
};
