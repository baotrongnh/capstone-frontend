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

  const canSubmit = frontImage && backImage;
  const [form] = useForm();

  const { data: userProfile } = useUserProfile();

  const { mutateAsync: updateUserCardImages } = useUpdateUserCardImages();

  const handleReservation = async () => {
    try {
      const values = await form.validateFields();
      const fileList = values.profileImageUrl || [];

      const file = fileList[0]?.originFileObj;
      if (!file) return;

      const uploaded = await uploadFile(file);

      const payload = {
        profileImageUrl: uploaded.url,
      };

      await updateUserCardImages(payload.profileImageUrl);

      onClose();
    } catch (error) {
      console.error("Error updating card image:", error);
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
            width={520}
          >
            <Space
              className="flex justify-center"
              size={4}
              style={{ width: "100%" }}
            >
              <h1 className="font-medium text-2xl">Xác thực danh tính</h1>
            </Space>

            <Space
              direction="vertical"
              size={20}
              style={{ width: "100%", marginTop: 24 }}
            >
              <Alert
                icon={<SafetyOutlined />}
                message="Thông tin của bạn được mã hóa và bảo mật tuyệt đối"
                type="info"
                showIcon
              />
              <Form form={form} layout="vertical">
                <div className="flex gap-2 items-center">
                  <p className="w-30">Mặt sau CCCD</p>

                  <Form.Item
                    name="profileImageUrl"
                    valuePropName="fileList"
                    getValueFromEvent={(e) =>
                      Array.isArray(e) ? e : e && e.fileList
                    }
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng tải lên ít nhất một ảnh",
                      },
                    ]}
                  >
                    <Upload beforeUpload={() => false} listType="picture">
                      <Button icon={<UploadOutlined />}>Upload photo</Button>
                    </Upload>
                  </Form.Item>
                </div>

                {/* <div className="flex gap-2 items-center">
            <p className="w-30">Mặt sau CCCD</p>
            <Form.Item
              name="profileImageUrl"
              valuePropName="fileList"
              getValueFromEvent={(e) =>
                Array.isArray(e) ? e : e && e.fileList
              }
              rules={[
                { required: true, message: "Vui lòng tải lên ít nhất một ảnh" },
              ]}
            >
              <Upload beforeUpload={() => false} listType="picture">
                <Button icon={<UploadOutlined />}>Upload photo</Button>
              </Upload>
            </Form.Item>
          </div> */}

                <Space
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 32,
                  }}
                >
                  <Button onClick={onClose}>Huỷ</Button>
                  <Button onClick={handleReservation} type="primary">
                    Xác nhận & Gửi
                  </Button>
                </Space>
              </Form>
            </Space>
          </Modal>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
