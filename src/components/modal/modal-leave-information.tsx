"use client";

import {
  Button,
  Form,
  Input,
  Modal,
  ConfigProvider,
  message,
  Radio,
  FloatButton,
} from "antd";
import React, { useState } from "react";
import {
  PhoneFilled,
  MailFilled,
  EnvironmentFilled,
  TwitterOutlined,
  InstagramOutlined,
  DiscordFilled,
  MailOutlined,
} from "@ant-design/icons";
import { QueryClient } from "@tanstack/react-query";
import { useCreateViewRequest } from "@/hooks/query/useViewRequest";

export default function ModalLeaveInformation(props?: {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  apartmentId?: string | number | null;
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);

  const open = props?.open ?? internalOpen;
  const setOpen = props?.setOpen ?? setInternalOpen;
  const apartmentId = props?.apartmentId;
  const queryClient = new QueryClient();

  const { mutateAsync: createViewRequest } = useCreateViewRequest();

  const handleSend = async () => {
    const data = await form.validateFields();
    setLoading(true);

    const payload = {
      apartmentId: String(apartmentId),
      fullName: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      preferredMoveInDate: "2026-02-15",
      numberOfOccupants: 2,
      message: data.message,
      preferredContactTime: "morning",
    };

    try {
      await createViewRequest(payload);
      queryClient.invalidateQueries({ queryKey: ["viewRequests"] });
    } catch (error) {}
    setLoading(false);
    setOpen(false);
    form.resetFields();
  };

  const inputStyle =
    "border-0 border-b border-gray-300 rounded-none px-0 text-sm text-gray-700 " +
    "focus:border-blue-500 focus:shadow-none bg-transparent hover:border-b-blue-400 " +
    "placeholder:text-gray-300 transition-all duration-300";

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#3b82f6",
            fontFamily: "Inter, sans-serif",
          },
        }}
      >
        <Modal
          open={open}
          footer={null}
          onCancel={() => setOpen(false)}
          centered
          width={1000}
          closeIcon={null}
        >
          <div className="flex flex-col md:flex-row min-h-140 bg-white">
            <div className="relative w-full md:w-[45%] p-10 text-white flex flex-col justify-between bg-[#011c2b] overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center grayscale opacity-60"
                style={{
                  backgroundImage:
                    "url('https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/pass/GoogleMapTA.jpg')",
                  transform: "scale(3.5)",
                  backgroundPosition: "30% 80%",
                }}
              />

              <div className="absolute inset-0 bg-[#011c2b]/85" />
              <div className="absolute inset-0 bg-linear-to-t from-[#011c2b] via-transparent to-transparent" />

              <div className="relative z-10">
                <h2 className="text-[28px] font-semibold mb-2">
                  Thông tin liên hệ
                </h2>
                <p className="text-gray-300 text-sm mb-12">
                  Hãy để lại lời nhắn để chúng tôi hỗ trợ bạn ngay!
                </p>

                <div className="space-y-8 text-[15px]">
                  <div className="flex items-center gap-4">
                    <PhoneFilled />
                    <span className="font-light tracking-wide">
                      +84 123 456 789
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <MailFilled />
                    <span className="font-light tracking-wide">
                      demo@gmail.com
                    </span>
                  </div>
                  <div className="flex items-start gap-4">
                    <EnvironmentFilled className="mt-1" />
                    <span className="font-light leading-relaxed">
                      132 Đường Dartmouth, Boston,
                      <br />
                      Massachusetts 02156 Hoa Kỳ
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex gap-4 mt-8">
                <SocialIcon dark>
                  <TwitterOutlined />
                </SocialIcon>
                <SocialIcon light>
                  <InstagramOutlined />
                </SocialIcon>
                <SocialIcon dark>
                  <DiscordFilled />
                </SocialIcon>
              </div>
            </div>

            <div className="relative w-full md:w-[55%] p-12 bg-white">
              <button
                onClick={() => setOpen(false)}
                className="absolute top-5 right-5 text-2xl text-gray-400 hover:text-red-500"
              >
                &times;
              </button>

              <h1 className="flex justify-center text-2xl mb-5">
                CĂN HỘ THÔNG MINH
              </h1>

              <Form form={form} layout="vertical" requiredMark={false}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
                  <Form.Item
                    name="firstName"
                    label="Tên"
                    rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                  >
                    <Input className={inputStyle} placeholder="Tên" />
                  </Form.Item>

                  <Form.Item
                    name="lastName"
                    label="Họ"
                    rules={[{ required: true, message: "Vui lòng nhập họ" }]}
                  >
                    <Input placeholder="Nguyễn" className={inputStyle} />
                  </Form.Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 mt-2">
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email" },
                      { type: "email", message: "Email không hợp lệ" },
                    ]}
                  >
                    <Input
                      className={inputStyle}
                      placeholder="example@email.com"
                    />
                  </Form.Item>

                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ required: true, message: "Vui lòng nhập SĐT" }]}
                  >
                    <Input
                      placeholder="+84 912 345 678"
                      className={inputStyle}
                    />
                  </Form.Item>
                </div>

                {/* <div className="mt-6 mb-8">
                  <h4 className="text-[#011c2b] font-semibold text-sm mb-3">
                    Bạn quan tâm vấn đề gì?
                  </h4>
                  <Form.Item name="subject" initialValue="rent">
                    <Radio.Group className="flex flex-wrap gap-x-6 gap-y-2">
                      <Radio
                        value="rent"
                        className="text-xs w-50 text-gray-500"
                      >
                        Tôi muốn thuê
                      </Radio>
                      <Radio
                        value="viewing"
                        className="text-xs w-50 text-gray-500"
                      >
                        Đặt lịch xem nhà
                      </Radio>
                      <Radio
                        value="pricing"
                        className="text-xs w-50 text-gray-500"
                      >
                        Báo giá & Hợp đồng
                      </Radio>
                      <Radio
                        value="support"
                        className="text-xs w-50 text-gray-500"
                      >
                        Hỗ trợ cư dân
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </div> */}

                <Form.Item
                  name="message"
                  label="Lời nhắn"
                  rules={[
                    { required: true, message: "Vui lòng nhập nội dung" },
                  ]}
                >
                  <Input.TextArea
                    rows={1}
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    placeholder="Nhập lời nhắn của bạn..."
                    className={`${inputStyle} resize-none`}
                  />
                </Form.Item>

                <div className="flex justify-end mt-10 relative">
                  <Button
                    type="primary"
                    onClick={handleSend}
                    loading={loading}
                    className="px-10 h-10 text-sm font-medium rounded-md shadow-md hover:bg-blue-600!"
                  >
                    Gửi yêu cầu
                  </Button>

                  <div className="absolute right-8 top-4 hidden md:block pointer-events-none">
                    <PaperPlaneDecoration />
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </Modal>
      </ConfigProvider>
    </>
  );
}

const SocialIcon = ({
  children,
  dark,
  light,
}: {
  children: React.ReactNode;
  dark?: boolean;
  light?: boolean;
}) => (
  <div
    className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition
      ${
        dark
          ? "bg-[#1e3a4a] text-white hover:bg-blue-500"
          : "bg-white text-black hover:bg-gray-200"
      }`}
  >
    {children}
  </div>
);

const PaperPlaneDecoration = () => (
  <svg
    width="200"
    height="100"
    viewBox="0 0 300 150"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="opacity-50"
  >
    <path
      d="M20 120 Q 80 140, 120 100 T 220 100"
      stroke="#9ca3af"
      strokeWidth="2"
      strokeDasharray="6 6"
      fill="none"
    />
    <g transform="translate(210, 70) rotate(-20)">
      <path
        d="M45 2L22 24"
        stroke="#9ca3af"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M45 2L31 42L22 24L4 16L45 2Z"
        fill="#e5e7eb"
        stroke="#9ca3af"
        strokeWidth="2"
      />
    </g>
  </svg>
);
