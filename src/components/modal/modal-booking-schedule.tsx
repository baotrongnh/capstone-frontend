'use client'

import { ROUTES } from '@/constants/routes'
import { useCreateViewRequest } from '@/hooks/query/useViewRequest'
import { useAuthStore } from '@/stores/auth.store'
import { Alert, Button, DatePicker, Input, Modal, Select, TimePicker } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/vi'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'

dayjs.locale('vi')

export interface BookingScheduleData {
     date: Dayjs
     timeSlot: string
     durationMinutes: number
     note?: string
}

const DURATION_OPTIONS = [30, 45, 60, 90]
const BOOKING_START_HOUR = 7
const BOOKING_END_HOUR = 17

const getMinBookingDateTime = () => {
     const rawMinBookingDateTime = dayjs().add(1, 'day')

     return rawMinBookingDateTime
          .startOf('minute')
          .add(rawMinBookingDateTime.second() > 0 || rawMinBookingDateTime.millisecond() > 0 ? 1 : 0, 'minute')
}

export default function ModalBookingSchedule({
     open,
     onClose,
     apartmentId
}: {
     open: boolean
     onClose: () => void
     apartmentId: string
}) {
     const t = useTranslations('BookingModal')
     const [date, setDate] = useState<Dayjs | null>(null)
     const [time, setTime] = useState<Dayjs | null>(null)
     const [durationMinutes, setDurationMinutes] = useState<number>(30)
     const [note, setNote] = useState<string>('')
     const [errors, setErrors] = useState<{ date?: string; time?: string; durationMinutes?: string }>({})
     const { mutate, isPending } = useCreateViewRequest()

     const user = useAuthStore((store) => store.user)
     const hasPhone = user?.phone
     const hasID = user?.identity
     const isValidToBook = hasPhone && hasID
     const minBookingDateTime = getMinBookingDateTime()

     const minBookingHint = minBookingDateTime.format('HH:mm DD/MM/YYYY')

     const onSubmit = (selectedDate: Dayjs, selectedTime: Dayjs, selectedDuration: number, message: string) => {
          const appointmentAt = selectedDate
               .hour(selectedTime.hour())
               .minute(selectedTime.minute())
               .second(0)
               .millisecond(0)
               .toISOString()

          mutate({
               apartmentId,
               appointmentAt,
               durationMinutes: selectedDuration,
               note: message
          })
     }

     const handleOk = () => {
          if (!date || !time || !durationMinutes) {
               setErrors({
                    date: !date ? t('dateRequired') : undefined,
                    time: !time ? t('timeRequired') : undefined,
                    durationMinutes: !durationMinutes ? 'Vui lòng chọn thời lượng cuộc hẹn' : undefined,
               })
               return
          }

          const appointmentDateTime = date
               .hour(time.hour())
               .minute(time.minute())
               .second(0)
               .millisecond(0)

          if (time.hour() < BOOKING_START_HOUR || time.hour() > BOOKING_END_HOUR) {
               setErrors((prev) => ({
                    ...prev,
                    time: 'Chỉ được chọn giờ từ 07:00 đến 17:59',
               }))
               return
          }

          if (appointmentDateTime.isBefore(minBookingDateTime)) {
               setErrors({
                    date: 'Lịch xem phải đặt trước ít nhất 1 ngày',
                    time: 'Vui lòng chọn thời gian hợp lệ',
               })
               return
          }

          onSubmit(date, time, durationMinutes, note)
          handleCancel()
     }

     const handleCancel = () => {
          setDate(null)
          setTime(null)
          setDurationMinutes(30)
          setNote('')
          setErrors({})
          onClose()
     }

     const handleDateChange = (val: Dayjs | null) => {
          setDate(val)
          setErrors((e) => ({ ...e, date: undefined }))

          if (!val || !time) {
               return
          }

          const appointmentDateTime = val
               .hour(time.hour())
               .minute(time.minute())
               .second(0)
               .millisecond(0)

          if (appointmentDateTime.isBefore(minBookingDateTime)) {
               setTime(null)
          }
     }

     const handleTimeChange = (val: Dayjs | null) => {
          setTime(val)
          setErrors((e) => ({ ...e, time: undefined }))
     }

     const disabledDate = (current: Dayjs) =>
          current &&
          (
               current < minBookingDateTime.startOf('day') ||
               (
                    minBookingDateTime.hour() > BOOKING_END_HOUR &&
                    current.isSame(minBookingDateTime.startOf('day'), 'day')
               )
          )

     const getDisabledTime = () => {
          const outsideBusinessHours = Array.from({ length: 24 }, (_, i) => i)
               .filter((hour) => hour < BOOKING_START_HOUR || hour > BOOKING_END_HOUR)

          if (!date || !date.isSame(minBookingDateTime, 'day')) {
               return {
                    disabledHours: () => outsideBusinessHours,
               }
          }

          const minHour = minBookingDateTime.hour()
          const minMinute = minBookingDateTime.minute()
          const beforeMinHours = Array.from({ length: Math.max(minHour, 0) }, (_, i) => i)
          const disabledHours = Array.from(new Set([...outsideBusinessHours, ...beforeMinHours]))
               .sort((a, b) => a - b)

          return {
               disabledHours: () => disabledHours,
               disabledMinutes: (selectedHour: number) =>
                    selectedHour === minHour
                         ? Array.from({ length: minMinute }, (_, i) => i)
                         : [],
          }
     }

     return (
          <Modal
               title={
                    <div>
                         <p className='text-base font-semibold leading-none'>{t('title')}</p>
                         <p className='mt-2 text-xs text-gray-500'>Chọn ngày và giờ phù hợp để được hỗ trợ xem căn hộ.</p>
                    </div>
               }
               open={open}
               onCancel={handleCancel}
               footer={null}
               width={520}
          >
               <div className='pt-4 space-y-5'>
                    <div className='rounded-xl border border-blue-100 bg-blue-50 p-3'>
                         <p className='text-xs text-blue-800'>Lịch xem cần đặt trước ít nhất 1 ngày, từ {minBookingHint}.</p>
                    </div>

                    <div className='rounded-xl border border-gray-200 bg-gray-50 p-4'>
                         <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                              <div className='space-y-1.5'>
                                   <label className='min-h-5 font-medium text-sm'>{t('dateLabel')}</label>
                                   <DatePicker
                                        className='w-full'
                                        size='large'
                                        format='DD/MM/YYYY'
                                        placeholder={t('datePlaceholder')}
                                        disabledDate={disabledDate}
                                        value={date}
                                        status={errors.date ? 'error' : undefined}
                                        onChange={handleDateChange}
                                   />
                                   {errors.date && <p className='text-red-500 text-xs'>{errors.date}</p>}
                              </div>

                              <div className='space-y-1.5'>
                                   <label className='min-h-5 font-medium text-sm'>{t('timeLabel')}</label>
                                   <TimePicker
                                        className='w-full'
                                        size='large'
                                        format='HH:mm'
                                        minuteStep={15}
                                        value={time}
                                        placeholder={t('timeLabel')}
                                        disabled={!date}
                                        status={errors.time ? 'error' : undefined}
                                        disabledTime={getDisabledTime}
                                        onChange={handleTimeChange}
                                   />
                                   {errors.time && <p className='text-red-500 text-xs'>{errors.time}</p>}
                              </div>

                              <div className='space-y-1.5 sm:col-span-2'>
                                   <label className='min-h-5 font-medium text-sm'>Thời lượng mong muốn</label>
                                   <Select<number>
                                        className='w-full'
                                        size='large'
                                        value={durationMinutes}
                                        options={DURATION_OPTIONS.map((value) => ({
                                             label: `${value} phút`,
                                             value,
                                        }))}
                                        status={errors.durationMinutes ? 'error' : undefined}
                                        onChange={(value) => {
                                             setDurationMinutes(value)
                                             setErrors((e) => ({ ...e, durationMinutes: undefined }))
                                        }}
                                   />
                                   {errors.durationMinutes && <p className='text-red-500 text-xs'>{errors.durationMinutes}</p>}
                              </div>
                         </div>

                         {date && time && (
                              <div className='mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2'>
                                   <p className='text-xs text-emerald-800'>
                                        Lịch dự kiến: {date.format('DD/MM/YYYY')} lúc {time.format('HH:mm')} trong {durationMinutes} phút
                                   </p>
                              </div>
                         )}
                    </div>

                    <div className='space-y-1'>
                         <label className='font-medium text-sm'>{t('noteLabel')}</label>
                         <Input.TextArea
                              rows={3}
                              placeholder={t('notePlaceholder')}
                              maxLength={300}
                              showCount
                              value={note}
                              onChange={(e) => setNote(e.target.value)}
                         />
                    </div>

                    {!isValidToBook && (
                         <Alert
                              type='warning'
                              showIcon
                              message={
                                   <p className='text-sm font-medium'>
                                        Vui lòng cập nhật
                                        {!hasPhone && 'số điện thoại'}
                                        {!hasPhone && !hasID && ' &'}
                                        {!hasID && ' CCCD '}
                                        để đặt lịch xem
                                        <Link href={ROUTES.PROFILE}>
                                             <span className='text-muted underline'> (Cập nhật ngay)</span>
                                        </Link>
                                   </p>
                              }
                         />
                    )}

                    <div className='flex justify-end gap-2'>
                         <Button size='large' shape='round' onClick={handleCancel}>{t('cancel')}</Button>
                         <Button
                              size='large'
                              type='primary'
                              shape='round'
                              style={{ minWidth: 140 }}
                              onClick={handleOk}
                              loading={isPending}
                              disabled={isPending || !isValidToBook || !date || !time}
                         >
                              {t('confirm')}
                         </Button>
                    </div>
               </div>
          </Modal>
     )
}
