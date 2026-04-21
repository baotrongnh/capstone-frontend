import type { MonthlyUtilityInvoiceItem } from '@/types/invoice'
import type { UtilityMonthSlot, UtilityUsageKey } from '@/types/userApartment'

export const APARTMENT_UTILITY_MONTH_LIMIT = 12

export const toUtilityNumber = (value?: string | number | null) => {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
}

export const toUtilityMonthKey = (dateValue?: string | null) => {
    if (!dateValue) {
        return ''
    }

    const date = new Date(dateValue)

    if (Number.isNaN(date.getTime())) {
        return ''
    }

    const month = String(date.getMonth() + 1).padStart(2, '0')
    return `${date.getFullYear()}-${month}`
}

export const buildUtilityMonthSlots = (limit = APARTMENT_UTILITY_MONTH_LIMIT): UtilityMonthSlot[] => {
    const now = new Date()
    const slots: UtilityMonthSlot[] = []

    for (let offset = limit - 1; offset >= 0; offset -= 1) {
        const date = new Date(now.getFullYear(), now.getMonth() - offset, 1)
        const month = String(date.getMonth() + 1).padStart(2, '0')

        slots.push({
            key: `${date.getFullYear()}-${month}`,
            label: String(date.getMonth() + 1),
            year: date.getFullYear(),
        })
    }

    return slots
}

export const getMonthlyUtilityBreakdown = (
    invoice: MonthlyUtilityInvoiceItem | undefined,
    utilityKey: UtilityUsageKey,
) => {
    if (!invoice) {
        return null
    }

    return utilityKey === 'electricity' ? invoice.electricity ?? null : invoice.water ?? null
}

export const resolveUtilityUnit = (
    utilityKey: UtilityUsageKey,
    meterUnit?: string | null,
    invoiceUnit?: string | null,
) => {
    return meterUnit || invoiceUnit || (utilityKey === 'electricity' ? 'kWh' : 'm3')
}
