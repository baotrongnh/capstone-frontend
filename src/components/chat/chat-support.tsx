"use client";

import { CustomerServiceOutlined, RobotOutlined } from '@ant-design/icons'
import { useApartment } from '@/hooks/query/useApartments'
import { useAuthStore } from '@/stores/auth.store'
import { Avatar, Divider, FloatButton, Space } from 'antd'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import ModalLoginRequired from '@/components/modal/modalLoginRequired'
import { ChatInput } from './chat-input'
import { ChatMessages } from './chat-messages'
import { ChatModeSelect } from './chat-mode-select'
import { ChatWindow } from './chat-window'
import { ChatMode, ChatMessage, STORAGE_KEY } from '@/types/chat'

export default function ChatSupport() {
  const t = useTranslations("Chat");
  const pathname = usePathname();

     const user = useAuthStore(s => s.user)
     const [loginModalOpen, setLoginModalOpen] = useState(false)
     const [open, setOpen] = useState(false)
     const [mode, setMode] = useState<ChatMode>(() =>
          typeof window !== 'undefined' ? (localStorage.getItem(STORAGE_KEY) as ChatMode) ?? null : null
     )
     const [messages, setMessages] = useState<ChatMessage[]>([])

  // Detect current apartment page
  const apartmentIdMatch = pathname.match(/^\/apartment\/([^/]+)$/);
  const currentApartmentId = apartmentIdMatch?.[1] ?? "";
  const { data: aptData } = useApartment(currentApartmentId);
  const currentApartment = aptData?.data;

  const accentColor = mode === "ai" ? "#7c3aed" : "#3b82f6";

  function pushMessage(msg: ChatMessage) {
    setMessages((prev) => [...prev, msg]);
  }

  function autoReply(content: string) {
    setTimeout(
      () =>
        pushMessage({
          id: Date.now(),
          content,
          sender: "support",
          timestamp: new Date(),
        }),
      1000,
    );
  }

  function selectMode(selected: "support" | "ai") {
    setMode(selected);
    localStorage.setItem(STORAGE_KEY, selected);
    pushMessage({
      id: Date.now(),
      content: selected === "ai" ? t("aiWelcome") : t("welcomeMessage"),
      sender: "support",
      timestamp: new Date(),
    });
  }

  function handleBack() {
    setMode(null);
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  function handleSend(content: string, images?: string[]) {
    pushMessage({
      id: Date.now(),
      content,
      images,
      sender: "user",
      timestamp: new Date(),
    });
    autoReply(mode === "ai" ? t("aiReply") : t("autoReply"));
  }

  function handleSendApartment() {
    if (!currentApartment) return;
    pushMessage({
      id: Date.now(),
      content: "",
      apartmentId: String(currentApartment.id),
      sender: "user",
      timestamp: new Date(),
    });
    autoReply(t("autoReply"));
  }

  const title = (
    <Space>
      <Avatar
        style={{ backgroundColor: accentColor }}
        icon={mode === "ai" ? <RobotOutlined /> : <CustomerServiceOutlined />}
      />
      <span>
        {mode === "ai"
          ? t("aiTitle")
          : mode === "support"
            ? t("title")
            : t("selectTitle")}
      </span>
    </Space>
  );

     return (
          <>
               <FloatButton
                    icon={<CustomerServiceOutlined />}
                    type="primary"
                    style={{ right: 24, bottom: 24, width: 56, height: 56 }}
                    onClick={() => user ? setOpen(true) : setLoginModalOpen(true)}
                    tooltip={t('supportTooltip')}
               />

               <ModalLoginRequired
                    isModalOpen={loginModalOpen}
                    setIsModalOpen={setLoginModalOpen}
               />

               <ChatWindow open={open} title={title} onClose={() => setOpen(false)}>
                    {!mode && <ChatModeSelect onSelect={selectMode} />}

        {mode && (
          <div className="flex flex-col h-full">
            <div className="px-4 pt-2 pb-1">
              <button
                onClick={handleBack}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                &larr; {t("back")}
              </button>
            </div>
            <ChatMessages messages={messages} />
            <Divider className="my-0" />
            <ChatInput
              onSend={handleSend}
              currentApartment={currentApartment}
              onSendApartment={handleSendApartment}
              accentColor={accentColor}
            />
          </div>
        )}
      </ChatWindow>
    </>
  );
}
