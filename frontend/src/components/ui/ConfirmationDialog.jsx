import React from "react";

const ConfirmDialog = ({
  isOpen,
  title = "Confirm",
  message = "Are you sure?",
  onConfirm,
  onCancel,
  confirmText = "Yes",
  cancelText = "No",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg max-w-md w-11/12 p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-[#2F2A76]">{title}</h2>
        <p className="text-black mb-6">{message}</p>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-md bg-gray-300 text-black hover:bg-gray-400 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-md bg-[#D4370B] text-white hover:bg-[#F4400D] transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
