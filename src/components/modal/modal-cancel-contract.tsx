import { useCancelContract } from "@/hooks/query/useContracts";
import { ContractWithMembers } from "@/lib/services/contracts.service";
import { App, Button, Input, Modal } from "antd";
import { AlertTriangle, FileText, Home } from "lucide-react";
import { useState } from "react";

interface ModalContractProps {
  showModalCancelContract: boolean;
  cancel: () => void;
  selectContract: ContractWithMembers | null;
}

export default function ModalCancelContract({
  showModalCancelContract,
  cancel,
  selectContract,
}: ModalContractProps) {
  const [reason, setReason] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { message } = App.useApp();
  const { mutateAsync: cancelContract } = useCancelContract(
    selectContract?.id ?? "",
  );

  const handleCancel = () => {
    setReason("");
    cancel();
  };

  const handleConfirm = async () => {
    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      message.warning("Vui lòng nhập lý do hủy hợp đồng");
      return;
    }

    setIsLoading(true);
    try {
      await cancelContract(trimmedReason);
      handleCancel();
    } catch {
      message.error("Lỗi khi hủy hợp đồng");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={showModalCancelContract}
      onCancel={handleCancel}
      width={520}
      centered
      closable={false}
      footer={null}
      className="[&_.ant-modal-content]:p-0 [&_.ant-modal-content]:rounded-2xl [&_.ant-modal-content]:overflow-hidden"
    >
      {selectContract && (
        <div className="bg-white flex flex-col">
          {/* Header Area */}
          <div className="px-6 pt-6 pb-4 border-b border-slate-100">
            <div className="flex items-start gap-4">
              {/* Warning Icon Badge */}
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
                <AlertTriangle
                  className="text-red-600"
                  size={24}
                  strokeWidth={2}
                />
              </div>
              <div className="pt-1">
                <h2 className="text-xl font-bold text-slate-900 mb-1">
                  Xác nhận hủy hợp đồng
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Thao tác này không thể hoàn tác. Các bên liên quan sẽ nhận
                  được thông báo ngay lập tức.
                </p>
              </div>
            </div>
          </div>

          {/* Body Area */}
          <div className="px-6 py-5 space-y-6">
            {/* Contract Info Cards - Đổi sang tone trung tính cho chuyên nghiệp */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/60 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1.5 text-slate-500">
                  <FileText size={15} />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    Mã hợp đồng
                  </span>
                </div>
                <p className="font-semibold text-base text-slate-900 truncate">
                  {selectContract.contractNumber}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/60 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1.5 text-slate-500">
                  <Home size={15} />
                  <span className="text-xs font-medium uppercase tracking-wide">
                    Căn hộ
                  </span>
                </div>
                <p className="font-semibold text-base text-slate-900 truncate">
                  Phòng {selectContract.apartment?.apartmentNumber}
                </p>
              </div>
            </div>

            {/* Form Section */}
            <div>
              <label className="flex items-center gap-1 text-sm font-semibold text-slate-700 mb-2">
                Lý do hủy <span className="text-red-500">*</span>
              </label>
              <Input.TextArea
                placeholder="Nhập lý do hủy hợp đồng..."
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                rows={4}
                maxLength={300}
                showCount
                className="[&_.ant-input]:rounded-xl"
              />
            </div>
          </div>

          {/* Footer Area */}
          <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex gap-3 justify-end">
            <Button
              size="large"
              onClick={handleCancel}
              disabled={isLoading}
              className="rounded-xl font-medium text-slate-600 border-slate-300 hover:bg-slate-100 hover:text-slate-800"
            >
              Quay lại
            </Button>
            <Button
              type="primary"
              danger
              size="large"
              loading={isLoading}
              onClick={handleConfirm}
              disabled={!reason.trim()}
              className="rounded-xl font-medium px-6 shadow-sm disabled:bg-red-200"
            >
              Xác nhận hủy
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
