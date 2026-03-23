import { ShieldAlert, IdCard, X } from "lucide-react";
import { Button, Modal } from "antd";

interface ModalVerifyProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
}

export default function ModalVerify({
  isOpen,
  onClose,
  onVerify,
}: ModalVerifyProps) {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={
        <>
          <div className="flex justify-between">
            <div></div>
            <div className="flex gap-5">
              <Button
                onClick={onClose}
                className="w-full l! sm:w-1/2 rounded-2xl! px-4! py-2.5 text-sm font-medium text-gray-700 bg-gray-100  hover:bg-gray-200 transition-colors"
              >
                Để sau
              </Button>
              <Button
                type="primary"
                onClick={onVerify}
                className="w-full sm:w-1/2 rounded-2xl! px-6! py-2.5 text-sm font-medium text-white bg-blue-600  hover:bg-blue-700 shadow-sm shadow-blue-600/30 transition-all active:scale-[0.98]"
              >
                Xác minh ngay
              </Button>
            </div>
          </div>
        </>
      }
      centered
      width={520}
      closeIcon={<X className="w-5 h-5 text-gray-400 hover:text-gray-600" />}
    >
      <div className="flex justify-center mb-5 mt-4">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
          <div className="relative flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-full border-4 border-blue-100">
            <IdCard className="w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Yêu cầu xác minh CCCD
        </h2>
        <p className="text-sm sm:text-base text-gray-500 mb-6 leading-relaxed">
          Để đảm bảo an toàn cho tài khoản và tuân thủ quy định, vui lòng cung
          cấp hình ảnh Căn cước công dân của bạn để tiếp tục sử dụng dịch vụ.
        </p>

        <div className="flex items-center justify-center gap-2 bg-amber-50 text-amber-700 text-xs px-3 py-2 rounded-lg mb-6">
          <ShieldAlert className="w-4 h-4" />
          <span>Thông tin của bạn sẽ được bảo mật tuyệt đối.</span>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3 mt-2"></div>
    </Modal>
  );
}
