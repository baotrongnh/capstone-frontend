import { ROUTES } from "@/constants/routes";
import { useUploadContractPdf } from "@/hooks/query/useContracts";
import { ContractWithMembers } from "@/lib/services/contracts.service";
import { Alert, Button, Checkbox, Divider, message, Modal } from "antd";
import { Check, Pen } from "lucide-react";
import { useRouter } from "next/navigation";
import { PDFDocument } from "pdf-lib";
import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

interface ModalAssignContractProps {
  showDetailModal: boolean;
  setShowDetailModal: (value: boolean) => void;
  selectedContract: ContractWithMembers | null;
}

export default function ModalAssignContract({
  showDetailModal,
  setShowDetailModal,
  selectedContract,
}: ModalAssignContractProps) {
  const sigRef = useRef<SignatureCanvas | null>(null);

  const route = useRouter();
  const [signature, setSignature] = useState<string | null>(null);
  const [signedPdfUrl, setSignedPdfUrl] = useState<string | null>(null);
  const [signedPdfBytes, setSignedPdfBytes] = useState<Uint8Array | null>(null);
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const { mutateAsync: uploadContractPdf } = useUploadContractPdf(
    selectedContract?.id || "",
  );

  const dataUrlToBytes = (dataUrl: string): Uint8Array => {
    const arr = dataUrl.split(",");
    const bstr = atob(arr[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return u8arr;
  };

  const embedSignatureInPDF = async (signatureDataUrl: string) => {
    if (!selectedContract?.pdfUrl) {
      message.error("Không tìm thấy URL PDF");
      return null;
    }

    try {
      const pdfUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_PREFIX}${selectedContract.pdfUrl}`;
      const pdfResponse = await fetch(pdfUrl);
      const pdfArrayBuffer = await pdfResponse.arrayBuffer();

      const pdfDoc = await PDFDocument.load(pdfArrayBuffer);

      const pages = pdfDoc.getPages();
      const lastPage = pages[pages.length - 1];
      const { width } = lastPage.getSize();

      const signatureBytes = dataUrlToBytes(signatureDataUrl);

      const signatureImage = await pdfDoc.embedPng(signatureBytes);

      const signatureWidth = 120;
      const signatureHeight = 50;
      const xPosition = width - signatureWidth - 120;
      const yPosition = 250;

      lastPage.drawImage(signatureImage, {
        x: xPosition,
        y: yPosition,
        width: signatureWidth,
        height: signatureHeight,
      });

      const pdfBytes = await pdfDoc.save();

      return pdfBytes;
    } catch (error) {
      console.error("Error embedding signature:", error);
      message.error("Lỗi khi nhúng chữ ký vào PDF");
      return null;
    }
  };

  const handleSignClick = () => {
    if (!agreePolicy) {
      message.warning("Vui lòng đồng ý với chính sách trước khi ký");
      return;
    }
    setShowSignModal(true);
  };

  const handleSignConfirm = async () => {
    if (!sigRef.current || sigRef.current.isEmpty()) {
      message.warning("Vui lòng ký trước khi xác nhận");
      return;
    }

    const signatureData = sigRef.current.toDataURL("image/png");
    setSignature(signatureData);

    const pdfBytes = await embedSignatureInPDF(signatureData);

    if (pdfBytes) {
      const blob = new Blob([new Uint8Array(pdfBytes)], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      setSignedPdfUrl(url);
      setSignedPdfBytes(pdfBytes);

      setShowSignModal(false);
      message.success("Ký thành công! Chữ ký đã được nhúng vào hợp đồng.");
    }
  };

  const handleRedoSign = () => {
    setSignature(null);
    setSignedPdfUrl(null);
    setSignedPdfBytes(null);
    if (sigRef.current) {
      sigRef.current.clear();
    }
    setShowSignModal(true);
  };

  const handleCloseModal = () => {
    if (sigRef.current) {
      sigRef.current.clear();
    }
    setShowDetailModal(false);
    setSignature(null);
    setSignedPdfUrl(null);
    setSignedPdfBytes(null);
    setAgreePolicy(false);
  };

  const handleSendContract = async (contractId: string) => {
    if (!signedPdfBytes) {
      message.error("Không tìm thấy PDF đã ký");
      return;
    }

    const blob = new Blob([new Uint8Array(signedPdfBytes)], {
      type: "application/pdf",
    });

    const file = new File([blob], `contract-${contractId}.pdf`, {
      type: "application/pdf",
    });

    const formData = new FormData();
    formData.append("contractPdf", file);
    formData.append("signedDate", new Date().toISOString());
    formData.append("contractDocumentUrl", "");

    try {
      await uploadContractPdf(formData);
      setShowSignModal(false);

      setShowDetailModal(false);

      route.push(`${ROUTES.PROFILE}/invoices`);
    } catch (error) {
      message.error("Lỗi khi gửi hợp đồng đã ký: " + error);
    }
  };

  return (
    <>
      <Modal
        title="Chi tiết hợp đồng"
        open={showDetailModal}
        onCancel={handleCloseModal}
        width={900}
        centered
        footer={null}
        styles={{
          body: { maxHeight: "80vh", overflowY: "auto", padding: "20px" },
        }}
        style={{ maxWidth: "95vw" }}
      >
        {selectedContract && (
          <div className="space-y-6">
            <Alert
              title={`Hợp đồng: ${selectedContract.contractNumber}`}
              description={`Người thuê: ${selectedContract.members?.[0]?.user?.fullName}`}
              type="info"
              showIcon
            />

            {selectedContract.hasPdf && (
              <div>
                <div style={{ marginBottom: 8, fontWeight: 600 }}></div>
                <iframe
                  src={
                    signedPdfUrl
                      ? `${signedPdfUrl}#toolbar=0&navpanes=0`
                      : `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_PREFIX}${selectedContract.pdfUrl}#toolbar=0&navpanes=0`
                  }
                  style={{
                    width: "100%",
                    height: "400px",
                    border: "1px solid #d9d9d9",
                    borderRadius: "8px",
                  }}
                />
              </div>
            )}

            {!selectedContract.hasPdf && (
              <Alert
                description="Hợp đồng này hiện chưa có tệp PDF."
                type="warning"
                showIcon
              />
            )}

            <Divider />

            {selectedContract.status === "draft" && !signature && (
              <div
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "1px solid #e8e8e8",
                }}
              >
                <Checkbox
                  checked={agreePolicy}
                  onChange={(e) => setAgreePolicy(e.target.checked)}
                >
                  Tôi đồng ý với các điều khoản và điều kiện của hợp đồng này
                </Checkbox>
              </div>
            )}

            {selectedContract.status === "draft" && signature && (
              <Alert
                description="Bạn đã ký hợp đồng. Vui lòng gửi để hoàn tất quá trình."
                type="success"
                showIcon
              />
            )}

            <div className="flex gap-3 justify-end pt-4 ">
              <Button onClick={handleCloseModal}>Đóng</Button>
              {selectedContract.status === "draft" && !signature && (
                <Button
                  type="primary"
                  onClick={handleSignClick}
                  disabled={!agreePolicy}
                  icon={<Pen size={16} />}
                >
                  Ký hợp đồng
                </Button>
              )}
              {selectedContract.status === "draft" && signature && (
                <>
                  <Button onClick={handleRedoSign} icon={<Pen size={16} />}>
                    Ký lại
                  </Button>
                  <Button
                    type="primary"
                    danger
                    loading={isSending}
                    onClick={() => {
                      handleSendContract(selectedContract.id);
                    }}
                    icon={<Check size={16} />}
                  >
                    Gửi hợp đồng
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <Pen size={20} />
            <span>Ký điện tử</span>
          </div>
        }
        open={showSignModal}
        onCancel={() => setShowSignModal(false)}
        width={700}
        footer={[
          <Button key="clear" onClick={() => sigRef.current?.clear()}>
            Xóa
          </Button>,
          <Button key="cancel" onClick={() => setShowSignModal(false)}>
            Hủy
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={handleSignConfirm}
            icon={<Check size={16} />}
          >
            Xác nhận ký
          </Button>,
        ]}
      >
        <div className="space-y-4">
          <Alert
            title="Hướng dẫn ký"
            description="Vui lòng ký vào ô bên dưới. Sử dụng chuột hoặc thiết bị chạm để ký."
            type="info"
            showIcon
          />

          <div
            style={{
              border: "2px solid #1890ff",
              borderRadius: "8px",
              overflow: "hidden",
              backgroundColor: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <SignatureCanvas
              ref={sigRef}
              penColor="black"
              canvasProps={{
                width: 640,
                height: 250,
                style: {
                  display: "block",
                  cursor: "crosshair",
                  backgroundColor: "white",
                },
              }}
            />
          </div>

          <div style={{ fontSize: "12px", color: "#666", textAlign: "center" }}>
            Bạn có thể vẽ lại. Ấn nút Xóa để xoá và thử lại.
          </div>
        </div>
      </Modal>
    </>
  );
}
