'use client'

import { useMyViewingRequests } from '@/hooks/query/useViewRequest'
import type { MyViewingRequestItem } from '@/types/viewRequest'
import dayjs, { type Dayjs } from 'dayjs'
import { Alert, Empty } from 'antd'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import ScheduleCalendar from './components/schedule-calendar'
import ScheduleDetailModal from './components/schedule-detail-modal'
import ScheduleSummary from './components/schedule-summary'
import {
    UPCOMING_STATUSES,
    buildAppointmentsByDate,
    toVnDateTime,
    toVnTime,
} from '../../../utils/schedule-utils'

export default function MySchedulePage() {
    const t = useTranslations('Profile.mySchedulePage')
    const { data, isLoading, isError, error } = useMyViewingRequests({ limit: 100 })
    const [openDetail, setOpenDetail] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)
    const [selectedAppointments, setSelectedAppointments] = useState<MyViewingRequestItem[]>([])
    const [calendarValue, setCalendarValue] = useState<Dayjs>(dayjs())
    const [upcomingIndex, setUpcomingIndex] = useState(-1)

    const appointments = useMemo(() => {
        return data?.data ?? []
    }, [data])

    const appointmentsByDate = useMemo(() => {
        return buildAppointmentsByDate(appointments)
    }, [appointments])

    const upcomingAppointments = useMemo(() => {
        const now = dayjs()
        return appointments
            .filter((appointment) => {
                if (!UPCOMING_STATUSES.has(appointment.status)) return false
                return toVnDateTime(appointment.appointmentAt).isAfter(now)
            })
            .sort((a, b) => toVnDateTime(a.appointmentAt).valueOf() - toVnDateTime(b.appointmentAt).valueOf())
    }, [appointments])

    const currentUpcoming = upcomingIndex >= 0 ? upcomingAppointments[upcomingIndex] : undefined

    const openDateAppointments = (value: Dayjs) => {
        const dateKey = value.format('DD-MM-YYYY')
        const items = appointmentsByDate.get(dateKey) ?? []
        if (items.length === 0) return

        setCalendarValue(value)
        setSelectedDate(value)
        setSelectedAppointments(items)
        setOpenDetail(true)
    }

    const handleNextUpcoming = () => {
        if (upcomingAppointments.length === 0) return

        const nextIndex = (upcomingIndex + 1) % upcomingAppointments.length
        const nextAppointment = upcomingAppointments[nextIndex]
        const nextDate = toVnDateTime(nextAppointment.appointmentAt)

        setUpcomingIndex(nextIndex)
        setCalendarValue(nextDate)
    }

    const selectedDateTitle = selectedDate ? selectedDate.format('DD-MM-YYYY') : ''

    return (
        <div className='space-y-4'>
            <div>
                <h2 className='text-2xl font-bold'>{t('title')}</h2>
                <p className='mt-1 text-sm text-muted'>{t('subtitle')}</p>
            </div>

            <ScheduleSummary
                upcomingCount={upcomingAppointments.length}
                currentFocusDate={currentUpcoming ? toVnDateTime(currentUpcoming.appointmentAt).format('DD-MM-YYYY') : undefined}
                currentFocusTime={currentUpcoming ? toVnTime(currentUpcoming.appointmentAt) : undefined}
                onNext={handleNextUpcoming}
            />

            {isError && (
                <Alert
                    type='error'
                    showIcon
                    title={t('errors.loadTitle')}
                    description={(error as Error)?.message || t('errors.loadDescription')}
                />
            )}

            <ScheduleCalendar
                value={calendarValue}
                appointmentsByDate={appointmentsByDate}
                onPanelChange={setCalendarValue}
                onSelect={openDateAppointments}
            />

            {!isLoading && appointments.length === 0 && (
                <div className='rounded-xl border border-gray-200 bg-white py-12'>
                    <Empty description={t('empty')} />
                </div>
            )}

            <ScheduleDetailModal
                open={openDetail}
                selectedDateTitle={selectedDateTitle}
                appointments={selectedAppointments}
                onClose={() => setOpenDetail(false)}
            />
        </div>
    )
}
