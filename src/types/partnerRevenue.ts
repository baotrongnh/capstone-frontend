import type { ColumnsType } from 'antd/es/table'
import type { ApexOptions } from 'apexcharts'
import type { Dayjs } from 'dayjs'

import type {
    PartnerRevenueDonutItem,
    PartnerRevenueSummary,
    PartnerRevenueTableRow,
    PartnerRevenueTimelinePoint,
} from './revenue'

export type RevenueDateRange = [Dayjs, Dayjs]

export type ApexChartSeries = NonNullable<ApexOptions['series']>

export type ApexChartType = NonNullable<NonNullable<ApexOptions['chart']>['type']>

export type ApexChartBlockProps = {
    options: ApexOptions
    series: ApexChartSeries
    type: ApexChartType
    height: number
}

export type PartnerRevenueFiltersLabels = {
    dateRange: string
    pageSize: string
    reset: string
}

export type PartnerRevenueFiltersProps = {
    labels: PartnerRevenueFiltersLabels
    selectedRange: RevenueDateRange
    limit: number
    limitOptions: readonly number[]
    dateFormat: string
    onDateRangeChange: (dates: null | [Dayjs | null, Dayjs | null]) => void
    onLimitChange: (limit: number) => void
    onReset: () => void
}

export type PartnerRevenueStatsLabels = {
    overviewTitle: string
    partnerLabel: string
    companyLabel: string
    activityTitle: string
    invoiceCount: string
    apartmentCount: string
    contractCount: string
    financeTitle: string
    totalGrossRevenue: string
    totalSystemRevenue: string
    totalNetPayoutRevenue: string
}

export type PartnerRevenueStatsProps = {
    summary: PartnerRevenueSummary
    locale: string
    labels: PartnerRevenueStatsLabels
}

export type PartnerRevenueChartLabels = {
    donutTitle: string
    donutSubtitle: string
    timelineTitle: string
    timelineSubtitle: string
    timelineRevenueSeries: string
    timelineSystemSeries: string
    timelineNetSeries: string
    timelineInvoiceSeries: string
    empty: string
}

export type PartnerRevenueChartsProps = {
    donutItems: PartnerRevenueDonutItem[]
    timelinePoints: PartnerRevenueTimelinePoint[]
    locale: string
    labels: PartnerRevenueChartLabels
    isLoading: boolean
}

export type PartnerRevenueTableLabels = {
    title: string
    empty: string
    invoiceNumber: string
    invoiceType: string
    paidAt: string
    apartment: string
    contract: string
    commissionRate: string
    grossRevenue: string
    systemRevenue: string
    netPayoutRevenue: string
}

export type PartnerRevenueTableProps = {
    rows: PartnerRevenueTableRow[]
    labels: PartnerRevenueTableLabels
    locale: string
    isLoading: boolean
    isLargeScreen: boolean
}

export type PartnerRevenueTableColumns = ColumnsType<PartnerRevenueTableRow>
