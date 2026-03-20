import { ContractWithMembers } from "@/lib/services/contracts.service";
import { DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import { Card, Button } from "antd";
import { FileText, Eye, User, MapPin, Calendar, Wallet } from "lucide-react";

interface ContractCardProps {
  contract: ContractWithMembers;
  onView: () => void;
  onDownload: () => void;
  onCancel: () => void;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusMap = {
    draft: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      label: "Chưa ký",
    },
    active: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      label: "Đã kích hoạt",
    },
    signed: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      label: "Đã ký",
    },
    terminated: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
      label: "Đã hủy",
    },
  };

  const config =
    statusMap[status as keyof typeof statusMap] || statusMap.terminated;

  return (
    <span
      className={`px-3 py-1.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border} whitespace-nowrap`}
    >
      {config.label}
    </span>
  );
};

export const ContractCard = ({
  contract,
  onView,
  onDownload,
  onCancel,
}: ContractCardProps) => {
  const primaryTenant = contract.members?.find(
    (m) => m.memberType === "primary",
  );

  const startDate = new Date(contract.startDate).toLocaleDateString("vi-VN");
  const endDate = new Date(contract.endDate).toLocaleDateString("vi-VN");
  const monthlyRent = Number(contract.monthlyRent).toLocaleString("vi-VN");

  return (
    <Card
      hoverable
      className="h-full border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      styles={{
        body: {
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        },
      }}
      style={{ borderRadius: "16px", overflow: "hidden" }}
    >
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 bg-blue-50 text-blue-600 rounded-xl">
              <FileText size={22} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 mb-0.5">Mã hợp đồng</span>
              <span className="text-base font-bold text-gray-800 leading-none">
                {contract.contractNumber}
              </span>
            </div>
          </div>
          <StatusBadge status={contract.status} />
        </div>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex items-start gap-3">
            <div className="flex justify-center w-6 pt-0.5">
              <User size={18} className="text-gray-400" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-xs text-gray-500 mb-0.5">
                Người đại diện thuê
              </span>
              <span className="text-sm font-semibold text-gray-800 leading-tight">
                {primaryTenant?.user?.fullName ?? "Chưa cập nhật"}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex justify-center w-6 pt-0.5">
              <MapPin size={18} className="text-gray-400" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-xs text-gray-500 mb-0.5">Căn hộ</span>
              <span className="text-sm font-semibold text-gray-800 leading-tight">
                Phòng {contract.apartment?.apartmentNumber}
              </span>
              <span className="text-xs text-gray-500 mt-1 line-clamp-2">
                {contract.apartment.newAddress.fullAddress}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex justify-center w-6 pt-0.5">
              <Calendar size={18} className="text-gray-400" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-xs text-gray-500 mb-0.5">Thời hạn</span>
              <span className="text-sm font-medium text-gray-800 leading-tight">
                {startDate} <span className="text-gray-400 mx-1">→</span>{" "}
                {endDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center bg-gray-50 px-4 py-3.5 rounded-xl mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 font-medium">Giá thuê</span>
          </div>
          <div className="text-lg font-bold text-blue-600 flex items-center gap-1">
            {monthlyRent}{" "}
            <span className="text-sm underline decoration-1 underline-offset-2">
              đ
            </span>
          </div>
        </div>

        <Button
          type="primary"
          block
          size="large"
          style={{ marginBottom: 10 }}
          onClick={onView}
          className="flex items-center justify-center gap-2 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-200 border-none"
        >
          <Eye size={18} />
          {(contract.status === "signed" ||
            contract.status === "terminated") && (
            <span className="font-medium">Xem hợp đồng</span>
          )}

          {contract.status === "active" && (
            <span className="font-medium">Xem hợp đồng</span>
          )}

          {contract.status === "draft" && (
            <span className="font-medium">Xem & ký hợp đồng</span>
          )}
        </Button>

        {contract.status != "terminated" && contract.status !== "active" && (
          <Button
            block
            size="large"
            style={{ marginBottom: 10 }}
            onClick={onCancel}
            className="flex items-center text-white! bg-red-500! justify-center gap-2 h-11 rounded-xl shadow-sm shadow-red-200! border-red-500! hover:bg-red-600!"
          >
            <DeleteOutlined size={18} />
            <span className="font-medium">Hủy hợp đồng</span>
          </Button>
        )}
        <Button
          block
          size="large"
          onClick={onDownload}
          className="flex items-center justify-center gap-2 h-11 rounded-xl shadow-sm shadow-blue-200 border-none "
        >
          <DownloadOutlined size={18} />
          <span className="font-medium">Tải hợp đồng</span>
        </Button>
      </div>
    </Card>
  );
};
