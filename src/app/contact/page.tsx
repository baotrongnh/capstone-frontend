"use client";
import AppPromoSection from "@/components/sections/app-promo";
import ServicesSection from "@/components/sections/services";
import bg from "../../../public/img/banner10.jpg";
import { useForm } from "antd/es/form/Form";
import { Button, Form, Input, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { uploadFile } from "@/utils/uploadFile";
import Image from "next/image";

export default function PartnerContact() {
  const [form] = useForm();

  const handleRegister = async () => {
    try {
      const data = await form.validateFields();

      const currentImage = data.images || [];

      const newImageFiles = currentImage.filter(
        (file: { originFileObj: File }) => file.originFileObj,
      );

      const uploadedImages = await Promise.all(
        newImageFiles.map(async (fileObj: { originFileObj: File }) => {
          const uploaded = await uploadFile(fileObj.originFileObj);
          return { imageUrl: uploaded.url };
        }),
      );

      const payload = {
        fullname: data.fullName,
        phone: data.phone,
        email: data.email,
        role: data.role,
        address: data.address,
        totalRooms: Number(data.totalRooms),
        propertyType: data.propertyType,
        expectedPrice: Number(data.expectedPrice),
        description: data.description,
        status: data.status,
        images: uploadedImages,
      };

      console.log("Payload to submit:", payload);
      form.resetFields();
    } catch (error) {
      console.log("Validate / Upload error:", error);
    }
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
    [&_.ant-form-item]:mb-4
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
              <p className="text-gray-600 leading-relaxed">
                Quản lý đặt phòng, hợp đồng, điện nước và thiết bị smart trên
                một nền tảng duy nhất. Nếu bạn là chủ sở hữu căn hộ hoặc tòa nhà
                cho thuê, hãy kết nối với chúng tôi để bắt đầu mô hình vận hành
                chuyên nghiệp, minh bạch và tối ưu doanh thu.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-xl font-semibold mb-6">
                Thông Tin Người Liên Hệ
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Form.Item
                  label="Họ và tên"
                  name="fullName"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên" },
                  ]}
                >
                  <Input placeholder="Nhập tên người liên hệ" />
                </Form.Item>

                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    {
                      pattern: /^[0-9]{9,11}$/,
                      message: "Số điện thoại không hợp lệ",
                    },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email" },
                    { type: "email", message: "Email không hợp lệ" },
                  ]}
                >
                  <Input placeholder="Nhập địa chỉ email" />
                </Form.Item>

                <Form.Item
                  label="Vai trò"
                  name="role"
                  rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
                >
                  <Select placeholder="Chọn vai trò" className="h-11">
                    <Select.Option value="owner">Chủ căn hộ</Select.Option>
                    <Select.Option value="partner">Đối tác</Select.Option>
                    <Select.Option value="tenant">Người thuê</Select.Option>
                    <Select.Option value="other">Khác</Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
          </div>

          <div
            className="mt-12 bg-white rounded-lg p-6
  shadow-[0_2px_10px_rgba(0,0,0,0.06),0_6px_20px_rgba(0,0,0,0.06)]"
          >
            <h3 className="text-lg font-semibold mb-6 text-center">
              Thông Tin Căn Hộ
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <Form.Item
                label="Địa chỉ căn hộ"
                name="address"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
              >
                <Input placeholder="VD: 123 Nguyễn Văn Linh, Q.7" />
              </Form.Item>

              <Form.Item
                label="Tổng số phòng"
                name="totalRooms"
                rules={[
                  { required: true, message: "Vui lòng nhập tổng số phòng" },
                  {
                    pattern: /^[1-9][0-9]*$/,
                    message: "Số phòng phải là số nguyên > 0",
                  },
                ]}
              >
                <Input placeholder="VD: 10" />
              </Form.Item>

              <Form.Item
                label="Loại hình tài sản"
                name="propertyType"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn loại hình tài sản",
                  },
                ]}
              >
                <Select className="h-10" placeholder="Chọn loại hình">
                  <Select.Option value="apartment">Căn hộ</Select.Option>
                  <Select.Option value="house">Nhà phố</Select.Option>
                  <Select.Option value="villa">Villa</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Tình trạng vận hành"
                name="status"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn tình trạng vận hành",
                  },
                ]}
              >
                <Select className="h-10" placeholder="Chọn tình trạng">
                  <Select.Option value="renting">Đang cho thuê</Select.Option>
                  <Select.Option value="idle">Chưa vận hành</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Giá thuê dự kiến (VNĐ / tháng)"
                name="expectedPrice"
                rules={[
                  { required: true, message: "Vui lòng nhập giá thuê" },
                  {
                    pattern: /^[0-9]+$/,
                    message: "Giá thuê phải là số",
                  },
                ]}
              >
                <Input placeholder="VD: 15000000" />
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

            <div className="flex justify-center mt-6">
              <Button
                type="primary"
                onClick={handleRegister}
                className="
        h-12! px-12!
        bg-primary hover:bg-blue-600
        text-white font-semibold text-base
        rounded-lg
      "
              >
                Đăng ký hợp tác
              </Button>
            </div>
          </div>
        </div>
      </Form>
      <ServicesSection />
      <AppPromoSection />
    </>
  );
}
