'use client'

import { useMarkAllNotificationsAsRead, useMarkNotificationAsRead, useNotifications } from '@/hooks/query/useNotifications'
import { ROUTES } from '@/constants/routes'
import type { MenuProps } from 'antd'
import { Badge, Dropdown } from 'antd'
import dayjs from 'dayjs'
import { BellRing } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useMemo } from 'react'

type NotificationDropdownProps = {
     iconSize?: number
     className?: string
}

export default function NotificationDropdown({ iconSize = 20, className = '' }: NotificationDropdownProps) {
     const t = useTranslations('Header')
     const { data: notifications = [], isLoading } = useNotifications()
     const markAsRead = useMarkNotificationAsRead()
     const markAllAsRead = useMarkAllNotificationsAsRead()

     const unreadCount = notifications.filter(item => !item.isRead).length
     const recentNotifications = notifications.slice(0, 5)
     const unreadById = useMemo(
          () => new Map(notifications.map((item) => [item.id, !item.isRead])),
          [notifications],
     )

     const contentItems: MenuProps['items'] = isLoading
          ? [{ key: 'loading', disabled: true, label: <p className='px-1 py-0.5 text-sm text-gray-500'>Đang tải...</p> }]
          : recentNotifications.length === 0
               ? [{ key: 'empty', disabled: true, label: <p className='px-1 py-0.5 text-sm text-gray-500'>Chưa có thông báo</p> }]
               : recentNotifications.map(item => ({
                    key: item.id,
                    label: (
                         <div className='w-76 max-w-full py-1'>
                              <div className='flex items-start gap-2'>
                                   <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.isRead ? 'bg-gray-300' : 'bg-sky-500'}`} />
                                   <div className='min-w-0'>
                                        <p className='text-sm font-medium leading-5 text-gray-900 line-clamp-1'>{item.title || 'Thông báo mới'}</p>
                                        <p className='mt-0.5 text-sm leading-5 text-gray-800 line-clamp-2'>{item.message}</p>
                                        <p className='mt-1 text-xs text-gray-400'>{dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}</p>
                                   </div>
                              </div>
                         </div>
                    ),
               }))

     const menuItems: MenuProps['items'] = [
          {
               key: 'header',
               disabled: true,
               label: <p className='text-sm font-semibold text-gray-700 px-1 py-0.5'>{t('notifications')}</p>,
          },
          ...contentItems,
          { type: 'divider' },
          {
               key: 'view-all',
               label: (
                    <Link href={ROUTES.NOTIFICATION} className='block text-center text-sm font-medium text-primary hover:underline py-1'>
                         {t('viewAllNotifications')}
                    </Link>
               ),
          },
     ]

     return (
          <Dropdown
               menu={{
                    items: menuItems,
                    onClick: ({ key }) => {
                         const id = String(key)
                         if (!unreadById.get(id)) return
                         if (markAsRead.isPending) return
                         markAsRead.mutate(id)
                    },
               }}
               trigger={['click']}
               placement='bottomRight'
               onOpenChange={(open) => {
                    if (!open || unreadCount === 0) return
                    if (markAllAsRead.isPending) return
                    markAllAsRead.mutate()
               }}
          >
               <button
                    type='button'
                    className={`inline-flex cursor-pointer items-center text-gray-700 hover:text-primary ${className}`.trim()}
                    aria-label={t('notifications')}
               >
                    <Badge count={unreadCount} size='small' overflowCount={9}>
                         <BellRing strokeWidth={1.4} size={iconSize} />
                    </Badge>
               </button>
          </Dropdown>
     )
}
