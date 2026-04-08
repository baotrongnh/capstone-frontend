import { OwnerApartmentResponse } from "@/lib/services/apartment.service";
import { DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import { Calendar, Eye, MapPin, User } from "lucide-react";

interface CooperationsCardProps {
  contract: OwnerApartmentResponse;
  onView: () => void;
  onDownload: () => void;
  onRedirectInvoice: () => void;
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
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      label: "đã ký",
    },
    inactive: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      label: "đã hủy",
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
  const startDate = contract.cooperationContract?.startDate
    ? new Date(contract.cooperationContract.startDate).toLocaleDateString(
        "vi-VN",
      )
    : "N/A";
  const endDate = contract.cooperationContract?.endDate
    ? new Date(contract.cooperationContract.endDate).toLocaleDateString("vi-VN")
    : "N/A";
  const baseRentPrice = Number(contract.baseRentPrice).toLocaleString("vi-VN");
  const contractNumber = contract.cooperationContract?.contractNumber;

  console.log("CON", contract);

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
                {contractNumber}
              </span>
            </div>
          </div>
          <div className="flex gap-2 items-center flex-wrap justify-end">
            <StatusBadge status={contract.status} />
          </div>
        </div>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex items-start gap-3">
            <div className="flex justify-center w-6 pt-0.5">
              <User size={18} className="text-gray-400" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-xs text-gray-500 ">Chủ sở hữu</span>
              <span className="text-sm font-semibold text-gray-800 leading-tight">
                {contract.owner?.fullName || "Chưa cập nhật"}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex justify-center w-6 pt-0.5">
              <MapPin size={18} className="text-gray-400" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-xs text-gray-500 mb-0.5">Toà nhà</span>
              <span className="text-sm font-semibold text-gray-800 leading-tight">
                {contract.buildingName || "Chưa cập nhật"}
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
                Phòng {contract.apartmentNumber || "Chưa cập nhật"}
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
                {contract.streetAddress || "Chưa cập nhật"}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex justify-center w-6 pt-0.5">
              <Calendar size={18} className="text-gray-400" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-xs text-gray-500 mb-0.5">
                Thời hạn hợp tác
              </span>
              <span className="text-sm font-medium text-gray-800 leading-tight">
                {startDate} <span className="text-gray-400 mx-1">→</span>{" "}
                {endDate}
              </span>
            </div>
          </div>

          {contract.status === "pending" && (
            <div className="flex bg-amber-50 border border-amber-100 p-3 rounded-lg shadow-sm">
              <div className="w-full">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-600"></span>
                  </div>
                  <p className="text-sm font-medium text-amber-800">
                    <span className="font-bold mr-1">Lưu ý:</span>
                    Đang chờ ký
                  </p>
                </div>
              </div>
            </div>
          )}

          {contract.status === "verified" && (
            <div className="flex bg-emerald-50 border border-emerald-100 p-3 rounded-lg shadow-sm">
              <div className="w-full">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-600"></span>
                  </div>
                  <p className="text-sm font-medium text-green-800">
                    <span className="font-bold mr-1">Lưu ý:</span>
                    Căn hộ đã được xác nhận!
                  </p>
                </div>
              </div>
            </div>
          )}

          {contract.status === "rejected" && (
            <div className="flex bg-rose-50 border border-rose-100 p-3 rounded-lg shadow-sm">
              <div className="w-full">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-2.5 w-2.5">
                    <span className="inline-flex h-full w-full rounded-full bg-rose-400"></span>
                  </div>
                  <p className="text-sm font-medium text-rose-800">
                    <span className="font-bold mr-1">Lưu ý:</span>
                    Căn hộ bị từ chối
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
            <span className="text-sm text-gray-600 font-medium">
              Giá căn hộ
            </span>
          </div>
          <div className="text-lg font-bold text-blue-600 flex items-center gap-1">
            {baseRentPrice}{" "}
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
          {contract.status === "pending" ? (
            <>
              <span className="font-medium">Xem & ký hợp đồng</span>
            </>
          ) : (
            <>
              <span className="font-medium">Xem hợp đồng</span>
            </>
          )}
        </Button>

        {contract.status === "pending" && (
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
          style={{ marginBottom: 10 }}
          onClick={onDownload}
        >
          <DownloadOutlined size={18} />
          <span className="font-medium">Tải hợp đồng</span>
        </Button>
      </div>
    </Card>
  );
};
