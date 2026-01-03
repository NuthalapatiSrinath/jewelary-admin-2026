import React, { useState, useEffect } from "react";
import Modal from "../../common/Modal";
import {
  Package,
  Truck,
  User,
  CreditCard,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Save,
} from "lucide-react";

const StatusBadge = ({ status, type = "order" }) => {
  const styles = {
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    Confirmed: "bg-blue-100 text-blue-700 border-blue-200",
    Shipped: "bg-indigo-100 text-indigo-700 border-indigo-200",
    Delivered: "bg-green-100 text-green-700 border-green-200",
    Cancelled: "bg-red-100 text-red-700 border-red-200",
    Paid: "bg-green-100 text-green-700 border-green-200",
    Failed: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
        styles[status] || "bg-gray-100 text-gray-700 border-gray-200"
      }`}
    >
      {status}
    </span>
  );
};

const OrderDetailsModal = ({
  isOpen,
  onClose,
  order,
  onUpdateStatus,
  loading,
}) => {
  const [formData, setFormData] = useState({
    status: "",
    paymentStatus: "",
    trackingNumber: "",
    adminNotes: "",
  });

  useEffect(() => {
    if (order) {
      setFormData({
        status: order.status || "Pending",
        paymentStatus: order.paymentStatus || "Pending",
        trackingNumber: order.trackingNumber || "",
        adminNotes: order.adminNotes || "",
      });
    }
  }, [order]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateStatus(order._id, formData);
  };

  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Order #${order.orderId}`}>
      <div className="space-y-6">
        {/* --- Top Bar: Status Update --- */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col md:flex-row gap-4 items-end"
        >
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
              Order Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded-md text-sm"
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
              Payment Status
            </label>
            <select
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
              className="w-full p-2 border rounded-md text-sm"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
              Tracking #
            </label>
            <input
              name="trackingNumber"
              value={formData.trackingNumber}
              onChange={handleChange}
              placeholder="Enter tracking..."
              className="w-full p-2 border rounded-md text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-bold flex items-center gap-2"
          >
            <Save size={16} /> Update
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Info */}
          <div className="border p-4 rounded-lg">
            <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-3 pb-2 border-b">
              <User size={16} className="text-slate-400" /> Customer Details
            </h4>
            <div className="text-sm space-y-2 text-slate-600">
              <p>
                <span className="font-semibold text-slate-800">Name:</span>{" "}
                {order.userId?.name || "Guest"}
              </p>
              <p>
                <span className="font-semibold text-slate-800">Email:</span>{" "}
                {order.contactEmail}
              </p>
              <p>
                <span className="font-semibold text-slate-800">Phone:</span>{" "}
                {order.contactPhone || "N/A"}
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="border p-4 rounded-lg">
            <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-3 pb-2 border-b">
              <MapPin size={16} className="text-slate-400" /> Shipping Address
            </h4>
            <div className="text-sm space-y-1 text-slate-600">
              <p className="font-medium text-slate-900">
                {order.shippingAddress?.firstName}{" "}
                {order.shippingAddress?.lastName}
              </p>
              <p>{order.shippingAddress?.address}</p>
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                {order.shippingAddress?.postalCode}
              </p>
              <p>{order.shippingAddress?.country}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
              <tr>
                <th className="p-3">Item</th>
                <th className="p-3">Type</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items?.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-3">
                    <div className="font-medium text-slate-800">
                      {item.productName || item.productSku}
                    </div>
                    {item.itemType === "dyo" && (
                      <div className="text-xs text-slate-500 mt-1">
                        Metal: {item.selectedMetal} | Shape:{" "}
                        {item.selectedShape} | Carat: {item.selectedCarat}
                      </div>
                    )}
                    {item.variant_sku && (
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        {item.variant_sku}
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${
                        item.itemType === "rts"
                          ? "bg-green-50 text-green-700 border-green-100"
                          : "bg-purple-50 text-purple-700 border-purple-100"
                      }`}
                    >
                      {item.itemType === "rts" ? "Ready" : "Custom"}
                    </span>
                  </td>
                  <td className="p-3 text-center font-bold text-slate-700">
                    {item.quantity}
                  </td>
                  <td className="p-3 text-right font-medium text-slate-800">
                    ${item.totalPrice?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50/50">
              <tr>
                <td colSpan="3" className="p-2 text-right text-slate-500">
                  Subtotal:
                </td>
                <td className="p-2 text-right font-medium">
                  ${order.subtotal?.toLocaleString()}
                </td>
              </tr>
              {order.discount > 0 && (
                <tr>
                  <td colSpan="3" className="p-2 text-right text-green-600">
                    Discount:
                  </td>
                  <td className="p-2 text-right font-medium text-green-600">
                    -${order.discount?.toLocaleString()}
                  </td>
                </tr>
              )}
              <tr>
                <td
                  colSpan="3"
                  className="p-3 text-right font-bold text-slate-800 text-base"
                >
                  Total:
                </td>
                <td className="p-3 text-right font-bold text-amber-600 text-base">
                  ${order.total?.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Admin Notes */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
            Internal Notes
          </label>
          <textarea
            name="adminNotes"
            value={formData.adminNotes}
            onChange={handleChange}
            className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50 h-20 outline-none focus:border-indigo-500"
            placeholder="Private admin notes..."
          />
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailsModal;
