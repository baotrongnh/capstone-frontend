"use client";

import { CloseOutlined } from "@ant-design/icons";
import { ReactNode } from "react";

interface Props {
  open: boolean;
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Floating chat panel — renders as a fixed positioned div (no overlay),
 * so the user can still interact with the rest of the page while chatting.
 */
export function ChatWindow({ open, title, onClose, children }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed z-50 flex flex-col bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
      style={{ bottom: 100, right: 24, width: 520, height: 560 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
        <div className="flex-1 min-w-0">{title}</div>
        <button
          onClick={onClose}
          className="ml-3 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Đóng chat"
        >
          <CloseOutlined />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  );
}
