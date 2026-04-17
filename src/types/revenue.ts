import type { paths } from './api'

export type RevenueOverviewQuery = paths['/api/v1/revenues/overview']['get']['parameters']['query']

export type RevenueOverviewResponse =
    paths['/api/v1/revenues/overview']['get']['responses']['200']['content']['application/json']

export type RevenueOverviewSchemaData = NonNullable<RevenueOverviewResponse['data']>

export type RevenueOverviewInvoice = {
    invoiceId: string
    invoiceNumber: string
    invoiceType: string
    invoicePaidAt: string
    invoiceAmount: number
    isPartnerApartment: boolean
    commissionRateApplied: number | null
    systemRevenueAmount: number
    partnerGrossRevenueAmount: number
    partnerNetPayoutAmount: number
    apartment?: {
        id: string
        apartmentNumber: string
        buildingName?: string | null
    } | null
    contract?: {
        id: string
        contractNumber: string
        startDate: string
        endDate: string
        status: string
    } | null
    partner?: {
        id: string
        fullName: string
        companyName?: string | null
    } | null
    cooperationContract?: {
        id: string
        contractNumber: string
        commissionRate: number
        startDate: string
        endDate: string
    } | null
}

export type RevenueOverviewData = RevenueOverviewSchemaData & {
    invoices?: RevenueOverviewInvoice[]
    page?: number
    limit?: number
    totalPages?: number
}

export type PartnerRevenueSummary = {
    partnerName: string
    companyName: string
    invoiceCount: number
    apartmentCount: number
    contractCount: number
    totalGrossRevenue: number
    totalSystemRevenue: number
    totalNetPayoutRevenue: number
}

export type PartnerRevenueDonutItem = {
    key: 'grossRevenue' | 'systemRevenue' | 'netPayout'
    label: string
    value: number
}

export type PartnerRevenueTableRow = {
    invoiceId: string
    invoiceNumber: string
    invoiceType: string
    invoicePaidAt: string
    apartmentName: string
    contractNumber: string
    commissionRateApplied: number | null
    grossRevenue: number
    systemRevenue: number
    netPayoutRevenue: number
}

export type PartnerRevenuePagination = {
    page: number
    limit: number
    totalPages: number
}

export type PartnerRevenueTimelineInvoice = {
    invoiceId: string
    invoiceNumber: string
    invoicePaidAt: string
    invoiceAmount: number
    systemRevenueAmount: number
    partnerNetPayoutAmount: number
}

export type PartnerRevenueTimelinePoint = {
    dateKey: string
    label: string
    grossRevenue: number
    systemRevenue: number
    netPayoutRevenue: number
    invoiceCount: number
}

export type PartnerRevenueTimelineQuery = {
    from: string
    to: string
}
