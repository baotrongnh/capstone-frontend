"use client";

import { useApartment } from "@/hooks/query/useApartments";
import { useCreateReservations } from "@/hooks/query/useReservations";
import {
  CheckCircleOutlined,
  FileTextOutlined,
  HomeOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Tag,
} from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ROUTES } from "@/constants/routes";
import { useFullAddress } from "@/hooks/query/useAddress";
import { ApartmentItem } from "@/lib/services/apartment.service";
import { useAuthStore } from "@/stores/auth.store";
import Link from "next/link";

interface ModalBookingProps {
  open: boolean;
  onClose: () => void;
  apartmentId?: string | number | null;
  apartmentData: ApartmentItem | undefined;
}

const durationOptions = [
  { label: "1 tháng", value: 1 },
  { label: "2 tháng", value: 2 },
  { label: "3 tháng", value: 3 },
  { label: "4 tháng", value: 4 },
  { label: "5 tháng", value: 5 },
  { label: "6 tháng", value: 6 },
  { label: "1 năm", value: 12 },
];

export default function ModalBooking({
  open,
  onClose,
  apartmentId,
  apartmentData,
}: ModalBookingProps) {
  const router = useRouter();
  const [formReservations] = useForm();
  const [agreeTerms, setAgreeTerms] = useState(false);

  const { data: apartment } = useApartment(apartmentId as string | number);

  console.log("DATA", apartment);

  const user = useAuthStore((store) => store.user);

  const displayAddress = useFullAddress(
    apartmentData?.streetAddress ?? undefined,
    apartmentData?.provinceCode ?? undefined,
    apartmentData?.wardCode ?? undefined,
  );

  const { mutateAsync: createReservation } = useCreateReservations();

  const handleReservations = async () => {
    const values = await formReservations.validateFields();
    const payload = {
      apartmentId: apartmentId,
      desiredStartDate: values.desiredStartDate.format("YYYY-MM-DD"),
      desiredEndDate: values.desiredEndDate.format("YYYY-MM-DD"),
      // numberOfOccupants: values.numberOfOccupants,
      additionalMemberNationalIds: values.additionalMemberNationalIds || [],
      specialRequests: values.specialRequests,
    };

    try {
      await createReservation(payload);
      formReservations.resetFields();
      onClose();

      router.push(`${ROUTES.PROFILE}/contracts`);
    } catch (error) {
      console.error("Error creating reservation:", error);
    }
  };

  const handleStartDateChange = () => {
    formReservations.setFieldValue("desiredEndDate", null);
  };

  const handleDurationChange = (value: number) => {
    const startDate = formReservations.getFieldValue("desiredStartDate");
    if (startDate) {
      const endDate = startDate.add(value, "month");
      formReservations.setFieldValue("desiredEndDate", endDate);
    }
  };

  return (
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

            {user?.isVerified == true && user?.identity != null && (
              <Button
                type="primary"
                onClick={handleReservations}
                disabled={!agreeTerms}
                className="h-10 px-6 font-medium bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <CheckCircleOutlined />
                Đặt thuê
              </Button>
            )}
          </>
        }
        centered
        width={560}
      >
        <div className="bg-blue-50/50 px-10   py-5 border-b border-blue-100">
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

        <div className="p-3 max-h-[88vh]">
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
                Phòng cho thuê
              </Tag>
            </div>

            <span className="text-gray-500 text-sm flex items-center gap-1">
              Địa chỉ: {displayAddress || "Chưa có địa chỉ"}
            </span>
            <Divider className=" border-gray-200" />

            <div className="">
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
            className=""
            onFinish={handleReservations}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="desiredStartDate"
                  label={
                    <span className="font-medium text-gray-700">
                      Ngày bắt đầu thuê
                    </span>
                  }
                  rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
                >
                  <DatePicker
                    className="w-full h-10 rounded-lg"
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày"
                    disabledDate={(current) => {
                      return (
                        current &&
                        (current.isBefore(dayjs(), "day") ||
                          current.isSame(dayjs(), "day"))
                      );
                    }}
                    onChange={handleStartDateChange}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="durationMonths"
                  label={
                    <span className="font-medium text-gray-700">
                      Thời hạn thuê
                    </span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng chọn thời hạn!" },
                  ]}
                >
                  <Select
                    className="w-full h-10 rounded-lg"
                    placeholder="Chọn thời hạn"
                    options={durationOptions}
                    onChange={handleDurationChange}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="additionalMemberNationalIds"
                  label={
                    <span className="font-medium text-gray-700">
                      Thêm thành viên (nếu có)
                    </span>
                  }
                >
                  <Select
                    mode="tags"
                    className="w-full h-10 rounded-lg"
                    placeholder="Nhập CCCD của thành viên khác (nếu có)"
                    tokenSeparators={[",", " "]}
                  />
                </Form.Item>
              </Col>

              {/* <Col span={8}>
                <Form.Item
                  name="numberOfOccupants"
                  label={
                    <span className="font-medium text-gray-700">
                      Số lượng người ở
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số người!",
                      type: "number",
                    },
                  ]}
                  initialValue={2}
                >
                  <InputNumber
                    min={1}
                    className="w-full h-10 rounded-lg flex items-center"
                    placeholder="Nhập số người"
                  />
                </Form.Item>
              </Col> */}
            </Row>

            <Form.Item
              name="desiredEndDate"
              hidden={true}
              label={
                <span className="font-medium text-gray-700">Ngày kết thúc</span>
              }
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn thời hạn trước!",
                },
              ]}
            >
              <DatePicker
                className="w-full h-10 rounded-lg"
                format="DD/MM/YYYY"
                placeholder="Tự động tính toán"
                disabled
              />
            </Form.Item>

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

            {user?.isVerified == true && user?.identity != null ? (
              <>
                <div className="bg-blue-50/50 rounded-lg p-3 mb-2 flex gap-3 text-sm text-blue-800 mt-5">
                  <div className="flex-1 space-y-1">
                    <p className="font-medium m-0">Lưu ý!</p>
                    <ul className="pl-4 m-0 text-blue-700/80 list-disc list-inside">
                      <li>Thao tác này sẽ tạo hợp đồng thuê và thanh toán.</li>
                    </ul>
                  </div>
                </div>

                <Form.Item
                  name="agreeTerms"
                  valuePropName="checked"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng đồng ý với điều kiện lưu ý!",
                    },
                  ]}
                  className="mt-4 mb-0"
                >
                  <Checkbox
                    className="text-gray-700"
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  >
                    Tôi đồng ý với điều kiện lưu ý trên và sẵn sàng ký hợp đồng
                    thuê
                  </Checkbox>
                </Form.Item>
              </>
            ) : (
              <>
                {" "}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-800 text-sm font-medium">
                    ⚠️ Vui lòng cập nhật
                    {" số điện thoại "}
                    {" CCCD "}
                    để đặt lịch xem
                    <Link href={ROUTES.PROFILE}>
                      <span className="text-muted underline">
                        {" "}
                        (Cập nhật ngay)
                      </span>
                    </Link>
                  </p>
                </div>
              </>
            )}
          </Form>
        </div>
      </Modal>
    </>
  );
}
