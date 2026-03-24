'use client'

import { INVOICE_STATUS_COLORS, INVOICE_STATUS_TABS } from '@/types/invoice'
import { useInvoices } from '@/hooks/query/useInvoices'
import type { InvoiceItem, InvoiceStatus, ListInvoicesQuery } from '@/types/invoice'
import { formatInvoiceAmount, formatInvoiceDate, isInvoiceStatus, toInvoiceTypeTranslationKey } from '../../../utils/invoice'
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

    const queryParams = useMemo<ListInvoicesQuery | undefined>(
        () => (activeStatus === 'all' ? undefined : { status: activeStatus }),
        [activeStatus],
    )

    const { data: allInvoicesData } = useInvoices()
    const { data, isLoading, isError, error } = useInvoices(queryParams)
    const invoices = data?.data ?? []
    const allInvoices = useMemo(() => allInvoicesData?.data ?? [], [allInvoicesData])

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

        allInvoices.forEach((invoice) => {
            const status = invoice.status
            if (status && isInvoiceStatus(status)) {
                counts[status] += 1
            }
        })

        return counts
    }, [allInvoices])

    const handleStatusTabChange = (key: string) => {
        if (key === 'all' || isInvoiceStatus(key)) {
            setActiveStatus(key)
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
            width: 160,
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
                const address = record.rentalContract?.apartment?.address
                const text = [number, address].filter(Boolean).join(' - ')
                return <span>{text || '-'}</span>
            },
        },
        {
            title: t('amount'),
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            width: 140,
            align: 'right',
            render: (totalAmount?: string | null) => (
                <span className="font-semibold">{formatInvoiceAmount(totalAmount, locale)}</span>
            ),
        },
        {
            title: t('dueDate'),
            dataIndex: 'dueDate',
            key: 'dueDate',
            width: 100,
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
        { key: 'all', label: `${t('all')} (${allInvoices.length})` },
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

            {invoices.length === 0 && !isLoading ? (
                <Empty description={t('empty')} className="py-10" />
            ) : (
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={invoices}
                    loading={isLoading}
                    scroll={screens.md ? undefined : { x: 760 }}
                    pagination={{ pageSize: 10 }}
                    onRow={(record) => ({
                        onClick: () => {
                            if (!record.id) return
                            router.push(`/profile/invoices/${record.id}`)
                        },
                        style: { cursor: record.id ? 'pointer' : 'default' },
                    })}
                />
            )}
        </div>
    )
}
