"use client"

import { Alert, Button, Card, Grid, Space, Typography } from "antd"
import dayjs, { type Dayjs } from "dayjs"
import { useLocale, useTranslations } from "next-intl"
import { useMemo, useState } from "react"

import {
    PARTNER_REVENUE_DEFAULT_LIMIT,
    PARTNER_REVENUE_LIMIT_OPTIONS,
    REVENUE_DATE_INPUT_FORMAT,
} from "@/constants/revenue"
import { useRevenueOverview } from "@/hooks/query/useRevenue"
import type { RevenueDateRange } from "@/types/partnerRevenue"
import {
    buildPartnerRevenueDonutItems,
    buildPartnerRevenueSummary,
    buildPartnerRevenueTableRows,
    buildPartnerRevenueTimelinePoints,
    extractPartnerRevenuePagination,
    extractRevenueOverviewInvoices,
    getCurrentMonthDateRange,
    toPartnerRevenueQueryDateRange,
} from "@/utils/revenue"

import { PartnerRevenueCharts } from "../components/revenue/partner-revenue-charts"
import { PartnerRevenueFilters } from "../components/revenue/partner-revenue-filters"
import { PartnerRevenueStats } from "../components/revenue/partner-revenue-stats"
import { PartnerRevenueTable } from "../components/revenue/partner-revenue-table"

const { Text } = Typography

