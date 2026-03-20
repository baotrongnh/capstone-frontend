'use client'

import ModalLoginRequired from '@/components/modal/modal-login-required'
import { useApartment } from '@/hooks/query/useApartments'
import { socket } from '@/socket'
import { useAuthStore } from '@/stores/auth.store'
import { CHAT_MODE_STORAGE_KEY, ChatMessage, ChatMode } from '@/types/chat'
import { CustomerServiceOutlined, RobotOutlined } from '@ant-design/icons'
import { Avatar, Divider, FloatButton, Space } from 'antd'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChatInput } from './chat-input'
import { ChatMessages } from './chat-messages'
import { ChatModeSelect } from './chat-mode-select'
import { ChatWindow } from './chat-window'

const getInitialChatMode = (): ChatMode => {
  if (typeof window === 'undefined') {
    return null
  }

  const savedMode = localStorage.getItem(CHAT_MODE_STORAGE_KEY)
  return savedMode === 'support' || savedMode === 'ai' ? savedMode : null
}

export default function ChatSupport() {
  const t = useTranslations('Chat')
  const pathname = usePathname()

  const user = useAuthStore((s) => s.user)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [mode, setMode] = useState<ChatMode>(getInitialChatMode)
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const currentApartmentId = pathname.match(/^\/apartment\/([^/]+)$/)?.[1] ?? ''
  const { data: apartmentData } = useApartment(currentApartmentId)
  const currentApartment = apartmentData?.data

  const isAiMode = mode === 'ai'
  const accentColor = isAiMode ? '#7c3aed' : '#3b82f6'
  const titleText = !mode ? t('selectTitle') : isAiMode ? t('aiTitle') : t('title')

  const pushMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message])
  }

  useEffect(() => {
    socket.on('chat:new_message', pushMessage)

    return () => {
      socket.off('chat:new_message', pushMessage)
    }
  }, [])

  const sendUserMessage = (payload: Pick<ChatMessage, 'content' | 'images' | 'apartmentId'>) => {
    const message: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      timestamp: new Date(),
      content: payload.content,
      images: payload.images,
      apartmentId: payload.apartmentId,
    }

    socket.emit('chat:send_message', message)
    pushMessage(message)

    console.log('[chat] outgoing message', {
      mode,
      message
    })
  }

  const handleModeSelect = (selectedMode: 'support' | 'ai') => {
    setMode(selectedMode)
    localStorage.setItem(CHAT_MODE_STORAGE_KEY, selectedMode)

    pushMessage({
      id: Date.now(),
      sender: 'support',
      timestamp: new Date(),
      content: selectedMode === 'ai' ? t('aiWelcome') : t('welcomeMessage'),
    })
  }

  const handleBack = () => {
    setMode(null)
    setMessages([])
    localStorage.removeItem(CHAT_MODE_STORAGE_KEY)
  }

  const handleSend = (content: string, images?: string[]) => {
    sendUserMessage({ content, images })
  }

  const handleSendApartment = () => {
    if (!currentApartment) {
      return
    }

    sendUserMessage({
      content: '',
      apartmentId: String(currentApartment.id),
    })
  }

  const title = (
    <Space>
      <Avatar
        style={{ backgroundColor: accentColor }}
        icon={mode === 'ai' ? <RobotOutlined /> : <CustomerServiceOutlined />}
      />
      <span>{titleText}</span>
    </Space>
  )

  return (
    <>
      <FloatButton
        icon={<CustomerServiceOutlined />}
        type="primary"
        style={{ right: 24, bottom: 24, width: 56, height: 56 }}
        onClick={() => (user ? setIsChatOpen(true) : setIsLoginModalOpen(true))}
        tooltip={t('supportTooltip')}
      />

      <ModalLoginRequired
        isModalOpen={isLoginModalOpen}
        setIsModalOpen={setIsLoginModalOpen}
      />

      <ChatWindow open={isChatOpen} title={title} onClose={() => setIsChatOpen(false)}>
        {!mode && <ChatModeSelect onSelect={handleModeSelect} />}

        {mode && (
          <div className="flex h-full flex-col">
            <div className="px-4 pb-1 pt-2">
              <button
                onClick={handleBack}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                &larr; {t('back')}
              </button>
            </div>

            <ChatMessages messages={messages} />
            <Divider className="my-0" />
            <ChatInput
              onSend={handleSend}
              currentApartment={currentApartment}
              onSendApartment={handleSendApartment}
            />
          </div>
        )}
      </ChatWindow>
    </>
  )
}
