import React from "react";
import Modal from "../../common/Modal";
import { AlertTriangle, Loader2 } from "lucide-react";

const DeleteDiamondModal = ({
  isOpen,
  onClose,
  onConfirm,
  diamond,
  loading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Confirmation">
      <div className="flex flex-col items-center text-center p-4">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={32} />
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-2">
          Delete this Diamond?
        </h3>
        <p className="text-slate-500 mb-6">
          Are you sure you want to remove{" "}
          <span className="font-bold text-slate-700">{diamond?.sku}</span>?
          <br /> This action cannot be undone.
        </p>

        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-slate-600 bg-slate-100 rounded-lg font-bold hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(diamond._id)}
            disabled={loading}
            className="flex-1 py-3 text-white bg-red-600 rounded-lg font-bold hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all flex justify-center items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Yes, Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteDiamondModal;
