import { INVOICE_STATUS_COLORS, INVOICE_TYPE_VALUES, type InvoiceStatus, type InvoiceType } from '@/types/invoice'

export type InvoiceTypeTranslationKey =
    | 'rent'
    | 'electricity'
    | 'water'
    | 'maintenance'
    | 'deposit'
    | 'contract_deposit'
    | 'utility'
    | 'service'
    | 'penalty'
    | 'other'

export type PaymentMethodTranslationKey = 'bank_transfer' | 'cash' | 'e_wallet' | 'auto_debit' | 'credit_card' | 'debit_card'

const INVOICE_TYPE_ALIASES: Record<string, InvoiceTypeTranslationKey> = {
    rent: 'rent',
    electricity: 'electricity',
    water: 'water',
    maintenance: 'maintenance',
    deposit: 'deposit',
    contractDeposit: 'contract_deposit',
    contract_deposit: 'contract_deposit',
    utility: 'utility',
    service: 'service',
    penalty: 'penalty',
    other: 'other',
}

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

export const formatInvoiceDate = (value?: string | null, locale = 'vi') => {
    if (!value) return '-'

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '-'

    const normalizedLocale = locale === 'en' ? 'en-US' : 'vi-VN'
    return date.toLocaleDateString(normalizedLocale)
}

export const formatInvoiceAmount = (value?: string | null, locale = 'vi') => {
    const amount = Number(value)
    if (!Number.isFinite(amount)) return '-'

    const normalizedLocale = locale === 'en' ? 'en-US' : 'vi-VN'
    return amount.toLocaleString(normalizedLocale, {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    })
}

export const isInvoiceStatus = (value: string): value is InvoiceStatus => value in INVOICE_STATUS_COLORS

export const isInvoiceType = (value: string): value is InvoiceType => INVOICE_TYPE_VALUES.some((type) => type === value)

export const toInvoiceTypeTranslationKey = (value?: string | null): InvoiceTypeTranslationKey | null => {
    if (!value) return null
    return INVOICE_TYPE_ALIASES[value] ?? null
}

export const toPaymentMethodTranslationKey = (value?: string | null): PaymentMethodTranslationKey | null => {
    if (!value) return null
    return PAYMENT_METHOD_ALIASES[value] ?? null
}