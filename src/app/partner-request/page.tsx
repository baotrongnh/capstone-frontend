"use client";
import AuthModal from "@/components/modal/auth-modal";
import ModalVerify from "@/components/modal/modal-verify";
import AppPromoSection from "@/components/sections/app-promo";
import ServicesSection from "@/components/sections/services";
import { ROUTES } from "@/constants/routes";
import { useProvinces, useWards } from "@/hooks/query/useAddress";
import { useCreateCooperation } from "@/hooks/query/useApartments";
import { useAuthStore } from "@/stores/auth.store";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Select, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface"; // Thêm type UploadFile
import { useForm } from "antd/es/form/Form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import bg from "../../../public/img/banner10.jpg";
import banner from "../../../public/img/partner.jpg";
import ModalLoginRequired from "@/components/modal/modal-login-required";

interface LocationData {
  code: number | string;
  name: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string | string[];
    };
  };
  message?: string;
}

export default function PartnerContact() {
  const [form] = useForm();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [modalVerify, setModalVerify] = useState(false);
  const { mutateAsync: createCooperation } = useCreateCooperation();

  const { data: provinces } = useProvinces();

  const [selectedProvince, setSelectedProvince] = useState<
    number | undefined
  >();

  const { data: wardCode } = useWards(selectedProvince);

  const handlePreviewImage = async (file: UploadFile) => {
    const previewWindow = window.open("", "_blank");

    let previewUrl = file.url || file.thumbUrl;

    if (!previewUrl && file.originFileObj) {
      previewUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as File);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Không thể xem trước ảnh"));
      });
    }

    if (!previewUrl) {
      previewWindow?.close();
      return;
    }

    if (!previewWindow) {
      window.open(previewUrl, "_blank");
      return;
    }

    previewWindow.document.write(`
      <html>
        <head>
          <title>Xem trước ảnh</title>
          <style>
            body {
              margin: 0;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #111827;
            }
            img {
              max-width: 100vw;
              max-height: 100vh;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          <img src="${previewUrl}" alt="preview" />
        </body>
      </html>
    `);
    previewWindow.document.close();
    previewWindow.focus();
  };

  const handleRegister = async () => {
    if (user?.isVerified === true && user?.identity !== null) {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const data = await form.validateFields();

        const formData = new FormData();
        formData.append("buildingName", data.buildingName);
        formData.append("apartmentNumber", data.apartmentNumber);
        formData.append("totalArea", String(data.totalArea));
        formData.append("usableArea", String(data.usableArea));
        formData.append("numberOfBathrooms", String(data.numberOfBathrooms));
        formData.append("numberOfBedrooms", String(data.numberOfBedrooms));
        formData.append("baseRentPrice", String(data.baseRentPrice));
        formData.append("description", data.description);
        formData.append("streetAddress", data.streetAddress);
        formData.append("depositAmount", data.depositAmount);
        formData.append("yearBuilt", String(data.yearBuilt));
        formData.append("floorNumber", String(data.floorNumber));
        formData.append("maxOccupants", data.maxOccupants);

        formData.append("wardCode", String(data.newWardCode));
        formData.append("latitude", "0");
        formData.append("longitude", "0");

        const currentImages: UploadFile[] = data.images || [];
        currentImages.forEach((file: UploadFile) => {
          if (file.originFileObj) {
            formData.append("images", file.originFileObj);
          }
        });

        const obj = Object.fromEntries(formData.entries());
        console.log(obj);

        await createCooperation(formData);
        form.resetFields();
      } catch (error: unknown) {
        console.log("Validate / Upload error:", error);

        const err = error as ApiError;

        const backendError =
          err?.response?.data?.message || err?.message || "Lỗi không xác định";

        const errorMsg = Array.isArray(backendError)
          ? backendError.join(", ")
          : backendError;

        setErrorMessage(errorMsg);
      } finally {
        setIsLoading(false);
      }
    } else if (!user) {
      setShowModalLogin(true);
    } else {
      setModalVerify(true);
    }
  };

  const formatter = (value?: number | string) => {
    if (!value) return "";
    return new Intl.NumberFormat("vi-VN").format(Number(value));
  };

  const parser = (value?: string) => {
    if (!value) return "";
    return value.replace(/\D/g, "");
  };

  const handleVerify = () => {
    router.push(`${ROUTES.PROFILE}`);
  };

  return (
    <>
      <div className="relative bottom-7 h-130 w-full overflow-hidden">
        <Image
          src={bg}
          alt="banner"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover filter brightness-110 contrast-120 saturate-125 sharpness-100"
        />

        <div className="absolute inset-0 bg-black/30"></div>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Liên hệ hợp tác
          </h1>
          <p className="text-base md:text-lg max-w-2xl">
            Liên hệ với chúng tôi để hợp tác vận hành, quản lý và cho thuê căn
            hộ một cách chuyên nghiệp, minh bạch và hiệu quả.
          </p>
        </div>
      </div>
      <Form
        form={form}
        layout="vertical"
        className="
    [&_.ant-form-item]:mb-1
    [&_.ant-form-item-label>label]:font-medium
    [&_.ant-form-item-label>label]:text-gray-700
    [&_.ant-input]:h-11
    [&_.ant-select-selector]:h-11
    [&_.ant-select-selector]:flex
    [&_.ant-select-selector]:items-center
    [&_.ant-input::placeholder]:text-gray-400
  "
      >
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <p className="text-primary font-semibold mb-10 uppercase text-sm">
                INTELLISERVOPS
              </p>
              <h2 className="text-3xl font-bold mb-4">Liên hệ với chúng tôi</h2>
              <p className="text-xl mb-5">
                Hợp tác vận hành căn hộ thông minh. Quản lý bất động sản chuyên
                nghiệp, minh bạch và tối ưu doanh thu cho chủ sở hữu.
              </p>
              <p className="text-gray-600 leading-relaxed text-justify">
                Quản lý đặt phòng, hợp đồng, điện nước và thiết bị smart trên
                một nền tảng duy nhất. Nếu bạn là chủ sở hữu căn hộ hoặc tòa nhà
                cho thuê, hãy kết nối với chúng tôi để bắt đầu mô hình vận hành
                chuyên nghiệp, minh bạch và tối ưu doanh thu.
              </p>
            </div>

            <div className="w-full h-85 relative ">
              <Image
                src={banner}
                alt="Banner"
                fill
                className="object-cover rounded-xl"
              />
            </div>
          </div>

          <div
            className="mt-12 bg-white rounded-lg p-6
  shadow-[0_2px_10px_rgba(0,0,0,0.06),0_6px_20px_rgba(0,0,0,0.06)]"
          >
            <h3 className="text-lg font-semibold mb-6 text-center">
              Thông Tin Căn Hộ
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 ">
              <Form.Item
                label="Tên căn hộ"
                name="buildingName"
                rules={[
                  { required: true, message: "Vui lòng nhập tên căn hộ" },
                ]}
              >
                <Input placeholder="VD: 123 Nguyễn Văn Linh, Q.7" />
              </Form.Item>

              <Form.Item
                label="Số căn hộ"
                name="apartmentNumber"
                rules={[{ required: true, message: "Vui lòng nhập số căn hộ" }]}
              >
                <Input placeholder="VD: 123 Nguyễn Văn Linh, Q.7" />
              </Form.Item>

              <Form.Item
                label="Tỉnh / Thành phố"
                name="province"
                rules={[
                  { required: true, message: "Vui lòng chọn tỉnh/thành" },
                ]}
              >
                <Select
                  placeholder="Chọn tỉnh/thành"
                  className="h-11"
                  showSearch
                  virtual
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={provinces?.map((p: LocationData) => ({
                    label: p.name,
                    value: p.code,
                  }))}
                  onChange={(value) => {
                    setSelectedProvince(value);
                    form.setFieldValue("wardCode", undefined);
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Phường / Xã"
                name="newWardCode"
                rules={[{ required: true, message: "Vui lòng chọn phường/xã" }]}
              >
                <Select
                  placeholder="Chọn phường/xã"
                  className="h-11"
                  showSearch
                  virtual
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={wardCode?.map((w: LocationData) => ({
                    // Fix type any
                    label: w.name,
                    value: w.code,
                  }))}
                  onChange={(value) => {
                    form.setFieldValue("newWardCode", value);
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Địa chỉ"
                name="streetAddress"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
              >
                <Input placeholder="VD: 123 Nguyễn Văn A, Quận 1" />
              </Form.Item>

              <Form.Item
                label="Tổng diện tích (m2)"
                name="totalArea"
                rules={[
                  { required: true, message: "Vui lòng nhập tổng diện tích" },
                  {
                    pattern: /^[1-9][0-9]*$/,
                    message: "Diện tích phải là số nguyên > 0",
                  },
                ]}
              >
                <Input type={"number"} placeholder="VD: 100m2" />
              </Form.Item>

              <Form.Item
                label="Diện tích sử dụng (m2)"
                name="usableArea"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập diện tích sử dụng",
                  },
                  {
                    pattern: /^[1-9][0-9]*$/,
                    message: "Diện tích phải là số nguyên > 0",
                  },
                ]}
              >
                <Input type={"number"} placeholder="VD: 100m2" />
              </Form.Item>

              <Form.Item
                label="Năm xây dựng"
                name="yearBuilt"
                rules={[
                  { required: true, message: "Vui lòng nhập năm xây dựng" },
                  {
                    pattern: /^[1-9][0-9]*$/,
                    message: "Năm xây dựng phải là số nguyên > 0",
                  },
                  {
                    validator: (_, value) => {
                      const year = Number(value);

                      if (!value || (year >= 1950 && year <= 2026)) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        new Error(
                          "Năm xây dựng không được lớn hơn 2026 và nhỏ hơn 1950",
                        ),
                      );
                    },
                  },
                ]}
              >
                <Input type={"number"} placeholder="VD: 2026" />
              </Form.Item>

              <Form.Item
                label="Số tầng"
                name="floorNumber"
                rules={[
                  { required: true, message: "Vui lòng nhập số tầng" },
                  {
                    pattern: /^[1-9][0-9]*$/,
                    message: "Số tầng phải là số nguyên > 0",
                  },
                  {
                    validator: (_, value) => {
                      if (!value || Number(value) <= 200)
                        return Promise.resolve();
                      return Promise.reject(
                        new Error("Số tầng không được lớn hơn 200"),
                      );
                    },
                  },
                ]}
              >
                <Input type={"number"} placeholder="VD: 2" />
              </Form.Item>

              <Form.Item
                label="Tổng số phòng tắm"
                name="numberOfBathrooms"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tổng số phòng tắm",
                  },
                  {
                    pattern: /^[1-9][0-9]*$/,
                    message: "Số phòng tắm phải là số nguyên > 0",
                  },
                  {
                    validator: (_, value) => {
                      if (!value || Number(value) <= 10)
                        return Promise.resolve();
                      return Promise.reject(
                        new Error("Số phòng tắm không được lớn hơn 10"),
                      );
                    },
                  },
                ]}
              >
                <Input type={"number"} placeholder="VD: 10" />
              </Form.Item>

              <Form.Item
                label="Tổng số phòng ngủ"
                name="numberOfBedrooms"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tổng số phòng ngủ",
                  },
                  {
                    pattern: /^[1-9][0-9]*$/,
                    message: "Số phòng ngủ phải là số nguyên > 0",
                  },
                  {
                    validator: (_, value) => {
                      if (!value || Number(value) <= 20)
                        return Promise.resolve();
                      return Promise.reject(
                        new Error("Số phòng ngủ không được lớn hơn 20"),
                      );
                    },
                  },
                ]}
              >
                <Input type={"number"} placeholder="VD: 10" />
              </Form.Item>

              <Form.Item
                label="Giá thuê dự kiến (VNĐ / tháng)"
                name="baseRentPrice"
                rules={[{ required: true, message: "Vui lòng nhập giá thuê" }]}
              >
                <InputNumber
                  className="w-full h-11"
                  style={{ width: "100%" }}
                  min={0}
                  formatter={formatter}
                  parser={parser}
                  placeholder="VD: 15.000.000"
                />
              </Form.Item>

              <Form.Item label="Số tiền cọc (VNĐ)" required>
                <Form.Item
                  name="depositAmount"
                  noStyle
                  rules={[
                    { required: true, message: "Vui lòng nhập số tiền cọc" },
                  ]}
                >
                  <InputNumber
                    className="w-full h-11"
                    style={{ width: "100%" }}
                    min={0}
                    formatter={formatter}
                    parser={parser}
                    placeholder="VD: 15.000.000"
                  />
                </Form.Item>

                <div className="flex gap-2 mt-2">
                  <Button
                    size="small"
                    onClick={() => {
                      const rentPrice = form.getFieldValue("baseRentPrice");
                      if (rentPrice) {
                        form.setFieldValue("depositAmount", rentPrice);
                      }
                    }}
                  >
                    1 tháng
                  </Button>

                  <Button
                    size="small"
                    onClick={() => {
                      const rentPrice = form.getFieldValue("baseRentPrice");
                      if (rentPrice) {
                        form.setFieldValue("depositAmount", rentPrice * 2);
                      }
                    }}
                  >
                    2 tháng
                  </Button>
                </div>
              </Form.Item>

              <Form.Item
                label="Số người ở tối đa"
                name="maxOccupants"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số người ở tối đa",
                  },
                ]}
              >
                <InputNumber
                  className="w-full h-11"
                  style={{ width: "100%" }}
                  min={0}
                  formatter={formatter}
                  parser={parser}
                  placeholder="VD: 1"
                />
              </Form.Item>

              <Form.Item
                label="Mô tả tài sản"
                name="description"
                rules={[
                  { required: true, message: "Vui lòng nhập mô tả tài sản" },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Mô tả thêm về vị trí, nội thất, tiện ích..."
                />
              </Form.Item>
            </div>

            <Form.Item
              label="Hình ảnh tài sản"
              name="images"
              rules={[
                {
                  required: true,
                  message: "Vui lòng upload ít nhất 1 hình ảnh",
                },
              ]}
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            >
              <Upload
                beforeUpload={() => false}
                listType="picture-card"
                multiple
                accept="image/*"
                maxCount={5}
                onPreview={handlePreviewImage}
              >
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <UploadOutlined className="text-xl mb-2" />
                  <span className="text-sm">Upload hình ảnh</span>
                </div>
              </Upload>
            </Form.Item>

            {errorMessage && (
              <>
                <p className="text-red-500 mb-3">{errorMessage}</p>
              </>
            )}

            <Button
              type="primary"
              onClick={handleRegister}
              loading={isLoading}
              disabled={isLoading}
              className="
        h-12! px-12! w-full!
        bg-primary hover:bg-blue-600
        text-white font-semibold text-base
        rounded-lg
      "
            >
              Đăng ký hợp tác
            </Button>
          </div>
        </div>
      </Form>
      <ServicesSection />
      <AppPromoSection />

      <ModalVerify
        isOpen={modalVerify}
        onClose={() => setModalVerify(false)}
        onVerify={() => handleVerify()}
      />
      <ModalLoginRequired
        isModalOpen={showModalLogin}
        setIsModalOpen={setShowModalLogin}
        setAuthModalOpen={setIsAuthModalOpen}
      />
      <AuthModal
        open={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
