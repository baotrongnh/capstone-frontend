'use client'

import ModalLoginRequired from '@/components/modal/modal-login-required'
import { useApartment } from '@/hooks/query/useApartments'
import { socket } from '@/lib/socket/socket'
import { useAuthStore } from '@/stores/auth.store'
import {
  CHAT_MODE_STORAGE_KEY,
  ChatConversation,
  ChatConversationDataPayload,
  ChatMessage,
  ChatMessageDto,
  ChatMode,
  ChatSendMessagePayload,
} from '@/types/chat'
import { CustomerServiceOutlined, RobotOutlined } from '@ant-design/icons'
import { Avatar, Divider, FloatButton, Space } from 'antd'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
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

const normalizeMessage = (message: ChatMessageDto | ChatMessage): ChatMessage => {
  const parsedTimestamp =
    message.timestamp instanceof Date
      ? message.timestamp
      : new Date(message.timestamp)

  return {
    id: message.id,
    content: message.content ?? '',
    images: message.images,
    apartmentId: message.apartmentId,
    sender: message.sender,
    timestamp: Number.isNaN(parsedTimestamp.getTime()) ? new Date() : parsedTimestamp,
  }
}

const appendUniqueMessage = (
  currentMessages: ChatMessage[],
  incomingMessage: ChatMessageDto | ChatMessage,
) => {
  const normalized = normalizeMessage(incomingMessage)

  if (currentMessages.some((item) => String(item.id) === String(normalized.id))) {
    return currentMessages
  }

  return [...currentMessages, normalized]
}

export default function ChatSupport() {
  const t = useTranslations('Chat')
  const pathname = usePathname()

  const user = useAuthStore((s) => s.user)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [mode, setMode] = useState<ChatMode>(getInitialChatMode)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [conversationId, setConversationId] = useState<string | null>(null)
  const isCreatingConversationRef = useRef(false)

  const currentApartmentId = pathname.match(/^\/apartment\/([^/]+)$/)?.[1] ?? ''
  const { data: apartmentData } = useApartment(currentApartmentId)
  const currentApartment = apartmentData?.data

  const isAiMode = mode === 'ai'
  const accentColor = isAiMode ? '#7c3aed' : '#3b82f6'
  const titleText = !mode ? t('selectTitle') : isAiMode ? t('aiTitle') : t('title')

  const pushMessage = useCallback((message: ChatMessageDto | ChatMessage) => {
    setMessages((prev) => appendUniqueMessage(prev, message))
  }, [])

  const resetChatSession = useCallback(() => {
    if (conversationId) {
      socket.emit('chat:leave_conversation', { conversationId })
    }

    isCreatingConversationRef.current = false
    setConversationId(null)
    setMessages([])
  }, [conversationId])

  const requestSupportConversation = useCallback(() => {
    if (conversationId || isCreatingConversationRef.current) {
      return
    }

    isCreatingConversationRef.current = true

    socket.emit('chat:create_conversation', {
      title: currentApartment
        ? `Ho tro can ho ${currentApartment.apartmentNumber}`
        : 'Hoi dap tu van can ho',
      metadata: currentApartment
        ? { apartmentId: String(currentApartment.id), pagePath: pathname }
        : { pagePath: pathname },
    })
  }, [conversationId, currentApartment, pathname])

  const handleConversationCreated = useCallback((conversation: ChatConversation) => {
    isCreatingConversationRef.current = false
    setConversationId(conversation.id)
    socket.emit('chat:join_conversation', { conversationId: conversation.id })
  }, [])

  const handleConversationData = useCallback((payload: ChatConversationDataPayload) => {
    setMessages(payload.messages.data.map(normalizeMessage))
  }, [])

  const sendSupportMessage = useCallback((payload: Pick<ChatMessage, 'content' | 'images' | 'apartmentId'>) => {
    if (!conversationId) {
      console.warn('[chat] conversation is not ready, creating a new one')
      requestSupportConversation()
      return
    }

    const socketPayload: ChatSendMessagePayload = {
      conversationId,
      content: payload.content,
      images: payload.images,
      apartmentId: payload.apartmentId,
      messageType: payload.images?.length ? 'image' : 'text',
    }

    socket.emit('chat:send_message', socketPayload)
  }, [conversationId, requestSupportConversation])

  const sendUserMessage = useCallback((payload: Pick<ChatMessage, 'content' | 'images' | 'apartmentId'>) => {
    if (mode === 'support') {
      sendSupportMessage(payload)
      return
    }

    pushMessage({
      id: Date.now(),
      sender: 'user',
      timestamp: new Date(),
      content: payload.content,
      images: payload.images,
      apartmentId: payload.apartmentId,
    })
  }, [mode, pushMessage, sendSupportMessage])

  const canSendSupportMessage = mode !== 'support' || Boolean(conversationId)

  useEffect(() => {
    const handleConnect = () => {
      console.info('[chat] connected', { socketId: socket.id })

      if (mode === 'support' && conversationId) {
        socket.emit('chat:join_conversation', { conversationId })
      }
    }

    const handleDisconnect = (reason: string) => {
      console.info('[chat] disconnected', { reason })
    }

    const handleChatError = (payload: { message: string }) => {
      isCreatingConversationRef.current = false
      console.error('[chat] server error', payload)
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('chat:error', handleChatError)
    socket.on('chat:conversation_created', handleConversationCreated)
    socket.on('chat:conversation_data', handleConversationData)
    socket.on('chat:new_message', pushMessage)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('chat:error', handleChatError)
      socket.off('chat:conversation_created', handleConversationCreated)
      socket.off('chat:conversation_data', handleConversationData)
      socket.off('chat:new_message', pushMessage)
    }
  }, [conversationId, handleConversationCreated, handleConversationData, mode, pushMessage])

  useEffect(() => {
    if (!isChatOpen || mode !== 'support' || conversationId || isCreatingConversationRef.current || !socket.connected) {
      return
    }

    requestSupportConversation()
  }, [conversationId, isChatOpen, mode, requestSupportConversation])

  const handleModeSelect = (selectedMode: 'support' | 'ai') => {
    setMode(selectedMode)
    localStorage.setItem(CHAT_MODE_STORAGE_KEY, selectedMode)

    pushMessage({
      id: `welcome-${selectedMode}-${Date.now()}`,
      sender: 'support',
      timestamp: new Date(),
      content: selectedMode === 'support' ? t('welcomeMessage') : t('aiWelcome'),
    })

    if (selectedMode === 'support' && socket.connected && !conversationId) {
      requestSupportConversation()
    }
  }

  const handleBack = () => {
    setMode(null)
    resetChatSession()
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
              disabled={mode === 'support' && !canSendSupportMessage}
            />
          </div>
        )}
      </ChatWindow>
    </>
  )
}
