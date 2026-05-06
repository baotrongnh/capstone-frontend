import { OwnerApartmentResponse } from "@/lib/services/apartment.service";
import {
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Card, Dropdown } from "antd";
import { Calendar, Eye, MapPin, User } from "lucide-react";

interface CooperationsCardProps {
  contract: OwnerApartmentResponse;
  onView: () => void;
  onDownload: () => void;
  onCancel: () => void;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusMap = {
    pending: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      label: "Chưa ký",
    },
    available: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      label: "Đã ký",
    },
    inactive: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
      label: "Đã hủy",
    },
    verified: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      label: "Đã xác nhận",
    },
    rejected: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
      label: "Bị từ chối",
    },
  };

  const config =
    statusMap[status as keyof typeof statusMap] || statusMap.pending;

  return (
    <span
      className={`px-3 py-1.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border} whitespace-nowrap`}
    >
      {config.label}
    </span>
  );
};

export const CooperationsCard = ({
  contract,
  onView,
  onDownload,
  onCancel,
}: CooperationsCardProps) => {
  const contractNumber = contract.cooperationContract?.contractNumber;
  const owner = contract.owner?.fullName || "Chưa cập nhật";
  const buildingName = contract.buildingName || "Chưa cập nhật";
  const apartmentNumber = contract.apartmentNumber || "Chưa cập nhật";
  const streetAddress = contract.streetAddress || "Chưa cập nhật";

  const startDate = contract.cooperationContract?.startDate
    ? new Date(contract.cooperationContract.startDate).toLocaleDateString(
        "vi-VN",
      )
    : "N/A";
  const endDate = contract.cooperationContract?.endDate
    ? new Date(contract.cooperationContract.endDate).toLocaleDateString("vi-VN")
    : "N/A";
  const baseRentPrice = Number(contract.baseRentPrice).toLocaleString("vi-VN");

  const actionItems: MenuProps["items"] = [
    {
      key: "view",
      label:
        contract.status === "pending" ? "Xem & ký hợp đồng" : "Xem hợp đồng",
      icon: <Eye size={16} />,
      onClick: () => onView(),
    },
    {
      key: "download",
      label: "Tải hợp đồng",
      icon: <DownloadOutlined />,
      onClick: () => onDownload(),
    },
    contract.status === "pending" && {
      key: "divider",
      type: "divider",
    },
    contract.status === "pending"
      ? {
          key: "cancel",
          label: "Hủy hợp đồng",
          danger: true,
          icon: <DeleteOutlined />,
          onClick: () => onCancel(),
        }
      : null,
  ].filter(Boolean) as MenuProps["items"];

  return (
    <>
      <Card
        className="border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-blue-200"
        styles={{
          body: {
            padding: "0",
            display: "flex",
            flexDirection: "column",
            gap: "0",
          },
        }}
        style={{ borderRadius: "12px", overflow: "hidden" }}
      >
        {/* Header with Contract Number & Status - Full Width */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div>
            <div className="text-xs text-gray-500 font-semibold uppercase mb-1">
              Mã hợp đồng
            </div>
            <div className="text-base font-bold text-gray-900">
              {contractNumber}
            </div>
          </div>
          <StatusBadge status={contract.status} />
        </div>

        {/* Content Section */}
        <div className="flex flex-1 items-stretch">
          {/* Left: Details Content */}
          <div className="flex-1 min-w-0 px-6 py-4 flex flex-col justify-between border-r border-gray-100">
            {/* Row 1: Owner & Building */}
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div className="flex items-start gap-2">
                <User size={16} className="text-blue-600 shrink-0 mt-1" />
                <div className="min-w-0">
                  <div className="text-xs text-gray-500 font-semibold uppercase">
                    Chủ sở hữu
                  </div>
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {owner}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-amber-600 shrink-0 mt-1" />
                <div className="min-w-0">
                  <div className="text-xs text-gray-500 font-semibold uppercase">
                    Toà nhà
                  </div>
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {buildingName}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Apartment & Duration */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-orange-600 shrink-0 mt-1" />
                <div className="min-w-0">
                  <div className="text-xs text-gray-500 font-semibold uppercase">
                    Căn hộ
                  </div>
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    Phòng {apartmentNumber}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar
                  size={16}
                  className="text-emerald-600 shrink-0 mt-1"
                />
                <div className="min-w-0">
                  <div className="text-xs text-gray-500 font-semibold uppercase">
                    Thời hạn
                  </div>
                  <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                    {startDate} → {endDate}
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="mt-5 pt-4 border-t border-gray-200">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-red-600 shrink-0 mt-1" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-500 font-semibold uppercase">
                    Địa chỉ
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {streetAddress}
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="mt-4">
              {contract.status === "pending" && (
                <div className="flex items-center justify-between gap-3 w-full rounded-lg border border-amber-100 bg-amber-50 px-3 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
                    </div>
                    <span className="text-amber-800 text-[13px] py-1 font-semibold">
                      Đang chờ ký
                    </span>
                  </div>
                </div>
              )}

              {contract.status === "verified" && (
                <div className="flex items-center w-full gap-2 bg-emerald-50 px-3 rounded-lg border border-emerald-100 text-xs">
                  <div className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                  </div>
                  <span className="text-emerald-800 text-[13px] py-1 font-semibold">
                    Căn hộ đã được xác nhận!
                  </span>
                </div>
              )}

              {contract.status === "rejected" && (
                <div className="flex items-center w-full gap-2 bg-rose-50 px-3 rounded-lg border border-rose-100 text-xs">
                  <div className="relative flex h-2 w-2 shrink-0">
                    <span className="inline-flex h-full w-full rounded-full bg-rose-400"></span>
                  </div>
                  <span className="text-rose-800 text-[13px] py-1 font-semibold">
                    Căn hộ bị từ chối
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Price & Actions */}
          <div className="flex w-64 shrink-0 flex-col px-5 py-4 border-l border-gray-100 h-full">
            {/* PRICE CARD */}
            <div className="rounded-2xl border border-gray-100 bg-linear-to-br from-white to-blue-50/60 p-5 shadow-sm hover:shadow-md transition-all duration-300">
              {/* HEADER */}
              <div className="w-full">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Giá căn hộ
                  </p>
                  <span className="text-[10px] font-medium text-blue-600 bg-blue-100 px-2.5 py-0.5 rounded-full">
                    VNĐ
                  </span>
                </div>

                <p className="text-[11px] text-gray-400 mt-3">
                  Theo hợp đồng hiện tại
                </p>
              </div>

              {/* PRICE */}
              <div className="mt-4">
                <div className="flex items-end gap-1">
                  <span className="text-[28px] font-bold tracking-tight text-blue-500">
                    {baseRentPrice}
                  </span>
                  <span className="text-sm text-blue-500 pb-1">đ</span>
                </div>

                <p className="text-xs text-gray-400 mt-1">Giá hợp tác</p>
              </div>
            </div>

            {/* BUTTON */}
            <div className="mt-4 pt-4">
              <Dropdown
                menu={{ items: actionItems }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <Button
                  className="
          h-11 w-full 
          rounded-xl 
          bg-blue-600 hover:bg-blue-700 
          text-white 
          shadow-md hover:shadow-lg 
          active:scale-95 
          transition-all duration-200 
          border-none
        "
                >
                  <EyeOutlined />
                  <span className="ml-1 font-medium">Xem thêm</span>
                </Button>
              </Dropdown>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};
