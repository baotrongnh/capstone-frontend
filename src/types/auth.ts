import { FormInstance } from "antd";
import { paths } from "./api";
import type { UserIdentity } from "./user";

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
    onRegister?: (values: RegisterDto) => void | Promise<void>;
    t?: (key: string) => string;
    loading?: boolean;
    registerLoading?: boolean;
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

type LoginPost = paths['/api/v1/auth/login']['post']
type RegisterPost = paths['/api/v1/auth/register']['post']
type GooglePost = paths['/api/v1/auth/google']['post']
type RefreshPost = paths['/api/v1/auth/refresh']['post']
type LogoutPost = paths['/api/v1/auth/logout']['post']

export type LoginDto = LoginPost['requestBody']['content']['application/json']
export type RegisterDto = RegisterPost['requestBody']['content']['application/json']
export type GoogleLoginDto = GooglePost['requestBody']['content']['application/json']
export type RefreshTokenDto = RefreshPost['requestBody']['content']['application/json']
export type LogoutDto = LogoutPost['requestBody']['content']['application/json']

export type LoginRes = LoginPost['responses']['200']['content']['application/json']
export type RegisterRes = RegisterPost['responses']['201']['content']['application/json']
export type GoogleLoginRes = GooglePost['responses']['200']['content']['application/json']
export type RefreshTokenRes = RefreshPost['responses']['200']['content']['application/json']
export type LogoutRes = LogoutPost['responses']['200']['content']

export type AuthTokens = NonNullable<RefreshTokenRes['data']>

type BaseUserInfo = {
    id: string
    email: string
    fullName: string
    role: string
    actorType: ActorType
    availableRoles?: string[]
    isVerified?: boolean
}

export type UserActorInfo = BaseUserInfo & {
    actorType: ActorType.USER
    identity?: UserIdentity | null
}

export type PartnerActorInfo = BaseUserInfo & {
    actorType: ActorType.PARTNER
    nationalId?: string | null
}

export type StaffActorInfo = BaseUserInfo & {
    actorType: ActorType.STAFF | ActorType.OPERATOR | ActorType.ADMIN
}

export type UserInfo = UserActorInfo | PartnerActorInfo | StaffActorInfo

export type SupabaseUrlResponse = {
    url: string
}

export type LoginResponse = NonNullable<LoginRes['data']> & {
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

export type RefreshTokenResponse = AuthTokens