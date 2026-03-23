import type { paths } from './api'

export type ListInvoicesQuery = paths['/api/v1/invoices']['get']['parameters']['query']
export type ListInvoicesRes = paths['/api/v1/invoices']['get']['responses']['200']['content']['application/json']
export type ListInvoicesPayload = NonNullable<ListInvoicesRes['data']>
export type InvoiceItem = ListInvoicesPayload[number]
export type InvoiceStatus = Exclude<NonNullable<ListInvoicesQuery>['status'], undefined>
