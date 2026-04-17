"use client"

import { Table } from 'antd'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

import type { PartnerRevenueTableColumns, PartnerRevenueTableProps } from '@/types/partnerRevenue'
import { formatPaymentAmount } from '@/utils/payment'

export function PartnerRevenueTable({ rows, labels, locale, isLoading, isLargeScreen }: PartnerRevenueTableProps) {
    const router = useRouter()

    const columns = useMemo<PartnerRevenueTableColumns>(
        () => [
            {
                title: labels.invoiceNumber,
                dataIndex: 'invoiceNumber',
                key: 'invoiceNumber',
                width: 160,
                render: (value: string) => <span className='font-medium'>{value}</span>,
            },
            {
                title: labels.invoiceType,
                dataIndex: 'invoiceType',
                key: 'invoiceType',
                width: 120,
            },
            {
                title: labels.paidAt,
                dataIndex: 'invoicePaidAt',
                key: 'invoicePaidAt',
                width: 140,
                render: (value: string) => new Date(value).toLocaleDateString(locale === 'en' ? 'en-GB' : 'vi-VN'),
            },
            {
                title: labels.apartment,
                dataIndex: 'apartmentName',
                key: 'apartmentName',
                width: 180,
            },
            {
                title: labels.contract,
                dataIndex: 'contractNumber',
                key: 'contractNumber',
                width: 150,
            },
            {
                title: labels.commissionRate,
                dataIndex: 'commissionRateApplied',
                key: 'commissionRateApplied',
                align: 'right',
                width: 120,
                render: (value: number | null) => `${value ?? 0}%`,
            },
            {
                title: labels.grossRevenue,
                dataIndex: 'grossRevenue',
                key: 'grossRevenue',
                align: 'right',
                width: 170,
                render: (value?: number) => <span className='font-medium'>{formatPaymentAmount(value, locale)}</span>,
            },
            {
                title: labels.systemRevenue,
                dataIndex: 'systemRevenue',
                key: 'systemRevenue',
                align: 'right',
                width: 190,
                render: (value?: number) => <span className='font-medium'>{formatPaymentAmount(value, locale)}</span>,
            },
            {
                title: labels.netPayoutRevenue,
                dataIndex: 'netPayoutRevenue',
                key: 'netPayoutRevenue',
                align: 'right',
                width: 170,
                render: (value?: number) => (
                    <span className='font-semibold text-emerald-600'>{formatPaymentAmount(value, locale)}</span>
                ),
            },
        ],
        [labels, locale],
    )

    return (
        <Table
            rowKey={(record) => record.invoiceId}
            columns={columns}
            dataSource={rows}
            loading={isLoading}
            locale={{ emptyText: labels.empty }}
            scroll={isLargeScreen ? undefined : { x: 1140 }}
            pagination={false}
            onRow={(record) => ({
                onClick: () => {
                    if (!record.invoiceId) {
                        return
                    }

                    router.push(`/profile/invoices/${encodeURIComponent(record.invoiceId)}?from=revenue`)
                },
                style: {
                    cursor: record.invoiceId ? 'pointer' : 'default',
                },
            })}
        />
    )
}
