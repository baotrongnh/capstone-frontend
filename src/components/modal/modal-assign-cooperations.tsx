import { ROUTES } from "@/constants/routes";
import { useApartmentCooperationContract } from "@/hooks/query/useApartments";
import { useSignCooperationContract } from "@/hooks/query/useContracts";
import { OwnerApartmentResponse } from "@/lib/services/apartment.service";
import { Alert, Button, Checkbox, Divider, message, Modal } from "antd";
import { Check, Pen } from "lucide-react";
import { useRouter } from "next/navigation";
import { PDFDocument } from "pdf-lib";
import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

interface ModalAssignCooperationsProps {
  showDetailModal: boolean;
  setShowDetailModal: (value: boolean) => void;
  selectedContract: OwnerApartmentResponse | null;
}

export default function ModalAssignCooperations({
  showDetailModal,
  setShowDetailModal,
  selectedContract,
}: ModalAssignCooperationsProps) {
  const sigRef = useRef<SignatureCanvas | null>(null);

  const route = useRouter();
  const [signature, setSignature] = useState<string | null>(null);
  const [signedPdfUrl, setSignedPdfUrl] = useState<string | null>(null);
  const [signedPdfBytes, setSignedPdfBytes] = useState<Uint8Array | null>(null);
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const { data: cooperation } = useApartmentCooperationContract(
    selectedContract?.id || "",
  );

  const { mutateAsync: signCooperationContract } = useSignCooperationContract(
    cooperation?.cooperationContractId || "",
  );

  console.log("DADA", cooperation);

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
    if (!cooperation.cooperationContractId) {
      message.error("Không tìm thấy hợp đồng hợp tác");
      return null;
    }

    try {
      const pdfUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_PREFIX}${cooperation.cooperationContractPublicPdfUrl}`;
      const pdfResponse = await fetch(pdfUrl);
      const pdfArrayBuffer = await pdfResponse.arrayBuffer();

      const pdfDoc = await PDFDocument.load(pdfArrayBuffer);

      const pages = pdfDoc.getPages();
      const lastPage = pages[pages.length - 1];
      const { width, height } = lastPage.getSize();

      const signatureBytes = dataUrlToBytes(signatureDataUrl);

      const signatureImage = await pdfDoc.embedPng(signatureBytes);

      const signatureWidth = 100;
      const signatureHeight = 100;
      const xPosition = width / 2 + 60;
      const yPosition = height / 2 - signatureHeight / 2 - 100;

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

  const handleSendCooperationContract = async (contractId: string) => {
    if (!signedPdfBytes) {
      message.error("Không tìm thấy PDF đã ký");
      return;
    }

    const blob = new Blob([new Uint8Array(signedPdfBytes)], {
      type: "application/pdf",
    });

    const file = new File([blob], `cooperation-contract-${contractId}.pdf`, {
      type: "application/pdf",
    });

    const formData = new FormData();
    formData.append("contractPdf", file);
    formData.append("signedDate", new Date().toISOString());

    try {
      setIsSending(true);
      await signCooperationContract(formData);

      setShowSignModal(false);
      setShowDetailModal(false);

      route.push(`${ROUTES.PROFILE}/cooperations`);
    } catch (error) {
      message.error("Lỗi khi gửi hợp đồng đã ký: " + error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Modal
        title="Chi tiết hợp đồng hợp tác"
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
              title={`Hợp đồng hợp tác: ${cooperation?.cooperationContractNumber || "N/A"}`}
              description={`Căn hộ: ${cooperation?.apartmentNumber || "Chưa cập nhật"}`}
              type="info"
              showIcon
            />

            {cooperation?.cooperationContractPublicPdfUrl && (
              <div>
                <div style={{ marginBottom: 8, fontWeight: 600 }}>
                  Xem hợp đồng
                </div>
                <iframe
                  src={
                    signedPdfUrl
                      ? `${signedPdfUrl}#toolbar=0&navpanes=0`
                      : `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_PREFIX}${cooperation.cooperationContractPublicPdfUrl}#toolbar=0&navpanes=0`
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

            {!cooperation?.cooperationContractPublicPdfUrl && (
              <Alert
                description="Hợp đồng này hiện chưa có tệp PDF."
                type="warning"
                showIcon
              />
            )}

            <Divider />

            {cooperation?.cooperationContractStatus === "pending" &&
              !signature && (
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
                    Tôi đồng ý với các điều khoản và điều kiện của hợp đồng hợp
                    tác này
                  </Checkbox>
                </div>
              )}

            {cooperation?.cooperationContractStatus === "pending" &&
              signature && (
                <Alert
                  description="Bạn đã ký hợp đồng. Vui lòng gửi để hoàn tất quá trình."
                  type="success"
                  showIcon
                />
              )}

            <div className="flex gap-3 justify-end pt-4 ">
              <Button onClick={handleCloseModal}>Đóng</Button>
              {cooperation?.cooperationContractStatus === "pending" &&
                !signature && (
                  <Button
                    type="primary"
                    onClick={handleSignClick}
                    disabled={!agreePolicy}
                    icon={<Pen size={16} />}
                  >
                    Ký hợp đồng
                  </Button>
                )}
              {cooperation?.cooperationContractStatus === "pending" &&
                signature && (
                  <>
                    <Button onClick={handleRedoSign} icon={<Pen size={16} />}>
                      Ký lại
                    </Button>
                    <Button
                      type="primary"
                      danger
                      loading={isSending}
                      onClick={() => {
                        handleSendCooperationContract(
                          cooperation?.cooperationContractId ||
                            selectedContract?.id ||
                            "",
                        );
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
