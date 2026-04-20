import type { paths } from '@/types/api'

export type ChatSender = 'user' | 'support'
export type ChatMessageType = 'text' | 'image' | 'file'

export type ChatConversationListQuery = NonNullable<
     paths['/api/v1/chat/conversations']['get']['parameters']['query']
>

export type ChatConversationListResponse =
     paths['/api/v1/chat/conversations']['get']['responses']['200']['content']['application/json']

export type ChatConversation = ChatConversationListResponse['data'][number]

export type ChatConversationDetailResponse =
     paths['/api/v1/chat/conversations/{id}']['get']['responses']['200']['content']['application/json']

export type ChatConversationMessagesQuery = NonNullable<
     paths['/api/v1/chat/conversations/{id}/messages']['get']['parameters']['query']
>

export type ChatConversationMessagesResponse =
     paths['/api/v1/chat/conversations/{id}/messages']['get']['responses']['200']['content']['application/json']

export type ChatConversationMessageFromApi = ChatConversationMessagesResponse['data'][number]

type ChatCreateConversationRequestFromApi =
     paths['/api/v1/chat/conversations']['post']['requestBody']['content']['application/json']

export type ChatCreateConversationPayload = Omit<ChatCreateConversationRequestFromApi, 'metadata'> & {
     metadata?: Record<string, unknown>
}

export type ChatUploadImagesResponse =
     paths['/api/v1/chat/upload-images']['post']['responses']['201']['content']['application/json']

export interface ChatSocketMessage {
     id: string | number
     content: string
     images?: string[]
     apartmentId?: string
     sender: ChatSender
     timestamp: string
     conversationId?: string
}

export type ChatMessageDto = ChatSocketMessage

export interface ChatMessage {
     id: string | number
     content: string
     images?: string[]
     apartmentId?: string
     sender: ChatSender
     timestamp: Date
}

export interface ChatSendMessagePayload {
     conversationId: string
     content: string
     images?: string[]
     apartmentId?: string
     messageType?: ChatMessageType
     attachments?: Array<{
          url: string
          filename: string
          mimeType?: string
          size?: number
     }>
}

export interface ChatConversationDataPayload {
     conversation: ChatConversationDetailResponse
     messages: {
          data: ChatSocketMessage[]
          meta?: Record<string, unknown>
     }
}

export interface ChatApartmentRef {
     id: string | number
     buildingName?: string | null
     apartmentNumber: string
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
     return typeof value === 'object' && value !== null
}

export const normalizeChatMessage = (raw: unknown): ChatSocketMessage | null => {
     if (!isRecord(raw)) {
          return null
     }

     const sender = raw.sender === 'support' ? 'support' : 'user'
     const id = typeof raw.id === 'string' || typeof raw.id === 'number' ? raw.id : Date.now()
     const content =
          typeof raw.content === 'string'
               ? raw.content
               : typeof raw.message === 'string'
                    ? raw.message
                    : ''

     const apartmentId = typeof raw.apartmentId === 'string' ? raw.apartmentId : undefined
     const hasImages = Array.isArray(raw.images) && raw.images.length > 0

     if (!content.trim() && !apartmentId && !hasImages) {
          return null
     }

     return {
          id,
          content,
          images: Array.isArray(raw.images)
               ? raw.images.filter((image): image is string => typeof image === 'string')
               : undefined,
          apartmentId,
          sender,
          timestamp:
               typeof raw.timestamp === 'string'
                    ? raw.timestamp
                    : new Date().toISOString(),
          conversationId:
               typeof raw.conversationId === 'string' ? raw.conversationId : undefined,
     }
}
