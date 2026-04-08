"use client";

import { useAddMemberContract } from "@/hooks/query/useContracts";
import { useSearchNational } from "@/hooks/query/useUser";
import { ContractWithMembers } from "@/lib/services/contracts.service";
import { CheckCircleOutlined, FileTextOutlined } from "@ant-design/icons";
import { Button, Modal, Select, Spin } from "antd";
import { User, X } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

interface ModalAddMemberProps {
  open: boolean;
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

export default function ModalAddMember({
  open,
  onClose,
  selectContract,
}: ModalAddMemberProps) {
  const [searchValue, setSearchValue] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<
    Map<string, { nationalId: string; fullName: string; email: string }>
  >(new Map());
  const [isLoading, setIsLoading] = useState(false);

  const { data: getNational, isLoading: isSearching } = useSearchNational(
    searchValue.length === 12 ? searchValue : "",
  );

  const { mutateAsync: addMember } = useAddMemberContract(
    selectContract?.id || "",
  );

  useEffect(() => {
    if (!open) {
      setSearchValue("");
      setSelectedMembers(new Map());
    }
  }, [open]);

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

  const handleSearchChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    setSearchValue(digitsOnly);
  };

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

  const handleAddMembers = async () => {
    if (selectedMembers.size === 0 || !selectContract?.id) return;

    const payload = {
      nationalId: Array.from(selectedMembers.keys())[0],
      memberType: "co_tenant",
      isPrimaryContact: false,
      sharePercentage: 0,
    };

    setIsLoading(true);
    try {
      await addMember(payload);
      onClose();
    } catch (error) {
      console.error("Error adding members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("CCCD", getNational);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={
        <div className="flex justify-end gap-2 p-4 ">
          <Button
            onClick={onClose}
            className="h-10 px-6 font-medium text-gray-600 bg-white border-gray-300 rounded-lg"
          >
            Hủy bỏ
          </Button>
          <Button
            type="primary"
            onClick={handleAddMembers}
            disabled={selectedMembers.size === 0 || isLoading}
            loading={isLoading}
            className="h-10 px-6 font-medium bg-blue-600 rounded-lg flex items-center gap-2"
          >
            <CheckCircleOutlined />
            Thêm thành viên ({selectedMembers.size})
          </Button>
        </div>
      }
      centered
      width={560}
      style={{ padding: 0 }}
    >
      <div className="bg-blue-50/50 px-10 py-5 mt-6 border-b border-blue-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <FileTextOutlined className="text-lg" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 m-0">
              Thêm thành viên
            </h3>
            <p className="text-sm text-gray-500 m-0">
              Tìm kiếm bằng 12 số CCCD.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 max-h-[60vh] overflow-y-auto">
        <div className="space-y-4">
          <div>
            <p>Danh sách thành viên</p>
            <p>
              {selectContract?.members?.map((item, index) => (
                <>
                  <div key={index}>
                    {index + 1}/ {item.user.fullName}
                  </div>
                </>
              ))}
            </p>

            <label className="block text-sm mt-5 font-medium text-gray-700 mb-2">
              Tìm kiếm thành viên
            </label>
            <Select
              showSearch
              allowClear
              onSearch={handleSearchChange}
              onSelect={handleMemberSelect}
              onClear={() => setSearchValue("")}
              options={autocompleteOptions}
              optionLabelProp="value"
              placeholder="Nhập 12 số CCCD"
              className="w-full"
              filterOption={false}
              notFoundContent={
                isSearching ? (
                  <Spin size="small" />
                ) : searchValue.length === 12 ? (
                  "Không tìm thấy người dùng"
                ) : (
                  ""
                )
              }
            />
          </div>

          {selectedMembers.size > 0 && (
            <div className="space-y-2 mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Thành viên đã chọn
              </label>
              {Array.from(selectedMembers.values()).map((member) => (
                <div
                  key={member.nationalId}
                  className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <User size={16} className="text-blue-600" />
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
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {selectedMembers.size === 0 && !searchValue && (
            <div className="bg-gray-50 border border-dashed rounded-lg p-8 text-center text-gray-400">
              Chưa có thành viên nào được chọn
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
