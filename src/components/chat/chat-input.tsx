'use client'

import { SendOutlined } from '@ant-design/icons'
import { Icon } from '@iconify/react'
import { Button, Input } from 'antd'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'
import { ChatApartmentRef } from '@/types/chat'

const { TextArea } = Input

interface Props {
     onSend: (content: string, images?: string[]) => void
     currentApartment?: ChatApartmentRef
     onSendApartment: () => void
     accentColor: string
}

export function ChatInput({ onSend, currentApartment, onSendApartment, accentColor }: Props) {
     const t = useTranslations('Chat')
     const [message, setMessage] = useState('')
     const [pendingImages, setPendingImages] = useState<string[]>([])

     function handleSend() {
          if (!message.trim() && pendingImages.length === 0) return
          onSend(message, pendingImages.length > 0 ? pendingImages : undefined)
          setMessage('')
          setPendingImages([])
     }

     function handleKeyPress(e: React.KeyboardEvent) {
          if (e.key === 'Enter' && !e.shiftKey) {
               e.preventDefault()
               handleSend()
          }
     }

     function handlePaste(e: React.ClipboardEvent) {
          const imageItems = Array.from(e.clipboardData.items).filter(i => i.type.startsWith('image/'))
          if (imageItems.length === 0) return
          e.preventDefault()
          imageItems.forEach(item => {
               const file = item.getAsFile()
               if (!file) return
               const reader = new FileReader()
               reader.onload = (ev) => setPendingImages(prev => [...prev, ev.target?.result as string])
               reader.readAsDataURL(file)
          })
     }

     return (
          <div className="p-3 flex flex-col gap-2">
               {pendingImages.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                         {pendingImages.map((src, i) => (
                              <div key={i} className="relative">
                                   <Image src={src} alt="preview" width={64} height={64} unoptimized className="h-16 w-16 object-cover rounded border" />
                                   <button
                                        onClick={() => setPendingImages(prev => prev.filter((_, idx) => idx !== i))}
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
                         onKeyPress={handleKeyPress}
                         onPaste={handlePaste}
                         placeholder={t('inputPlaceholder')}
                         autoSize={{ minRows: 1, maxRows: 4 }}
                         className="flex-1"
                    />
                    <Button
                         type="primary"
                         icon={<SendOutlined />}
                         onClick={handleSend}
                         disabled={!message.trim() && pendingImages.length === 0}
                         style={{ backgroundColor: accentColor, borderColor: accentColor }}
                    >
                         {t('send')}
                    </Button>
               </div>

               <p className="text-xs text-gray-400 mb-0">{t('pasteImageHint')}</p>
          </div>
     )
}
