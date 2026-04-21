'use client'

import { ArrowDownOutlined, ArrowUpOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { Button, Card, Empty, Spin, Tag } from 'antd'
import type { ApexOptions } from 'apexcharts'
import { Droplets } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'

import { useUtilityMonthlyInvoices } from '@/hooks/query/useInvoices'
import { useIotMetersByApartment } from '@/hooks/query/useUserApartment'
import type { MonthlyUtilityInvoiceItem } from '@/types/invoice'
import type { MyApartmentUtilityUsageTabProps, UtilityUsageKey } from '@/types/userApartment'
import { formatLocaleDate, toDisplayText } from '@/utils/format'
import { formatPaymentAmount } from '@/utils/payment'
import {
    APARTMENT_UTILITY_MONTH_LIMIT,
    buildUtilityMonthSlots,
    getMonthlyUtilityBreakdown,
    resolveUtilityUnit,
    toUtilityMonthKey,
    toUtilityNumber,
} from '@/utils/utilityUsage'
import { ApexChartBlock } from '../revenue/apex-chart-block'

const UTILITY_KEYS: UtilityUsageKey[] = ['electricity', 'water']

export function MyApartmentUtilityUsageTab({ t, locale, apartmentId }: MyApartmentUtilityUsageTabProps) {
    const tInvoices = useTranslations('Profile.invoices')
    const [activeUtility, setActiveUtility] = useState<UtilityUsageKey>('electricity')

    const { data: meterResponse, isLoading: isMetersLoading } = useIotMetersByApartment(apartmentId)
    const { data: utilityInvoicesResponse, isLoading: isUtilityInvoicesLoading } = useUtilityMonthlyInvoices({
        page: 1,
        limit: APARTMENT_UTILITY_MONTH_LIMIT,
    })

    const monthSlots = useMemo(() => buildUtilityMonthSlots(APARTMENT_UTILITY_MONTH_LIMIT), [])

    const apartmentInvoices = useMemo<MonthlyUtilityInvoiceItem[]>(() => {
        const invoiceItems = utilityInvoicesResponse?.data?.items ?? []

        if (!apartmentId) {
            return []
        }

        return invoiceItems.filter((invoice) => String(invoice.apartment?.id ?? '') === apartmentId)
    }, [apartmentId, utilityInvoicesResponse?.data?.items])

    const invoiceByMonth = useMemo(() => {
        const map = new Map<string, MonthlyUtilityInvoiceItem>()

        apartmentInvoices.forEach((invoice) => {
            const monthKey = toUtilityMonthKey(invoice.billingPeriodStart)

            if (monthKey) {
                map.set(monthKey, invoice)
            }
        })

        return map
    }, [apartmentInvoices])

    const currentSlot = monthSlots[monthSlots.length - 1]
    const activeMeter = activeUtility === 'electricity' ? meterResponse?.data?.electric : meterResponse?.data?.water
    const currentMeterConsumption = toUtilityNumber(activeMeter?.currentReading)

    const monthlyConsumptions = useMemo(() => {
        return monthSlots.map((slot) => {
            if (slot.key === currentSlot.key) {
                return currentMeterConsumption
            }

            const invoice = invoiceByMonth.get(slot.key)
            const breakdown = getMonthlyUtilityBreakdown(invoice, activeUtility)
            return toUtilityNumber(breakdown?.consumption)
        })
    }, [activeUtility, currentMeterConsumption, currentSlot.key, invoiceByMonth, monthSlots])

    const previousConsumption = monthlyConsumptions[monthlyConsumptions.length - 2] || 0
    const currentInvoice = invoiceByMonth.get(currentSlot.key)
    const currentBreakdown = getMonthlyUtilityBreakdown(currentInvoice, activeUtility)
    const currentAmount = toUtilityNumber(currentBreakdown?.amount)
    const currentConsumption = currentMeterConsumption
    const currentUnit = resolveUtilityUnit(activeUtility, activeMeter?.unitOfMeasurement, currentBreakdown?.unit)

    const trend = previousConsumption > 0
        ? (currentConsumption - previousConsumption) / previousConsumption
        : 0
    const isTrendUp = trend >= 0

    const currentInvoiceStatus = String(currentInvoice?.status ?? '').trim().toLowerCase()
    const hasCurrentInvoice = Boolean(currentInvoice)
    const isPaid = Boolean(currentInvoice?.paidAt)
    const canPayNow = Boolean(currentInvoice?.invoiceId && !isPaid && ['issued', 'overdue'].includes(currentInvoiceStatus))

    const currentBillingPeriodLabel = `${currentSlot.label}/${currentSlot.year}`
    const utilityInvoiceMonthLabel = t('utilityInvoiceMonth', { period: currentBillingPeriodLabel })
    const invoiceStatusLabels: Record<string, string> = {
        draft: tInvoices('statuses.draft'),
        issued: tInvoices('statuses.issued'),
        sent: tInvoices('statuses.sent'),
        partially_paid: tInvoices('statuses.partially_paid'),
        paid: tInvoices('statuses.paid'),
        overdue: tInvoices('statuses.overdue'),
        cancelled: tInvoices('statuses.cancelled'),
    }
    const currentStatusLabel = invoiceStatusLabels[currentInvoiceStatus]
        ? invoiceStatusLabels[currentInvoiceStatus]
        : toDisplayText(currentInvoice?.status) === '-'
            ? t('invoiceNotIssued')
            : toDisplayText(currentInvoice?.status)
    const utilityInvoiceStatusLabel = t('utilityInvoiceStatus', { status: currentStatusLabel })
    const utilityLastMonthsUsageLabel = t('utilityLastMonthsUsage', { count: APARTMENT_UTILITY_MONTH_LIMIT })
    const utilityPaidAtLabel = t('utilityPaidAt', {
        date: formatLocaleDate(currentInvoice?.paidAt, locale === 'en' ? 'en' : 'vi'),
    })
    const isElectricity = activeUtility === 'electricity'

    const chartOptions: ApexOptions = {
        chart: {
            type: 'line',
            toolbar: { show: false },
            zoom: { enabled: false },
        },
        colors: ['#2563eb'],
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
            width: 3,
        },
        markers: {
            size: 4,
        },
        grid: {
            borderColor: '#e2e8f0',
        },
        xaxis: {
            categories: monthSlots.map((slot) => slot.label),
        },
        yaxis: {
            labels: {
                formatter: (value) => `${Math.round(value)}`,
            },
        },
        tooltip: {
            y: {
                formatter: (value) => `${value.toLocaleString(locale === 'en' ? 'en-US' : 'vi-VN')} ${currentUnit}`,
            },
        },
    }

    const chartSeries = [
        {
            name: activeUtility === 'electricity' ? t('electricity') : t('water'),
            data: monthlyConsumptions,
        },
    ] as NonNullable<ApexOptions['series']>

    if (!apartmentId) {
        return (
            <div className="p-4 md:p-6">
                <Empty description={t('noApartment')} />
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6">
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                {UTILITY_KEYS.map((utility) => (
                    <button
                        key={utility}
                        type="button"
                        onClick={() => setActiveUtility(utility)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${activeUtility === utility
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {utility === 'electricity' ? t('electricity') : t('water')}
                    </button>
                ))}
            </div>

            <Card className="rounded-xl border-slate-200" style={{ marginTop: 12 }} styles={{ body: { padding: 16 } }}>
                <div className="flex items-start gap-3">
                    <div className="flex-1">
                        <p className="text-xs text-slate-500">{utilityInvoiceMonthLabel}</p>
                        {hasCurrentInvoice ? (
                            <p className="mt-2 text-2xl font-bold text-slate-900">{formatPaymentAmount(currentAmount, locale)}</p>
                        ) : (
                            <p className="mt-2 text-base font-semibold text-slate-900">{t('utilityInvoiceNotAvailable')}</p>
                        )}

                        {isPaid && currentInvoice?.paidAt ? (
                            <p className="mt-2 text-xs text-slate-500">
                                {utilityPaidAtLabel}
                            </p>
                        ) : (
                            <p className="mt-2 text-xs text-slate-500">
                                {utilityInvoiceStatusLabel}
                            </p>
                        )}
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-lg text-blue-600">
                        {isElectricity ? <ThunderboltOutlined /> : <Droplets size={18} />}
                    </div>
                </div>
            </Card>

            <Card className="rounded-xl border-slate-200" style={{ marginTop: 12 }} styles={{ body: { padding: 16 } }}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500">{t('utilityCurrentMonthUsage')}</p>
                        <p className="mt-1 text-2xl font-bold text-slate-900">
                            {currentConsumption.toLocaleString(locale === 'en' ? 'en-US' : 'vi-VN')}
                            <span className="ml-1 text-sm font-medium text-slate-500">{currentUnit}</span>
                        </p>
                    </div>

                    <div className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${isTrendUp ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {isTrendUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                        <span>{isTrendUp ? '+' : ''}{(trend * 100).toFixed(2)}%</span>
                    </div>
                </div>
            </Card>

            <Card className="rounded-xl border-slate-200" style={{ marginTop: 12 }} styles={{ body: { padding: 16 } }}>
                <h4 className="mb-3 text-sm font-semibold text-slate-900">
                    {utilityLastMonthsUsageLabel}
                </h4>

                {(isMetersLoading || isUtilityInvoicesLoading) ? (
                    <div className="flex min-h-56 items-center justify-center">
                        <Spin />
                    </div>
                ) : (
                    <ApexChartBlock options={chartOptions} series={chartSeries} type="line" height={300} />
                )}
            </Card>

            {isPaid ? (
                <Tag color="green" className="px-3 py-1 text-sm font-medium">
                    {tInvoices('statuses.paid')}
                </Tag>
            ) : null}

            {canPayNow ? (
                <Link href={`/profile/invoices/${currentInvoice?.invoiceId}`} className="block">
                    <Button type="primary" size="large" block>
                        {tInvoices('detail.actions.payNow')}
                    </Button>
                </Link>
            ) : null}
        </div>
    )
}
