import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMetals,
  createMetal,
  updateMetal,
  deleteMetal,
} from "../../store/slices/metalSlice";

// Components
import DataTable from "../../components/common/DataTable";
import MetalFormModal from "../../components/modals/metals/MetalFormModal";
import DeleteDiamondModal from "../../components/modals/diamonds/DeleteDiamondModal"; // Reusing the generic delete modal

import { Plus, Trash2, Edit, Coins } from "lucide-react";

const Metals = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.metals);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMetal, setSelectedMetal] = useState(null);

  useEffect(() => {
    dispatch(fetchMetals());
  }, [dispatch]);

  // --- Handlers ---
  const handleAdd = () => {
    setSelectedMetal(null);
    setIsFormOpen(true);
  };

  const handleEdit = (metal) => {
    setSelectedMetal(metal);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (metal) => {
    setSelectedMetal(metal);
    setIsDeleteOpen(true);
  };

  const handleSave = async (data) => {
    let res;
    if (selectedMetal) {
      // Update: pass original metal_type as ID, and new data
      res = await dispatch(
        updateMetal({ metalType: selectedMetal.metal_type, data })
      );
    } else {
      res = await dispatch(createMetal(data));
    }

    if (!res.error) {
      setIsFormOpen(false);
      setSelectedMetal(null);
      // No need to fetch again if Redux slice updates state correctly,
      // but strictly safe to refresh:
      // dispatch(fetchMetals());
    }
  };

  const confirmDelete = async () => {
    if (selectedMetal) {
      await dispatch(deleteMetal(selectedMetal.metal_type));
      setIsDeleteOpen(false);
    }
  };

  // --- Columns ---
  const columns = [
    {
      header: "Code",
      accessor: "metal_code",
      render: (row) => (
        <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded text-sm">
          {row.metal_code}
        </span>
      ),
    },
    {
      header: "Metal Type",
      accessor: "metal_type",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <Coins size={14} />
          </div>
          <span className="font-bold text-slate-800 capitalize">
            {row.metal_type.replace(/_/g, " ")}
          </span>
        </div>
      ),
    },
    {
      header: "Rate / Gram",
      accessor: "rate_per_gram",
      render: (row) => (
        <span className="font-bold text-green-700">
          ${row.rate_per_gram?.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Multiplier",
      accessor: "price_multiplier",
      render: (row) => (
        <span className="text-slate-600 font-medium">
          x{row.price_multiplier}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={() => handleEdit(row)}
            className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded transition-colors"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-2 w-full">
      <DataTable
        title="Metal Rates"
        columns={columns}
        data={items}
        loading={loading}
        // Client-side pagination (Controller returns all items)
        pagination={{ page: 1, limit: 100, total: items.length }}
        actionButton={
          <button
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 h-10 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-lg active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Metal
          </button>
        }
      />

      <MetalFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        metal={selectedMetal}
        loading={loading}
      />

      {/* Reusing DeleteModal - tricking it by passing metal_type as sku for display */}
      <DeleteDiamondModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        diamond={{
          sku: selectedMetal?.metal_type,
          _id: selectedMetal?.metal_type,
        }}
        loading={loading}
      />
    </div>
  );
};

export default Metals;
