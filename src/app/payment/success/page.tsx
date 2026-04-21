'use client'

import { useInvoice } from '@/hooks/query/useInvoices'
import { formatInvoiceAmount } from '@/utils/invoice'
import { normalizeText } from '@/utils/text'
import { Alert, Button, Descriptions, Result, Spin, Typography } from 'antd'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const { Text } = Typography

export default function PaymentSuccessPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const locale = useLocale()
    const t = useTranslations('Profile.payment.checkout')
    const tInvoices = useTranslations('Profile.invoices')
    const tPayment = useTranslations('Profile.payment')
    const invoiceId = searchParams.get('invoiceId') ?? undefined
    const source = searchParams.get('source')
    const scheme = searchParams.get('scheme') || 'homeiq'

    useEffect(() => {
        if (source !== 'mobile') {
            return
        }

        const params = new URLSearchParams()
        if (invoiceId) {
            params.set('invoiceId', invoiceId)
        }

        const deepLink = `${scheme}://payment/success${params.toString() ? `?${params.toString()}` : ''}`
        window.location.replace(deepLink)
    }, [invoiceId, scheme, source])

    const { data, isLoading, isError, error } = useInvoice(invoiceId)
    const invoice = data?.data

    const getStatusLabel = (status: unknown) => {
        const normalizedStatus = String(status ?? '')
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/-/g, '_')

        if (!normalizedStatus) {
            return '-'
        }

        const statusKey = `statuses.${normalizedStatus}`

        if (typeof tInvoices.has === 'function' && tInvoices.has(statusKey)) {
            return tInvoices(statusKey)
        }

        if (typeof tPayment.has === 'function' && tPayment.has(statusKey)) {
            return tPayment(statusKey)
        }

        return normalizeText(status)
    }

    if (isLoading) {
        return (
            <div className="flex min-h-100 items-center justify-center">
                <Spin size="large" />
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-3xl py-8">
            <Result
                status="success"
                title={t('success.title')}
                subTitle={t('success.subtitle')}
            />

            {isError && (
                <Alert
                    type="warning"
                    showIcon
                    className="mb-4"
                    title={t('success.loadWarning')}
                    description={error?.message}
                />
            )}

            {invoice && (
                <Descriptions bordered column={1} size="middle" className="mb-4">
                    <Descriptions.Item label={t('labels.invoiceId')}>
                        <Text className="font-mono text-xs">{invoice.id}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label={t('labels.invoiceNumber')}>
                        {invoice.invoiceNumber}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('labels.totalAmount')}>
                        {formatInvoiceAmount(invoice.totalAmount, locale)}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('labels.status')}>
                        {getStatusLabel(invoice.status)}
                    </Descriptions.Item>
                </Descriptions>
            )}

            <div className="flex justify-center mt-6">
                <Button type="primary" size="large" onClick={() => router.push('/profile/payment-history')}>
                    {t('success.backToHistory')}
                </Button>
            </div>
        </div>
    )
}
