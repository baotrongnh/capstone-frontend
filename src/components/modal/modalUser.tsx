import { Button, Form, Input, Modal } from "antd";
import React from "react";

export default function ModalUser({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form] = Form.useForm();

  const handleSend = async () => {
    const data = await form.validateFields();
    console.log("first", data);
  };

  return (
    <Modal open={open} footer={null} onOk={() => {}} onCancel={onClose}>
      <div className="w-[80%] mx-auto">
        <h1 className="text-center text-3xl font-medium">Yêu cầu liên hệ</h1>
        <p className="text-muted flex justify-center mt-2 mb-2">
          Điền thông tin của bạn
        </p>

        <Form form={form} layout="vertical" className="space-y-4 mt-4">
          <Form.Item
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
          >
            <Input className="h-10" placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input className="h-10" placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="note"
            rules={[{ required: true, message: "Vui lòng nhập ghi chú" }]}
          >
            <Input.TextArea
              className="h-10"
              rows={4}
              placeholder="Nhập ghi chú"
            />
          </Form.Item>
          <Button onClick={handleSend} className="w-full mt-4">
            Gửi yêu cầu
          </Button>
        </Form>
      </div>
    </Modal>
  );
}
