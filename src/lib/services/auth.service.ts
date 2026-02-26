import { LoginDto, LoginResponse, LogoutDto, RefreshTokenDto, RefreshTokenResponse } from "@/types/auth";
import { apiClient } from "../apis/client";
import { endpoints } from "../apis/endpoints";

export const authService = {
    login: async (credentials: LoginDto): Promise<LoginResponse> => {
        const { data } = await apiClient.post(`${endpoints.auth}/login`, credentials)
        return data
    },

    refresh: async (tokenData: RefreshTokenDto): Promise<RefreshTokenResponse> => {
        const { data } = await apiClient.post(`${endpoints.auth}/refresh`, tokenData)
        return data
    },

    logout: async (tokenData: LogoutDto): Promise<void> => {
        await apiClient.post(`${endpoints.auth}/logout`, tokenData)
    }
}
