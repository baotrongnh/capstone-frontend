'use client'

import ModalLoginRequired from '@/components/modal/modal-login-required'
import { useApartment } from '@/hooks/query/useApartments'
import { chatService } from '@/lib/services/chat.service'
import { socket } from '@/lib/socket/socket'
import { useAuthStore } from '@/stores/auth.store'
import {
  CHAT_MODE_STORAGE_KEY,
  ChatConversation,
  ChatConversationDataPayload,
  ChatMessage,
  ChatMode,
  ChatSocketMessage,
  normalizeChatMessage,
} from '@/types/chat'
import { CustomerServiceOutlined, RobotOutlined } from '@ant-design/icons'
import { Avatar, Badge, Divider, FloatButton, Space } from 'antd'
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

const CHAT_NOTIFICATION_SOUND_URL = '/sounds/notification.mp3'

const toUiMessage = (message: ChatSocketMessage): ChatMessage => {
  const parsedTimestamp = new Date(message.timestamp)

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
  incomingMessage: unknown,
) => {
  const normalized = normalizeChatMessage(incomingMessage)
  if (!normalized) {
    return currentMessages
  }

  const normalizedMessage = toUiMessage(normalized)

  if (currentMessages.some((item) => String(item.id) === String(normalizedMessage.id))) {
    return currentMessages
  }

  return [...currentMessages, normalizedMessage]
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
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [unreadSupportCount, setUnreadSupportCount] = useState(0)
  const messagesRef = useRef<ChatMessage[]>([])
  const isCreatingConversationRef = useRef(false)
  const notificationAudioRef = useRef<HTMLAudioElement | null>(null)

  const currentApartmentId = pathname.match(/^\/apartment\/([^/]+)$/)?.[1] ?? ''
  const { data: apartmentData } = useApartment(currentApartmentId)
  const currentApartment = apartmentData?.data

  const resetUnreadSupport = () => setUnreadSupportCount(0)

  const pushMessage = useCallback((message: unknown) => {
    setMessages((prev) => appendUniqueMessage(prev, message))
  }, [])

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  const resetChatSession = useCallback(() => {
    if (conversationId) {
      socket.emit('chat:leave_conversation', { conversationId })
    }

    isCreatingConversationRef.current = false
    setConversationId(null)
    setIsLoadingHistory(false)
    messagesRef.current = []
    setMessages([])
  }, [conversationId])

  const requestSupportConversation = useCallback(() => {
    if (conversationId || isCreatingConversationRef.current) {
      return
    }

    isCreatingConversationRef.current = true
    setIsLoadingHistory(true)

    socket.emit('chat:create_conversation', {
      title: currentApartment
        ? `Hỗ trợ tư vấn căn hộ ${currentApartment.apartmentNumber}`
        : 'Hỗ trợ tư vấn căn hộ',
      metadata: currentApartment
        ? { apartmentId: String(currentApartment.id), pagePath: pathname }
        : { pagePath: pathname },
    })
  }, [conversationId, currentApartment, pathname])

  const handleConversationCreated = useCallback((conversation: ChatConversation) => {
    isCreatingConversationRef.current = false
    setConversationId(conversation.id)
    setIsLoadingHistory(true)
    socket.emit('chat:join_conversation', { conversationId: conversation.id })
  }, [])

  const handleConversationData = useCallback((payload: ChatConversationDataPayload) => {
    const normalizedMessages = payload.messages.data
      .map(normalizeChatMessage)
      .filter((item): item is ChatSocketMessage => Boolean(item))
      .map(toUiMessage)

    setMessages(normalizedMessages)
    messagesRef.current = normalizedMessages
    setIsLoadingHistory(false)
  }, [])

  const sendSupportMessage = useCallback((payload: Pick<ChatMessage, 'content' | 'images' | 'apartmentId'>) => {
    if (!conversationId) {
      requestSupportConversation()
      return
    }

    socket.emit('chat:send_message', {
      conversationId,
      content: payload.content,
      images: payload.images,
      apartmentId: payload.apartmentId,
      messageType: payload.images?.length ? 'image' : 'text',
    })
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

  const playIncomingMessageSound = useCallback(() => {
    if (typeof window === 'undefined') return

    if (!notificationAudioRef.current) {
      notificationAudioRef.current = new Audio(CHAT_NOTIFICATION_SOUND_URL)
      notificationAudioRef.current.preload = 'auto'
    }

    const audio = notificationAudioRef.current
    audio.currentTime = 0
    audio.play().catch(() => {
      // Ignore playback errors (e.g. missing file or autoplay restrictions).
    })
  }, [])

  const handleIncomingSocketMessage = useCallback((payload: unknown) => {
    const normalized = normalizeChatMessage(payload)
    if (!normalized) return

    const normalizedMessage = toUiMessage(normalized)

    if (messagesRef.current.some((item) => String(item.id) === String(normalizedMessage.id))) {
      return
    }

    const nextMessages = [...messagesRef.current, normalizedMessage]
    messagesRef.current = nextMessages
    setMessages(nextMessages)

    if (normalized.sender === 'support' && (!isChatOpen || mode !== 'support')) {
      setUnreadSupportCount((prev) => prev + 1)
      playIncomingMessageSound()
    }
  }, [isChatOpen, mode, playIncomingMessageSound])

  const ensureSupportConversation = useCallback(() => {
    if (!isChatOpen || mode !== 'support' || conversationId || isCreatingConversationRef.current || !socket.connected) {
      return
    }

    requestSupportConversation()
  }, [conversationId, isChatOpen, mode, requestSupportConversation])

  useEffect(() => {
    const handleConnect = () => {
      if (mode === 'support' && conversationId) {
        setIsLoadingHistory(true)
        socket.emit('chat:join_conversation', { conversationId })
        return
      }

      ensureSupportConversation()
    }

    const handleChatError = (payload: { message: string }) => {
      isCreatingConversationRef.current = false
      setIsLoadingHistory(false)
      console.error('[chat] server error', payload?.message)
    }

    socket.on('connect', handleConnect)
    socket.on('chat:error', handleChatError)
    socket.on('chat:conversation_created', handleConversationCreated)
    socket.on('chat:conversation_data', handleConversationData)
    socket.on('chat:new_message', handleIncomingSocketMessage)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('chat:error', handleChatError)
      socket.off('chat:conversation_created', handleConversationCreated)
      socket.off('chat:conversation_data', handleConversationData)
      socket.off('chat:new_message', handleIncomingSocketMessage)
    }
  }, [conversationId, ensureSupportConversation, handleConversationCreated, handleConversationData, handleIncomingSocketMessage, mode])

  const handleModeSelect = (selectedMode: 'support' | 'ai') => {
    setMode(selectedMode)
    localStorage.setItem(CHAT_MODE_STORAGE_KEY, selectedMode)

    if (selectedMode === 'support' && isChatOpen) {
      resetUnreadSupport()
    }

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

  const handleOpenChat = () => {
    if (!user) {
      setIsLoginModalOpen(true)
      return
    }

    setIsChatOpen(true)
    resetUnreadSupport()

    if (mode === 'support' && socket.connected && !conversationId && !isCreatingConversationRef.current) {
      requestSupportConversation()
    }
  }

  const handleBack = () => {
    setMode(null)
    resetChatSession()
    localStorage.removeItem(CHAT_MODE_STORAGE_KEY)
  }

  const handleSend = async (content: string, files?: File[]) => {
    const uploadedImages = files?.length ? await chatService.uploadImages(files) : undefined
    sendUserMessage({ content, images: uploadedImages })
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
        style={{ backgroundColor: mode === 'ai' ? '#7c3aed' : '#3b82f6' }}
        icon={mode === 'ai' ? <RobotOutlined /> : <CustomerServiceOutlined />}
      />
      <span>{!mode ? t('selectTitle') : mode === 'ai' ? t('aiTitle') : t('title')}</span>
    </Space>
  )

  return (
    <>
      <FloatButton
        icon={(
          <Badge count={unreadSupportCount} size="small" overflowCount={99}>
            <CustomerServiceOutlined />
          </Badge>
        )}
        type="primary"
        style={{ right: 24, bottom: 24, width: 56, height: 56 }}
        onClick={handleOpenChat}
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

            <ChatMessages messages={messages} isLoading={isLoadingHistory} />
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
