"use client";

import { Modal, Upload, Button, Typography, Space, Alert, Form } from "antd";
import {
  UploadOutlined,
  IdcardOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import { useForm } from "antd/es/form/Form";
import { uploadFile } from "@/utils/uploadFile";
import { useUpdateUserCardImages, useUserProfile } from "@/hooks/query/useUser";

const { Title, Text } = Typography;

interface ModalReservationProps {
  open: boolean;
  onClose: () => void;
}

export default function ModalReservation({
  open,
  onClose,
}: ModalReservationProps) {
  const [frontImage, setFrontImage] = useState<any>(null);
  const [backImage, setBackImage] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const canSubmit = frontImage && backImage;
  const [form] = useForm();

  const { data: userProfile } = useUserProfile();

  const { mutateAsync: updateUserCardImages, error } =
    useUpdateUserCardImages();

  const handleReservation = async () => {
    try {
      setSubmitting(true);

      const values = await form.validateFields();
      const fileList = values.profileImageUrl || [];

      const file = fileList[0]?.originFileObj;
      if (!file) return;

      const uploaded = await uploadFile(file);

      const payload = {
        profileImageUrl: uploaded.url,
      };

      await updateUserCardImages(payload.profileImageUrl);

      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Error updating card image:", error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      {userProfile?.profileImageUrl == null &&
      userProfile?.isVerified === false ? (
        <>
          <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            width={540}
          >
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <IdcardOutlined className="text-2xl text-blue-600" />
                </div>
                <Title level={2} className="mb-1 text-center">
                  Xác thực danh tính
                </Title>
                <Text type="secondary" className="text-center text-sm">
                  Hoàn thành xác thực để mở khóa đầy đủ tính năng
                </Text>
              </div>

              <Alert
                icon={<SafetyOutlined />}
                message="Thông tin của bạn được mã hóa và bảo mật tuyệt đối"
                description="Chúng tôi không bao giờ chia sẻ dữ liệu cá nhân của bạn với bên thứ ba"
                type="info"
                showIcon
                style={{ borderRadius: "8px" }}
              />

              <Form form={form} layout="vertical" className="space-y-4">
                <Form.Item
                  label={
                    <span className="font-semibold flex mt-2 items-center gap-2">
                      <IdcardOutlined className="text-base" />
                      Ảnh CCCD
                    </span>
                  }
                  name="profileImageUrl"
                  valuePropName="fileList"
                  getValueFromEvent={(e) =>
                    Array.isArray(e) ? e : e && e.fileList
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng tải lên ảnh CCCD",
                    },
                  ]}
                  className="mb-0"
                >
                  <Upload
                    beforeUpload={() => false}
                    listType="picture"
                    accept="image/*"
                    className="w-full"
                  >
                    <Button
                      icon={<UploadOutlined />}
                      className="w-full h-12"
                      style={{
                        borderColor: "#d9d9d9",
                        color: "#1890ff",
                      }}
                    >
                      Chọn ảnh từ thiết bị
                    </Button>
                  </Upload>
                </Form.Item>

                <Text type="secondary" className="text-xs">
                  Hỗ trợ các định dạng: JPG, PNG (Dung lượng tối đa: 5MB)
                </Text>
              </Form>

              <div className="flex gap-3 pt-4">
                <Button onClick={onClose} className="flex-1 h-10 font-medium">
                  Huỷ
                </Button>
                <Button
                  onClick={handleReservation}
                  type="primary"
                  loading={submitting}
                  disabled={submitting}
                  className="flex-1 h-10 font-medium"
                  style={{ borderRadius: "6px" }}
                >
                  {submitting ? "Đang gửi..." : "Xác nhận & Gửi"}
                </Button>
              </div>
            </div>
          </Modal>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
