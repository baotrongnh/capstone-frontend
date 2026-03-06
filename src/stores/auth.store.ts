import { AuthState, UserInfo } from '@/types/auth'
import { create } from 'zustand'

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    tokens: null,
    isAuthenticated: false,
    isHydrated: false,

    setAuth: (user, tokens) => {
        localStorage.setItem('accessToken', tokens.accessToken)
        localStorage.setItem('refreshToken', tokens.refreshToken)
        localStorage.setItem('user', JSON.stringify(user))
        set({ user, tokens, isAuthenticated: true })
    },

    setTokens: (tokens) => {
        localStorage.setItem('accessToken', tokens.accessToken)
        localStorage.setItem('refreshToken', tokens.refreshToken)
        set({ tokens })
    },

    logout: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        set({ user: null, tokens: null, isAuthenticated: false })
    },

    hydrate: () => {
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')
        const userStr = localStorage.getItem('user')

        if (accessToken && refreshToken && userStr) {
            try {
                const user = JSON.parse(userStr) as UserInfo
                set({
                    user,
                    tokens: { accessToken, refreshToken },
                    isAuthenticated: true,
                    isHydrated: true,
                })
            } catch {
                set({ isHydrated: true })
            }
        } else {
            set({ isHydrated: true })
        }
    },
}))
