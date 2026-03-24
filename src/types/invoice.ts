import type { paths } from './api'

export type ListInvoicesQuery = paths['/api/v1/invoices']['get']['parameters']['query']
export type ListInvoicesRes = paths['/api/v1/invoices']['get']['responses']['200']['content']['application/json']
export type ListInvoicesPayload = NonNullable<ListInvoicesRes['data']>
export type InvoiceItem = ListInvoicesPayload[number]
export type InvoiceStatus = Exclude<NonNullable<ListInvoicesQuery>['status'], undefined>

export type GetInvoiceByIdPath = paths['/api/v1/invoices/{id}']['get']['parameters']['path']
export type GetInvoiceByIdRes = paths['/api/v1/invoices/{id}']['get']['responses']['200']['content']['application/json']
export type InvoiceDetail = NonNullable<GetInvoiceByIdRes['data']>
export type InvoiceDetailPayment = InvoiceDetail['payments'][number]
export type InvoiceDetailContentItem = NonNullable<NonNullable<InvoiceDetail['invoiceContent']>['items']>[number]
export type InvoiceType = Extract<NonNullable<InvoiceDetail['invoiceType']>, string>

export const INVOICE_STATUS_COLORS: Record<InvoiceStatus, string> = {
    draft: 'default',
    issued: 'blue',
    sent: 'cyan',
    partially_paid: 'gold',
    paid: 'green',
    overdue: 'red',
    cancelled: 'magenta',
}

export const INVOICE_STATUS_TABS: InvoiceStatus[] = [
    'issued',
    'paid',
    'overdue',
    'cancelled',
]

export const INVOICE_TYPE_VALUES: InvoiceType[] = ['rent', 'electricity', 'water', 'maintenance', 'deposit', 'other']
