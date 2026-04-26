import { useCancelCooperation } from "@/hooks/query/useContracts";
import { OwnerApartmentResponse } from "@/lib/services/apartment.service";
import { App, Button, Divider, Input, Modal } from "antd";
import { AlertCircle, FileText, Home } from "lucide-react";
import { useState } from "react";

interface ModalCancelContractProps {
  showModalCancelContract: boolean;
  cancel: () => void;
  selectContract: OwnerApartmentResponse | null;
}

export default function ModalCancelCooperations({
  showModalCancelContract,
  cancel,
  selectContract,
}: ModalCancelContractProps) {
  const [reason, setReason] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { message } = App.useApp();
  const { mutateAsync: cancelCooperation } = useCancelCooperation(
    selectContract?.cooperationContract?.id ?? "",
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
      await cancelCooperation(trimmedReason);
      handleCancel();
    } catch {
      message.error("Lỗi khi hủy hợp đồng");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div className="flex px-8 items-center gap-3 -ml-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Hủy hợp đồng</h2>
            <p className="text-xs text-slate-500">Quản lý hợp đồng của bạn</p>
          </div>
        </div>
      }
      open={showModalCancelContract}
      onCancel={handleCancel}
      width={600}
      centered
      footer={null}
    >
      {selectContract && (
        <div className="bg-white">
          <div className="bg-linear-to-r from-orange-50 to-red-50 border-l-4 border-red-500 p-4 mx-6 mt-6 rounded-lg">
            <div className="flex gap-3">
              <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900 text-sm mb-1">
                  Thao tác này sẽ hủy hợp đồng
                </p>
                <p className="text-xs text-red-700">
                  Hủy hợp đồng là thao tác quan trọng. Các bên liên quan sẽ được
                  thông báo ngay lập tức.
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-4 tracking-wide">
              Thông tin căn hộ
            </p>

            <div className="grid grid-cols-2 gap-4 mb-1">
              <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={16} className="text-blue-600" />
                  <span className="text-xs font-semibold text-blue-900">
                    Mã căn hộ
                  </span>
                </div>
                <p className="font-bold text-lg text-slate-900 truncate">
                  {selectContract.apartmentNumber}
                </p>
              </div>

              <div className="bg-linear-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
                <div className="flex items-center gap-2 mb-2">
                  <Home size={16} className="text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-900">
                    Căn hộ
                  </span>
                </div>
                <p className="font-bold text-lg text-slate-900 truncate">
                  {selectContract?.buildingName || "Chưa cập nhật"}
                </p>
              </div>
            </div>
          </div>

          <Divider />

          <div className="px-6 py-5">
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-4">
                <span className="text-red-500">*</span> Lý do hủy hợp đồng
              </label>
              <Input.TextArea
                placeholder="Nhập lý do hủy hợp đồng..."
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                rows={4}
                maxLength={300}
                showCount
              />
            </div>
          </div>

          <div className="px-6 py-5 bg-slate-50 border-t border-slate-200 rounded-b-lg flex gap-3 justify-end">
            <Button
              size="large"
              onClick={handleCancel}
              className="rounded-lg font-semibold min-w-32"
            >
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              danger
              size="large"
              loading={isLoading}
              onClick={handleConfirm}
              disabled={!reason.trim()}
              className="rounded-lg font-semibold min-w-40"
            >
              Xác nhận hủy
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
