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
    onSubmit?: (values: Login | Register) => void | Promise<void>;
    t?: (key: string) => string;
}

// ========== API Types ==========

export enum ActorType {
    USER = 'user',
    STAFF = 'staff',
    OPERATOR = 'operator',
    ADMIN = 'admin',
    PARTNER = 'partner'
}

export interface LoginDto {
    email: string
    password: string
    actorType: ActorType
}

export interface AuthTokens {
    accessToken: string
    refreshToken: string
}

export interface UserInfo {
    id: string
    email: string
    actorType: ActorType
    name?: string
    avatar?: string
    isActive: boolean
}

export interface LoginResponse {
    user: UserInfo
    tokens: AuthTokens
}

export interface AuthError {
    message: string
    statusCode?: number
    error?: string
}

export interface ApiErrorResponse {
    response?: {
        data?: AuthError
        status?: number
    }
    message?: string
}

export interface RefreshTokenDto {
    refreshToken: string
}

export interface RefreshTokenResponse {
    tokens: AuthTokens
}

export interface LogoutDto {
    refreshToken: string
}