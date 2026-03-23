import type { InvoiceStatus } from '@/types/invoice'

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
    'draft',
    'issued',
    'sent',
    'partially_paid',
    'paid',
    'overdue',
    'cancelled',
]

export const INVOICE_TYPE_VALUES = ['rent', 'electricity', 'water', 'maintenance', 'deposit', 'other'] as const
