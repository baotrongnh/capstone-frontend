'use client'

import { CustomerServiceOutlined, RobotOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'
import { useTranslations } from 'next-intl'

interface Props {
     onSelect: (mode: 'support' | 'ai') => void
}

export function ChatModeSelect({ onSelect }: Props) {
     const t = useTranslations('Chat')

     return (
          <div className="p-8 flex flex-col gap-4 justify-center h-full">
               <p className="text-sm text-gray-500 text-center mb-2">{t('selectPrompt')}</p>

               <button
                    onClick={() => onSelect('support')}
                    className="flex items-center gap-4 p-5 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
               >
                    <Avatar size={52} style={{ backgroundColor: '#3b82f6', flexShrink: 0 }} icon={<CustomerServiceOutlined />} />
                    <div>
                         <p className="font-semibold text-gray-800 mb-1">{t('supportOption')}</p>
                         <p className="text-xs text-gray-500 mb-0">{t('supportOptionDesc')}</p>
                    </div>
               </button>

               <button
                    onClick={() => onSelect('ai')}
                    className="flex items-center gap-4 p-5 border border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all text-left"
               >
                    <Avatar size={52} style={{ backgroundColor: '#7c3aed', flexShrink: 0 }} icon={<RobotOutlined />} />
                    <div>
                         <p className="font-semibold text-gray-800 mb-1">{t('aiOption')}</p>
                         <p className="text-xs text-gray-500 mb-0">{t('aiOptionDesc')}</p>
                    </div>
               </button>
          </div>
     )
}
