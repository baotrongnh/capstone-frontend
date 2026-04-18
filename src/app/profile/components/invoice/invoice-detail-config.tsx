import type { BuildDetailRowsParams, BuildItemColumnsParams, BuildPaymentColumnsParams, InvoiceDetailContentItem, InvoiceDetailPayment } from '@/types/invoice'
import { formatInvoiceAmount, formatInvoiceDate } from '@/utils/invoice'
import { normalizeText } from '@/utils/text'
import type { DescriptionsProps } from 'antd'
import { Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'

const { Text } = Typography

export const createItemColumns = ({ t, locale, getTypeLabel }: BuildItemColumnsParams): ColumnsType<InvoiceDetailContentItem> => [
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
        render: (value: unknown) => getTypeLabel(normalizeText(value)),
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

export const createPaymentColumns = ({
    t,
    locale,
    getPaymentMethodLabel,
    getStatusColor,
    getStatusLabel,
}: BuildPaymentColumnsParams): ColumnsType<InvoiceDetailPayment> => [
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
            render: (value: unknown) => getPaymentMethodLabel(normalizeText(value)),
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

export const createDetailRows = ({
    invoiceData,
    t,
    locale,
    getStatusColor,
    getStatusLabel,
    getTypeLabel,
    getPaymentMethodLabel,
}: BuildDetailRowsParams): NonNullable<DescriptionsProps['items']> => {
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
            key: 'apartmentId',
            label: t('fields.apartmentId'),
            children: <Text className="font-mono">{normalizeText(invoiceData.contract.apartment.apartmentNumber)}</Text>,
        },
        {
            key: 'status',
            label: t('fields.status'),
            children: <Tag color={getStatusColor(status)}>{invoiceStatusLabel}</Tag>,
        },
        {
            key: 'invoiceType',
            label: t('fields.invoiceType'),
            children: <Tag>{invoiceTypeLabel}</Tag>,
        },
        {
            key: 'billingStart',
            label: t('fields.billingStart'),
            children: formatInvoiceDate(invoiceData.billingPeriodStart, locale),
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
            children: getPaymentMethodLabel(normalizeText(invoiceData.paymentMethod)),
        },
        {
            key: 'totalAmount',
            label: t('fields.totalAmount'),
            children: <Text strong>{formatInvoiceAmount(invoiceData.totalAmount, locale)}</Text>,
        },
        {
            key: 'createdAt',
            label: t('fields.createdAt'),
            children: formatInvoiceDate(invoiceData.createdAt, locale),
        },
        {
            key: 'id',
            label: t('fields.id'),
            children: <Text className="font-mono text-xs">{normalizeText(invoiceData.id)}</Text>,
        },
    ]
}