import { useApartmentPolicies } from "@/hooks/query/useApartmentPolicies";
import { Modal, Checkbox, Spin, Alert } from "antd";

interface ModalPoliciesProps {
  onOpen: boolean;
  onCancel: () => void;
  apartmentId?: string;
  agreePolicy: boolean;
  onAgreeChange: (value: boolean) => void;
}

export default function ModalPolicies({
  onOpen,
  onCancel,
  apartmentId,
  agreePolicy,
  onAgreeChange,
}: ModalPoliciesProps) {
  const { data, isLoading, error } = useApartmentPolicies(apartmentId ?? "");

  return (
    <Modal
      open={onOpen}
      onCancel={onCancel}
      title="Chính sách hợp đồng"
      footer={null}
    >
      {isLoading && <Spin />}

      {error && (
        <Alert type="error" message="Không thể tải chính sách" showIcon />
      )}

      {!isLoading && !error && (
        <>
          <p>• Thanh toán đúng hạn hàng tháng</p>
          <p>• Không tự ý sửa chữa, cải tạo phòng</p>
          <p>• Giữ gìn tài sản chung</p>

          <Checkbox
            style={{ marginTop: 16 }}
            checked={agreePolicy}
            onChange={(e) => onAgreeChange(e.target.checked)}
          >
            Tôi đã đọc và đồng ý với chính sách hợp đồng
          </Checkbox>
        </>
      )}
    </Modal>
  );
}
