"use client"

import { ChatMessage } from "@/types/chat"
import { formatTime } from "@/utils/format"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { ApartmentCardMessage } from "./apartment-card-message"

export function ChatMessages({ messages }: { messages: ChatMessage[] }) {
  const endRef = useRef<HTMLDivElement>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  useEffect(() => {
    const animationId = requestAnimationFrame(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth" })
    })

    return () => cancelAnimationFrame(animationId)
  }, [messages.length])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2">
      {messages.map((item) => (
        <div
          key={item.id}
          className={`mb-3 flex ${item.sender === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={
              `max-w-[80%] px-3 py-2 rounded-lg
              ${item.sender === "user" ? "bg-primary text-white" : "bg-gray-100 text-gray-800"}`
            }
          >
            {item.apartmentId && <ApartmentCardMessage apartmentId={item.apartmentId} />}
            {item.content && <p className="text-sm mb-1 whitespace-pre-wrap">{item.content}</p>}

            {item.images?.map((src, i) => (
              <button
                key={`${item.id}-${i}`}
                type="button"
                onClick={() => setPreviewImage(src)}
                className="mt-1 block"
              >
                <Image
                  src={src}
                  alt="attachment"
                  width={400}
                  height={200}
                  unoptimized
                  className="max-w-full rounded max-h-48 object-contain cursor-zoom-in"
                />
              </button>
            ))}

            <p className={`text-xs mt-1 mb-0 ${item.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
              {formatTime(item.timestamp)}
            </p>
          </div>
        </div>
      ))}
      <div ref={endRef} />

      {previewImage && (
        <button
          type="button"
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/80 p-4"
          aria-label="Close image preview"
        >
          <div className="relative h-full w-full">
            <Image
              src={previewImage}
              alt="image preview"
              fill
              unoptimized
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </button>
      )}
    </div>
  )
}
