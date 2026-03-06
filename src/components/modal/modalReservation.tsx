"use client";

import {
  Modal,
  Upload,
  Button,
  Typography,
  Space,
  Alert,
  Form,
  Divider,
  Tag,
  Row,
  Col,
  DatePicker,
  InputNumber,
  Input,
} from "antd";
import {
  UploadOutlined,
  IdcardOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  HomeOutlined,
  FileTextOutlined,
  ClockCircleFilled,
  CheckCircleFilled,
  SyncOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { uploadFile } from "@/utils/uploadFile";
import { useUpdateUserCardImages, useUserProfile } from "@/hooks/query/useUser";
import { useAuthStore } from "@/stores/auth.store";
import { UserProfile } from "@/types/profile";
import { useApartment } from "@/hooks/query/useApartments";
import { ApartmentItem } from "@/types/apartment";
import ModalWaitingVerify from "./modalWaitingVerify";
import { useCreateReservations } from "@/hooks/query/useReservations";

const { Title, Text } = Typography;

interface ModalReservationProps {
  open: boolean;
  onClose: () => void;
  apartmentId?: string | number | null;
}

export default function ModalReservation({
  open,
  onClose,
  apartmentId,
}: ModalReservationProps) {
  const [frontImage, setFrontImage] = useState<any>(null);
  const [backImage, setBackImage] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const canSubmit = frontImage && backImage;
  const [formVerify] = useForm();
  const [formReservations] = useForm();

  const user = useAuthStore((s) => s.user);

  const { data: profile } = useUserProfile(!!user && open);

  const { data: apartment } = useApartment(apartmentId as string | number);

  const { mutateAsync: createReservation } = useCreateReservations();

  console.log("ID", apartment);

  const { mutateAsync: updateUserCardImages, error } =
    useUpdateUserCardImages();

  if (!user) return null;

  const handleVerify = async () => {
    try {
      setSubmitting(true);

      const values = await formVerify.validateFields();
      const fileList = values.profileImageUrl || [];

      const file = fileList[0]?.originFileObj;
      if (!file) return;

      const uploaded = await uploadFile(file);

      const payload = {
        profileImageUrl: uploaded.url,
      };

      await updateUserCardImages(payload.profileImageUrl);

      formVerify.resetFields();
      onClose();
    } catch (error) {
      console.error("Error updating card image:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReservations = async () => {
    const values = await formReservations.validateFields();

    const payload = {
      apartmentId: apartmentId,
      desiredStartDate: values.desiredStartDate.format("YYYY-MM-DD"),
      desiredEndDate: values.desiredEndDate.format("YYYY-MM-DD"),
      numberOfOccupants: values.numberOfOccupants,
      specialRequests: values.specialRequests,
    };

    try {
      await createReservation(payload);
      formReservations.resetFields();
      onClose();
    } catch (error) {
      console.error("Error creating reservation:", error);
    }
  };

  const needUpload = profile?.isVerified === false && !profile?.profileImageUrl;
  const waitingVerify =
    profile?.isVerified === false && profile?.profileImageUrl;
  const verified = profile?.isVerified === true;

  return (
    <>
      {needUpload && (
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

              <Form form={formVerify} layout="vertical" className="space-y-4">
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
                  onClick={handleVerify}
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
      )}

      {waitingVerify && (
        <>
          <ModalWaitingVerify open={open} onClose={onClose} />
        </>
      )}

      {verified && (
        <>
          <Modal
            open={open}
            onCancel={onClose}
            closable={false}
            footer={
              <>
                <Button
                  onClick={onClose}
                  className="h-10 px-6 font-medium text-gray-600 hover:text-gray-800 bg-white border-gray-300 rounded-lg shadow-sm"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="primary"
                  onClick={handleReservations}
                  className="h-10 px-6 font-medium bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-2"
                >
                  <CheckCircleOutlined />
                  Xác nhận gửi yêu cầu
                </Button>
              </>
            }
            centered
            width={560}
          >
            <div className="bg-blue-50/50 px-10 mt-2 py-5 border-b border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <FileTextOutlined className="text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 m-0 leading-tight">
                    Xác nhận yêu cầu thuê
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 mb-0">
                    Vui lòng kiểm tra lại thông tin trước khi gửi hồ sơ.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 text-gray-800 font-semibold text-base">
                    <HomeOutlined className="text-gray-500" />
                    <span>{apartment?.data?.buildingName}</span>
                  </div>
                  <Tag
                    color="blue"
                    className="m-0 border-none bg-blue-100 text-blue-700 font-medium px-2 py-0.5"
                  >
                    Phòng{" "}
                    {apartment?.data?.address?.at(-1)?.split(",")[0].trim()}
                  </Tag>
                </div>

                <Divider className="my-3 border-gray-200" />

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Giá thuê mỗi tháng:</span>
                    <span className="font-semibold text-gray-900 text-base">
                      {Number(apartment?.data?.baseRentPrice).toLocaleString(
                        "vi-VN",
                      )}{" "}
                      ₫
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Tiền cọc (dự kiến):</span>
                    <span className="font-semibold text-gray-900 text-base">
                      {Number(apartment?.data?.depositAmount).toLocaleString(
                        "vi-VN",
                      )}{" "}
                      ₫
                    </span>
                  </div>
                </div>
              </div>

              <Form
                form={formReservations}
                layout="vertical"
                requiredMark={false}
                className="mb-5"
                onFinish={handleReservations}
              >
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      name="desiredStartDate"
                      label={
                        <span className="font-medium text-gray-700">
                          Ngày bắt đầu thuê
                        </span>
                      }
                      rules={[
                        { required: true, message: "Vui lòng chọn ngày!" },
                      ]}
                    >
                      <DatePicker
                        className="w-full h-10 rounded-lg"
                        format="DD/MM/YYYY"
                        placeholder="Chọn ngày"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="desiredEndDate"
                      label={
                        <span className="font-medium text-gray-700">
                          Ngày kết thúc
                        </span>
                      }
                      rules={[
                        { required: true, message: "Vui lòng chọn ngày!" },
                      ]}
                    >
                      <DatePicker
                        className="w-full h-10 rounded-lg"
                        format="DD/MM/YYYY"
                        placeholder="Chọn ngày"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="numberOfOccupants"
                      label={
                        <span className="font-medium text-gray-700">
                          Số lượng người ở
                        </span>
                      }
                      rules={[
                        { required: true, message: "Vui lòng nhập số người!" },
                      ]}
                      initialValue={2}
                    >
                      <InputNumber
                        min={1}
                        className="w-full h-10 rounded-lg flex items-center"
                        placeholder="Nhập số người"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="specialRequests"
                  label={
                    <span className="font-medium text-gray-700">
                      Yêu cầu đặc biệt (Ghi chú)
                    </span>
                  }
                  className="mb-0"
                >
                  <Input.TextArea
                    rows={3}
                    className="w-full rounded-lg"
                    placeholder="Ví dụ: Need parking spot..."
                  />
                </Form.Item>
              </Form>

              <div className="bg-blue-50/50 rounded-lg p-3 flex gap-3 text-sm text-blue-800">
                <InfoCircleOutlined className="text-blue-500 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="font-medium m-0">Tiếp theo sẽ thế nào?</p>
                  <ul className="pl-4 m-0 text-blue-700/80 list-disc list-inside">
                    <li>Chủ nhà sẽ xét duyệt hồ sơ của bạn trong 24h.</li>
                    <li>Bạn chưa phải thanh toán bất kỳ khoản nào lúc này.</li>
                  </ul>
                </div>
              </div>
            </div>
          </Modal>
        </>
      )}
    </>
  );
}
