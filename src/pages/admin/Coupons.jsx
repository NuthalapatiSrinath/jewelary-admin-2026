import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
} from "../../store/slices/couponSlice";

import DataTable from "../../components/common/DataTable";
import CouponFormModal from "../../components/modals/coupons/CouponFormModal";
import DeleteDiamondModal from "../../components/modals/diamonds/DeleteDiamondModal"; // Reusing generic delete

import {
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Tag,
  Calendar,
} from "lucide-react";

const Coupons = () => {
  const dispatch = useDispatch();
  const { items, pagination, loading } = useSelector((state) => state.coupons);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 20,
    search: "",
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [processingIds, setProcessingIds] = useState(new Set());

  useEffect(() => {
    dispatch(fetchCoupons(queryParams));
  }, [dispatch, queryParams]);

  const handlePageChange = (p) =>
    setQueryParams((prev) => ({ ...prev, page: p }));
  const handleLimitChange = (l) =>
    setQueryParams((prev) => ({ ...prev, limit: l, page: 1 }));
  const handleSearch = (t) =>
    setQueryParams((prev) => ({ ...prev, search: t, page: 1 }));

  const handleAdd = () => {
    setSelectedCoupon(null);
    setIsFormOpen(true);
  };
  const handleEdit = (c) => {
    setSelectedCoupon(c);
    setIsFormOpen(true);
  };
  const handleDeleteClick = (c) => {
    setSelectedCoupon(c);
    setIsDeleteOpen(true);
  };

  const handleSave = async (data) => {
    let res;
    if (selectedCoupon)
      res = await dispatch(updateCoupon({ id: selectedCoupon._id, data }));
    else res = await dispatch(createCoupon(data));

    if (!res.error) {
      setIsFormOpen(false);
      setSelectedCoupon(null);
    }
  };

  const confirmDelete = async () => {
    if (selectedCoupon) {
      await dispatch(deleteCoupon(selectedCoupon._id));
      setIsDeleteOpen(false);
    }
  };

  const handleToggleStatus = async (id, status) => {
    setProcessingIds((prev) => new Set(prev).add(id));
    try {
      await dispatch(toggleCouponStatus({ id, currentStatus: status }));
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const columns = [
    {
      header: "Code",
      accessor: "code",
      render: (r) => (
        <div className="flex items-center gap-2">
          <Tag size={14} className="text-amber-500" />
          <span className="font-mono font-bold text-slate-800 tracking-wider bg-slate-100 px-2 py-1 rounded">
            {r.code}
          </span>
        </div>
      ),
    },
    {
      header: "Discount",
      accessor: "discountValue",
      render: (r) => (
        <span className="font-bold text-green-600">
          {r.discountType === "percent"
            ? `${r.discountValue}%`
            : `$${r.discountValue}`}{" "}
          OFF
        </span>
      ),
    },
    {
      header: "Validity",
      accessor: "endDate",
      render: (r) => {
        if (!r.startDate && !r.endDate)
          return <span className="text-slate-400 text-xs">Always Valid</span>;
        const start = r.startDate
          ? new Date(r.startDate).toLocaleDateString()
          : "Now";
        const end = r.endDate
          ? new Date(r.endDate).toLocaleDateString()
          : "Forever";
        return (
          <div className="text-xs text-slate-600 flex items-center gap-1">
            <Calendar size={12} /> {start} - {end}
          </div>
        );
      },
    },
    {
      header: "Usage",
      accessor: "usedCount",
      render: (r) => (
        <span className="text-sm font-medium text-slate-700">
          {r.usedCount} / {r.maxGlobalUses || "∞"}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      className: "text-center",
      render: (row) => {
        const isProcessing = processingIds.has(row._id);
        const isActive = row.status === "active";
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus(row._id, row.status);
            }}
            disabled={isProcessing}
            className={`p-1 rounded-full ${
              isActive
                ? "text-green-600 bg-green-50"
                : "text-slate-400 bg-slate-100"
            }`}
          >
            {isProcessing ? (
              <Loader2 size={14} className="animate-spin" />
            ) : isActive ? (
              <CheckCircle size={16} />
            ) : (
              <XCircle size={16} />
            )}
          </button>
        );
      },
    },
    {
      header: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={() => handleEdit(row)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
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
        title="Coupon Management"
        columns={columns}
        data={items}
        loading={loading}
        pagination={{
          page: pagination.page || 1,
          limit: 20,
          total: pagination.total || 0,
        }}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSearch={handleSearch}
        actionButton={
          <button
            onClick={handleAdd}
            className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-indigo-700 font-medium"
          >
            <Plus size={16} /> Create Coupon
          </button>
        }
      />

      <CouponFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        coupon={selectedCoupon}
        loading={loading}
      />

      <DeleteDiamondModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        diamond={{ sku: selectedCoupon?.code }}
        loading={loading}
      />
    </div>
  );
};

export default Coupons;
