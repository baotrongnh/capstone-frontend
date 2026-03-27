import type { ChatUploadImagesResponse } from '@/types/chat'
import { apiClient } from '../apis/client'
import { endpoints } from '../apis/endpoints'

const getImagesFromUploadResponse = (payload: unknown): string[] => {
     if (!payload || typeof payload !== 'object') {
          return []
     }

     const raw = payload as { images?: unknown; data?: { images?: unknown } }

     if (Array.isArray(raw.images)) {
          return raw.images.filter((item): item is string => typeof item === 'string')
     }

     if (raw.data && Array.isArray(raw.data.images)) {
          return raw.data.images.filter((item): item is string => typeof item === 'string')
     }

     return []
}

export const chatService = {
     uploadImages: async (files: File[]): Promise<string[]> => {
          if (files.length === 0) {
               return []
          }

          const formData = new FormData()
          files.slice(0, 5).forEach((file) => {
               formData.append('images', file)
          })

          const { data } = await apiClient.post<ChatUploadImagesResponse>(
               `${endpoints.chat}/upload-images`,
               formData,
               {
                    headers: { 'Content-Type': 'multipart/form-data' },
               },
          )

          return getImagesFromUploadResponse(data)
     },
}
