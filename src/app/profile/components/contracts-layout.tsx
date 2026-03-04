"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import {
  Card,
  Button,
  Typography,
  Modal,
  message,
  Checkbox,
  Spin,
  Empty,
  Space,
  Alert,
} from "antd";
import SignatureCanvas from "react-signature-canvas";

import { useGetContracts } from "@/hooks/query/useContracts";
import type { ContractDetail } from "@/types/contracts";

const { Title, Text } = Typography;

export default function ContractLayout() {
  const sigRef = useRef<SignatureCanvas | null>(null);
  const pdfContentRef = useRef<HTMLDivElement>(null);

  const [selectedContractId, setSelectedContractId] = useState<string | null>(
    null,
  );
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data, isLoading, error } = useGetContracts();
  const contractsList: ContractDetail[] = data?.data ?? [];

  console.log("DATA", data);

  useEffect(() => {
    if (!selectedContractId && contractsList.length > 0) {
      setSelectedContractId(contractsList[0].id);
    }
  }, [contractsList, selectedContractId]);

  const contract = useMemo<ContractDetail | null>(() => {
    if (!contractsList.length) return null;
    return (
      contractsList.find((c) => c.id === selectedContractId) ?? contractsList[0]
    );
  }, [contractsList, selectedContractId]);

  const formattedContract = useMemo(() => {
    if (!contract) return null;
    const member = contract.members?.[0];
    return {
      contractNumber: contract.contractNumber,
      startDate: new Date(contract.startDate).toLocaleDateString("vi-VN"),
      endDate: new Date(contract.endDate).toLocaleDateString("vi-VN"),
      monthlyRent: Number(contract.monthlyRent).toLocaleString("vi-VN"),
      apartmentNumber: contract.apartment?.apartmentNumber,
      address: contract.apartment?.address,
      city: contract.apartment?.city,
      renterName: member?.user?.fullName ?? "Chưa cập nhật",
      renterEmail: member?.user?.email ?? "Chưa cập nhật",
    };
  }, [contract]);

  const handleViewContract = () => {
    setShowPdfModal(true);
  };

  const handleSignClick = () => {
    if (!agreePolicy) {
      message.warning("Vui lòng đồng ý chính sách trước");
      return;
    }
    setShowSignModal(true);
  };

  const handleSignConfirm = () => {
    if (!sigRef.current || sigRef.current.isEmpty()) {
      message.warning("Vui lòng ký");
      return;
    }
    setSignature(sigRef.current.toDataURL("image/png"));
    setShowSignModal(false);
    message.success("Ký thành công!");
  };

  const handleRedoSign = () => {
    Modal.confirm({
      title: "Ký lại?",
      content: "Chữ ký hiện tại sẽ bị xóa",
      okText: "Ký lại",
      cancelText: "Hủy",
      onOk: () => {
        setSignature(null);
        setShowSignModal(true);
      },
    });
  };

  const handleSubmit = () => {
    if (!signature) {
      message.warning("Vui lòng ký hợp đồng");
      return;
    }

    Modal.confirm({
      title: "Xác nhận gửi hợp đồng",
      content: "Sau khi gửi, hợp đồng sẽ được khóa",
      okText: "Gửi",
      cancelText: "Hủy",
      onOk: () => {
        setIsSubmitted(true);
        setShowPdfModal(false);
        message.success("Hợp đồng đã được gửi!");
      },
    });
  };

  // States
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <Spin size="large" />
        <p style={{ marginTop: 16 }}>Đang tải hợp đồng...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        showIcon
        message="Lỗi"
        description="Không thể tải hợp đồng"
      />
    );
  }

  if (!contractsList.length || !formattedContract) {
    return (
      <Card style={{ textAlign: "center", padding: 60 }}>
        <Empty description="Chưa có hợp đồng nào" />
      </Card>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 32 }}>
      <Title level={2}> Hợp Đồng Thuê Nhà</Title>

      {isSubmitted && (
        <Alert
          type="success"
          showIcon
          message="✓ Hợp đồng đã được gửi thành công"
          closable
          style={{ marginBottom: 24 }}
        />
      )}

      {/* Contract Selection */}
      {contractsList.length > 1 && (
        <Card style={{ marginBottom: 24, background: "#fafafa" }}>
          <Space wrap>
            <Text strong>Chọn hợp đồng:</Text>
            {contractsList.map((c) => (
              <Button
                key={c.id}
                type={selectedContractId === c.id ? "primary" : "default"}
                onClick={() => {
                  setSelectedContractId(c.id);
                  setSignature(null);
                  setAgreePolicy(false);
                  setIsSubmitted(false);
                }}
              >
                {c.contractNumber}
              </Button>
            ))}
          </Space>
        </Card>
      )}

      {/* Main Button */}
      {!isSubmitted && (
        <Card style={{ textAlign: "center", padding: 40 }}>
          <Button
            type="primary"
            size="large"
            onClick={handleViewContract}
            style={{
              fontSize: 16,
              height: 48,
              paddingLeft: 32,
              paddingRight: 32,
            }}
          >
            Xem & Ký Hợp Đồng
          </Button>
        </Card>
      )}

      {isSubmitted && (
        <Card style={{ textAlign: "center", padding: 40 }}>
          <Title level={3}>✓ Hợp Đồng Đã Gửi</Title>
          <Text type="secondary">
            Hợp đồng đang chờ xác nhận từ bên cho thuê
          </Text>
        </Card>
      )}

      <Modal
        title="Hợp Đồng Thuê Nhà"
        open={showPdfModal}
        width={920}
        onCancel={() => setShowPdfModal(false)}
        footer={null}
        bodyStyle={{ maxHeight: 700, overflow: "auto" }}
      >
        <div
          ref={pdfContentRef}
          style={{
            backgroundColor: "white",
            padding: 40,
            fontFamily: "Times New Roman, serif",
            fontSize: 15,
            lineHeight: 1.8,
            color: "#000",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: "bold" }}>
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </div>
            <div style={{ fontSize: 13 }}>Độc lập - Tự do - Hạnh phúc</div>
            <div style={{ textDecoration: "overline", marginTop: 8 }}></div>
          </div>

          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: "bold", margin: 0 }}>
              HỢP ĐỒNG THUÊ NHÀ
            </h3>
            <div style={{ marginTop: 10 }}>
              Số: {formattedContract.contractNumber}
            </div>
            <div>
              Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm{" "}
              {new Date().getFullYear()}
            </div>
          </div>

          {/* Info Section */}
          <div style={{ marginBottom: 20 }}>
            <div>
              <span style={{ fontWeight: "bold" }}>Người thuê:</span>{" "}
              {formattedContract.renterName}
            </div>
            <div>
              <span style={{ fontWeight: "bold" }}>Địa chỉ:</span>{" "}
              {formattedContract.address}, {formattedContract.city}
            </div>
            <div>
              <span style={{ fontWeight: "bold" }}>Email:</span>{" "}
              {formattedContract.renterEmail}
            </div>
          </div>

          {/* Thời hạn thuê */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: "bold" }}>Thời hạn thuê:</div>
            <div>
              Từ ngày {formattedContract.startDate} đến ngày{" "}
              {formattedContract.endDate}
            </div>
          </div>

          {/* Apartment Info */}
          <div
            style={{
              marginBottom: 20,
              padding: 12,
              backgroundColor: "#f9f9f9",
              border: "1px solid #ddd",
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: 10 }}>
              THÔNG TIN CĂN HỘ:
            </div>
            <div>
              - Số căn hộ:{" "}
              <span style={{ fontWeight: "bold" }}>
                {formattedContract.apartmentNumber}
              </span>
            </div>
            <div>
              - Địa chỉ:{" "}
              <span style={{ fontWeight: "bold" }}>
                {formattedContract.address}
              </span>
            </div>
            <div>
              - Thành phố:{" "}
              <span style={{ fontWeight: "bold" }}>
                {formattedContract.city}
              </span>
            </div>
            <div>
              - Thời hạn thuê:{" "}
              <span style={{ fontWeight: "bold" }}>
                {formattedContract.startDate}
              </span>{" "}
              đến{" "}
              <span style={{ fontWeight: "bold" }}>
                {formattedContract.endDate}
              </span>
            </div>
            <div>
              - Tiền thuê/tháng:{" "}
              <span style={{ fontWeight: "bold" }}>
                {formattedContract.monthlyRent} VNĐ
              </span>
            </div>
          </div>

          {/* Agreement Section */}
          <div style={{ marginBottom: 16 }}>
            <Checkbox
              checked={agreePolicy}
              onChange={(e) => setAgreePolicy(e.target.checked)}
            >
              <Text strong>
                Tôi đã đọc và đồng ý với tất cả các điều khoản trên
              </Text>
            </Checkbox>
          </div>

          {/* Signature Section */}
          <div
            style={{
              marginTop: 30,
              borderTop: "1px solid #999",
              paddingTop: 20,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ textAlign: "center", width: "45%" }}>
                <div style={{ fontWeight: "bold", marginBottom: 30 }}>
                  BÊN CHO THUÊ
                </div>
                <div
                  style={{
                    height: 60,
                    border: "1px dashed #999",
                    marginBottom: 10,
                  }}
                ></div>
                <div style={{ fontSize: 12 }}>(Ký và ghi rõ họ tên)</div>
              </div>

              <div style={{ textAlign: "center", width: "45%" }}>
                <div style={{ fontWeight: "bold", marginBottom: 30 }}>
                  NGƯỜI THUÊ
                </div>
                {signature ? (
                  <div
                    style={{
                      height: 60,
                      border: "1px solid #ccc",
                      marginBottom: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={signature}
                      style={{ maxHeight: 55, maxWidth: "90%" }}
                      alt="signature"
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      height: 60,
                      border: "1px dashed #999",
                      marginBottom: 10,
                    }}
                  ></div>
                )}
                <div style={{ fontSize: 12 }}>(Ký và ghi rõ họ tên)</div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 20,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button onClick={() => setShowPdfModal(false)}>Đóng</Button>
          <Space>
            {signature && <Button onClick={handleRedoSign}> Ký Lại</Button>}
            {!signature ? (
              <Button
                type="primary"
                onClick={handleSignClick}
                disabled={!agreePolicy}
              >
                Ký
              </Button>
            ) : (
              <Button type="primary" danger onClick={handleSubmit}>
                Gửi Hợp Đồng
              </Button>
            )}
          </Space>
        </div>
      </Modal>

      <Modal
        title=" Ký Điện Tử"
        open={showSignModal}
        width={600}
        onCancel={() => setShowSignModal(false)}
        footer={[
          <Button key="clear" onClick={() => sigRef.current?.clear()}>
            Xóa
          </Button>,
          <Button key="cancel" onClick={() => setShowSignModal(false)}>
            Hủy
          </Button>,
          <Button key="confirm" type="primary" onClick={handleSignConfirm}>
            ✓ Xác nhận Ký
          </Button>,
        ]}
      >
        <div style={{ textAlign: "center" }}>
          <p>Vui lòng ký vào ô bên dưới:</p>
          <SignatureCanvas
            ref={sigRef}
            penColor="black"
            canvasProps={{
              width: 500,
              height: 200,
              style: {
                border: "2px solid #1890ff",
                borderRadius: 8,
                cursor: "crosshair",
                backgroundColor: "white",
              },
            }}
          />
          <p style={{ marginTop: 12, color: "#666", fontSize: 12 }}>
            Sử dụng chuột hoặc touch để ký
          </p>
        </div>
      </Modal>
    </div>
  );
}
