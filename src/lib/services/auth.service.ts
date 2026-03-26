import { LoginDTO, LoginResponse , LogoutDTO, RefreshTokenDto, RefreshTokenResponse, RegisterDto } from '@/types/auth'
import { apiClient } from "../apis/client";
import { endpoints } from "../apis/endpoints";

export const authService = {
    login: async (credentials: LoginDTO): Promise<LoginResponse> => {
        const { data } = await apiClient.post(`${endpoints.auth}/login`, credentials)
        return data.data
    },

    register: async (payload: RegisterDto): Promise<LoginResponse> => {
        const { data } = await apiClient.post(`${endpoints.auth}/register`, payload)
        return data.data
    },

    refresh: async (tokenData: RefreshTokenDto): Promise<RefreshTokenResponse> => {
        const { data } = await apiClient.post(`${endpoints.auth}/refresh`, tokenData)
        return data.data
    },

    logout: async (tokenData: LogoutDTO): Promise<void> => {
        await apiClient.post(`${endpoints.auth}/logout`, tokenData)
    },

    getSupabaseUrl: async (): Promise<string> => {
        const { data } = await apiClient.get(`${endpoints.auth}/supabaseUrl`)
        return typeof data.data === 'string' ? data.data : data.data?.url
    },

    googleLogin: async (accessToken: string): Promise<LoginResponse> => {
        const { data } = await apiClient.post(`${endpoints.auth}/google`, { accessToken })
        return data.data
    },
}
