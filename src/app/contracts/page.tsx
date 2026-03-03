"use client";
import React, { useRef, useState } from "react";
import {
  Card,
  Button,
  Typography,
  Divider,
  Tag,
  Modal,
  message,
  Descriptions,
  Space,
  Alert,
  Steps,
  Checkbox,
} from "antd";
import SignatureCanvas from "react-signature-canvas";
import { useApartmentPolicies } from "@/hooks/query/useApartmentPolicies";

const { Title, Text } = Typography;

type ContractStatus =
  | "created"
  | "viewed"
  | "signed"
  | "submitted"
  | "completed";

export default function Contracts() {
  const sigRef = useRef<any>(null);

  const [contract] = useState({
    id: "CT-2026-001",
    room: "Phòng 302 - Chung cư ABC",
    renter: "Nguyễn Văn A",
    staff: "Nguyễn Thị B",
    startDate: "01/03/2026",
    endDate: "01/03/2027",
    price: "5.000.000 VNĐ / tháng",
  });

  const [signature, setSignature] = useState<string | null>(null);
  const [status, setStatus] = useState<ContractStatus>("viewed");

  const [openPreview, setOpenPreview] = useState(false);
  const [openPolicy, setOpenPolicy] = useState(false);
  const [agreePolicy, setAgreePolicy] = useState(false);

  const {
    data: contracts,
    isLoading,
    error,
  } = useApartmentPolicies("18367c10-eb16-4cbc-9c41-e4dd3dee6698");

  console.log("DDDD", contracts);

  /* ===== STEP INDEX ===== */
  const stepIndex = {
    created: 0,
    viewed: 1,
    signed: 2,
    submitted: 3,
    completed: 4,
  }[status];

  /* ===== ACTIONS ===== */
  const handleSign = () => {
    if (sigRef.current?.isEmpty()) {
      message.warning("Vui lòng ký trước khi xác nhận");
      return;
    }
    setSignature(sigRef.current.toDataURL("image/png"));
    setStatus("signed");
    message.success("Đã ký điện tử");
  };

  const handleResign = () => {
    Modal.confirm({
      title: "Ký lại hợp đồng?",
      content: "Chữ ký hiện tại sẽ bị xóa và bạn có thể ký lại.",
      okText: "Ký lại",
      cancelText: "Hủy",
      onOk: () => {
        setSignature(null);
        setStatus("viewed");
        sigRef.current?.clear();
        message.info("Vui lòng ký lại hợp đồng");
      },
    });
  };

  const handleSubmit = () => {
    if (!agreePolicy) {
      message.warning("Bạn cần đồng ý chính sách trước khi gửi hợp đồng");
      return;
    }

    Modal.confirm({
      title: "Xác nhận gửi hợp đồng",
      content: "Sau khi gửi, hợp đồng sẽ được khóa và không thể chỉnh sửa.",
      okText: "Gửi hợp đồng",
      cancelText: "Hủy",
      onOk: () => {
        setStatus("submitted");
        message.success("Hợp đồng đã được gửi");
      },
    });
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 32 }}>
      <Title level={3}>Hợp đồng thuê nhà</Title>

      {/* ================= STEPS ================= */}
      <Steps
        current={stepIndex}
        style={{ marginBottom: 32 }}
        items={[
          { title: "Tạo hợp đồng" },
          { title: "Xem hợp đồng" },
          { title: "Ký điện tử" },
          { title: "Gửi hợp đồng" },
          { title: "Hoàn tất" },
        ]}
      />

      {/* ================= ALERT ================= */}
      <Alert
        showIcon
        type={
          status === "submitted"
            ? "success"
            : status === "signed"
              ? "info"
              : "warning"
        }
        message={
          status === "signed"
            ? "Hợp đồng đã được ký. Vui lòng đồng ý chính sách và gửi."
            : status === "submitted"
              ? "Hợp đồng đã được gửi và đang chờ xác nhận."
              : "Vui lòng kiểm tra nội dung và ký hợp đồng."
        }
        style={{ marginBottom: 24 }}
      />

      <Card>
        {/* ================= INFO ================= */}
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Mã hợp đồng">
            <Tag color="blue">{contract.id}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Phòng thuê">
            <Space>
              {contract.room}
              <Button
                type="link"
                size="small"
                onClick={() => setOpenPolicy(true)}
              >
                Chính sách
              </Button>
              {agreePolicy && <Tag color="green">Đã đồng ý</Tag>}
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label="Người thuê">
            {contract.renter}
          </Descriptions.Item>
          <Descriptions.Item label="Nhân viên phụ trách">
            {contract.staff}
          </Descriptions.Item>
          <Descriptions.Item label="Thời hạn">
            {contract.startDate} → {contract.endDate}
          </Descriptions.Item>
          <Descriptions.Item label="Giá thuê">
            <Text strong>{contract.price}</Text>
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Text strong>Chữ ký xác nhận</Text>

        <div className="grid grid-cols-2 gap-6 mt-4">
          <div className="border rounded-lg p-4 text-center">
            <Text strong>BÊN CHO THUÊ</Text>
            <p className="italic text-gray-500">(Đã ký)</p>
            <Tag color="green">Hoàn tất</Tag>
          </div>

          <div className="border rounded-lg p-4 text-center">
            <Text strong>NGƯỜI THUÊ</Text>

            {!signature && status !== "submitted" && (
              <>
                <SignatureCanvas
                  ref={sigRef}
                  penColor="black"
                  canvasProps={{
                    width: "full",
                    height: 120,
                    style: {
                      border: "1px dashed #ccc",
                      borderRadius: 6,
                      marginTop: 15,
                      marginBottom: 15,
                      margin: "0 auto",
                    },
                  }}
                />
                <Button type="primary" onClick={handleSign}>
                  Ký điện tử
                </Button>
              </>
            )}

            {signature && (
              <>
                <img src={signature} style={{ maxWidth: 200 }} />
                <Tag color="green">Đã ký</Tag>
                {status !== "submitted" && (
                  <Button type="link" danger onClick={handleResign}>
                    Ký lại
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        <Divider />

        {/* ================= ACTION ================= */}
        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
          <Button onClick={() => setOpenPreview(true)}>Xem hợp đồng</Button>

          {status === "signed" && agreePolicy && (
            <Button type="primary" onClick={handleSubmit}>
              Gửi hợp đồng
            </Button>
          )}
        </Space>
      </Card>

      {/* ================= POLICY MODAL ================= */}
      <Modal
        open={openPolicy}
        title="Chính sách & điều khoản thuê"
        okText="Đồng ý"
        cancelText="Đóng"
        onCancel={() => setOpenPolicy(false)}
        onOk={() => {
          if (!agreePolicy) {
            message.warning("Vui lòng đồng ý chính sách");
            return;
          }
          setOpenPolicy(false);
        }}
      >
        <p>• Thanh toán đúng hạn hàng tháng.</p>
        <p>• Không tự ý sửa chữa, cải tạo phòng.</p>
        <p>• Giữ gìn tài sản và vệ sinh chung.</p>

        <Divider />

        <Checkbox
          checked={agreePolicy}
          onChange={(e) => setAgreePolicy(e.target.checked)}
        >
          Tôi đã đọc và đồng ý với các chính sách trên
        </Checkbox>
      </Modal>

      {/* ================= PREVIEW ================= */}
      <Modal
        open={openPreview}
        footer={null}
        onCancel={() => setOpenPreview(false)}
        width={800}
        title="Xem hợp đồng"
      >
        <p>Nội dung hợp đồng đầy đủ (PDF / HTML).</p>
      </Modal>
    </div>
  );
}
