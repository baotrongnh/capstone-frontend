import { Button, Form, Input, Modal, ConfigProvider, message } from "antd";
import React, { useState } from "react";
import {
  UserOutlined,
  PhoneOutlined,
  FileTextOutlined,
  SendOutlined,
  CloseOutlined,
} from "@ant-design/icons";

export default function ModalUser({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    try {
      const data = await form.validateFields();
      setLoading(true);

      setTimeout(() => {
        console.log("Form Data:", data);
        setLoading(false);
        onClose();
        form.resetFields();
      }, 1500);
    } catch (error) {
      console.error("Validate Failed:", error);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#4F46E5",
          borderRadius: 8,
          controlHeight: 42,
        },
      }}
    >
      <Modal
        open={open}
        footer={null}
        onCancel={onClose}
        centered
        destroyOnClose
        width={500}
      >
        <div className="p-4">
          <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4">
            <div className="mx-auto">
              <h2 className="flex justify-center text-xl font-bold text-gray-800 m-0">
                Yêu cầu liên hệ
              </h2>
              <p className="flex justify-center text-gray-500 text-sm m-0">
                Nhập thông tin để chúng tôi hỗ trợ bạn
              </p>
            </div>
          </div>
          <Form form={form} layout="vertical" requiredMark={false}>
            <Form.Item
              name="fullName"
              label={
                <span className="font-medium text-gray-700">Họ và tên</span>
              }
              rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400 mr-2" />}
                placeholder="Ví dụ: Nguyễn Văn A"
              />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label={
                <span className="font-medium text-gray-700">Số điện thoại</span>
              }
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
                { pattern: /^[0-9]+$/, message: "Số điện thoại không hợp lệ" },
              ]}
            >
              <Input
                prefix={<PhoneOutlined className="text-gray-400 mr-2" />}
                placeholder="Ví dụ: 0912 345 678"
              />
            </Form.Item>

            <Form.Item
              name="note"
              label={<span className="font-medium text-gray-700">Ghi chú</span>}
              rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Nội dung cần hỗ trợ..."
                className="resize-none"
              />
            </Form.Item>

            <div className="flex justify-end items-center gap-3 mt-8  border-t border-gray-50">
              <Button
                type="primary"
                onClick={handleSend}
                loading={loading}
                className="  shadow-md hover:shadow-lg "
              >
                Gửi yêu cầu
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </ConfigProvider>
  );
}
