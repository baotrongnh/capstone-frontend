import type {
    PartnerRevenueDonutItem,
    PartnerRevenuePagination,
    PartnerRevenueSummary,
    PartnerRevenueTableRow,
    RevenueOverviewData,
    RevenueOverviewInvoice,
    RevenueOverviewResponse,
    PartnerRevenueTimelinePoint,
} from '@/types/revenue'
import { toDisplayText, toFiniteNumber } from './format'

const DATE_INPUT_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/

const parseDateInput = (value: string, isEndOfDay = false) => {
    const matches = value.match(DATE_INPUT_REGEX)
    if (!matches) {
        return null
    }

    const year = Number(matches[1])
    const month = Number(matches[2])
    const day = Number(matches[3])

    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
        return null
    }

    const parsedDate = isEndOfDay
        ? new Date(year, month - 1, day, 23, 59, 59, 999)
        : new Date(year, month - 1, day, 0, 0, 0, 0)

    if (Number.isNaN(parsedDate.getTime())) {
        return null
    }

    return parsedDate
}

const toDateInputValue = (date: Date) => {
    const year = date.getFullYear()
    const month = `${date.getMonth() + 1}`.padStart(2, '0')
    const day = `${date.getDate()}`.padStart(2, '0')

    return `${year}-${month}-${day}`
}

export const getCurrentMonthDateRange = (baseDate = new Date()) => {
    const start = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1)
    const end = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0)

    return {
        fromDate: toDateInputValue(start),
        toDate: toDateInputValue(end),
    }
}

export const toPartnerRevenueQueryDateRange = (fromDate: string, toDate: string) => {
    const fallback = getCurrentMonthDateRange()

    const from = parseDateInput(fromDate) ?? parseDateInput(fallback.fromDate)
    const to = parseDateInput(toDate, true) ?? parseDateInput(fallback.toDate, true)

    return {
        from: from ? from.toISOString() : new Date().toISOString(),
        to: to ? to.toISOString() : new Date().toISOString(),
    }
}

const toOverviewData = (response?: RevenueOverviewResponse): RevenueOverviewData => {
    const rawData = (response?.data ?? {
        invoiceCount: 0,
        totalInvoiceAmount: 0,
        totalSystemRevenue: 0,
        totalPartnerGrossRevenue: 0,
        totalPartnerNetPayout: 0,
    }) as RevenueOverviewData

    return rawData
}

export const extractRevenueOverviewData = (response?: RevenueOverviewResponse) => toOverviewData(response)

export const extractRevenueOverviewInvoices = (response?: RevenueOverviewResponse): RevenueOverviewInvoice[] => {
    const data = toOverviewData(response)
    return Array.isArray(data.invoices) ? data.invoices : []
}

const resolvePartnerDisplayNameFromInvoices = (invoices: RevenueOverviewInvoice[]) => {
    const firstInvoicePartner = invoices.find((invoice) => invoice.partner?.fullName || invoice.partner?.companyName)?.partner
    const fullName = toDisplayText(firstInvoicePartner?.fullName, '').trim()
    const companyName = toDisplayText(firstInvoicePartner?.companyName, '').trim()

    if (fullName.length > 0) {
        return fullName
    }

    if (companyName.length > 0) {
        return companyName
    }

    return '-'
}

const resolveCompanyNameFromInvoices = (invoices: RevenueOverviewInvoice[]) => {
    const firstInvoicePartner = invoices.find((invoice) => invoice.partner?.companyName)?.partner
    const companyName = toDisplayText(firstInvoicePartner?.companyName, '').trim()
    return companyName.length > 0 ? companyName : '-'
}

const countDistinctBy = <T>(items: T[], getValue: (item: T) => string | undefined | null) => {
    const unique = new Set(
        items
            .map(getValue)
            .filter((value): value is string => typeof value === 'string' && value.trim().length > 0),
    )

    return unique.size
}

export const buildPartnerRevenueSummary = (response?: RevenueOverviewResponse): PartnerRevenueSummary => {
    const data = toOverviewData(response)
    const invoices = extractRevenueOverviewInvoices(response)

    return {
        partnerName: resolvePartnerDisplayNameFromInvoices(invoices),
        companyName: resolveCompanyNameFromInvoices(invoices),
        invoiceCount: toFiniteNumber(data.invoiceCount),
        apartmentCount: countDistinctBy(invoices, (invoice) => invoice.apartment?.id),
        contractCount: countDistinctBy(invoices, (invoice) => invoice.contract?.id),
        totalGrossRevenue: toFiniteNumber(data.totalPartnerGrossRevenue),
        totalSystemRevenue: toFiniteNumber(data.totalSystemRevenue),
        totalNetPayoutRevenue: toFiniteNumber(data.totalPartnerNetPayout),
    }
}

