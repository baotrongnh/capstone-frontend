'use client'

import { CreditCardOutlined } from '@ant-design/icons'
import { INVOICE_STATUS_COLORS, isInvoiceStatus, isInvoiceType } from '@/types/invoice'
import { useInvoice } from '@/hooks/query/useInvoices'
import type { InvoiceDetail, InvoiceDetailContentItem, InvoiceDetailPayment } from '@/types/invoice'
import { formatInvoiceAmount, formatInvoiceDate, normalizeObjectToRows, normalizeText } from '@/utils/invoice'
import { Alert, Breadcrumb, Button, Card, Col, Descriptions, Empty, Row, Spin, Statistic, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

const { Text, Title } = Typography

export default function InvoiceDetailPage() {
    const locale = useLocale()
    const t = useTranslations('Profile.invoices.detail')
    const tInvoices = useTranslations('Profile.invoices')
    const params = useParams<{ id: string }>()
    const id = params?.id

    const { data, isLoading, isError, error } = useInvoice(id)
    const invoice = data?.data

    const getStatusColor = (status: string) => (isInvoiceStatus(status) ? INVOICE_STATUS_COLORS[status] : 'default')

    const getStatusLabel = (status: string) => (isInvoiceStatus(status) ? tInvoices(`statuses.${status}`) : status)

    const getTypeLabel = (invoiceType: string) => (isInvoiceType(invoiceType) ? tInvoices(`types.${invoiceType}`) : invoiceType)

    const itemColumns: ColumnsType<InvoiceDetailContentItem> = [
        {
            title: t('table.description'),
            dataIndex: 'description',
            key: 'description',
            render: (value: unknown) => normalizeText(value),
        },
        {
            title: t('table.type'),
            dataIndex: 'itemType',
            key: 'itemType',
            width: 160,
            render: (value: unknown) => normalizeText(value),
        },
        {
            title: t('table.quantity'),
            dataIndex: 'quantity',
            key: 'quantity',
            width: 120,
            align: 'right',
            render: (value: unknown) => normalizeText(value),
        },
        {
            title: t('table.amount'),
            dataIndex: 'amount',
            key: 'amount',
            width: 200,
            align: 'right',
            render: (value: number) => formatInvoiceAmount(String(value), locale),
        },
    ]

    const paymentColumns: ColumnsType<InvoiceDetailPayment> = [
        {
            title: t('table.paymentId'),
            dataIndex: 'id',
            key: 'id',
            render: (value: unknown) => <Text className="font-mono text-xs">{normalizeText(value)}</Text>,
        },
        {
            title: t('table.method'),
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            render: (value: unknown) => normalizeText(value),
        },
        {
            title: t('table.status'),
            dataIndex: 'status',
            key: 'status',
            width: 140,
            render: (value: unknown) => {
                const status = normalizeText(value)
                const color = getStatusColor(status)
                const label = getStatusLabel(status)
                return <Tag color={color}>{label}</Tag>
            },
        },
        {
            title: t('table.paymentDate'),
            dataIndex: 'paymentDate',
            key: 'paymentDate',
            width: 160,
            render: (value: string) => formatInvoiceDate(value, locale),
        },
        {
            title: t('table.amount'),
            dataIndex: 'amount',
            key: 'amount',
            width: 200,
            align: 'right',
            render: (value: string) => formatInvoiceAmount(value, locale),
        },
    ]

    const detailRows = (invoiceData: InvoiceDetail) => {
        const status = normalizeText(invoiceData.status)
        const invoiceType = normalizeText(invoiceData.invoiceType)
        const invoiceStatusLabel = getStatusLabel(status)
        const invoiceTypeLabel = getTypeLabel(invoiceType)

        return [
            {
                key: 'invoiceNumber',
                label: t('fields.invoiceNumber'),
                children: <Text className="font-mono">{normalizeText(invoiceData.invoiceNumber)}</Text>,
            },
            {
                key: 'status',
                label: t('fields.status'),
                children: (
                    <Tag color={getStatusColor(status)}>
                        {invoiceStatusLabel}
                    </Tag>
                ),
            },
            {
                key: 'invoiceType',
                label: t('fields.invoiceType'),
                children: (
                    <Tag>{invoiceTypeLabel}</Tag>
                ),
            },
            {
                key: 'billingStart',
                label: t('fields.billingStart'),
                children: formatInvoiceDate(invoiceData.billingPeriodStart, locale),
            },
            {
                key: 'billingEnd',
                label: t('fields.billingEnd'),
                children: formatInvoiceDate(invoiceData.billingPeriodEnd, locale),
            },
            {
                key: 'dueDate',
                label: t('fields.dueDate'),
                children: formatInvoiceDate(invoiceData.dueDate, locale),
            },
            {
                key: 'issueDate',
                label: t('fields.issueDate'),
                children: formatInvoiceDate(invoiceData.issueDate, locale),
            },
            {
                key: 'sentAt',
                label: t('fields.sentAt'),
                children: formatInvoiceDate(invoiceData.sentAt ?? undefined, locale),
            },
            {
                key: 'paidAt',
                label: t('fields.paidAt'),
                children: formatInvoiceDate(invoiceData.paidAt ?? undefined, locale),
            },
            {
                key: 'currency',
                label: t('fields.currency'),
                children: normalizeText(invoiceData.currency),
            },
            {
                key: 'paymentMethod',
                label: t('fields.paymentMethod'),
                children: normalizeText(invoiceData.paymentMethod),
            },
            {
                key: 'totalAmount',
                label: t('fields.totalAmount'),
                children: <Text strong>{formatInvoiceAmount(invoiceData.totalAmount, locale)}</Text>,
            },
            {
                key: 'baseRent',
                label: t('fields.baseRent'),
                children: formatInvoiceAmount(invoiceData.baseRent, locale),
            },
            {
                key: 'taxAmount',
                label: t('fields.taxAmount'),
                children: formatInvoiceAmount(invoiceData.taxAmount, locale),
            },
            {
                key: 'invoiceDocumentUrl',
                label: t('fields.invoiceDocument'),
                children: invoiceData.invoiceDocumentUrl ? (
                    <Link href={invoiceData.invoiceDocumentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                        {t('actions.openDocument')}
                    </Link>
                ) : (
                    '-'
                ),
            },
            {
                key: 'notes',
                label: t('fields.notes'),
                children: normalizeText(invoiceData.notes),
            },
            {
                key: 'createdAt',
                label: t('fields.createdAt'),
                children: formatInvoiceDate(invoiceData.createdAt, locale),
            },
            {
                key: 'updatedAt',
                label: t('fields.updatedAt'),
                children: formatInvoiceDate(invoiceData.updatedAt, locale),
            },
            {
                key: 'id',
                label: t('fields.id'),
                children: <Text className="font-mono text-xs">{normalizeText(invoiceData.id)}</Text>,
            },
        ]
    }

    if (isLoading) {
        return (
            <div className="flex min-h-75 items-center justify-center">
                <Spin size="large" />
            </div>
        )
    }

    if (isError) {
        return (
            <Alert
                type="error"
                showIcon
                title={t('loadError')}
                description={error?.message}
            />
        )
    }

    if (!invoice) {
        return <Empty description={t('notFound')} className="py-10" />
    }

    const utilityRows = normalizeObjectToRows(invoice.utilityCharges)
    const additionalRows = normalizeObjectToRows(invoice.additionalCharges)
    const discountRows = normalizeObjectToRows(invoice.discounts)
    const contentItems = invoice.invoiceContent?.items ?? []
    const invoiceStatus = normalizeText(invoice.status)
    const invoiceType = normalizeText(invoice.invoiceType)
    const invoiceStatusLabel = getStatusLabel(invoiceStatus)
    const invoiceTypeLabel = getTypeLabel(invoiceType)
    const statusColor = getStatusColor(invoiceStatus)

    return (
        <div className="space-y-6">
            <div>
                <Breadcrumb
                    style={{ marginBottom: 24 }}
                    items={[
                        {
                            title: <Link href="/profile/invoices">{tInvoices('title')}</Link>,
                        },
                        {
                            title: normalizeText(invoice.invoiceNumber),
                        },
                    ]}
                />

                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                        <Title level={3} style={{ margin: 0, lineHeight: 1.2 }}>{t('title')}</Title>
                        <Text type="secondary" className="mt-1 block truncate">{t('invoiceId')}: {normalizeText(invoice.id)}</Text>
                    </div>

                    <Button
                        type="primary"
                        size="large"
                        icon={<CreditCardOutlined />}
                        style={{
                            border: 'none',
                            background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
                            boxShadow: '0 8px 18px rgba(37, 99, 235, 0.28)',
                        }}
                    >
                        {t('actions.payNow')}
                    </Button>
                </div>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                    <Card
                        className="border-0 shadow-sm"
                        styles={{ body: { padding: 20 } }}
                    >
                        <Statistic
                            title={t('summary.totalAmount')}
                            value={formatInvoiceAmount(invoice.totalAmount, locale)}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card
                        className="border-0 shadow-sm"
                        styles={{ body: { padding: 20 } }}
                    >
                        <div className="text-sm text-gray-500">{t('summary.status')}</div>
                        <div className="mt-2">
                            <Tag color={statusColor}>{invoiceStatusLabel}</Tag>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card
                        className="border-0 shadow-sm"
                        styles={{ body: { padding: 20 } }}
                    >
                        <div className="text-sm text-gray-500">{t('summary.invoiceType')}</div>
                        <div className="mt-2">
                            <Tag>{invoiceTypeLabel}</Tag>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Card
                className="border-0 shadow-sm bg-linear-to-r from-sky-50 to-indigo-50"
                title={<span className="text-base font-semibold text-slate-800">{t('sections.overview')}</span>}
                styles={{ body: { padding: 16 } }}
            >
                <div className="rounded-lg bg-white p-3">
                    <Descriptions
                        bordered
                        size="middle"
                        column={{ xs: 1, sm: 2, lg: 3 }}
                        items={detailRows(invoice)}
                    />
                </div>
            </Card>

            <Card
                title={t('sections.invoiceContent')}
                className="border border-gray-100"
                style={{ marginTop: 24 }}
                styles={{ body: { padding: 20 } }}
            >
                <div className="space-y-4 pb-6">
                    <div className="flex flex-col gap-1">
                        <Text strong>{t('fields.title')}: </Text>
                        <Text>{normalizeText(invoice.invoiceContent?.title)}</Text>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Text strong>{t('fields.description')}: </Text>
                        <Text>{normalizeText(invoice.invoiceContent?.description)}</Text>
                    </div>
                </div>

                {contentItems.length > 0 ? (
                    <Table
                        rowKey={(record) => `${record.description}-${record.itemType}-${record.amount}`}
                        columns={itemColumns}
                        dataSource={contentItems}
                        pagination={false}
                        size="middle"
                        scroll={{ x: 760 }}
                    />
                ) : (
                    <Empty description={t('empty.invoiceItems')} />
                )}
            </Card>

            <Card
                title={t('sections.utilityCharges')}
                className="border border-gray-100"
                style={{ marginTop: 24 }}
                styles={{ body: { padding: 16 } }}
            >
                {utilityRows.length === 0 ? (
                    <Empty description={t('empty.utilityCharges')} />
                ) : (
                    <Descriptions
                        bordered
                        size="middle"
                        column={1}
                        items={utilityRows.map((item) => ({ key: item.key, label: item.key, children: item.value }))}
                    />
                )}
            </Card>

            <Card
                title={t('sections.additionalCharges')}
                className="border border-gray-100"
                style={{ marginTop: 24 }}
                styles={{ body: { padding: 16 } }}
            >
                {additionalRows.length === 0 ? (
                    <Empty description={t('empty.additionalCharges')} />
                ) : (
                    <Descriptions
                        bordered
                        size="middle"
                        column={1}
                        items={additionalRows.map((item) => ({ key: item.key, label: item.key, children: item.value }))}
                    />
                )}
            </Card>

            <Card
                title={t('sections.discounts')}
                className="border border-gray-100"
                style={{ marginTop: 24 }}
                styles={{ body: { padding: 16 } }}
            >
                {discountRows.length === 0 ? (
                    <Empty description={t('empty.discounts')} />
                ) : (
                    <Descriptions
                        bordered
                        size="middle"
                        column={1}
                        items={discountRows.map((item) => ({ key: item.key, label: item.key, children: item.value }))}
                    />
                )}
            </Card>

            <Card
                title={t('sections.payments')}
                className="border border-gray-100"
                style={{ marginTop: 24 }}
                styles={{ body: { padding: 20 } }}
            >
                {invoice.payments.length > 0 ? (
                    <Table
                        rowKey="id"
                        columns={paymentColumns}
                        dataSource={invoice.payments}
                        pagination={false}
                        size="middle"
                        scroll={{ x: 760 }}
                    />
                ) : (
                    <Empty description={t('empty.payments')} />
                )}
            </Card>
        </div>
    )
}
