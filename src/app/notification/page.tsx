'use client'

import { useNotifications } from '@/hooks/query/useNotifications'
import dayjs from 'dayjs'
import Link from 'next/link'

export default function NotificationPage() {
     const { data: notifications, isLoading } = useNotifications()

     return (
          <div className='container py-10'>
               <h1 className='mb-2 text-2xl font-semibold'>Thông báo</h1>
               <p className='mb-6 text-gray-600'>Danh sách tất cả thông báo của bạn.</p>

               {isLoading && <p className='text-sm text-gray-500'>Đang tải thông báo...</p>}

               {!isLoading && notifications?.length === 0 && (
                    <p className='text-sm text-gray-500'>Hiện chưa có thông báo nào.</p>
               )}

               <div className='space-y-3'>
                    {notifications?.map((item) => (
                         <article
                              key={item.id}
                              className={`rounded-lg border p-4 transition-colors ${item.isRead ? 'border-gray-200 bg-white' : 'border-sky-200 bg-sky-50/60'}`}
                         >
                              <div className='mb-1 flex items-start justify-between gap-3'>
                                   <h2 className='text-sm font-semibold text-gray-900'>{item.title || 'Thông báo mới'}</h2>
                                   <span className='shrink-0 text-xs text-gray-500'>
                                        {dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}
                                   </span>
                              </div>

                              <p className='text-sm leading-6 text-gray-700'>{item.message}</p>

                              {(item.actionUrl || item.actionLabel) && (
                                   <div className='mt-2'>
                                        {item.actionUrl ? (
                                             <Link href={item.actionUrl} className='text-sm font-medium text-primary hover:underline'>
                                                  {item.actionLabel || 'Xem chi tiết'}
                                             </Link>
                                        ) : (
                                             <span className='text-sm font-medium text-primary'>{item.actionLabel}</span>
                                        )}
                                   </div>
                              )}
                         </article>
                    ))}
               </div>
          </div>
     )
}
