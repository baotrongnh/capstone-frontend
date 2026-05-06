import { ContractWithMembers } from "@/lib/services/contracts.service";
import {
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Card, Dropdown } from "antd";
import { Calendar, Eye, MapPin, User, WalletCards } from "lucide-react";

interface ContractCardProps {
  contract: ContractWithMembers;
  onView: () => void;
  onDownload: () => void;
  onRedirectInvoice: () => void;
  onCancel: () => void;
  onExtend: () => void;
  onAddMember: () => void;
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
      label: "Đã ký",
    },
    signed: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      label: "Đã ký",
    },
    terminated: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
      label: "Đã hủy",
    },
    renewal: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      label: "Gia hạn",
    },
    expired: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
      label: "Đã hết hạn",
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
  onRedirectInvoice,
  onExtend,
  onAddMember,
}: ContractCardProps) => {
  const primaryTenant = contract.members?.find(
    (m) => m.memberType === "primary",
  );
  const members = contract.members ?? [];
  const memberNames = members.map((member) => member.user.fullName);

  const startDate = new Date(contract.startDate).toLocaleDateString("vi-VN");
  const endDate = new Date(contract.endDate).toLocaleDateString("vi-VN");
  const monthlyRent = Number(contract.monthlyRent).toLocaleString("vi-VN");
  const isPaymentPending =
    contract.status === "signed" && !contract.isDepositPaid;

  const actionItems: MenuProps["items"] = [
    {
      key: "view",
      label: contract.status === "draft" ? "Xem & ký hợp đồng" : "Xem hợp đồng",
      icon: <Eye size={16} />,
      onClick: () => onView(),
    },
    {
      key: "download",
      label: "Tải hợp đồng",
      icon: <DownloadOutlined />,
      onClick: () => onDownload(),
    },

    contract.status === "draft"
      ? {
          key: "add-member",
          label: "Thêm thành viên",
          icon: <User size={16} />,
          onClick: () => onAddMember(),
        }
      : null,
    contract.isRenewed === false && contract.status === "active"
      ? {
          key: "extend",
          label: "Gia hạn hợp đồng",
          icon: <WalletCards size={16} />,
          onClick: () => onExtend(),
        }
      : null,
    {
      key: "divider",
      type: "divider",
    },
    contract.status !== "terminated"
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
              {contract.contractNumber}
            </div>
          </div>
          <StatusBadge
            status={
              contract.category === "renewal" &&
              contract.status !== "terminated"
                ? "renewal"
                : contract.status
            }
          />
        </div>

        {/* Content Section */}
        <div className="flex flex-1 items-stretch">
          {/* Left: Details Content */}
          <div className="flex-1 min-w-0 px-6 py-4 flex flex-col justify-between border-r border-gray-100">
            {/* Row 1: Tenant & Apartment */}
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div className="flex items-start gap-2">
                <User size={16} className="text-blue-600 shrink-0 mt-1" />
                <div className="min-w-0">
                  <div className="text-xs text-gray-500 font-semibold uppercase">
                    Người đại diện
                  </div>
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {primaryTenant?.user?.fullName ?? "Chưa cập nhật"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-amber-600 shrink-0 mt-1" />
                <div className="min-w-0">
                  <div className="text-xs text-gray-500 font-semibold uppercase">
                    Căn hộ
                  </div>
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    Phòng {contract.apartment?.apartmentNumber}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Address & Duration */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-orange-600 shrink-0 mt-1" />
                <div className="min-w-0">
                  <div className="text-xs text-gray-500 font-semibold uppercase">
                    Địa chỉ
                  </div>
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {contract.apartment?.streetAddress}
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

            <div className="mt-5 h-px w-full bg-gray-200"></div>

            {/* Members */}
            <div className="mt-4  items-start gap-2 text-sm">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 shrink-0 mt-0.5">
                Thành viên (Tối đa: {contract.apartment?.maxOccupants})
              </span>
              <div className="min-w-0 text-gray-700">
                {memberNames.length > 0 ? (
                  <span className="font-medium">
                    {memberNames.slice(0, 2).join(", ")}
                    {memberNames.length > 2
                      ? ` +${memberNames.length - 2}`
                      : ""}
                  </span>
                ) : (
                  <span className="text-gray-500">
                    Chưa có thông tin thành viên
                  </span>
                )}
              </div>
            </div>

            {/* Alerts */}
            <div className="mt-4">
              {isPaymentPending && (
                <div className="flex items-center justify-between gap-3 w-full rounded-lg border border-blue-100 bg-blue-50 px-3  text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-blue-400"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                    </div>
                    <span className="text-blue-800 text-[13px] py-1 font-semibold">
                      Chưa thanh toán hợp đồng
                    </span>
                  </div>
                  <Button
                    type="link"
                    onClick={onRedirectInvoice}
                    className="h-auto p-0 text-blue-700! font-semibold underline"
                  >
                    Thanh toán ngay
                  </Button>
                </div>
              )}

              {contract.status === "active" && contract.isDepositPaid && (
                <div className="flex items-center w-full gap-2 bg-emerald-50 px-3  rounded-lg border border-emerald-100 text-xs">
                  <div className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                  </div>
                  <span className="text-emerald-800 text-[13px] py-1 font-semibold">
                    Hợp đồng đã kích hoạt
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Price & Actions */}
          <div className="flex w-full shrink-0 flex-col px-5 py-4 md:w-64 md:border-l md:border-gray-100 h-full">
            {/* PRICE CARD */}
            <div className="rounded-2xl border border-gray-100 bg-linear-to-br from-white to-blue-50/60 p-5 shadow-sm hover:shadow-md transition-all duration-300">
              {/* HEADER */}
              <div className="w-full">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Giá thuê
                  </p>
                  <span className="text-[10px] font-medium text-blue-600 bg-blue-100 px-2.5 py-0.5 rounded-full">
                    VNĐ / tháng
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
                    {monthlyRent}
                  </span>
                  <span className="text-sm text-blue-500 pb-1">đ</span>
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  Thanh toán hàng tháng
                </p>
              </div>
            </div>

            {/* BUTTON LUÔN Ở ĐÁY */}
            <div className="mt-4 pt-4 ">
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
