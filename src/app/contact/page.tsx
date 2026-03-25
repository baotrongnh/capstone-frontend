"use client";
import AppPromoSection from "@/components/sections/app-promo";
import ServicesSection from "@/components/sections/services";
import bg from "../../../public/img/banner10.jpg";
import { useForm } from "antd/es/form/Form";
import { Button, Form, Input, InputNumber, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { uploadFile } from "@/utils/uploadFile";
import Image from "next/image";
import banner from "../../../public/img/partner.jpg";
import { useCreateCooperation } from "@/hooks/query/useApartments";

export default function PartnerContact() {
  const [form] = useForm();

  const { mutateAsync: createCooperation } = useCreateCooperation();
  const handleRegister = async () => {
    try {
      const data = await form.validateFields();
      const currentImage = data.images || [];

      const formData = new FormData();

      formData.append("buildingName", data.buildingName);
      formData.append("apartmentNumber", data.apartmentNumber);

      formData.append("totalArea", String(data.totalArea));
      formData.append("numberOfBathrooms", String(data.numberOfBathrooms));
      formData.append("numberOfBedrooms", String(data.numberOfBedrooms));

      formData.append("baseRentPrice", String(data.baseRentPrice));
      formData.append("description", data.description);

      currentImage.forEach((file: any) => {
        if (file.originFileObj) {
          formData.append("images", file.originFileObj);
        }
      });

      console.log("FormData:", formData);

      await createCooperation(formData);

      form.resetFields();
    } catch (error) {
      console.log("Validate / Upload error:", error);
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
            Liên hệ với chúng tôi
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
                label="Địa chỉ căn hộ"
                name="address"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
              >
                <Input placeholder="VD: 123 Nguyễn Văn Linh, Q.7" />
              </Form.Item>

              <Form.Item
                label="Tổng diện tích"
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
                maxCount={5}
              >
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <UploadOutlined className="text-xl mb-2" />
                  <span className="text-sm">Upload hình ảnh</span>
                </div>
              </Upload>
            </Form.Item>

            <Button
              type="primary"
              onClick={handleRegister}
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
    </>
  );
}
