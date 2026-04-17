"use client"

import { Card, Col, Empty, Row, Typography } from 'antd'
import type { ApexOptions } from 'apexcharts'
import { useMemo } from 'react'

import {
    PARTNER_REVENUE_DONUT_COLORS,
    PARTNER_REVENUE_TIMELINE_COLORS,
} from '@/constants/revenue'
import type { ApexChartSeries, PartnerRevenueChartsProps } from '@/types/partnerRevenue'
import { formatPaymentAmount } from '@/utils/payment'
import { ApexChartBlock } from './apex-chart-block'

const { Text } = Typography

export function PartnerRevenueCharts({
    donutItems,
    timelinePoints,
    locale,
    labels,
    isLoading,
}: PartnerRevenueChartsProps) {
    const donutChartOptions = useMemo<ApexOptions>(
        () => ({
            chart: {
                type: 'donut',
            },
            colors: PARTNER_REVENUE_DONUT_COLORS,
            labels: donutItems.map((item) => item.label),
            legend: {
                position: 'bottom',
            },
            dataLabels: {
                enabled: true,
            },
            tooltip: {
                y: {
                    formatter: (value) => formatPaymentAmount(value, locale),
                },
            },
            stroke: {
                width: 0,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '62%',
                    },
                },
            },
        }),
        [donutItems, locale],
    )

    const donutSeriesValues = useMemo(() => donutItems.map((item) => item.value), [donutItems])

    const donutSeries = useMemo(
        () => donutSeriesValues as ApexChartSeries,
        [donutSeriesValues],
    )

    const timelineOptions = useMemo<ApexOptions>(
        () => ({
            chart: {
                type: 'line',
                toolbar: { show: false },
                animations: { enabled: true },
            },
            colors: PARTNER_REVENUE_TIMELINE_COLORS,
            xaxis: {
                categories: timelinePoints.map((point) => point.label),
                tickPlacement: 'on',
                labels: {
                    rotate: -35,
                    trim: true,
                },
            },
            yaxis: [
                {
                    seriesName: [labels.timelineRevenueSeries, labels.timelineSystemSeries, labels.timelineNetSeries],
                    labels: {
                        formatter: (value) => formatPaymentAmount(value, locale),
                    },
                },
                {
                    seriesName: labels.timelineInvoiceSeries,
                    title: {
                        text: labels.timelineInvoiceSeries,
                    },
                    opposite: true,
                    labels: {
                        formatter: (value) => `${Math.round(value)}`,
                    },
                },
            ],
            stroke: {
                width: [2.5, 2.5, 2.5, 3],
                curve: 'straight',
            },
            fill: {
                opacity: [0.12, 0.1, 0.1, 1],
            },
            markers: {
                size: [4, 4, 4, 6],
                strokeWidth: 1,
            },
            dataLabels: {
                enabled: false,
            },
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: (value, context) => {
                        const seriesIndex = context?.seriesIndex ?? -1

                        if (seriesIndex >= 0 && seriesIndex <= 2) {
                            return formatPaymentAmount(value, locale)
                        }

                        return `${Math.round(value)} ${labels.timelineInvoiceSeries}`
                    },
                },
            },
            grid: {
                borderColor: '#e5e7eb',
            },
            legend: {
                position: 'top',
            },
        }),
        [
            labels.timelineInvoiceSeries,
            labels.timelineNetSeries,
            labels.timelineRevenueSeries,
            labels.timelineSystemSeries,
            locale,
            timelinePoints,
        ],
    )

    const timelineSeries = useMemo(
        () => [
            {
                name: labels.timelineRevenueSeries,
                type: 'area',
                data: timelinePoints.map((point) => point.grossRevenue),
            },
            {
                name: labels.timelineSystemSeries,
                type: 'area',
                data: timelinePoints.map((point) => point.systemRevenue),
            },
            {
                name: labels.timelineNetSeries,
                type: 'area',
                data: timelinePoints.map((point) => point.netPayoutRevenue),
            },
            {
                name: labels.timelineInvoiceSeries,
                type: 'line',
                data: timelinePoints.map((point) => point.invoiceCount),
            },
        ] as ApexChartSeries,
        [
            labels.timelineInvoiceSeries,
            labels.timelineNetSeries,
            labels.timelineRevenueSeries,
            labels.timelineSystemSeries,
            timelinePoints,
        ],
    )

    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} xl={16}>
                <Card title={labels.timelineTitle} extra={<Text type='secondary'>{labels.timelineSubtitle}</Text>}>
                    {timelinePoints.length === 0 && !isLoading ? (
                        <Empty description={labels.empty} className='py-10' />
                    ) : (
                        <ApexChartBlock options={timelineOptions} series={timelineSeries} type='line' height={360} />
                    )}
                </Card>
            </Col>

            <Col xs={24} xl={8}>
                <Card title={labels.donutTitle} extra={<Text type='secondary'>{labels.donutSubtitle}</Text>}>
                    {donutSeriesValues.every((value) => value <= 0) && !isLoading ? (
                        <Empty description={labels.empty} className='py-10' />
                    ) : (
                        <>
                            <ApexChartBlock options={donutChartOptions} series={donutSeries} type='donut' height={300} />

                            <div className='space-y-2'>
                                {donutItems.map((item) => (
                                    <div key={item.key} className='flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2'>
                                        <span className='text-sm text-muted'>{item.label}</span>
                                        <span className='text-sm font-semibold'>{formatPaymentAmount(item.value, locale)}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </Card>
            </Col>
        </Row>
    )
}
