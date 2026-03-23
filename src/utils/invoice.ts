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

export const normalizeText = (value: unknown) => {
    if (typeof value === 'string') {
        const trimmed = value.trim()
        return trimmed.length > 0 ? trimmed : '-'
    }
    if (typeof value === 'number') return String(value)
    return '-'
}

export const normalizeObjectToRows = (value: unknown): Array<{ key: string; value: string }> => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return []

    return Object.entries(value as Record<string, unknown>).map(([key, rowValue]) => ({
        key,
        value: normalizeText(rowValue),
    }))
}