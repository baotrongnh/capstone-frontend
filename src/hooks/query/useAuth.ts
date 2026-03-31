'use client'

import { authService } from '@/lib/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { ActorType, ApiErrorResponse } from '@/types/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { useState } from 'react'
import { userService } from '@/lib/services/user.service'
import { useTranslations } from 'next-intl'

const ALLOWED_LOGIN_ROLES = new Set<string>([ActorType.USER, ActorType.PARTNER])

const isAllowedLoginRole = (role: unknown) => {
    return typeof role === 'string' && ALLOWED_LOGIN_ROLES.has(role)
}

export const useLogin = (onSuccess?: () => void) => {
    const { message } = App.useApp()
    const t = useTranslations('Auth')
    const setTokens = useAuthStore((s) => s.setTokens)
    const setAuth = useAuthStore((s) => s.setAuth)
    const logoutStore = useAuthStore((s) => s.logout)
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: authService.login,
        onSuccess: async (data) => {
            queryClient.clear()
            setTokens(data.tokens)
            const user = await queryClient.fetchQuery({
                queryKey: ['user', 'profile'],
                queryFn: () => userService.getProfile()
            })

            if (!isAllowedLoginRole(user?.role)) {
                logoutStore()
                queryClient.clear()
                message.error(t('loginRoleNotAllowed'))
                return
            }

            setAuth(user, data.tokens)
            message.success(t('loginSuccessful'))
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
    const t = useTranslations('Auth')
    const setTokens = useAuthStore((s) => s.setTokens)
    const setAuth = useAuthStore((s) => s.setAuth)
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: authService.register,
        onSuccess: async (data) => {
            queryClient.clear()
            setTokens(data.tokens)
            const user = await queryClient.fetchQuery({
                queryKey: ['user', 'profile'],
                queryFn: () => userService.getProfile()
            })
            setAuth(user, data.tokens)
            message.success(t('registrationSuccessful'))
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
            setTokens(data)
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
    const t = useTranslations('Auth')
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
            message.success(t('logoutSuccessful'))
            onSuccess?.()
        },
        onError: () => {
            logoutStore()
            queryClient.clear()
        }
    })
}

export const useGoogleLogin = (onSuccess?: () => void) => {
    const { message } = App.useApp()
    const t = useTranslations('Auth')
    const setTokens = useAuthStore((s) => s.setTokens)
    const setAuth = useAuthStore((s) => s.setAuth)
    const logoutStore = useAuthStore((s) => s.logout)
    const queryClient = useQueryClient()
    const [loading, setLoading] = useState(false)

    const login = async () => {
        setLoading(true)
        try {
            const url = await authService.getSupabaseUrl()

            const popupWidth = 600
            const popupHeight = 700
            const dualScreenLeft = window.screenLeft ?? window.screenX ?? 0
            const dualScreenTop = window.screenTop ?? window.screenY ?? 0
            const viewportWidth = window.innerWidth || document.documentElement.clientWidth || screen.width
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight || screen.height
            const left = Math.max(0, dualScreenLeft + (viewportWidth - popupWidth) / 2)
            const top = Math.max(0, dualScreenTop + (viewportHeight - popupHeight) / 2)
            const popupFeatures = `width=${popupWidth},height=${popupHeight},left=${Math.floor(left)},top=${Math.floor(top)},scrollbars=yes,resizable=yes`

            const popup = window.open(url, 'GoogleOAuth', popupFeatures)
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
                        message.error("Somethings went wrong!")
                    }
                }, 500)
            })

            const data = await authService.googleLogin(accessToken)
            queryClient.clear()
            setTokens(data.tokens)
            const user = await queryClient.fetchQuery({
                queryKey: ['user', 'profile'],
                queryFn: () => userService.getProfile()
            })

            if (!isAllowedLoginRole(user?.role)) {
                logoutStore()
                queryClient.clear()
                message.error(t('loginRoleNotAllowed'))
                return
            }

            setAuth(user, data.tokens)
            message.success(t('loginSuccessful'))
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
