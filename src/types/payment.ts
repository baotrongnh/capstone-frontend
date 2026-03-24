import type { paths } from './api'

export type ListPaymentsQuery = paths['/api/v1/payments']['get']['parameters']['query']
export type ListPaymentsRes = paths['/api/v1/payments']['get']['responses']['200']['content']['application/json']
export type ListPaymentsPayload = NonNullable<ListPaymentsRes['data']>
export type PaymentListItem = ListPaymentsPayload[number]
export type PaymentStatus = Exclude<NonNullable<ListPaymentsQuery>['status'], undefined>

export type CreatePayOSPaymentLinkBody = paths['/api/v1/payments/payos/create-link']['post']['requestBody']['content']['application/json']
export type CreatePayOSPaymentLinkRes = paths['/api/v1/payments/payos/create-link']['post']['responses']['201']['content']['application/json']
export type CreatePayOSPaymentLinkData = NonNullable<CreatePayOSPaymentLinkRes['data']>

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
    pending: 'orange',
    processing: 'blue',
    completed: 'green',
    failed: 'red',
    refunded: 'purple',
    cancelled: 'default',
}

export const PAYMENT_STATUS_TABS: PaymentStatus[] = [
    'completed',
    'failed',
    'refunded',
    'cancelled',
]
