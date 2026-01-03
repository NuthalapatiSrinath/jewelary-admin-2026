import React, { useState, useEffect } from "react";
import Modal from "../../common/Modal";
import { Info, DollarSign, Calendar, Settings, Ticket } from "lucide-react";

// --- Helper Components ---
const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 text-slate-800 font-bold text-sm uppercase border-b border-slate-200 pb-2 mt-6 mb-4">
    <Icon size={16} className="text-amber-500" /> {title}
  </div>
);

const InputGroup = ({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
  value,
  onChange,
  min,
}) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-slate-500 uppercase">
      {label} {required && "*"}
    </label>
    <input
      name={name}
      type={type}
      min={min}
      value={value || ""}
      onChange={onChange}
      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-amber-500 focus:bg-white text-slate-800 font-medium transition-all"
      required={required}
      placeholder={placeholder}
    />
  </div>
);

const SelectGroup = ({ label, name, options, value, onChange, required }) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-slate-500 uppercase">
      {label} {required && "*"}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-amber-500 focus:bg-white text-slate-800 font-medium transition-all"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const CouponFormModal = ({ isOpen, onClose, onSave, coupon, loading }) => {
  const isEdit = !!coupon;

  const initialState = {
    code: "",
    description: "",
    discountType: "percent", // 'fixed' or 'percent'
    discountValue: "",
    minOrderAmount: "",
    maxDiscountAmount: "",
    startDate: "",
    endDate: "",
    maxGlobalUses: "",
    maxUsesPerUser: "",
    status: "active",
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (isOpen) {
      if (coupon) {
        // Format dates for input[type="date"]
        const formatDate = (dateStr) =>
          dateStr ? new Date(dateStr).toISOString().split("T")[0] : "";
        setFormData({
          ...initialState,
          ...coupon,
          startDate: formatDate(coupon.startDate),
          endDate: formatDate(coupon.endDate),
        });
      } else {
        setFormData(initialState);
      }
    }
  }, [isOpen, coupon]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Edit Coupon: ${formData.code}` : "Create New Coupon"}
    >
      <form onSubmit={handleSubmit} className="space-y-2">
        <SectionTitle icon={Ticket} title="Coupon Details" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup
            label="Code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            placeholder="SUMMER2025"
          />
          <InputGroup
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Summer Sale Discount"
          />
        </div>

        <SectionTitle icon={DollarSign} title="Discount Rules" />
        <div className="grid grid-cols-2 gap-4">
          <SelectGroup
            label="Type"
            name="discountType"
            value={formData.discountType}
            onChange={handleChange}
            required
            options={[
              { value: "percent", label: "Percentage (%)" },
              { value: "fixed", label: "Fixed Amount ($)" },
            ]}
          />
          <InputGroup
            label="Value"
            name="discountValue"
            type="number"
            min="0"
            value={formData.discountValue}
            onChange={handleChange}
            required
          />
          <InputGroup
            label="Min Order ($)"
            name="minOrderAmount"
            type="number"
            min="0"
            value={formData.minOrderAmount}
            onChange={handleChange}
          />
          <InputGroup
            label="Max Discount ($)"
            name="maxDiscountAmount"
            type="number"
            min="0"
            value={formData.maxDiscountAmount}
            onChange={handleChange}
          />
        </div>

        <SectionTitle icon={Calendar} title="Validity Period" />
        <div className="grid grid-cols-2 gap-4">
          <InputGroup
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
          />
          <InputGroup
            label="End Date"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
          />
        </div>

        <SectionTitle icon={Settings} title="Usage Limits" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <InputGroup
            label="Total Uses"
            name="maxGlobalUses"
            type="number"
            min="0"
            value={formData.maxGlobalUses}
            onChange={handleChange}
            placeholder="Unlimited"
          />
          <InputGroup
            label="Uses Per User"
            name="maxUsesPerUser"
            type="number"
            min="0"
            value={formData.maxUsesPerUser}
            onChange={handleChange}
            placeholder="Unlimited"
          />
          <SelectGroup
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
        </div>

        <div className="pt-6 flex gap-3 border-t border-slate-100 mt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 text-slate-600 bg-slate-100 rounded-lg font-bold hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 text-white bg-amber-500 rounded-lg font-bold hover:bg-amber-600 shadow-lg"
          >
            {isEdit ? "Update Coupon" : "Create Coupon"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CouponFormModal;
