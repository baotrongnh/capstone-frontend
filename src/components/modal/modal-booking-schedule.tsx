'use client'

import { ROUTES } from '@/constants/routes'
import { useCreateViewRequest } from '@/hooks/query/useViewRequest'
import { useAuthStore } from '@/stores/auth.store'
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { Button, DatePicker, Input, Modal, Radio } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/vi'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'

dayjs.locale('vi')

export interface BookingScheduleData {
     date: Dayjs
     timeSlot: string
     note?: string
}

const TIME_SLOTS = [
     '08:00', '09:00', '10:00', '11:00',
     '13:00', '14:00', '15:00', '16:00',
]

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
     const [timeSlot, setTimeSlot] = useState<string>('')
     const [note, setNote] = useState<string>('')
     const [errors, setErrors] = useState<{ date?: string; timeSlot?: string }>({})
     const { mutate, isPending } = useCreateViewRequest()

     const user = useAuthStore((store) => store.user)
     const hasPhone = user?.phone
     const hasID = user?.identity
     const isValidToBook = hasPhone && hasID

     const onSubmit = (date: dayjs.Dayjs, timeSlot: string, note: string) => {
          const appointmentAt = date.hour(
               parseInt(timeSlot.split(':')[0]))
               .minute(parseInt(timeSlot.split(':')[1]))
               .toISOString()
          mutate({
               apartmentId,
               appointmentAt,
               note
          })
     }

     const handleOk = () => {
          if (!date || !timeSlot) {
               setErrors({ date: !date ? t('dateRequired') : undefined, timeSlot: !timeSlot ? t('timeRequired') : undefined })
               return
          }
          onSubmit(date, timeSlot, note)
          handleCancel()
     }

     const handleCancel = () => {
          setDate(null)
          setTimeSlot('')
          setNote('')
          setErrors({})
          onClose()
     }

     const disabledDate = (current: Dayjs) =>
          current && current < dayjs().startOf('day')

     return (
          <Modal
               title={
                    <div className='flex items-center gap-2 text-base font-semibold'>
                         <CalendarOutlined className='text-primary' />
                         {t('title')}
                    </div>
               }
               open={open}
               onCancel={handleCancel}
               footer={null}
               width={480}
          >
               <div className='pt-4 space-y-5'>
                    {/* Date */}
                    <div className='space-y-1'>
                         <label className='font-medium text-sm'>
                              <CalendarOutlined className='mr-1' /> {t('dateLabel')}
                         </label>
                         <DatePicker
                              className='w-full'
                              size='large'
                              format='DD/MM/YYYY'
                              placeholder={t('datePlaceholder')}
                              disabledDate={disabledDate}
                              value={date}
                              onChange={(val) => {
                                   setDate(val)
                                   setErrors(e => ({ ...e, date: undefined }))
                              }}
                         />
                         {errors.date && <p className='text-red-500 text-xs'>{errors.date}</p>}
                    </div>

                    {/* Time Slots */}
                    <div className='space-y-1'>
                         <label className='font-medium text-sm'>
                              <ClockCircleOutlined className='mr-1' /> {t('timeLabel')}
                         </label>
                         <Radio.Group
                              className='w-full'
                              value={timeSlot}
                              onChange={(e) => { setTimeSlot(e.target.value); setErrors(er => ({ ...er, timeSlot: undefined })) }}
                         >
                              <div className='grid grid-cols-4 gap-2'>
                                   {TIME_SLOTS.map((slot) => (
                                        <Radio.Button
                                             key={slot}
                                             value={slot}
                                             className='text-center rounded-lg! border! border-gray-200! hover:border-primary!'
                                             style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 40 }}
                                        >
                                             {slot}
                                        </Radio.Button>
                                   ))}
                              </div>
                         </Radio.Group>
                         {errors.timeSlot && <p className='text-red-500 text-xs'>{errors.timeSlot}</p>}
                    </div>

                    {/* Note */}
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
                         <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-3'>
                              <p className='text-yellow-800 text-sm font-medium'>
                                   ⚠️ Vui lòng cập nhật
                                   {!hasPhone && 'số điện thoại'}
                                   {hasPhone == null && hasID == null && ' &'}
                                   {!hasID && ' CCCD '}
                                   để đặt lịch xem
                                   <Link href={ROUTES.PROFILE}>
                                        <span className='text-muted underline'> (Cập nhật ngay)</span>
                                   </Link>
                              </p>
                         </div>
                    )}

                    {/* Actions */}
                    <div className='flex justify-end gap-2'>
                         <Button size='large' shape='round' onClick={handleCancel}>{t('cancel')}</Button>
                         <Button
                              size='large'
                              type='primary'
                              shape='round'
                              style={{ minWidth: 140 }}
                              onClick={handleOk}
                              disabled={isPending || !isValidToBook}
                         >
                              {t('confirm')}
                         </Button>
                    </div>
               </div>
          </Modal>
     )
}
