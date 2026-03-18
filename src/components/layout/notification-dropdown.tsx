'use client'

import { ROUTES } from '@/constants/routes'
import type { MenuProps } from 'antd'
import { Badge, Dropdown } from 'antd'
import { BellRing } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

type NotificationDropdownProps = {
     iconSize?: number
     className?: string
}

export default function NotificationDropdown({ iconSize = 20, className = '' }: NotificationDropdownProps) {
     const t = useTranslations('Header')
     const notifications = [
          { key: 'n-1', message: t('notificationSample1'), time: t('notificationTime1'), unread: true },
          { key: 'n-2', message: t('notificationSample2'), time: t('notificationTime2'), unread: true },
          { key: 'n-3', message: t('notificationSample3'), time: t('notificationTime3'), unread: false },
     ]

     const unreadCount = notifications.filter(item => item.unread).length

     const menuItems: MenuProps['items'] = [
          {
               key: 'header',
               disabled: true,
               label: <p className='text-sm font-semibold text-gray-700 px-1 py-0.5'>{t('notifications')}</p>,
          },
          ...notifications.map(item => ({
               key: item.key,
               label: (
                    <div className='w-76 max-w-full py-1'>
                         <div className='flex items-start gap-2'>
                              {item.unread && <span className='mt-1.5 h-2 w-2 rounded-full bg-sky-500 shrink-0' />}
                              {!item.unread && <span className='mt-1.5 h-2 w-2 rounded-full bg-gray-300 shrink-0' />}
                              <div className='min-w-0'>
                                   <p className='text-sm leading-5 text-gray-800 line-clamp-2'>{item.message}</p>
                                   <p className='text-xs text-gray-400 mt-1'>{item.time}</p>
                              </div>
                         </div>
                    </div>
               ),
          })),
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
          <Dropdown menu={{ items: menuItems }} trigger={['click']} placement='bottomRight'>
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
