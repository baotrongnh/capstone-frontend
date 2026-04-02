import { toDisplayText } from '@/utils/format'

export type ApartmentStatus = 'available' | 'occupied' | 'rented' | 'maintenance' | 'reserved' | 'unavailable' | 'inactive'

export const APARTMENT_STATUS_COLORS: Record<ApartmentStatus, string> = {
    available: 'green',
    occupied: 'blue',
    rented: 'geekblue',
    maintenance: 'orange',
    reserved: 'purple',
    unavailable: 'volcano',
    inactive: 'red',
}

export const toSafeNumber = (value: unknown, fallback = 0) => {
    const parsed = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(parsed) ? parsed : fallback
}

export const toOptionalNumber = (value: unknown): number | undefined => {
    const parsed = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
}

export const toApartmentStatus = (status: unknown): ApartmentStatus => {
    if (typeof status !== 'string') {
        return 'inactive'
    }

    return status in APARTMENT_STATUS_COLORS ? (status as ApartmentStatus) : 'inactive'
}

export const toReadableStatus = (value: unknown) => {
    const text = toDisplayText(value)
    if (text === '-') return text

    return text
        .split('_')
        .join(' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
}

export const formatFurnishing = (value: unknown, t: (key: string) => string) => {
    if (typeof value !== 'string' || value.trim().length === 0) {
        return '-'
    }

    const normalized = value.toLowerCase()

    if (normalized === 'fully_furnished') {
        return t('furnishing.fully_furnished')
    }

    if (normalized === 'semi_furnished') {
        return t('furnishing.semi_furnished')
    }

    if (normalized === 'unfurnished') {
        return t('furnishing.unfurnished')
    }

    return value.replace(/_/g, ' ')
}

export const toVideoEmbedUrl = (value: unknown) => {
    if (typeof value !== 'string' || value.trim().length === 0) {
        return undefined
    }

    try {
        const parsed = new URL(value)
        const host = parsed.hostname.toLowerCase()

        if (host.includes('youtu.be')) {
            const id = parsed.pathname.split('/').filter(Boolean)[0]
            return id ? `https://www.youtube.com/embed/${id}` : undefined
        }

        if (host.includes('youtube.com')) {
            const pathSegments = parsed.pathname.split('/').filter(Boolean)
            const videoId = parsed.searchParams.get('v') ?? pathSegments[pathSegments.length - 1]
            return videoId ? `https://www.youtube.com/embed/${videoId}` : undefined
        }

        return value
    } catch {
        return undefined
    }
}

export const isDirectVideoFileUrl = (value: string) => {
    try {
        const parsed = new URL(value)
        return /\.(mp4|webm|ogg|mov|m4v)$/i.test(parsed.pathname)
    } catch {
        return false
    }
}

export const normalizeApartmentImages = (images: string[] | null | undefined) => {
    const APARTMENT_PLACEHOLDER = '/img/apartment-placeholder.png'
    const apartmentImages = (images ?? []).filter((image) => typeof image === 'string' && image.trim().length > 0)
    return apartmentImages.length > 0 ? apartmentImages : [APARTMENT_PLACEHOLDER]
}
