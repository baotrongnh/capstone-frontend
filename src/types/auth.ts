import type { FormInstance } from 'antd'
import type { AxiosError } from 'axios'
import type { paths } from './api'
import type { UserDetail } from './user'

export const ActorType = {
    USER: 'user',
    PARTNER: 'partner',
    STAFF: 'staff',
    OPERATOR: 'operator',
    ADMIN: 'admin',
    GUEST: 'guest',
} as const

export type ActorType = (typeof ActorType)[keyof typeof ActorType]

export type LoginDTO = paths['/api/v1/auth/login']['post']['requestBody']['content']['application/json']
export type LoginRes = paths['/api/v1/auth/login']['post']['responses']['200']['content']['application/json']
export type LoginPayload = NonNullable<LoginRes['data']>
export type LoginResponse = LoginPayload

export type RegisterDto = paths['/api/v1/auth/register']['post']['requestBody']['content']['application/json']
export type RegisterRes = paths['/api/v1/auth/register']['post']['responses']['201']['content']['application/json']
export type RegisterPayload = NonNullable<RegisterRes['data']>

export type LogoutDTO = paths['/api/v1/auth/logout']['post']['requestBody']['content']['application/json']
export type LogoutRes = paths['/api/v1/auth/logout']['post']['responses']['200']['content']

export type RefreshTokenDto = paths['/api/v1/auth/refresh']['post']['requestBody']['content']['application/json']
export type RefreshTokenRes = paths['/api/v1/auth/refresh']['post']['responses']['200']['content']['application/json']
export type RefreshTokenResponse = NonNullable<RefreshTokenRes['data']>
export type AuthTokens = RefreshTokenResponse

export type ApiErrorData = {
    message?: string | string[]
}

export type ApiErrorResponse = AxiosError<ApiErrorData>

export type AuthModal = {
    open: boolean
    onClose: () => void
}

export type AuthFormProps = {
    form: FormInstance
    onSubmit?: (values: LoginDTO) => Promise<void>
    onRegister?: (values: RegisterDto) => Promise<void>
    t?: (key: string) => string
    loading?: boolean
    registerLoading?: boolean
    onGoogleLogin?: () => Promise<void>
    googleLoading?: boolean
}

export type AuthState = {
    user: UserDetail | null
    tokens: AuthTokens | null
    isAuthenticated: boolean
    isHydrated: boolean
    setAuth: (user: UserDetail, tokens: AuthTokens) => void
    setTokens: (tokens: AuthTokens) => void
    logout: () => void
    hydrate: () => void
}