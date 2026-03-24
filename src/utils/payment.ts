import { PAYMENT_STATUS_COLORS, type PaymentStatus } from '@/types/payment'
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
    if (!value) return '-'

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '-'

    const normalizedLocale = locale === 'en' ? 'en-US' : 'vi-VN'
    return date.toLocaleDateString(normalizedLocale)
}

export const formatPaymentDateTime = (value?: string | null, locale = 'vi') => {
    if (!value) return '-'

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '-'

    const normalizedLocale = locale === 'en' ? 'en-US' : 'vi-VN'
    return date.toLocaleString(normalizedLocale)
}

export const formatPaymentAmount = (value?: string | number | null, locale = 'vi') => {
    const amount = typeof value === 'number' ? value : Number(value)
    if (!Number.isFinite(amount)) return '-'

    const normalizedLocale = locale === 'en' ? 'en-US' : 'vi-VN'
    return amount.toLocaleString(normalizedLocale, {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    })
}

export const toPaymentMethodTranslationKey = (value?: string | null): PaymentMethodTranslationKey => {
    if (!value) return 'other'
    return PAYMENT_METHOD_ALIASES[value] ?? 'other'
}

export const normalizePaymentStatus = (value: unknown) => normalizeText(value)
