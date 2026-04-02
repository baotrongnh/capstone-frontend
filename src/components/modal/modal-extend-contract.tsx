import { useRenewContract } from "@/hooks/query/useContracts";
import { ContractWithMembers } from "@/lib/services/contracts.service";
import { Button, Modal, Select, message } from "antd";
import { AlertCircle, Calendar, FileText } from "lucide-react";
import { useState } from "react";

interface ModalExtendContractProps {
  isOpen: boolean;
  onClose: () => void;
  selectContract: ContractWithMembers | null;
}

const monthOptions = [
  { label: "1 tháng", value: 1 },
  { label: "2 tháng", value: 2 },
  { label: "3 tháng", value: 3 },
  { label: "4 tháng", value: 4 },
  { label: "5 tháng", value: 5 },
  { label: "6 tháng", value: 6 },
  { label: "7 tháng", value: 7 },
  { label: "8 tháng", value: 8 },
  { label: "9 tháng", value: 9 },
  { label: "10 tháng", value: 10 },
  { label: "11 tháng", value: 11 },
  { label: "12 tháng", value: 12 },
];

export default function ModalExtendContract({
  isOpen,
  onClose,
  selectContract,
}: ModalExtendContractProps) {
  const [selectedMonths, setSelectedMonths] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: renewContract } = useRenewContract(
    selectContract?.id ?? "",
  );

  const calculateNewEndDate = () => {
    if (!selectContract || !selectedMonths) return null;
    const currentEndDate = new Date(selectContract.endDate);
    const newEndDate = new Date(currentEndDate);
    newEndDate.setMonth(newEndDate.getMonth() + selectedMonths);
    return newEndDate;
  };

  const newEndDate = calculateNewEndDate();

  const handleCancel = () => {
    setSelectedMonths(null);
    onClose();
  };

  const handleConfirm = async () => {
    if (!selectedMonths) {
      message.warning("Vui lòng chọn số tháng gia hạn");
      return;
    }

    setIsLoading(true);
    try {
      await renewContract(selectedMonths);
      handleCancel();
    } catch (error) {
      console.error("Error in handleConfirm:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      centered
      width={540}
      closable={true}
      style={{ padding: "40px 32px" }}
      className="extend-contract-modal"
    >
      {selectContract && (
        <div className="space-y-6 px-5 py-2">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-sm border border-blue-100">
              <AlertCircle size={22} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl md:text-3xl flex justify-center font-medium text-slate-800">
              Gia hạn hợp đồng thuê
            </h2>
          </div>

          <div className="bg-linear-to-r from-blue-50 to-blue-50/50 border border-blue-200/60 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-blue-200/40">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600/10 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Mã hợp đồng
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {selectContract.contractNumber}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Người thuê
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {selectContract.members?.[0]?.user?.fullName || "N/A"}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Phòng
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {selectContract.apartment?.apartmentNumber}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2 bg-white/90 rounded-lg p-3">
                <Calendar className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Bắt đầu
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {new Date(selectContract.endDate).toLocaleDateString(
                      "vi-VN",
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 bg-white/90 rounded-lg p-3">
                <Calendar className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Hết hạn
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {newEndDate
                      ? newEndDate.toLocaleDateString("vi-VN")
                      : new Date(selectContract.endDate).toLocaleDateString(
                          "vi-VN",
                        )}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-blue-100 rounded-lg p-3">
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Tiền thuê hàng tháng
                </p>
                <p className="text-base font-bold text-blue-700">
                  {new Intl.NumberFormat("vi-VN").format(
                    Number(selectContract.monthlyRent || 0),
                  )}{" "}
                  <span className="text-sm">đ</span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-900">
              Chọn thời gian gia hạn <span className="text-red-500">*</span>
            </label>
            <Select
              placeholder="Chọn số tháng gia hạn"
              value={selectedMonths}
              onChange={setSelectedMonths}
              options={monthOptions}
              className="w-full"
              size="large"
              status={selectedMonths ? "" : ""}
              style={{
                fontSize: "14px",
              }}
            />
          </div>

          <div className="flex gap-3 bg-amber-50/70 border border-amber-200 rounded-xl p-2">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-800 leading-relaxed">
              <span className="font-semibold">Lưu ý:</span> Các bên liên quan sẽ
              được thông báo ngay khi hợp đồng được gia hạn.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleCancel}
              className="flex-1 rounded-xl! h-10! text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border-0 transition-all duration-200"
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              onClick={handleConfirm}
              loading={isLoading}
              className="flex-1 rounded-xl! h-10! text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 shadow-lg shadow-blue-600/30 transition-all duration-200"
              disabled={selectedMonths === null}
            >
              Chấp nhận gia hạn
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
