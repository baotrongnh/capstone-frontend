'use client'

import type { ScheduleCalendarProps } from '@/types/viewRequest'
import type { CalendarProps } from 'antd'
import { Calendar } from 'antd'
import type { Dayjs } from 'dayjs'
import { useTranslations } from 'next-intl'

export default function ScheduleCalendar({
    value,
    appointmentsByDate,
    onPanelChange,
    onSelect,
}: ScheduleCalendarProps) {
    const t = useTranslations('Profile.mySchedulePage')

    const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
        if (info.type !== 'date') return info.originNode

        const dateKey = current.format('DD-MM-YYYY')
        const appointments = appointmentsByDate.get(dateKey) ?? []
        const appointmentCount = appointments.length
        const cancelledCount = appointments.filter((appointment) => appointment.status === 'cancelled').length
        const activeCount = appointmentCount - cancelledCount
        const hasAppointment = appointmentCount > 0
        const markerColorClass = activeCount > 0 ? 'bg-blue-500' : 'bg-red-500'

        if (!hasAppointment) return null

        return (
            <div className='mt-1 flex flex-col items-center gap-1'>
                <div className={`mx-auto mt-1 h-0.5 w-6 rounded-full ${markerColorClass}`} />
                <div className='flex flex-wrap gap-1'>
                    {activeCount > 0 && (
                        <div className='rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600'>
                            {t('calendar.marker', { count: activeCount })}
                        </div>
                    )}
                    {cancelledCount > 0 && (
                        <div className='rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-600'>
                            {t('calendar.cancelledMarker', { count: cancelledCount })}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className='rounded-xl border border-gray-200 bg-white p-3 [&_.ant-picker-calendar-date-content]:overflow-hidden'>
            <Calendar
                value={value}
                onPanelChange={(nextValue) => onPanelChange(nextValue)}
                cellRender={cellRender}
                onSelect={onSelect}
                fullscreen
            />
        </div>
    )
}
