export type ChatMode = 'support' | 'ai' | null

export const STORAGE_KEY = 'chat_mode'

export interface ChatMessage {
     id: number
     content: string
     images?: string[]
     apartmentId?: string
     sender: 'user' | 'support'
     timestamp: Date
}

export interface ChatApartmentRef {
     id: string | number
     buildingName?: string | null
     apartmentNumber: string
}
