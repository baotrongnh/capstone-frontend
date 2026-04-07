import { ContractWithMembers } from "@/lib/services/contracts.service";
import { DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
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

  console.log("DA", contract);

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
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 mb-0.5">Mã hợp đồng</span>
              <span className="text-base font-bold text-gray-800 leading-none">
                {contract.contractNumber}
              </span>
            </div>
          </div>
          <div className="flex gap-2 items-center flex-wrap justify-end">
            {contract.category == "renewal" &&
            contract.status !== "terminated" ? (
              <StatusBadge status={"renewal"} />
            ) : (
              <StatusBadge status={contract.status} />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex justify-between gap-3">
            <div className="flex gap-3.5">
              <div className="flex justify-center w-6 pt-0.5">
                <User size={18} className="text-gray-400" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-xs text-gray-500 ">
                  Người đại diện thuê
                </span>
                <span className="text-sm font-semibold text-gray-800 leading-tight">
                  {primaryTenant?.user?.fullName ?? "Chưa cập nhật"}
                </span>
              </div>
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
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex justify-center w-6 pt-0.5">
              <MapPin size={18} className="text-gray-400" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-xs text-gray-500 mb-0.5">Địa chỉ</span>
              <span className="text-sm font-semibold text-gray-800 leading-tight">
                {contract.apartment?.streetAddress || "Chưa cập nhật"}
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

          {contract.members?.length >= 0 && (
            <div className="flex gap-3.5">
              <div className="flex justify-center w-6 pt-0.5">
                <User size={18} className="text-gray-400" />
              </div>
              <div className="flex flex-col flex-1 gap-2">
                <span className="text-xs text-gray-500">
                  Thành viên khác (Tối đa:{" "}
                  {contract.apartment?.numberOfBedrooms} thành viên)
                </span>
                <div className="space-y-2">
                  {contract.members?.map((member, index) => {
                    return (
                      <div
                        key={index}
                        className="text-sm font-medium text-gray-800 mb-2"
                      >
                        {index + 1}/ {member.user?.fullName || "Chưa cập nhật"}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {contract.status === "signed" && contract.isDepositPaid == false && (
            <div className="flex bg-blue-50 border border-blue-100 p-3 rounded-lg shadow-sm">
              <div className="w-full">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                  </div>
                  <p className="text-sm font-medium text-blue-800">
                    <span className="font-bold mr-1">Lưu ý:</span>
                    Chưa thanh toán
                  </p>
                </div>
                <div
                  className="flex justify-center items-center ml-3"
                  onClick={onRedirectInvoice}
                >
                  <p className="text-blue-600 hover:text-blue-800 text-sm font-medium underline mt-2 cursor-pointer">
                    Thanh toán hợp đồng ngay!
                  </p>
                </div>
              </div>
            </div>
          )}

          {contract.status === "active" && contract.isDepositPaid === true && (
            <div className="flex bg-emerald-50 border border-emerald-100 p-3 rounded-lg shadow-sm">
              <div className="w-full">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-600"></span>
                  </div>
                  <p className="text-sm font-medium text-green-800">
                    <span className="font-bold mr-1">Lưu ý:</span>
                    Hợp đồng đã thanh toán và được kích hoạt!
                  </p>
                </div>
              </div>
            </div>
          )}

          {contract.isDepositPaid === true && contract.status !== "active" && (
            <div className="flex bg-emerald-50 border border-emerald-100 p-3 rounded-lg shadow-sm">
              <div className="w-full">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-600"></span>
                  </div>
                  <p className="text-sm font-medium text-green-800">
                    <span className="font-bold mr-1">Lưu ý:</span>
                    Hợp đồng đã thanh toán và đang chờ kích hoạt!
                  </p>
                </div>
              </div>
            </div>
          )}
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
          className="flex items-center justify-center gap-2 h-9! rounded-xl bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-200 border-none"
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

        {contract.status != "terminated" &&
          contract.status !== "active" &&
          contract.isDepositPaid === false && (
            <Button
              block
              size="large"
              style={{ marginBottom: 10 }}
              onClick={onCancel}
              className="flex items-center text-white! bg-red-500! justify-center gap-2 h-9! rounded-xl shadow-sm shadow-red-200! border-red-500! hover:bg-red-600!"
            >
              <DeleteOutlined size={18} />
              <span className="font-medium">Hủy hợp đồng</span>
            </Button>
          )}

        {contract.isRenewed === false && contract.status === "active" && (
          <>
            <Button
              block
              size="large"
              onClick={onExtend}
              className=" bg-[#07b873]! text-white! h-9! hover:bg-[#059a60]! border-none! mb-3!"
            >
              <WalletCards size={18} />
              <span className="font-medium">Gia hạn hợp đồng</span>
            </Button>
          </>
        )}

        {contract.status == "draft" && (
          <>
            <Button
              block
              size="large"
              onClick={onAddMember}
              className=" bg-yellow-500! text-white! h-9! hover:bg-yellow-600! border-none! mb-3!"
            >
              <User size={18} />
              <span className="font-medium">Thêm thành viên</span>
            </Button>
          </>
        )}

        <Button
          block
          size="large"
          onClick={onDownload}
          className="flex items-center justify-center gap-2 h-9! rounded-xl shadow-sm shadow-blue-200 border-none "
        >
          <DownloadOutlined size={18} />
          <span className="font-medium">Tải hợp đồng</span>
        </Button>
      </div>
    </Card>
  );
};
