// Format số thành 70,000 hoặc 70,000 VNĐ
export const formatVND = (value: number | string, showVND = false) => {
     const num = typeof value === 'string' ? Number(value) : value
     const formatted = num.toLocaleString('en-US')
     return showVND ? `${formatted} VNĐ` : formatted
}

type AppLocale = 'vi' | 'en'

const toLocaleCode = (locale: AppLocale) => (locale === 'en' ? 'en-US' : 'vi-VN')

export const toDisplayText = (value: unknown, fallback = '-') => {
     if (value === null || value === undefined) {
          return fallback
     }

     if (typeof value === 'string') {
          const trimmed = value.trim()
          return trimmed.length > 0 ? trimmed : fallback
     }

     return String(value)
}

export const toFiniteNumber = (value: unknown, fallback = 0) => {
     const parsed = typeof value === 'number' ? value : Number(value)
     return Number.isFinite(parsed) ? parsed : fallback
}

export const formatVndCurrency = (value?: string | number | null, locale: AppLocale = 'vi') => {
     const amount = toFiniteNumber(value, Number.NaN)
     if (!Number.isFinite(amount)) return '-'

     return amount.toLocaleString(toLocaleCode(locale), {
          style: 'currency',
          currency: 'VND',
          maximumFractionDigits: 0,
     })
}

export const formatLocaleDate = (value?: string | null, locale: AppLocale = 'vi') => {
     if (!value) return '-'

     const date = new Date(value)
     if (Number.isNaN(date.getTime())) return '-'

     return date.toLocaleDateString(toLocaleCode(locale))
}

export const formatLocaleDateTime = (value?: string | null, locale: AppLocale = 'vi') => {
     if (!value) return '-'

     const date = new Date(value)
     if (Number.isNaN(date.getTime())) return '-'

     return date.toLocaleString(toLocaleCode(locale))
}

export function normalizeText(text: string) {
     return text
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/đ/g, "d")
          .toLowerCase()
}

export const formatPrice = (price: number) => (price / 1_000_000).toFixed(1) + ' tr'

export const formatArea = (area?: number) => area ? `${area} m²` : ''

export const formatTime = (date: Date) => {
     return date.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
     })
}
