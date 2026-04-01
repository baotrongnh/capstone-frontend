import type { MyViewingRequestItem } from '@/types/viewRequest'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const STATUS_COLORS: Record<string, string> = {
    scheduled: 'gold',
    confirmed: 'blue',
    completed: 'green',
    cancelled: 'red',
    no_show: 'volcano',
}

export const UPCOMING_STATUSES = new Set(['scheduled', 'confirmed'])

export const toVnDateKey = (iso: string) => dayjs.utc(iso).utcOffset(7).format('DD-MM-YYYY')
export const toVnTime = (iso: string) => dayjs.utc(iso).utcOffset(7).format('HH:mm')
export const toVnDateTime = (iso: string) => dayjs.utc(iso).utcOffset(7)

export const toSafeString = (value: unknown, fallback = '-') => {
    return typeof value === 'string' && value.trim().length > 0 ? value : fallback
}

export const buildAppointmentsByDate = (appointments: MyViewingRequestItem[]) => {
    const grouped = new Map<string, MyViewingRequestItem[]>()

    appointments.forEach((appointment) => {
        const dateKey = toVnDateKey(appointment.appointmentAt)
        const existing = grouped.get(dateKey) ?? []
        existing.push(appointment)
        grouped.set(dateKey, existing)
    })

    grouped.forEach((items, key) => {
        grouped.set(
            key,
            [...items].sort((a, b) => dayjs(a.appointmentAt).valueOf() - dayjs(b.appointmentAt).valueOf()),
        )
    })

    return grouped
}
