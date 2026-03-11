"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ApartmentCardMessage } from "./apartment-card-message";
import { ChatMessage } from "@/types/chat";

interface Props {
  messages: ChatMessage[];
}

export function ChatMessages({ messages }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(
      () => endRef.current?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2">
      {messages.map((item) => (
        <div
          key={item.id}
          className={`mb-3 flex ${item.sender === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[80%] px-3 py-2 rounded-lg ${item.sender === "user" ? "bg-primary text-white" : "bg-gray-100 text-gray-800"}`}
          >
            {item.apartmentId && (
              <ApartmentCardMessage apartmentId={item.apartmentId} />
            )}
            {item.content && (
              <p className="text-sm mb-1 whitespace-pre-wrap">{item.content}</p>
            )}
            {item.images?.map((src, i) => (
              <Image
                key={i}
                src={src}
                alt="attachment"
                width={400}
                height={200}
                unoptimized
                className="max-w-full rounded mt-1 max-h-48 object-contain"
              />
            ))}
            <p
              className={`text-xs mt-1 mb-0 ${item.sender === "user" ? "text-blue-100" : "text-gray-500"}`}
            >
              {item.timestamp.toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
