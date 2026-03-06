import {
  CheckCircleFilled,
  ClockCircleFilled,
  SyncOutlined,
} from "@ant-design/icons";
import { Button, Modal } from "antd";
import React from "react";

interface ModalWaitingVerifyProps {
  open: boolean;
  onClose: () => void;
}

export default function ModalWaitingVerify({
  open,
  onClose,
}: ModalWaitingVerifyProps) {
  return (
    <Modal open={open} onCancel={onClose} footer={null} centered width={460}>
      <div className="flex flex-col items-center text-center">
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-[3px] border-blue-100 border-t-blue-500 animate-spin"></div>
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center">
            <SyncOutlined className="text-2xl text-blue-600 animate-pulse" />
          </div>
        </div>

        <h3 className="text-[22px] font-bold text-gray-900 mb-2">
          Hồ sơ đang xét duyệt
        </h3>
        <p className="text-[15px] text-gray-500 mb-8 max-w-[340px] leading-relaxed">
          Thông tin của bạn đã được tiếp nhận và đang trong quá trình kiểm tra.
          Xin vui lòng chờ trong ít phút.
        </p>

        <div className="w-full bg-gray-50 rounded-xl p-5 mb-8 border border-gray-100 text-left relative">
          <div className="absolute left-[29px] top-[36px] h-8 w-[2px] bg-blue-200"></div>

          <div className="flex items-start gap-4 mb-5 relative z-10">
            <div className="bg-gray-50 mt-0.5">
              <CheckCircleFilled className="text-blue-500! text-[20px]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 m-0">
                Gửi thông tin thành công
              </p>
              <p className="text-xs text-gray-500 m-0 mt-0.5">
                Hệ thống đã lưu trữ dữ liệu an toàn
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 relative z-10">
            <div className="bg-gray-50 mt-0.5">
              <ClockCircleFilled className="text-blue-500! text-[20px]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 m-0">
                Đang chờ duyệt
              </p>
              <p className="text-xs text-blue-600/80 m-0 mt-0.5 font-medium">
                Dự kiến hoàn thành trong 24h
              </p>
            </div>
          </div>
        </div>

        <Button
          type="primary"
          onClick={onClose}
          className="w-full h-12 text-[15px] font-medium rounded-xl bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
        >
          Tôi đã hiểu
        </Button>
      </div>
    </Modal>
  );
}
