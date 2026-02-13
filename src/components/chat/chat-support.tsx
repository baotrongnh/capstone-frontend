'use client'

import { CloseOutlined, CustomerServiceOutlined, SendOutlined } from '@ant-design/icons'
import { Avatar, Button, Divider, FloatButton, Input, Modal, Space } from 'antd'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

const { TextArea } = Input

interface Message {
     id: number
     content: string
     sender: 'user' | 'support'
     timestamp: Date
}

export default function ChatSupport() {
     const t = useTranslations('Chat')
     const [open, setOpen] = useState(false)
     const [message, setMessage] = useState('')
     const [messages, setMessages] = useState<Message[]>([
          {
               id: 1,
               content: t('welcomeMessage'),
               sender: 'support',
               timestamp: new Date()
          }
     ])

     const handleSendMessage = () => {
          if (!message.trim()) return

          // Add user message
          const userMessage: Message = {
               id: messages.length + 1,
               content: message,
               sender: 'user',
               timestamp: new Date()
          }

          setMessages([...messages, userMessage])
          setMessage('')

          // Simulate support response
          setTimeout(() => {
               const supportMessage: Message = {
                    id: messages.length + 2,
                    content: t('autoReply'),
                    sender: 'support',
                    timestamp: new Date()
               }
               setMessages(prev => [...prev, supportMessage])
          }, 1000)
     }

     const handleKeyPress = (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' && !e.shiftKey) {
               e.preventDefault()
               handleSendMessage()
          }
     }

     return (
          <>
               <FloatButton
                    icon={<CustomerServiceOutlined />}
                    type="primary"
                    style={{
                         right: 24,
                         bottom: 24,
                         width: 56,
                         height: 56
                    }}
                    onClick={() => setOpen(true)}
                    tooltip={<div>{t('supportTooltip')}</div>}
               />

               <Modal
                    title={
                         <Space>
                              <Avatar
                                   style={{ backgroundColor: '#3b82f6' }}
                                   icon={<CustomerServiceOutlined />}
                              />
                              <span>{t('title')}</span>
                         </Space>
                    }
                    open={open}
                    onCancel={() => setOpen(false)}
                    footer={null}
                    width={400}
                    style={{
                         position: 'fixed',
                         bottom: 100,
                         right: 24,
                         top: 'auto',
                         margin: 0
                    }}
                    styles={{
                         body: {
                              padding: 0,
                              maxHeight: '400px',
                              display: 'flex',
                              flexDirection: 'column'
                         }
                    }}
                    closeIcon={<CloseOutlined />}
               >
                    <div className="flex flex-col h-full">
                         {/* Messages Area */}
                         <div className="flex-1 overflow-y-auto p-3" style={{ maxHeight: '400px' }}>
                              {messages.map((item) => (
                                   <div
                                        key={item.id}
                                        className={`mb-3 flex ${item.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                   >
                                        <div
                                             className={`max-w-[80%] px-3 py-2 rounded-lg ${item.sender === 'user'
                                                  ? 'bg-primary text-white'
                                                  : 'bg-gray-100 text-gray-800'
                                                  }`}
                                        >
                                             <p className="text-sm mb-0">{item.content}</p>
                                             <p className={`text-xs mt-1 mb-0 ${item.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                                                  }`}>
                                                  {item.timestamp.toLocaleTimeString('vi-VN', {
                                                       hour: '2-digit',
                                                       minute: '2-digit'
                                                  })}
                                             </p>
                                        </div>
                                   </div>
                              ))}
                         </div>

                         <Divider className="my-0" />

                         {/* Input Area */}
                         <div className="p-1">
                              <div className="flex gap-2 w-full">
                                   <TextArea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder={t('inputPlaceholder')}
                                        autoSize={{ minRows: 1, maxRows: 3 }}
                                        className="flex-1"
                                   />
                                   <Button
                                        type="primary"
                                        icon={<SendOutlined />}
                                        onClick={handleSendMessage}
                                        disabled={!message.trim()}
                                   >
                                        {t('send')}
                                   </Button>
                              </div>
                              <p className="text-xs text-gray-500 mt-2 mb-0">
                                   {t('responseTime')}
                              </p>
                         </div>
                    </div>
               </Modal>
          </>
     )
}
