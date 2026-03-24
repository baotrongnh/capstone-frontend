'use client'

import { CustomerServiceOutlined, RobotOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'
import { useTranslations } from 'next-intl'

const modeOptions = [
     {
          mode: 'support' as const,
          icon: <CustomerServiceOutlined />,
          avatarColor: '#3b82f6',
          cardClassName: 'hover:border-blue-400 hover:bg-blue-50',
          titleKey: 'supportOption',
          descriptionKey: 'supportOptionDesc',
     },
     {
          mode: 'ai' as const,
          icon: <RobotOutlined />,
          avatarColor: '#7c3aed',
          cardClassName: 'hover:border-purple-400 hover:bg-purple-50',
          titleKey: 'aiOption',
          descriptionKey: 'aiOptionDesc',
     },
]

export function ChatModeSelect({ onSelect }: {onSelect: (mode: 'support' | 'ai') => void}) {
     const t = useTranslations('Chat')

     return (
          <div className="p-8 flex flex-col gap-4 justify-center h-full">
               <p className="text-sm text-gray-500 text-center mb-2">{t('selectPrompt')}</p>

               {modeOptions.map((option) => (
                    <button
                         key={option.mode}
                         onClick={() => onSelect(option.mode)}
                         className={`flex items-center gap-4 p-5 border border-gray-200 rounded-xl transition-all text-left ${option.cardClassName} ${option.mode == 'ai' && 'opacity-30 cursor-not-allowed'}`}
                         disabled={option.mode == 'ai'}
                    >
                         <Avatar
                              size={52}
                              style={{ backgroundColor: option.avatarColor, flexShrink: 0 }}
                              icon={option.icon}
                         />
                         <div>
                              <p className="font-semibold text-gray-800 mb-1">{t(option.titleKey)}</p>
                              <p className="text-xs text-gray-500 mb-0">{t(option.descriptionKey)}</p>
                         </div>
                    </button>
               ))}
          </div>
     )
}
