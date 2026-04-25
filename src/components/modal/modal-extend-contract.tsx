import { useRenewContract } from "@/hooks/query/useContracts";
import { useSearchNational } from "@/hooks/query/useUser";
import { ContractWithMembers } from "@/lib/services/contracts.service";
import { Button, Form, Input, Modal, Select, Spin } from "antd";
import { AlertCircle, Calendar, FileText } from "lucide-react";
import { ReactNode, useState } from "react";

interface ModalExtendContractProps {
  isOpen: boolean;
  onClose: () => void;
  selectContract: ContractWithMembers | null;
}

interface MemberOption {
  label: ReactNode;
  value: string;
  data: {
    nationalId: string;
    fullName: string;
    email: string;
  };
}

const monthOptions = [
  { label: "6 tháng", value: 6 },
  { label: "12 tháng", value: 12 },
  { label: "18 tháng", value: 18 },
  { label: "24 tháng", value: 24 },
];

export default function ModalExtendContract({
  isOpen,
  onClose,
  selectContract,
}: ModalExtendContractProps) {
  const [form] = Form.useForm();
  const [selectedMonths, setSelectedMonths] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState("keep");
  const [searchValue, setSearchValue] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<
    Map<string, { nationalId: string; fullName: string; email: string }>
  >(new Map());

  const { data: getNational, isLoading: isSearching } = useSearchNational(
    searchValue.length === 12 ? searchValue : "",
  );

  const autocompleteOptions = getNational
    ? [
        {
          label: (
            <div className="py-1">
              <div className="font-semibold text-gray-900">
                {getNational.fullName}
              </div>
              <div className="text-xs text-gray-500">
                CCCD: {getNational.identity?.nationalId}
              </div>
              {getNational.email && (
                <div className="text-xs text-gray-400">{getNational.email}</div>
              )}
            </div>
          ),
          value: getNational.identity?.nationalId || "",
          data: {
            nationalId: getNational.identity?.nationalId || "",
            fullName: getNational.fullName,
            email: getNational.email,
          },
        },
      ]
    : [];

  const { mutateAsync: renewContract } = useRenewContract(
    selectContract?.id ?? "",
  );

  const calculateNewEndDate = () => {
    if (!selectContract) return null;

    const startDate = new Date(selectContract.startDate);
    const currentEndDate = new Date(selectContract.endDate);

    if (options === "keep") {
      // Calculate contract duration in months
      const monthsDuration =
        (currentEndDate.getFullYear() - startDate.getFullYear()) * 12 +
        (currentEndDate.getMonth() - startDate.getMonth());

      const newEndDate = new Date(currentEndDate);
      newEndDate.setMonth(newEndDate.getMonth() + monthsDuration);
      return newEndDate;
    } else if (options === "change" && selectedMonths) {
      const newEndDate = new Date(currentEndDate);
      newEndDate.setMonth(newEndDate.getMonth() + selectedMonths);
      return newEndDate;
    }

    return null;
  };

  const newEndDate = calculateNewEndDate();

  const handleMemberSelect = (value: string, option: MemberOption) => {
    const memberData = option.data;
    const nationalId = memberData.nationalId;

    if (selectedMembers.has(nationalId)) {
      setSearchValue("");
      return;
    }

    const newSelected = new Map(selectedMembers);
    newSelected.set(nationalId, memberData);
    setSelectedMembers(newSelected);

    setSearchValue("");
  };

  const handleCancel = () => {
    setSelectedMonths(null);
    setSearchValue("");
    setSelectedMembers(new Map());
    onClose();
  };

  const handleConfirm = async () => {
    const value = form.getFieldsValue();
    const payloadChange = {
      renewalOption: "customize",
      extensionMonths: value.extensionMonths,
      memberNationalIds: Array.from(selectedMembers.values()).map(
        (member) => member.nationalId,
      ),
    };
    console.log("VALUE", payloadChange);

    const payloadKeep = {
      renewalOption: "keep_current",
    };
    setIsLoading(true);
    try {
      if (options === "change") {
        await renewContract(payloadChange);
      } else {
        await renewContract(payloadKeep);
      }
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
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-sm border border-blue-100">
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

          <div className="flex justify-between px-5">
            <Button
              className={options === "keep" ? "bg-blue-600! text-white!" : ""}
              onClick={() => setOptions("keep")}
            >
              Gia hạn giữ nguyên
            </Button>
            <Button
              className={options === "change" ? "bg-blue-600! text-white!" : ""}
              onClick={() => setOptions("change")}
            >
              Gia hạn có thay đổi
            </Button>
          </div>

          <Form form={form} layout="vertical">
            {options === "change" && (
              <>
                <div className="space-y-4">
                  <Form.Item
                    name="extensionMonths"
                    label="Số tháng muốn gia hạn"
                    required
                  >
                    <Select
                      placeholder="Chọn số tháng gia hạn"
                      value={selectedMonths}
                      onChange={setSelectedMonths}
                      options={monthOptions}
                      className="w-full"
                      size="large"
                      style={{
                        fontSize: "14px",
                      }}
                    />
                  </Form.Item>

                  <Form.Item label="Thêm thành viên (tìm kiếm bằng CCCD)">
                    <Input
                      type="text"
                      inputMode="numeric"
                      maxLength={12}
                      placeholder="Nhập 12 số CCCD"
                      value={searchValue}
                      onChange={(e) => {
                        const digitsOnly = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 12);
                        setSearchValue(digitsOnly);
                      }}
                      className="w-full h-10 rounded-lg"
                    />
                    {autocompleteOptions.length > 0 &&
                      searchValue.length === 12 && (
                        <div className="mt-2 border rounded-lg bg-white shadow-lg">
                          {autocompleteOptions.map((option) => (
                            <div
                              key={option.value}
                              onClick={() =>
                                handleMemberSelect(
                                  option.value,
                                  option as MemberOption,
                                )
                              }
                              className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                            >
                              {option.label}
                            </div>
                          ))}
                        </div>
                      )}
                    {isSearching && searchValue.length === 12 && (
                      <div className="mt-2 flex justify-center">
                        <Spin size="small" />
                      </div>
                    )}
                    {searchValue.length === 12 &&
                      !isSearching &&
                      autocompleteOptions.length === 0 && (
                        <div className="mt-2 text-center text-gray-500 text-sm">
                          Không tìm thấy người dùng
                        </div>
                      )}
                  </Form.Item>

                  {selectedMembers.size > 0 && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Thành viên đã chọn
                      </label>
                      {Array.from(selectedMembers.values()).map((member) => (
                        <div
                          key={member.nationalId}
                          className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="font-medium text-sm text-gray-900">
                                {member.fullName}
                              </div>
                              <div className="text-xs text-gray-500">
                                Email: {member.email}
                              </div>
                              <div className="text-xs text-gray-500">
                                Căn cước công dân: {member.nationalId}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              const next = new Map(selectedMembers);
                              next.delete(member.nationalId);
                              setSelectedMembers(next);
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors ml-2 shrink-0"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </Form>

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
            >
              Chấp nhận gia hạn
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
