import { ContractWithMembers } from "@/lib/services/contracts.service";
import { Modal, Button, Select, message, Divider, Space, Tag } from "antd";
import { useState } from "react";
import { AlertCircle, FileText, Home } from "lucide-react";
import { useCancelContract } from "@/hooks/query/useContracts";

interface ModalContractProps {
  showModalCancelContract: boolean;
  cancel: () => void;
  selectContract: ContractWithMembers | null;
}

const reasonOptions = [
  {
    label: " Người thuê yêu cầu hủy",
    value: "tenant_request",
    description: "Người thuê chủ động yêu cầu hủy hợp đồng",
  },
  {
    label: "Chủ nhà yêu cầu hủy",
    value: "landlord_request",
    description: "Chủ nhà chủ động yêu cầu hủy hợp đồng",
  },
  {
    label: "Vi phạm điều khoản hợp đồng",
    value: "violation",
    description: "Một trong các bên vi phạm điều khoản",
  },
  {
    label: "Không thanh toán đầy đủ",
    value: "non_payment",
    description: "Không thanh toán tiền thuê hoặc chi phí",
  },
  {
    label: "Thỏa thuận chung",
    value: "mutual_agreement",
    description: "Cả hai bên đồng ý hủy hợp đồng",
  },
  {
    label: "Lý do khác",
    value: "other",
    description: "Các lý do không nằm trong danh sách trên",
  },
];

export default function ModalCancelContract({
  showModalCancelContract,
  cancel,
  selectContract,
}: ModalContractProps) {
  const [reason, setReason] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: cancelContract } = useCancelContract(
    selectContract?.id ?? "",
  );

  const handleCancel = () => {
    setReason("");
    cancel();
  };

  const handleConfirm = async () => {
    if (!reason) {
      message.warning("Vui lòng chọn lý do hủy hợp đồng");
      return;
    }

    setIsLoading(true);
    try {
      await cancelContract(reason);
      handleCancel();
    } catch (error) {
      message.error("Lỗi khi hủy hợp đồng");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedOption = reasonOptions.find((opt) => opt.value === reason);

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
              Thông tin hợp đồng
            </p>

            <div className="grid grid-cols-2 gap-4 mb-1">
              <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={16} className="text-blue-600" />
                  <span className="text-xs font-semibold text-blue-900">
                    Mã hợp đồng
                  </span>
                </div>
                <p className="font-bold text-lg text-slate-900 truncate">
                  {selectContract.contractNumber}
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
                  Phòng {selectContract.apartment?.apartmentNumber}
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
              <Select
                placeholder="Chọn lý do hủy..."
                value={reason || undefined}
                onChange={setReason}
                options={reasonOptions}
                size="large"
                className="w-full"
                style={{ height: "44px" }}
              />
            </div>

            {selectedOption && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-600 font-medium mb-1">
                  Lý do được chọn:
                </p>
                <p className="text-sm font-semibold text-slate-900 mb-1">
                  {selectedOption.label}
                </p>
                <p className="text-xs text-slate-600">
                  {selectedOption.description}
                </p>
              </div>
            )}
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
              disabled={!reason}
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
