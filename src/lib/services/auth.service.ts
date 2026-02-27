import { LoginDto, LoginResponse, LogoutDto, RefreshTokenDto, RefreshTokenResponse } from "@/types/auth";
import { apiClient } from "../apis/client";
import { endpoints } from "../apis/endpoints";

export const authService = {
    login: async (credentials: LoginDto): Promise<LoginResponse> => {
        const { data } = await apiClient.post(`${endpoints.auth}/login`, credentials)
        return data.data
    },

    refresh: async (tokenData: RefreshTokenDto): Promise<RefreshTokenResponse> => {
        const { data } = await apiClient.post(`${endpoints.auth}/refresh`, tokenData)
        return data.data
    },

    logout: async (tokenData: LogoutDto): Promise<void> => {
        await apiClient.post(`${endpoints.auth}/logout`, tokenData)
    },

    getSupabaseUrl: async (): Promise<string> => {
        const { data } = await apiClient.get(`${endpoints.auth}/supabaseUrl`)
        // The API may return the URL as a plain string or inside a `url` property
        return typeof data.data === 'string' ? data.data : data.data?.url
    },

    googleLogin: async (accessToken: string): Promise<LoginResponse> => {
        const { data } = await apiClient.post(`${endpoints.auth}/google`, { accessToken })
        return data.data
    },
}
