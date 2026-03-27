'use client'

import { SendOutlined } from '@ant-design/icons'
import type { ChatApartmentRef } from '@/types/chat'
import { Icon } from '@iconify/react'
import { Button, Input } from 'antd'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react'

const { TextArea } = Input
const MAX_PENDING_IMAGES = 5

type PendingImage = { file: File; previewUrl: string }

interface Props {
     onSend: (content: string, images?: File[]) => Promise<void> | void
     currentApartment?: ChatApartmentRef
     onSendApartment: () => void
     disabled?: boolean
}

export function ChatInput({ onSend, currentApartment, onSendApartment, disabled = false }: Props) {
     const t = useTranslations('Chat')
     const [message, setMessage] = useState('')
     const [pendingImages, setPendingImages] = useState<PendingImage[]>([])
     const [isSending, setIsSending] = useState(false)
     const pendingImagesRef = useRef<PendingImage[]>([])

     const canSend = !disabled && !isSending && (message.trim().length > 0 || pendingImages.length > 0)

     useEffect(() => {
          pendingImagesRef.current = pendingImages
     }, [pendingImages])

     useEffect(() => {
          return () => {
               pendingImagesRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl))
          }
     }, [])

     async function handleSend() {
          const text = message.trim()
          if (!text && pendingImages.length === 0) return

          setIsSending(true)

          try {
               await onSend(
                    text,
                    pendingImages.length > 0 ? pendingImages.map((item) => item.file) : undefined,
               )

               pendingImages.forEach((item) => URL.revokeObjectURL(item.previewUrl))
               setMessage('')
               setPendingImages([])
          } finally {
               setIsSending(false)
          }
     }

     function handlePressEnter(e: KeyboardEvent<HTMLTextAreaElement>) {
          if (e.key === 'Enter' && !e.shiftKey) {
               e.preventDefault()
               handleSend()
          }
     }

     async function handlePaste(e: ClipboardEvent<HTMLTextAreaElement>) {
          const imageItems = Array.from(e.clipboardData.items).filter((item) => item.type.startsWith('image/'))

          if (imageItems.length === 0) return

          e.preventDefault()

          const files = imageItems
               .map((item) => item.getAsFile())
               .filter((file): file is File => Boolean(file))

          if (files.length === 0) return

          setPendingImages((prev) => {
               if (prev.length >= MAX_PENDING_IMAGES) {
                    return prev
               }

               const availableSlots = MAX_PENDING_IMAGES - prev.length
               const accepted = files.slice(0, availableSlots).map((file) => ({
                    file,
                    previewUrl: URL.createObjectURL(file),
               }))

               return [...prev, ...accepted]
          })
     }

     function removePendingImage(index: number) {
          setPendingImages((prev) => {
               const target = prev[index]
               if (target) {
                    URL.revokeObjectURL(target.previewUrl)
               }
               return prev.filter((_, itemIndex) => itemIndex !== index)
          })
     }

     return (
          <div className="p-3 flex flex-col gap-2">
               {pendingImages.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                         {pendingImages.map((item, index) => (
                              <div key={`${item.previewUrl}-${index}`} className="relative">
                                   <Image src={item.previewUrl} alt="preview" width={64} height={64} unoptimized className="h-16 w-16 object-cover rounded border" />
                                   <button
                                        onClick={() => removePendingImage(index)}
                                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center leading-none"
                                   >×</button>
                              </div>
                         ))}
                    </div>
               )}

               {currentApartment && (
                    <button
                         onClick={onSendApartment}
                         className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 self-start px-2 py-1 rounded-md border border-blue-200 hover:bg-blue-50 transition-all"
                    >
                         <Icon icon="lucide:home" width={13} />
                         {t('sendApartment')}: {currentApartment.buildingName ?? ''} - {currentApartment.apartmentNumber}
                    </button>
               )}

               <div className="flex gap-2">
                    <TextArea
                         value={message}
                         onChange={(e) => setMessage(e.target.value)}
                         onPressEnter={handlePressEnter}
                         onPaste={handlePaste}
                         placeholder={t('inputPlaceholder')}
                         autoSize={{ minRows: 1, maxRows: 4 }}
                         className="flex-1"
                         disabled={disabled || isSending}
                    />
                    <Button
                         type="primary"
                         icon={<SendOutlined />}
                         onClick={handleSend}
                         disabled={!canSend}
                         loading={isSending}
                    >
                         {t('send')}
                    </Button>
               </div>

               <p className="text-xs text-gray-400 mb-0">{t('pasteImageHint')}</p>
          </div>
     )
}
