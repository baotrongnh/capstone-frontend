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