export default function PartnerRevenuesPage() {
    const t = useTranslations("Profile.revenue")
    const locale = useLocale()
    const screens = Grid.useBreakpoint()

    const defaultDateRange = useMemo(() => getCurrentMonthDateRange(), [])

    const [selectedRange, setSelectedRange] = useState<RevenueDateRange>(() => [
        dayjs(defaultDateRange.fromDate),
        dayjs(defaultDateRange.toDate),
    ])
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState<number>(PARTNER_REVENUE_DEFAULT_LIMIT)

    const queryDateRange = useMemo(
        () =>
            toPartnerRevenueQueryDateRange(
                selectedRange[0].format(REVENUE_DATE_INPUT_FORMAT),
                selectedRange[1].format(REVENUE_DATE_INPUT_FORMAT),
            ),
        [selectedRange],
    )

    const queryParams = useMemo(
        () => ({
            actorScope: "partner_receivable" as const,
            ...queryDateRange,
            page,
            limit,
        }),
        [limit, page, queryDateRange],
    )

    const { data, isLoading, isError, error } = useRevenueOverview(queryParams)

    const invoices = useMemo(() => extractRevenueOverviewInvoices(data), [data])
    const rows = useMemo(() => buildPartnerRevenueTableRows(invoices), [invoices])
    const summary = useMemo(() => buildPartnerRevenueSummary(data), [data])
    const pagination = useMemo(() => extractPartnerRevenuePagination(data), [data])

    const timelinePoints = useMemo(
        () => buildPartnerRevenueTimelinePoints(invoices, locale),
        [invoices, locale],
    )

    const donutItems = useMemo(
        () =>
            buildPartnerRevenueDonutItems(
                {
                    grossRevenue: t("charts.donut.grossRevenue"),
                    systemRevenue: t("charts.donut.systemRevenue"),
                    netPayoutRevenue: t("charts.donut.netPayoutRevenue"),
                },
                summary,
            ),
        [summary, t],
    )

    const filtersLabels = useMemo(
        () => ({
            dateRange: t("filters.dateRange"),
            pageSize: t("filters.pageSize"),
            reset: t("filters.reset"),
        }),
        [t],
    )

    const statsLabels = useMemo(
        () => ({
            overviewTitle: t("stats.overviewTitle"),
            partnerLabel: t("stats.partnerLabel"),
            companyLabel: t("stats.companyLabel"),
            activityTitle: t("stats.activityTitle"),
            invoiceCount: t("stats.invoiceCount"),
            apartmentCount: t("stats.apartmentCount"),
            contractCount: t("stats.contractCount"),
            financeTitle: t("stats.financeTitle"),
            totalGrossRevenue: t("stats.totalGrossRevenue"),
            totalSystemRevenue: t("stats.totalSystemRevenue"),
            totalNetPayoutRevenue: t("stats.totalNetPayoutRevenue"),
        }),
        [t],
    )

    const chartLabels = useMemo(
        () => ({
            donutTitle: t("charts.donut.title"),
            donutSubtitle: t("charts.donut.subtitle"),
            timelineTitle: t("charts.timeline.title"),
            timelineSubtitle: t("charts.timeline.subtitle"),
            timelineRevenueSeries: t("charts.timeline.grossRevenue"),
            timelineSystemSeries: t("charts.timeline.systemRevenue"),
            timelineNetSeries: t("charts.timeline.netPayoutRevenue"),
            timelineInvoiceSeries: t("charts.timeline.invoiceCount"),
            empty: t("table.empty"),
        }),
        [t],
    )

    const tableLabels = useMemo(
        () => ({
            title: t("table.title"),
            empty: t("table.empty"),
            invoiceNumber: t("table.invoiceNumber"),
            invoiceType: t("table.invoiceType"),
            paidAt: t("table.paidAt"),
            apartment: t("table.apartment"),
            contract: t("table.contract"),
            commissionRate: t("table.commissionRate"),
            grossRevenue: t("table.grossRevenue"),
            systemRevenue: t("table.systemRevenue"),
            netPayoutRevenue: t("table.netPayoutRevenue"),
        }),
        [t],
    )

    const handleDateRangeChange = (dates: null | [Dayjs | null, Dayjs | null]) => {
        if (!dates?.[0] || !dates?.[1]) {
            return
        }

        setSelectedRange([dates[0], dates[1]])
        setPage(1)
    }

    const handleResetDateRange = () => {
        const fallback = getCurrentMonthDateRange()
        setSelectedRange([dayjs(fallback.fromDate), dayjs(fallback.toDate)])
        setPage(1)
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">{t("title")}</h2>
                <p className="mt-1 text-sm text-muted">{t("subtitle")}</p>
            </div>

            <Card>
                <PartnerRevenueFilters
                    labels={filtersLabels}
                    selectedRange={selectedRange}
                    limit={limit}
                    limitOptions={PARTNER_REVENUE_LIMIT_OPTIONS}
                    dateFormat={REVENUE_DATE_INPUT_FORMAT}
                    onDateRangeChange={handleDateRangeChange}
                    onLimitChange={(nextLimit) => {
                        setLimit(nextLimit)
                        setPage(1)
                    }}
                    onReset={handleResetDateRange}
                />
            </Card>

            {isError && (
                <Alert
                    type="error"
                    showIcon
                    message={t("errors.loadError")}
                    description={(error as Error)?.message}
                />
            )}

            <PartnerRevenueStats summary={summary} locale={locale} labels={statsLabels} />

            <PartnerRevenueCharts
                donutItems={donutItems}
                timelinePoints={timelinePoints}
                locale={locale}
                labels={chartLabels}
                isLoading={isLoading}
            />

            <Card title={tableLabels.title}>
                <PartnerRevenueTable
                    rows={rows}
                    labels={tableLabels}
                    locale={locale}
                    isLoading={isLoading}
                    isLargeScreen={Boolean(screens.lg)}
                />

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                    <Text type="secondary">
                        {t("pagination.currentPage", { page: pagination.page, totalPages: pagination.totalPages })}
                    </Text>

                    <Space>
                        <Button
                            disabled={pagination.page <= 1 || isLoading}
                            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        >
                            {t("pagination.previous")}
                        </Button>
                        <Button
                            disabled={pagination.page >= pagination.totalPages || isLoading}
                            onClick={() => setPage((prev) => prev + 1)}
                        >
                            {t("pagination.next")}
                        </Button>
                    </Space>
                </div>
            </Card>
        </div>
    )
}
