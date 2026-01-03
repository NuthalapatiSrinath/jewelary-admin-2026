import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, updateOrder } from "../../store/slices/orderSlice";

import DataTable from "../../components/common/DataTable";
import OrderDetailsModal from "../../components/modals/orders/OrderDetailsModal";
import { Eye, Package, CheckCircle, Clock, XCircle } from "lucide-react";

const Orders = () => {
  const dispatch = useDispatch();
  const { items, pagination, loading } = useSelector((state) => state.orders);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 20,
    search: "",
    status: "",
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders(queryParams));
  }, [dispatch, queryParams]);

  const handlePageChange = (p) =>
    setQueryParams((prev) => ({ ...prev, page: p }));
  const handleLimitChange = (l) =>
    setQueryParams((prev) => ({ ...prev, limit: l, page: 1 }));
  const handleSearch = (t) =>
    setQueryParams((prev) => ({ ...prev, search: t, page: 1 }));
  const handleStatusFilter = (e) =>
    setQueryParams((prev) => ({ ...prev, status: e.target.value, page: 1 }));

  const handleView = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (id, data) => {
    const res = await dispatch(updateOrder({ id, data }));
    if (!res.error) {
      setIsModalOpen(false);
      dispatch(fetchOrders(queryParams)); // Refresh
    }
  };

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    let color = "bg-gray-100 text-gray-600";
    let icon = <Clock size={12} />;

    if (status === "Confirmed" || status === "Processing") {
      color = "bg-blue-100 text-blue-700";
      icon = <Package size={12} />;
    } else if (status === "Shipped") {
      color = "bg-indigo-100 text-indigo-700";
      icon = <Truck size={12} />;
    } else if (status === "Delivered") {
      color = "bg-green-100 text-green-700";
      icon = <CheckCircle size={12} />;
    } else if (status === "Cancelled") {
      color = "bg-red-100 text-red-700";
      icon = <XCircle size={12} />;
    }

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${color}`}
      >
        {icon} {status}
      </span>
    );
  };

  const columns = [
    {
      header: "Order ID",
      accessor: "orderId",
      render: (r) => (
        <span className="font-mono font-bold text-slate-700">{r.orderId}</span>
      ),
    },
    {
      header: "Customer",
      accessor: "contactEmail",
      render: (r) => (
        <div>
          <div className="font-medium text-slate-800">
            {r.userId?.name || "Guest"}
          </div>
          <div className="text-xs text-slate-500">{r.contactEmail}</div>
        </div>
      ),
    },
    {
      header: "Date",
      accessor: "createdAt",
      render: (r) => (
        <span className="text-sm text-slate-600">
          {new Date(r.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Total",
      accessor: "total",
      render: (r) => (
        <span className="font-bold text-amber-600">
          ${r.total?.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Payment",
      accessor: "paymentStatus",
      render: (r) => (
        <span
          className={`text-xs font-bold ${
            r.paymentStatus === "Paid" ? "text-green-600" : "text-amber-600"
          }`}
        >
          {r.paymentStatus}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      header: "Actions",
      className: "text-right",
      render: (row) => (
        <button
          onClick={() => handleView(row)}
          className="p-2 hover:bg-slate-100 text-slate-500 hover:text-indigo-600 rounded-lg transition-colors"
        >
          <Eye size={18} />
        </button>
      ),
    },
  ];

  return (
    <div className="p-2 w-full">
      <DataTable
        title="Orders Management"
        columns={columns}
        data={items}
        loading={loading}
        pagination={{
          page: pagination.page || 1,
          limit: 50,
          total: pagination.total || 0,
        }}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSearch={handleSearch}
        actionButton={
          <select
            onChange={handleStatusFilter}
            className="h-10 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:border-amber-500 outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        }
      />

      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
        loading={loading}
      />
    </div>
  );
};

export default Orders;
