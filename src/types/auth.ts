import { FormInstance } from "antd";

export type AuthModal = {
    open: boolean;
    onClose: () => void;
}

export type Login = {
    email: string,
    password: string
}

export type Register = {
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
}


export type AuthFormProps = {
    form: FormInstance,
    onSubmit?: (values: LoginDto) => void | Promise<void>;
    t?: (key: string) => string;
    loading?: boolean;
    onGoogleLogin?: () => Promise<void>;
    googleLoading?: boolean;
}

export type AuthState = {
    user: UserInfo | null
    tokens: AuthTokens | null
    isAuthenticated: boolean
    isHydrated: boolean
    setAuth: (user: UserInfo, tokens: AuthTokens) => void
    setTokens: (tokens: AuthTokens) => void
    logout: () => void
    hydrate: () => void
}

// ========== API Types ==========

export enum ActorType {
    USER = 'user',
    STAFF = 'staff',
    OPERATOR = 'operator',
    ADMIN = 'admin',
    PARTNER = 'partner'
}

export type LoginDto = {
    email: string
    password: string
    actorType: ActorType
}

export type AuthTokens = {
    accessToken: string
    refreshToken: string
}

export type UserInfo = {
    id: string
    email: string
    fullName: string
    role: string
    actorType: ActorType
    availableRoles?: string[]
}

export type GoogleLoginDto = {
    accessToken: string
}

export type SupabaseUrlResponse = {
    url: string
}

export type LoginResponse = {
    user: UserInfo
    tokens: AuthTokens
}

export type AuthError = {
    message: string | string[]
    statusCode?: number
    error?: string
}

export type ApiErrorResponse = {
    response?: {
        data?: AuthError
        status?: number
    }
    message?: string
}

export type RefreshTokenDto = {
    refreshToken: string
}

export type RefreshTokenResponse = {
    tokens: AuthTokens
}

export type LogoutDto = {
    refreshToken: string
}