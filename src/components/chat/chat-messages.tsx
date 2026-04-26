"use client"

import { ChatMessage } from "@/types/chat"
import { formatTime } from "@/utils/format"
import { useEffect, useRef, useState } from "react"
import { ApartmentCardMessage } from "./apartment-card-message"
import { ChatImageGrid, ChatImageLightbox } from "./chat-image"

interface ChatMessagesProps {
  messages: ChatMessage[]
  isLoading?: boolean
}

export function ChatMessages({ messages, isLoading = false }: ChatMessagesProps) {
  const endRef = useRef<HTMLDivElement>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  useEffect(() => {
    if (isLoading) return

    const animationId = requestAnimationFrame(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth" })
    })

    return () => cancelAnimationFrame(animationId)
  }, [isLoading, messages.length])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2">
      {isLoading && (
        <div className="space-y-3 py-1">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className={`flex ${item % 2 === 0 ? "justify-end" : "justify-start"}`}>
              <div className="h-16 w-52 animate-pulse rounded-lg bg-gray-200" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && messages.length === 0 && (
        <p className="py-2 text-sm text-gray-500">Chưa có tin nhắn</p>
      )}

      {!isLoading && messages.map((item) => (
        <div
          key={item.id}
          className={`mb-4 flex ${item.sender === "user" ? "justify-end" : "justify-start"}`}
        >
          <div className="max-w-[82%]">
            {item.apartmentId && <ApartmentCardMessage apartmentId={item.apartmentId} />}

            {item.content && (
              <div
                className={`rounded-2xl px-3 py-2 ${
                  item.sender === "user" ? "bg-primary text-white" : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{item.content}</p>
              </div>
            )}

            <ChatImageGrid images={item.images ?? []} onPreview={setPreviewImage} />

            <p
              className={`mt-1 mb-0 px-1 text-xs ${
                item.sender === "user" ? "text-right text-gray-400" : "text-gray-500"
              }`}
            >
              {formatTime(item.timestamp)}
            </p>
          </div>
        </div>
      ))}

      <div ref={endRef} />

      <ChatImageLightbox image={previewImage} onClose={() => setPreviewImage(null)} />
    </div>
  )
}
