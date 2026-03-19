"use client";

import React, { useState, useMemo } from "react";
import { Card, Typography, Select, Spin, Empty } from "antd";
import { Files, FileEdit, FileCheck } from "lucide-react";

import { useGetContracts } from "@/hooks/query/useContracts";
import { ContractWithMembers } from "@/lib/services/contracts.service";
import { ContractCard } from "./card-contracts-layout";
import ModalAssignContract from "./modal/modal-assign-contract";

const { Title, Text } = Typography;

type StatusFilter = "all" | "draft" | "active";

export default function ContractLayout() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedContractId, setSelectedContractId] = useState<string | null>(
    null,
  );
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { data, isLoading } = useGetContracts();

  const contractsList = useMemo<ContractWithMembers[]>(() => {
    return (data?.data ?? []) as ContractWithMembers[];
  }, [data]);

  console.log("AAAA", contractsList);

  const filteredContracts = useMemo(() => {
    if (statusFilter === "all") return contractsList;
    return contractsList.filter(
      (c: ContractWithMembers) => c.status === statusFilter,
    );
  }, [contractsList, statusFilter]);

  const selectedContract = useMemo(() => {
    return (
      contractsList.find(
        (c: ContractWithMembers) => c.id === selectedContractId,
      ) ?? null
    );
  }, [contractsList, selectedContractId]);

  const handleViewContract = (contractId: string) => {
    setSelectedContractId(contractId);
    setShowDetailModal(true);
  };

  const handleDownloadContract = async (contractId: string) => {
    const contract = contractsList.find((c) => c.id === contractId);
    if (!contract?.pdfUrl) {
      alert("Không tìm thấy file PDF để tải");
      return;
    }

    try {
      const pdfUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${contract.pdfUrl}`;

      const response = await fetch(pdfUrl);
      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${contract.contractNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Lỗi khi tải file PDF");
    }
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

  // Cấu hình các thẻ thống kê
  const stats = [
    {
      title: "Tổng hợp đồng",
      value: contractsList.length,
      icon: <Files size={24} />,
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Chưa ký",
      value: contractsList.filter((c: any) => c.status === "draft").length,
      icon: <FileEdit size={24} />,
      textColor: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Đã ký",
      value: contractsList.filter((c: any) => c.status === "active").length,
      icon: <FileCheck size={24} />,
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Title level={2} style={{ marginBottom: 4, color: "#111827" }}>
          Hợp Đồng Thuê Nhà
        </Title>
        <Text type="secondary" className="text-gray-500">
          Quản lý và ký kỹ thuật số các hợp đồng thuê nhà của bạn
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
            onChange={(value) => setStatusFilter(value)}
            options={[
              { label: "Tất cả hợp đồng", value: "all" },
              { label: "Chưa ký", value: "draft" },
              { label: "Đã ký", value: "active" },
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContracts.map((contract: ContractWithMembers) => (
          <ContractCard
            key={contract.id}
            contract={contract}
            onView={() => handleViewContract(contract.id)}
            onDownload={() => handleDownloadContract(contract.id)}
          />
        ))}
      </div>

      <ModalAssignContract
        selectedContract={selectedContract}
        showDetailModal={showDetailModal}
        setShowDetailModal={setShowDetailModal}
      />
    </div>
  );
}
