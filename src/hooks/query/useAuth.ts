'use client'

import { authService } from '@/lib/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { ROLE_PRIORITY } from '@/constants/roles'
import { ActorType, ApiErrorResponse, UserInfo } from '@/types/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { useState } from 'react'

// ========== Helpers ==========
const resolveEffectiveRole = (user: UserInfo): UserInfo => {
    const availableRoles = user.availableRoles ?? [user.role]
    const effectiveRole = ROLE_PRIORITY.find((r) => availableRoles.includes(r)) ?? ActorType.USER
    return { ...user, actorType: effectiveRole, role: effectiveRole }
}

// MUTATIONS
export const useLogin = (onSuccess?: () => void) => {
    const { message } = App.useApp()
    const setAuth = useAuthStore((s) => s.setAuth)
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            queryClient.clear()
            setAuth(resolveEffectiveRole(data.user), data.tokens)
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

export const useRegister = (onSuccess?: () => void) => {
    const { message } = App.useApp()
    const setAuth = useAuthStore((s) => s.setAuth)
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: authService.register,
        onSuccess: (data) => {
            queryClient.clear()
            setAuth(resolveEffectiveRole(data.user), data.tokens)
            message.success('Registration successful!')
            onSuccess?.()
        },
        onError: (error: ApiErrorResponse) => {
            const msg = error?.response?.data?.message
            const errorMessage = Array.isArray(msg) ? msg[0] : msg || error?.message || 'Registration failed. Email or phone may already be in use.'
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
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => {
            const refreshToken = localStorage.getItem('refreshToken') ?? ''
            return authService.logout({ refreshToken })
        },
        onSuccess: () => {
            logoutStore()
            queryClient.clear()
            message.success('Logout successful!')
            onSuccess?.()
        },
        onError: () => {
            // Clear local state even if API call fails
            logoutStore()
            queryClient.clear()
        }
    })
}

export const useGoogleLogin = (onSuccess?: () => void) => {
    const { message } = App.useApp()
    const setAuth = useAuthStore((s) => s.setAuth)
    const queryClient = useQueryClient()
    const [loading, setLoading] = useState(false)

    const login = async () => {
        setLoading(true)
        try {
            const url = await authService.getSupabaseUrl()

            const popup = window.open(url, 'GoogleOAuth', 'width=600,height=700,scrollbars=yes,resizable=yes')
            if (!popup) {
                message.error('Popup blocked. Please allow popups for this site.')
                setLoading(false)
                return
            }

            const accessToken = await new Promise<string>((resolve, reject) => {
                const timer = setInterval(() => {
                    try {
                        if (popup.closed) {
                            clearInterval(timer)
                            reject(new Error('Popup closed by user'))
                            return
                        }
                        const hash = popup.location.hash
                        if (hash && hash.includes('access_token')) {
                            clearInterval(timer)
                            popup.close()
                            const params = new URLSearchParams(hash.substring(1))
                            const token = params.get('access_token')
                            if (token) resolve(token)
                            else reject(new Error('No access token found in redirect URL'))
                        }
                    } catch {
                        // Cross-origin error while popup is on OAuth/Supabase domain — expected, keep polling
                    }
                }, 500)
            })

            const data = await authService.googleLogin(accessToken)
            queryClient.clear()
            setAuth(data.user, data.tokens)
            message.success('Login successful!')
            onSuccess?.()
        } catch (error: unknown) {
            if (error instanceof Error && error.message !== 'Popup closed by user') {
                message.error(error.message || 'Google login failed')
            }
        } finally {
            setLoading(false)
        }
    }

    return { login, loading }
}
