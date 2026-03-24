'use client'

import { useInvoice } from '@/hooks/query/useInvoices'
import { formatInvoiceAmount } from '@/utils/invoice'
import { normalizeText } from '@/utils/text'
import { Alert, Button, Descriptions, Result, Spin, Typography } from 'antd'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'

const { Text } = Typography

export default function PaymentSuccessPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const locale = useLocale()
    const t = useTranslations('Profile.payment.checkout')
    const invoiceId = searchParams.get('invoiceId') ?? undefined

    const { data, isLoading, isError, error } = useInvoice(invoiceId)
    const invoice = data?.data

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
                    title ={t('success.loadWarning')}
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
                        {normalizeText(invoice.status)}
                    </Descriptions.Item>
                </Descriptions>
            )}

            <div className="flex justify-center">
                <Button type="primary" size="large" onClick={() => router.push('/profile/payment-history')}>
                    {t('success.backToHistory')}
                </Button>
            </div>
        </div>
    )
}
