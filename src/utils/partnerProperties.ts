import type {
    PartnerPropertyDetailItem,
    PartnerPropertyListItem,
    PartnerPropertyStatus,
} from '@/types/partnerProperties'
import type { QuickSummaryRow, TranslationFn } from '@/types/userApartment'
import { toDisplayText } from '@/utils/format'
import { formatPaymentAmount } from '@/utils/payment'
import {
    APARTMENT_STATUS_COLORS,
    formatFurnishing,
    hasDisplayValue,
    toSafeNumber,
    toUserApartmentStatusLabel,
} from '@/utils/userApartment'

export type PartnerPropertyStatusFilter = 'all' | PartnerPropertyStatus

type AddressShape = Pick<
    PartnerPropertyListItem,
    'streetAddress' | 'fullAddress' | 'wardName' | 'districtName' | 'provinceName'
>

export const PARTNER_PROPERTY_STATUS_COLORS: Record<PartnerPropertyStatus, string> = {
    ...APARTMENT_STATUS_COLORS,
    verified: 'cyan',
    pending: 'gold',
}

export const toPartnerPropertyStatus = (status: unknown): PartnerPropertyStatus => {
    if (typeof status !== 'string') {
        return 'inactive'
    }

    return status in PARTNER_PROPERTY_STATUS_COLORS ? (status as PartnerPropertyStatus) : 'inactive'
}

export const toPartnerPropertyAddress = (property?: AddressShape | PartnerPropertyDetailItem) => {
    if (!property) {
        return '-'
    }

    const normalizedFullAddress = toDisplayText(property.fullAddress, '').trim()
    if (normalizedFullAddress.length > 0) {
        return normalizedFullAddress
    }

    const segments = [property.streetAddress, property.wardName, property.districtName, property.provinceName]
        .map((segment) => toDisplayText(segment, '').trim())
        .filter((segment) => segment.length > 0)

    return segments.length > 0 ? segments.join(', ') : '-'
}

export const buildPartnerPropertySearchText = (property: PartnerPropertyListItem) => {
    return [
        property.buildingName,
        property.apartmentNumber,
        property.streetAddress,
        property.fullAddress,
        property.wardName,
        property.districtName,
        property.provinceName,
    ]
        .map((segment) => toDisplayText(segment, '').toLowerCase())
        .filter((segment) => segment.length > 0)
        .join(' ')
}

export const filterPartnerProperties = (
    properties: PartnerPropertyListItem[],
    search: string,
    statusFilter: PartnerPropertyStatusFilter,
) => {
    const normalizedSearch = search.trim().toLowerCase()

    return properties.filter((property) => {
        const matchesSearch = normalizedSearch.length === 0 || buildPartnerPropertySearchText(property).includes(normalizedSearch)
        const propertyStatus = toPartnerPropertyStatus(property.status)
        const matchesStatus = statusFilter === 'all' || propertyStatus === statusFilter

        return matchesSearch && matchesStatus
    })
}

export const buildPartnerPropertiesStats = (properties: PartnerPropertyListItem[]) => {
    return {
        total: properties.length,
        available: properties.filter((item) => toPartnerPropertyStatus(item.status) === 'available').length,
        occupied: properties.filter((item) => {
            const status = toPartnerPropertyStatus(item.status)
            return status === 'occupied' || status === 'rented'
        }).length,
        maintenance: properties.filter((item) => toPartnerPropertyStatus(item.status) === 'maintenance').length,
        monthlyRevenue: properties
            .filter((item) => {
                const status = toPartnerPropertyStatus(item.status)
                return status === 'occupied' || status === 'rented'
            })
            .reduce((sum, item) => sum + toSafeNumber(item.baseRentPrice), 0),
    }
}

type BuildPartnerPropertyQuickSummaryRowsParams = {
    t: TranslationFn
    apartment: PartnerPropertyDetailItem | undefined
    locale: string
}

export const buildPartnerPropertyQuickSummaryRows = ({
    t,
    apartment,
    locale,
}: BuildPartnerPropertyQuickSummaryRowsParams): QuickSummaryRow[] => {
    const totalArea = toSafeNumber(apartment?.totalArea)
    const depositAmount = toSafeNumber(apartment?.depositAmount)
    const status = toPartnerPropertyStatus(apartment?.status)

    return [
        {
            key: 'quickTotalArea',
            label: t('totalArea'),
            value: hasDisplayValue(apartment?.totalArea) ? `${totalArea} m²` : '-',
        },
        {
            key: 'quickDepositAmount',
            label: t('depositAmount'),
            value: hasDisplayValue(apartment?.depositAmount) ? formatPaymentAmount(depositAmount, locale) : '-',
        },
        {
            key: 'quickFurnishingStatus',
            label: t('furnishingStatus'),
            value: formatFurnishing(apartment?.furnishingStatus, t),
        },
        {
            key: 'quickStatus',
            label: t('statusLabel'),
            value: toUserApartmentStatusLabel(status, t),
        },
    ]
}