export const buildPartnerRevenueDonutItems = (
    labels: {
        grossRevenue: string
        systemRevenue: string
        netPayoutRevenue: string
    },
    summary: PartnerRevenueSummary,
): PartnerRevenueDonutItem[] => {
    return [
        {
            key: 'grossRevenue',
            label: labels.grossRevenue,
            value: summary.totalGrossRevenue,
        },
        {
            key: 'systemRevenue',
            label: labels.systemRevenue,
            value: summary.totalSystemRevenue,
        },
        {
            key: 'netPayout',
            label: labels.netPayoutRevenue,
            value: summary.totalNetPayoutRevenue,
        },
    ]
}

export const buildPartnerRevenueTableRows = (invoices: RevenueOverviewInvoice[]): PartnerRevenueTableRow[] => {
    return invoices.map((invoice) => {
        const apartmentNumber = toDisplayText(invoice.apartment?.apartmentNumber)
        const buildingName = toDisplayText(invoice.apartment?.buildingName, '').trim()

        return {
            invoiceId: invoice.invoiceId,
            invoiceNumber: invoice.invoiceNumber,
            invoiceType: invoice.invoiceType,
            invoicePaidAt: invoice.invoicePaidAt,
            apartmentName: buildingName.length > 0 ? `${apartmentNumber} - ${buildingName}` : apartmentNumber,
            contractNumber: toDisplayText(invoice.contract?.contractNumber),
            commissionRateApplied: invoice.commissionRateApplied,
            grossRevenue: toFiniteNumber(invoice.partnerGrossRevenueAmount),
            systemRevenue: toFiniteNumber(invoice.systemRevenueAmount),
            netPayoutRevenue: toFiniteNumber(invoice.partnerNetPayoutAmount),
        }
    })
}

export const extractPartnerRevenuePagination = (response?: RevenueOverviewResponse): PartnerRevenuePagination => {
    const data = toOverviewData(response)

    return {
        page: toFiniteNumber(data.page, 1),
        limit: toFiniteNumber(data.limit, 20),
        totalPages: Math.max(1, toFiniteNumber(data.totalPages, 1)),
    }
}

const toTimelineDateKey = (isoDateTime: string) => {
    const date = new Date(isoDateTime)

    const year = date.getFullYear()
    const month = `${date.getMonth() + 1}`.padStart(2, '0')
    const day = `${date.getDate()}`.padStart(2, '0')

    return `${year}-${month}-${day}`
}

const toTimelineLabel = (dateKey: string, locale: string) => {
    const [year, month, day] = dateKey.split('-').map(Number)
    const date = new Date(year, (month ?? 1) - 1, day ?? 1)

    return date.toLocaleDateString(locale === 'en' ? 'en-GB' : 'vi-VN', {
        day: '2-digit',
        month: '2-digit',
    })
}

export const buildPartnerRevenueTimelinePoints = (
    invoices: RevenueOverviewInvoice[],
    locale: string,
): PartnerRevenueTimelinePoint[] => {
    const grouped = invoices.reduce<Map<string, { grossRevenue: number; systemRevenue: number; netPayoutRevenue: number; invoiceCount: number }>>((accumulator, invoice) => {
        const dateKey = toTimelineDateKey(invoice.invoicePaidAt)
        const current = accumulator.get(dateKey) ?? {
            grossRevenue: 0,
            systemRevenue: 0,
            netPayoutRevenue: 0,
            invoiceCount: 0,
        }

        accumulator.set(dateKey, {
            grossRevenue: current.grossRevenue + toFiniteNumber(invoice.partnerGrossRevenueAmount),
            systemRevenue: current.systemRevenue + toFiniteNumber(invoice.systemRevenueAmount),
            netPayoutRevenue: current.netPayoutRevenue + toFiniteNumber(invoice.partnerNetPayoutAmount),
            invoiceCount: current.invoiceCount + 1,
        })

        return accumulator
    }, new Map())

    return Array.from(grouped.entries())
        .sort(([leftDate], [rightDate]) => leftDate.localeCompare(rightDate))
        .map(([dateKey, value]) => ({
            dateKey,
            label: toTimelineLabel(dateKey, locale),
            grossRevenue: value.grossRevenue,
            systemRevenue: value.systemRevenue,
            netPayoutRevenue: value.netPayoutRevenue,
            invoiceCount: value.invoiceCount,
        }))
}
