'use client'

import { Modal, Tag } from 'antd'
import { useTranslations } from 'next-intl'
import {
    STATUS_COLORS,
    toSafeString,
    toVnTime,
} from '../../../utils/schedule-utils'
import { ScheduleDetailModalProps } from '@/types/viewRequest'

export default function ScheduleDetailModal({
    open,
    selectedDateTitle,
    appointments,
    onClose,
}: ScheduleDetailModalProps) {
    const t = useTranslations('Profile.mySchedulePage')

    const statusLabelMap: Record<string, string> = {
        scheduled: t('status.scheduled'),
        confirmed: t('status.confirmed'),
        completed: t('status.completed'),
        cancelled: t('status.cancelled'),
        no_show: t('status.noShow'),
    }

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            title={t('modal.title', { date: selectedDateTitle })}
        >
            <div className='space-y-3'>
                {appointments.map((appointment) => (
                    <div key={appointment.appointmentId} className='rounded-lg border border-gray-200 p-3'>
                        <div className='mb-2 flex items-center justify-between'>
                            <p className='font-semibold text-gray-900'>
                                {toSafeString(appointment.apartment?.buildingName, t('fields.unknownBuilding'))} -{' '}
                                {toSafeString(appointment.apartment?.apartmentNumber, t('fields.unknownApartment'))}
                            </p>
                            <Tag color={STATUS_COLORS[appointment.status] || 'default'}>
                                {statusLabelMap[appointment.status] || appointment.status}
                            </Tag>
                        </div>

                        <p className='text-sm text-gray-600'>
                            {t('fields.time')}: {toVnTime(appointment.appointmentAt)} ({appointment.durationMinutes} {t('fields.minutes')})
                        </p>
                        <p className='text-sm text-gray-600'>
                            {t('fields.staff')}: {toSafeString(appointment.assignedStaff?.fullName)} - {toSafeString(appointment.assignedStaff?.phone)}
                        </p>
                        <p className='text-sm text-gray-600'>
                            {t('fields.note')}: {toSafeString(appointment.note, t('fields.noNote'))}
                        </p>
                    </div>
                ))}
            </div>
        </Modal>
    )
}
