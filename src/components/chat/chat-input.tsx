'use client'

import { SendOutlined } from '@ant-design/icons'
import type { ChatApartmentRef } from '@/types/chat'
import { Icon } from '@iconify/react'
import { Button, Input } from 'antd'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState, type ClipboardEvent, type KeyboardEvent } from 'react'

const { TextArea } = Input

function fileToDataUrl(file: File): Promise<string> {
     return new Promise((resolve, reject) => {
          const reader = new FileReader()

          reader.onload = () => {
               if (typeof reader.result === 'string') {
                    resolve(reader.result)
                    return
               }

               reject(new Error('Failed to read image data'))
          }

          reader.onerror = () => reject(reader.error ?? new Error('Failed to read image data'))
          reader.readAsDataURL(file)
     })
}

interface Props {
     onSend: (content: string, images?: string[]) => void
     currentApartment?: ChatApartmentRef
     onSendApartment: () => void
     disabled?: boolean
}

export function ChatInput({ onSend, currentApartment, onSendApartment, disabled = false }: Props) {
     const t = useTranslations('Chat')
     const [message, setMessage] = useState('')
     const [pendingImages, setPendingImages] = useState<string[]>([])

     const canSend = !disabled && (message.trim().length > 0 || pendingImages.length > 0)

     function handleSend() {
          const text = message.trim()
          if (!text && pendingImages.length === 0) return

          onSend(text, pendingImages.length > 0 ? pendingImages : undefined)
          setMessage('')
          setPendingImages([])
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

          const results = await Promise.allSettled(files.map(fileToDataUrl))
          const nextImages = results
               .filter((result): result is PromiseFulfilledResult<string> => result.status === 'fulfilled')
               .map((result) => result.value)

          if (nextImages.length === 0) return

          setPendingImages((prev) => [...prev, ...nextImages])
     }

     function removePendingImage(index: number) {
          setPendingImages((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
     }

     return (
          <div className="p-3 flex flex-col gap-2">
               {pendingImages.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                         {pendingImages.map((src, index) => (
                              <div key={`${src}-${index}`} className="relative">
                                   <Image src={src} alt="preview" width={64} height={64} unoptimized className="h-16 w-16 object-cover rounded border" />
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
                         disabled={disabled}
                    />
                    <Button
                         type="primary"
                         icon={<SendOutlined />}
                         onClick={handleSend}
                         disabled={!canSend}
                    >
                         {t('send')}
                    </Button>
               </div>

               <p className="text-xs text-gray-400 mb-0">{t('pasteImageHint')}</p>
          </div>
     )
}
