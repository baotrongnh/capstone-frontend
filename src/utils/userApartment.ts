import type {
    ApartmentStatus,
    BuildMyApartmentQuickSummaryRowsParams,
    QuickSummaryRow,
    TranslationFn,
} from '@/types/userApartment'
import { toDisplayText } from '@/utils/format'
import { formatPaymentAmount } from '@/utils/payment'

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

export const toApartmentStatus = (status: unknown): ApartmentStatus => {
    if (typeof status !== 'string') {
        return 'inactive'
    }

    return status in APARTMENT_STATUS_COLORS ? (status as ApartmentStatus) : 'inactive'
}

const toReadableStatus = (value: unknown) => {
    const text = toDisplayText(value)
    if (text === '-') return text

    return text
        .split('_')
        .join(' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
}

export const hasDisplayValue = (value: unknown) => {
    if (value === null || value === undefined) {
        return false
    }

    if (typeof value === 'string') {
        return value.trim().length > 0
    }

    return true
}

const normalizeEnumKey = (value: unknown) => {
    const text = toDisplayText(value)
    if (text === '-') {
        return ''
    }

    return text
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/-/g, '_')
}

const translateEnumValue = (value: unknown, t: TranslationFn, keyPrefix: string) => {
    const normalized = normalizeEnumKey(value)

    if (!normalized) {
        return '-'
    }

    const translationKey = `${keyPrefix}.${normalized}`
    const hasKey = typeof t.has === 'function' ? t.has(translationKey) : false

    if (hasKey) {
        return t(translationKey)
    }

    return toReadableStatus(normalized)
}

export const toUserApartmentStatusLabel = (status: unknown, t: TranslationFn) => {
    return translateEnumValue(status, t, 'status')
}

export const toPaymentMethodLabel = (paymentMethod: unknown, t: TranslationFn) => {
    return translateEnumValue(paymentMethod, t, 'paymentMethodOptions')
}

export const toContractCategoryLabel = (category: unknown, t: TranslationFn) => {
    return translateEnumValue(category, t, 'contractCategoryOptions')
}

export const toContractMemberTypeLabel = (memberType: unknown, t: TranslationFn) => {
    return translateEnumValue(memberType, t, 'memberTypeOptions')
}

export const toContractMemberStatusLabel = (status: unknown, t: TranslationFn) => {
    return translateEnumValue(status, t, 'memberStatusOptions')
}

export const parseApartmentImages = (images: unknown) => {
    if (!Array.isArray(images)) {
        return [] as string[]
    }

    return images.filter((image): image is string => typeof image === 'string' && image.trim().length > 0)
}

export const getApartmentCoverImage = (images: unknown) => {
    const parsedImages = parseApartmentImages(images)
    return parsedImages[0] ?? '/img/apartment-placeholder.png'
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

export const buildMyApartmentQuickSummaryRows = ({
    t,
    apartment,
    rawApartment,
    totalArea,
    depositAmount,
    locale,
}: BuildMyApartmentQuickSummaryRowsParams): QuickSummaryRow[] => {
    return [
        {
            key: 'quickTotalArea',
            label: t('totalArea'),
            value: hasDisplayValue(apartment?.totalArea) ? `${totalArea} m²` : '-',
        },
        {
            key: 'quickDepositAmount',
            label: t('depositAmount'),
            value: hasDisplayValue(apartment?.depositAmount)
                ? formatPaymentAmount(depositAmount, locale)
                : '-',
        },
        {
            key: 'quickFurnishingStatus',
            label: t('furnishingStatus'),
            value: formatFurnishing(apartment?.furnishingStatus, t),
        },
        {
            key: 'quickTenantStatus',
            label: t('tenantStatus'),
            value: toUserApartmentStatusLabel(rawApartment?.status, t),
        },
    ]
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
