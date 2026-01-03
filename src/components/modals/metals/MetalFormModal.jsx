import React, { useState, useEffect } from "react";
import Modal from "../../common/Modal";
import { Loader2, Info, DollarSign } from "lucide-react";

// --- Helper Components ---
const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 text-slate-800 font-bold text-sm uppercase border-b border-slate-200 pb-2 mt-4 mb-4">
    <Icon size={16} className="text-amber-500" /> {title}
  </div>
);

const InputGroup = ({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
  step,
  value,
  onChange,
  disabled,
}) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-slate-500 uppercase">
      {label} {required && "*"}
    </label>
    <input
      name={name}
      type={type}
      step={step}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      className={`w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-amber-500 focus:bg-white text-slate-800 font-medium transition-all ${
        disabled ? "bg-slate-100 text-slate-500 cursor-not-allowed" : ""
      }`}
      required={required}
      placeholder={placeholder}
    />
  </div>
);

const MetalFormModal = ({ isOpen, onClose, onSave, metal, loading }) => {
  const isEdit = !!metal;

  const initialState = {
    metal_type: "",
    metal_code: "",
    rate_per_gram: "",
    price_multiplier: "1",
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (isOpen) {
      if (metal) {
        setFormData({ ...initialState, ...metal });
      } else {
        setFormData(initialState);
      }
    }
  }, [isOpen, metal]);

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
      title={isEdit ? "Edit Metal Rate" : "Add New Metal"}
    >
      <form onSubmit={handleSubmit} className="space-y-2">
        <SectionTitle icon={Info} title="Metal Details" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup
            label="Metal Type (ID)"
            name="metal_type"
            value={formData.metal_type}
            onChange={handleChange}
            required
            placeholder="e.g. 18k_yellow_gold"
            disabled={isEdit} // Cannot change ID on edit
          />
          <InputGroup
            label="Metal Code"
            name="metal_code"
            value={formData.metal_code}
            onChange={handleChange}
            required
            placeholder="e.g. 18Y"
          />
        </div>

        <SectionTitle icon={DollarSign} title="Pricing Configuration" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup
            label="Rate Per Gram ($)"
            name="rate_per_gram"
            type="number"
            step="0.01"
            value={formData.rate_per_gram}
            onChange={handleChange}
            required
          />
          <InputGroup
            label="Price Multiplier"
            name="price_multiplier"
            type="number"
            step="0.01"
            value={formData.price_multiplier}
            onChange={handleChange}
            placeholder="Default: 1"
          />
        </div>

        <div className="pt-6 flex gap-3 border-t border-slate-100 mt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 text-slate-600 bg-slate-100 rounded-lg font-bold hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 text-white bg-amber-500 rounded-lg font-bold hover:bg-amber-600 shadow-lg shadow-amber-500/25 transition-all flex justify-center items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}{" "}
            {isEdit ? "Update Rates" : "Add Metal"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MetalFormModal;
