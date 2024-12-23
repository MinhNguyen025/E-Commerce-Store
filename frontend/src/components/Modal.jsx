// components/Modal.jsx (hoặc nơi bạn định nghĩa Modal)
import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    // Lớp overlay (nền đen mờ)
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
      onClick={onClose}
    >
      {/* Khối modal chính, bg tối, text trắng, etc. */}
      <div
        className="bg-[#1a1a1a] text-white p-6 rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
