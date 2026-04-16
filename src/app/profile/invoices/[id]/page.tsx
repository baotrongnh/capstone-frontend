'use client'

import { CreditCardOutlined } from '@ant-design/icons'
import { INVOICE_STATUS_COLORS } from '@/types/invoice'
import { useInvoice } from '@/hooks/query/useInvoices'
import { useCreatePayOSPaymentLink } from '@/hooks/query/usePayments'
import { createDetailRows, createItemColumns, createPaymentColumns } from '../../components/invoice-detail-config'
import type { ApiErrorResponse } from '@/types/auth'
import {
    formatInvoiceAmount,
    isInvoiceStatus,
    toInvoiceTypeTranslationKey,
    toPaymentMethodTranslationKey,
} from '@/utils/invoice'
import { normalizeObjectToRows, normalizeText } from '@/utils/text'
import { Alert, App, Breadcrumb, Button, Card, Col, Descriptions, Empty, Row, Spin, Statistic, Table, Tag, Typography } from 'antd'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

const { Text, Title } = Typography

export default function InvoiceDetailPage() {
    const { message } = App.useApp()
    const locale = useLocale()
    const t = useTranslations('Profile.invoices.detail')
    const tInvoices = useTranslations('Profile.invoices')
    const tPayments = useTranslations('Profile.payment')
    const tRevenue = useTranslations('Profile.revenue')
    const params = useParams<{ id: string }>()
    const searchParams = useSearchParams()
    const id = params?.id
    const from = searchParams.get('from')

    const backHref =
        from === 'payments'
            ? '/profile/payment-history'
            : from === 'revenue'
                ? '/profile/partner-revenues'
                : '/profile/invoices'

    const backLabel =
        from === 'payments'
            ? tPayments('title')
            : from === 'revenue'
                ? tRevenue('title')
                : tInvoices('title')

    const { data, isLoading, isError, error } = useInvoice(id)
    const { mutateAsync: createPayOSLink, isPending: isCreatingPayOSPaymentLink } = useCreatePayOSPaymentLink()
    const invoice = data?.data

    const getErrorMessage = (errorValue: unknown) => {
        const apiError = errorValue as ApiErrorResponse
        const errorMessage = apiError?.response?.data?.message

        if (Array.isArray(errorMessage) && errorMessage.length > 0) {
            return errorMessage[0]
        }

        if (errorMessage) {
            return errorMessage
        }

        return t('errors.createPaymentLinkFailed')
    }

    const handlePayNow = async () => {
        if (!invoice?.id) {
            message.error(t('notFound'))
            return
        }

        const callbackBaseUrl = process.env.NEXT_PUBLIC_PAYMENT_CALLBACK_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || window.location.origin
        // if (callbackBaseUrl.includes('localhost')) {
        //     message.error(t('errors.invalidReturnUrl'))
        //     return
        // }

        const returnUrl = `${callbackBaseUrl}/payment/success?invoiceId=${encodeURIComponent(invoice.id)}`
        const cancelUrl = `${callbackBaseUrl}/payment/cancel?invoiceId=${encodeURIComponent(invoice.id)}`
        const descriptionSource = invoice.invoiceNumber || invoice.id
        const description = `TT ${descriptionSource}`.slice(0, 25)

        try {
            const response = await createPayOSLink({
                invoiceId: invoice.id,
                returnUrl,
                cancelUrl,
                description,
            })

            const checkoutUrl = response.data?.checkoutUrl
            if (!checkoutUrl) {
                message.error(t('errors.missingCheckoutUrl'))
                return
            }

            window.location.assign(checkoutUrl)
        } catch (errorValue) {
            message.error(getErrorMessage(errorValue))
        }
    }

    const getStatusColor = (status: string) => (isInvoiceStatus(status) ? INVOICE_STATUS_COLORS[status] : 'default')

    const getStatusLabel = (status: string) => (isInvoiceStatus(status) ? tInvoices(`statuses.${status}`) : status)

    const getTypeLabel = (invoiceType: string) => {
        const translationKey = toInvoiceTypeTranslationKey(invoiceType)
        return translationKey ? tInvoices(`types.${translationKey}`) : invoiceType
    }

    const getPaymentMethodLabel = (paymentMethod: string) => {
        const translationKey = toPaymentMethodTranslationKey(paymentMethod)
        return translationKey ? tInvoices(`paymentMethods.${translationKey}`) : paymentMethod
    }

    const itemColumns = createItemColumns({ t, locale, getTypeLabel })

    const paymentColumns = createPaymentColumns({
        t,
        locale,
        getPaymentMethodLabel,
        getStatusColor,
        getStatusLabel,
    })

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
    const canPayNow = ['issued', 'overdue'].includes(invoiceStatus)

    return (
        <div className="space-y-6">
            <div>
                <Breadcrumb
                    style={{ marginBottom: 24 }}
                    items={[
                        {
                            title: <Link href={backHref}>{backLabel}</Link>,
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

                    {canPayNow && (
                        <Button
                            type="primary"
                            size="large"
                            icon={<CreditCardOutlined />}
                            loading={isCreatingPayOSPaymentLink}
                            onClick={() => void handlePayNow()}
                            style={{
                                border: 'none',
                                background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
                                boxShadow: '0 8px 18px rgba(37, 99, 235, 0.28)',
                            }}
                        >
                            {t('actions.payNow')}
                        </Button>
                    )}
                </div>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                    <Card
                        className="border-0 shadow-sm min-h-27"
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
                        className="border-0 shadow-sm min-h-27"
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
                        className="border-0 shadow-sm min-h-27"
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
                        items={createDetailRows({
                            invoiceData: invoice,
                            t,
                            locale,
                            getStatusColor,
                            getStatusLabel,
                            getTypeLabel,
                            getPaymentMethodLabel,
                        })}
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
