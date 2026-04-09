"use client";

import { Card, Empty, Select, Spin, Typography } from "antd";
import { AlertCircle, FileCheck, FileEdit, Files } from "lucide-react";
import { useMemo, useState } from "react";

import { CooperationsCard } from "@/components/layout/card-cooperations-layout";
import ModalAssignCooperations from "@/components/modal/modal-assign-cooperations";
import ModalCancelCooperations from "@/components/modal/modal-cancel-cooperations";
import { ROUTES } from "@/constants/routes";
import { useApartmentOwner } from "@/hooks/query/useApartments";
import { OwnerApartmentResponse } from "@/lib/services/apartment.service";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

type StatusFilter = "all" | "pending" | "available";

export default function CooperationsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedContractId, setSelectedContractId] = useState<string | null>(
    null,
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showModalCancelContract, setShowModalCancelContract] = useState(false);
  const router = useRouter();

  const user = useAuthStore((state) => state.user);

  const { data, isLoading } = useApartmentOwner(user?.id || "");

  const contractsList = useMemo<OwnerApartmentResponse[]>(() => {
    return (data ?? []) as OwnerApartmentResponse[];
  }, [data]);

  console.log("AAA", contractsList);

  const filteredContracts = useMemo(() => {
    const baseContracts = contractsList.filter(
      (c) =>
        c.status === "pending" ||
        c.status === "available" ||
        c.status === "reserved" ||
        c.status === "inactive",
    );

    if (statusFilter === "all") {
      return baseContracts;
    }

    return baseContracts.filter((c) => c.status === statusFilter);
  }, [contractsList, statusFilter]);

  const selectedContract = useMemo(() => {
    return (
      contractsList.find(
        (c: OwnerApartmentResponse) => c.id === selectedContractId,
      ) ?? null
    );
  }, [contractsList, selectedContractId]);

  const handleViewContract = (apartmentId: string) => {
    setSelectedContractId(apartmentId);
    setShowDetailModal(true);
  };

  const handleDownloadContract = async (apartmentId: string) => {
    const contract = filteredContracts.find((c) => c.id === apartmentId);
    if (!contract?.cooperationContract?.cooperationContractPublicPdfUrl) {
      alert("Không tìm thấy file PDF để tải");
      return;
    }

    try {
      const pdfUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_PREFIX}${contract.cooperationContract.cooperationContractPublicPdfUrl}`;

      const response = await fetch(pdfUrl);
      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${contract.cooperationContract.contractNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Lỗi khi tải file PDF");
    }
  };

  const handleCancelContract = (contractId: string) => {
    setSelectedContractId(contractId);
    setShowModalCancelContract(true);
  };

  const handleRedirectInvoice = () => {
    router.push(`${ROUTES.PROFILE}/invoices`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
        <Spin size="large" />
        <Text className="mt-4 text-gray-500">
          Đang tải danh sách hợp đồng...
        </Text>
      </div>
    );
  }

  if (contractsList.length === 0) {
    return (
      <Card className="text-center py-20 border-gray-200 rounded-2xl shadow-sm">
        <Empty description="Chưa có hợp đồng nào" style={{ marginTop: 24 }} />
        <Text type="secondary" className="block mt-4">
          Vui lòng liên hệ với người quản lý để tạo hợp đồng.
        </Text>
      </Card>
    );
  }

  const stats = [
    {
      title: "Tổng căn hộ",
      value: contractsList.length,
      icon: <Files size={24} />,
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Chờ duyệt",
      value: contractsList.filter(
        (c: OwnerApartmentResponse) => c.status === "pending",
      ).length,
      icon: <FileEdit size={24} />,
      textColor: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Đã xác nhận",
      value: contractsList.filter(
        (c: OwnerApartmentResponse) => c.status === "verified",
      ).length,
      icon: <FileCheck size={24} />,
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Bị từ chối",
      value: contractsList.filter(
        (c: OwnerApartmentResponse) => c.status === "rejected",
      ).length,
      icon: <AlertCircle size={24} />,
      textColor: "text-rose-600",
      bgColor: "bg-rose-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Title level={2} style={{ marginBottom: 4, color: "#111827" }}>
          Hợp Đồng Hợp Tác
        </Title>
        <Text type="secondary" className="text-gray-500">
          Quản lý và ký kỹ thuật số các hợp đồng thuê nhà của bạn
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="border-gray-100 shadow-sm transition-all duration-300"
            style={{ borderRadius: "16px" }}
            styles={{ body: { padding: "24px" } }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-gray-500 text-md  font-semibold uppercase tracking-wider block mb-2">
                  {stat.title}
                </h1>
                <h1 className="text-4xl">{stat.value}</h1>
              </div>
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-2xl ${stat.bgColor} ${stat.textColor}`}
              >
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Text strong className="whitespace-nowrap text-gray-700">
            Trạng thái:
          </Text>
          <Select
            size="large"
            style={{ width: "100%", minWidth: "200px" }}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as StatusFilter)}
            options={[
              { label: "Tất cả căn hộ", value: "all" },
              { label: "Chưa ký", value: "pending" },
              { label: "Đã ký", value: "available" },
              { label: "Đã hủy", value: "inactive" },
            ]}
          />
        </div>

        <Text className="text-gray-500 font-medium bg-gray-50 px-3 py-1.5 rounded-lg">
          Hiển thị{" "}
          <span className="text-gray-900 font-bold">
            {filteredContracts.length}
          </span>{" "}
          / {contractsList.length}
        </Text>
      </div>

      {filteredContracts.length === 0 ? (
        <Card className="text-center py-20 border-gray-200 rounded-2xl shadow-sm">
          <Empty description="Không có căn hộ nào" style={{ marginTop: 24 }} />
          <Text type="secondary" className="block mt-4">
            Không có căn hộ phù hợp với bộ lọc được chọn.
          </Text>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContracts.map((apartment: OwnerApartmentResponse) => (
            <CooperationsCard
              key={apartment.id}
              contract={apartment}
              onView={() => handleViewContract(apartment.id)}
              onCancel={() => handleCancelContract(apartment.id)}
              onRedirectInvoice={() => handleRedirectInvoice()}
              onDownload={() => handleDownloadContract(apartment.id)}
            />
          ))}
        </div>
      )}

      <ModalAssignCooperations
        selectedContract={selectedContract}
        showDetailModal={showDetailModal}
        setShowDetailModal={setShowDetailModal}
      />

      <ModalCancelCooperations
        showModalCancelContract={showModalCancelContract}
        cancel={() => setShowModalCancelContract(false)}
        selectContract={selectedContract}
      />
    </div>
  );
}
