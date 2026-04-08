'use client'

import { INVOICE_STATUS_COLORS, INVOICE_STATUS_TABS } from '@/types/invoice'
import { useInvoices } from '@/hooks/query/useInvoices'
import type { InvoiceItem, InvoiceStatus, ListInvoicesQuery } from '@/types/invoice'
import {
    extractInvoiceItems,
    extractInvoiceLimit,
    extractInvoicePage,
    extractInvoiceTotal,
    formatInvoiceAmount,
    formatInvoiceDate,
    isInvoiceStatus,
    toInvoiceTypeTranslationKey,
} from '../../../utils/invoice'
import { Alert, Empty, Grid, Table, Tabs, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

export default function InvoicesPage() {
    const router = useRouter()
    const t = useTranslations('Profile.invoices')
    const locale = useLocale()
    const screens = Grid.useBreakpoint()
    const [activeStatus, setActiveStatus] = useState<'all' | InvoiceStatus>('all')
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)

    const queryParams = useMemo<ListInvoicesQuery>(
        () => ({
            ...(activeStatus === 'all' ? {} : { status: activeStatus }),
            page,
            limit,
        }),
        [activeStatus, limit, page],
    )

    const { data, isLoading, isError, error } = useInvoices(queryParams)
    const { data: issuedCountData } = useInvoices({ status: 'issued', page: 1, limit: 1 })
    const { data: paidCountData } = useInvoices({ status: 'paid', page: 1, limit: 1 })
    const { data: overdueCountData } = useInvoices({ status: 'overdue', page: 1, limit: 1 })
    const { data: cancelledCountData } = useInvoices({ status: 'cancelled', page: 1, limit: 1 })

    const invoices = useMemo(() => extractInvoiceItems(data?.data), [data])
    const filteredInvoices = useMemo(
        () => invoices.filter((invoice) => invoice.status && isInvoiceStatus(invoice.status) && INVOICE_STATUS_TABS.includes(invoice.status)),
        [invoices],
    )
    const currentPage = extractInvoicePage(data) ?? page
    const currentLimit = extractInvoiceLimit(data) ?? limit
    const currentTotal = extractInvoiceTotal(data)

    const statusCounts = useMemo(() => {
        const counts: Record<InvoiceStatus, number> = {
            draft: 0,
            issued: 0,
            sent: 0,
            partially_paid: 0,
            paid: 0,
            overdue: 0,
            cancelled: 0,
        }

        counts.issued = extractInvoiceTotal(issuedCountData)
        counts.paid = extractInvoiceTotal(paidCountData)
        counts.overdue = extractInvoiceTotal(overdueCountData)
        counts.cancelled = extractInvoiceTotal(cancelledCountData)

        return counts
    }, [cancelledCountData, overdueCountData, paidCountData, issuedCountData])

    const totalVisibleInvoices = useMemo(
        () => INVOICE_STATUS_TABS.reduce((sum, status) => sum + statusCounts[status], 0),
        [statusCounts],
    )

    const handleStatusTabChange = (key: string) => {
        if (key === 'all' || isInvoiceStatus(key)) {
            setActiveStatus(key)
            setPage(1)
        }
    }

    const getInvoiceTypeLabel = (invoiceType?: string | null) => {
        if (!invoiceType) return '-'
        const translationKey = toInvoiceTypeTranslationKey(invoiceType)
        return translationKey ? t(`types.${translationKey}`) : invoiceType
    }

    const columns: ColumnsType<InvoiceItem> = [
        {
            title: t('invoiceNumber'),
            dataIndex: 'invoiceNumber',
            key: 'invoiceNumber',
            width: 200,
            render: (invoiceNumber?: string) => (
                <span className="font-mono text-xs text-muted">{invoiceNumber || '-'}</span>
            ),
        },
        {
            title: t('type'),
            dataIndex: 'invoiceType',
            key: 'invoiceType',
            width: 120,
            render: (invoiceType?: string) => {
                if (!invoiceType) return <Tag>-</Tag>

                return <Tag>{getInvoiceTypeLabel(invoiceType)}</Tag>
            },
        },
        {
            title: t('apartment'),
            key: 'apartment',
            width: 140,
            render: (_: unknown, record) => {
                const number = record.rentalContract?.apartment?.apartmentNumber
                const text = number || '-'
                return (
                    <span
                        style={{
                            display: 'inline-block',
                            maxWidth: 120,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            verticalAlign: 'bottom',
                        }}
                        title={text || '-'}
                    >
                        {text || '-'}
                    </span>
                )
            },
        },
        {
            title: t('amount'),
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            width: 120,
            align: 'right',
            render: (totalAmount?: string | null) => (
                <span className="font-semibold">{formatInvoiceAmount(totalAmount, locale)}</span>
            ),
        },
        {
            title: t('dueDate'),
            dataIndex: 'dueDate',
            key: 'dueDate',
            width: 150,
            render: (dueDate?: string | null) => formatInvoiceDate(dueDate, locale),
        },
        {
            title: t('status'),
            dataIndex: 'status',
            key: 'status',
            width: 140,
            render: (status?: string | null) => {
                if (!status) return <Tag>-</Tag>
                if (!isInvoiceStatus(status)) return <Tag>{status}</Tag>
                return <Tag color={INVOICE_STATUS_COLORS[status]}>{t(`statuses.${status}`)}</Tag>
            },
        },
    ]

    const tabItems = [
        { key: 'all', label: `${t('all')} (${totalVisibleInvoices})` },
        ...INVOICE_STATUS_TABS.map((status) => ({
            key: status,
            label: `${t(`statuses.${status}`)} (${statusCounts[status]})`,
        })),
    ]

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-2xl font-bold">{t('title')}</h2>
                <p className="mt-1 text-sm text-muted">{t('subtitle')}</p>
            </div>

            {isError && (
                <Alert
                    type="error"
                    showIcon
                    title={t('loadError')}
                    description={error?.message}
                />
            )}

            <Tabs
                activeKey={activeStatus}
                onChange={handleStatusTabChange}
                items={tabItems}
            />

            {filteredInvoices.length === 0 && !isLoading ? (
                <Empty description={t('empty')} className="py-10" />
            ) : (
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={filteredInvoices}
                    loading={isLoading}
                    scroll={screens.md ? undefined : { x: 760 }}
                    pagination={{
                        current: currentPage,
                        pageSize: currentLimit,
                        total: currentTotal,
                        showSizeChanger: false,
                        onChange: (nextPage, nextPageSize) => {
                            setPage(nextPage)
                            if (nextPageSize && nextPageSize !== limit) {
                                setLimit(nextPageSize)
                            }
                        },
                    }}
                    onRow={(record) => ({
                        onClick: () => {
                            if (!record.id) return
                            router.push(`/profile/invoices/${record.id}?from=invoices`)
                        },
                        style: { cursor: record.id ? 'pointer' : 'default' },
                    })}
                />
            )}
        </div>
    )
}
