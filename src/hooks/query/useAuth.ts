'use client'

import { authService } from '@/lib/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { ApiErrorResponse } from '@/types/auth'
import { useMutation } from '@tanstack/react-query'
import { App } from 'antd'

// MUTATIONS
export const useLogin = (onSuccess?: () => void) => {
    const { message } = App.useApp()
    const setAuth = useAuthStore((s) => s.setAuth)

    return useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            setAuth(data.user, data.tokens)
            message.success('Login successful!')
            onSuccess?.()
        },
        onError: (error: ApiErrorResponse) => {
            const msg = error?.response?.data?.message
            const errorMessage = Array.isArray(msg) ? msg[0] : msg || error?.message || 'Invalid credentials or account deactivated'
            message.error(errorMessage)
        }
    })
}

export const useRefreshToken = () => {
    const { message } = App.useApp()
    const setTokens = useAuthStore((s) => s.setTokens)

    return useMutation({
        mutationFn: authService.refresh,
        onSuccess: (data) => {
            setTokens(data.tokens)
        },
        onError: (error: ApiErrorResponse) => {
            const msg = error?.response?.data?.message
            const errorMessage = Array.isArray(msg) ? msg[0] : msg || error?.message || 'Invalid or expired refresh token'
            message.error(errorMessage)
        }
    })
}

export const useLogout = (onSuccess?: () => void) => {
    const { message } = App.useApp()
    const logoutStore = useAuthStore((s) => s.logout)

    return useMutation({
        mutationFn: () => {
            const refreshToken = localStorage.getItem('refreshToken') ?? ''
            return authService.logout({ refreshToken })
        },
        onSuccess: () => {
            logoutStore()
            message.success('Logout successful!')
            onSuccess?.()
        },
        onError: () => {
            // Clear local state even if API call fails
            logoutStore()
        }
    })
}
