'use client'

import { authService } from '@/lib/services/auth.service'
import { ApiErrorResponse } from '@/types/auth'
import { useMutation } from '@tanstack/react-query'
import { message } from 'antd'

// MUTATIONS
export const useLogin = () => {
    return useMutation({
        mutationFn: authService.login,
        onSuccess: () => {
            message.success('Login successful!')
            // Store tokens if needed (access via mutation result)
            // localStorage.setItem('accessToken', data.tokens.accessToken)
            // localStorage.setItem('refreshToken', data.tokens.refreshToken)
        },
        onError: (error: ApiErrorResponse) => {
            const errorMessage = error?.response?.data?.message || error?.message || 'Invalid credentials or account deactivated'
            message.error(errorMessage)
        }
    })
}

export const useRefreshToken = () => {
    return useMutation({
        mutationFn: authService.refresh,
        onSuccess: () => {
            // Store new tokens
            // localStorage.setItem('accessToken', data.tokens.accessToken)
            // localStorage.setItem('refreshToken', data.tokens.refreshToken)
        },
        onError: (error: ApiErrorResponse) => {
            const errorMessage = error?.response?.data?.message || error?.message || 'Invalid or expired refresh token'
            message.error(errorMessage)
            // Redirect to login if refresh fails
            // localStorage.removeItem('accessToken')
            // localStorage.removeItem('refreshToken')
        }
    })
}

export const useLogout = () => {
    return useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            message.success('Logout successful!')
            // Clear tokens
            // localStorage.removeItem('accessToken')
            // localStorage.removeItem('refreshToken')
            // Redirect to login page
        },
        onError: (error: ApiErrorResponse) => {
            const errorMessage = error?.response?.data?.message || error?.message || 'Logout failed'
            message.error(errorMessage)
        }
    })
}
