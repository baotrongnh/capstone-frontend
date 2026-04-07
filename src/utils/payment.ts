import { PAYMENT_STATUS_COLORS, type ListPaymentsRes, type PaymentListItem, type PaymentStatus } from '@/types/payment'
import { formatLocaleDate, formatLocaleDateTime, formatVndCurrency } from './format'
import { normalizeText } from './text'

export type PaymentMethodTranslationKey =
    | 'bank_transfer'
    | 'cash'
    | 'e_wallet'
    | 'auto_debit'
    | 'credit_card'
    | 'debit_card'
    | 'other'

const PAYMENT_METHOD_ALIASES: Record<string, PaymentMethodTranslationKey> = {
    bank_transfer: 'bank_transfer',
    bankTransfer: 'bank_transfer',
    cash: 'cash',
    e_wallet: 'e_wallet',
    eWallet: 'e_wallet',
    auto_debit: 'auto_debit',
    autoDebit: 'auto_debit',
    credit_card: 'credit_card',
    creditCard: 'credit_card',
    debit_card: 'debit_card',
    debitCard: 'debit_card',
}

export const isPaymentStatus = (value: string): value is PaymentStatus => value in PAYMENT_STATUS_COLORS

export const formatPaymentDate = (value?: string | null, locale = 'vi') => {
    return formatLocaleDate(value, locale === 'en' ? 'en' : 'vi')
}

export const formatPaymentDateTime = (value?: string | null, locale = 'vi') => {
    return formatLocaleDateTime(value, locale === 'en' ? 'en' : 'vi')
}

export const formatPaymentAmount = (value?: string | number | null, locale = 'vi') => {
    return formatVndCurrency(value, locale === 'en' ? 'en' : 'vi')
}

export const toPaymentMethodTranslationKey = (value?: string | null): PaymentMethodTranslationKey => {
    if (!value) return 'other'
    return PAYMENT_METHOD_ALIASES[value] ?? 'other'
}

export const normalizePaymentStatus = (value: unknown) => normalizeText(value)

export const extractPaymentItems = (response?: ListPaymentsRes): PaymentListItem[] => {
    const payload = response?.data
    if (!payload) return []
    if (Array.isArray(payload)) return payload

    const paginatedPayload = payload as { items?: PaymentListItem[] }
    return paginatedPayload.items ?? []
}

export const extractPaymentTotal = (response?: ListPaymentsRes): number => {
    if (typeof response?.meta?.total === 'number') return response.meta.total

    const payload = response?.data
    if (!payload) return 0
    if (Array.isArray(payload)) return payload.length

    const paginatedPayload = payload as { total?: number }
    return paginatedPayload.total ?? 0
}

export const extractPaymentPage = (response?: ListPaymentsRes): number | undefined => {
    if (typeof response?.meta?.page === 'number') return response.meta.page

    const payload = response?.data
    if (!payload || Array.isArray(payload)) return undefined

    const paginatedPayload = payload as { page?: number }
    return paginatedPayload.page
}

export const extractPaymentLimit = (response?: ListPaymentsRes): number | undefined => {
    if (typeof response?.meta?.limit === 'number') return response.meta.limit

    const payload = response?.data
    if (!payload || Array.isArray(payload)) return undefined

    const paginatedPayload = payload as { limit?: number }
    return paginatedPayload.limit
}
