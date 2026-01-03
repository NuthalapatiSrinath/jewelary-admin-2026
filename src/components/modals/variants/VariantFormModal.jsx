import React, { useState, useEffect } from "react";
import Modal from "../../common/Modal";
import { Info, DollarSign, Settings, Gem, Layers } from "lucide-react";

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
}) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-slate-500 uppercase">
      {label} {required && "*"}
    </label>
    <input
      name={name}
      type={type}
      value={value || ""}
      onChange={onChange}
      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-amber-500 focus:bg-white text-slate-800 font-medium transition-all"
      required={required}
      placeholder={placeholder}
    />
  </div>
);

const VariantFormModal = ({
  isOpen,
  onClose,
  onSave,
  variant,
  productSku,
  loading,
}) => {
  const isEdit = !!variant;

  const initialState = {
    productSku: productSku || "",
    variantSku: "",
    metalType: "",
    metalCode: "",
    shape_code: "",
    centerStoneWeight: "",
    centerStonePrice: "",
    metalPrice: "",
    stock: "0",
    active: true,
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (isOpen) {
      if (variant) setFormData(variant);
      else setFormData({ ...initialState, productSku: productSku || "" });
    }
  }, [isOpen, variant, productSku]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Variant" : "Add Variant"}
    >
      <form onSubmit={handleSubmit} className="space-y-2">
        <SectionTitle icon={Info} title="Identifiers" />
        <div className="grid grid-cols-2 gap-4">
          <InputGroup
            label="Product SKU"
            name="productSku"
            value={formData.productSku}
            onChange={handleChange}
            required
          />
          <InputGroup
            label="Variant SKU"
            name="variantSku"
            value={formData.variantSku}
            onChange={handleChange}
            required
          />
        </div>

        <SectionTitle icon={Layers} title="Configuration" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <InputGroup
            label="Metal Type"
            name="metalType"
            value={formData.metalType}
            onChange={handleChange}
            placeholder="14k_white_gold"
          />
          <InputGroup
            label="Metal Code"
            name="metalCode"
            value={formData.metalCode}
            onChange={handleChange}
            placeholder="14W"
          />
          <InputGroup
            label="Shape Code"
            name="shape_code"
            value={formData.shape_code}
            onChange={handleChange}
            placeholder="RND"
          />
        </div>

        <SectionTitle icon={Gem} title="Stone Specs" />
        <div className="grid grid-cols-2 gap-4">
          <InputGroup
            label="Carat Weight"
            name="centerStoneWeight"
            type="number"
            value={formData.centerStoneWeight}
            onChange={handleChange}
          />
          <InputGroup
            label="Stone Price"
            name="centerStonePrice"
            type="number"
            value={formData.centerStonePrice}
            onChange={handleChange}
          />
        </div>

        <SectionTitle icon={DollarSign} title="Pricing & Stock" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-end">
          <InputGroup
            label="Metal Price"
            name="metalPrice"
            type="number"
            value={formData.metalPrice}
            onChange={handleChange}
            required
          />
          <InputGroup
            label="Stock Qty"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
          />

          <label className="flex items-center gap-2 h-10 bg-slate-50 px-3 rounded-lg border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="w-4 h-4 accent-amber-500"
            />
            <span className="text-sm font-medium text-slate-700">Active</span>
          </label>
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
            {isEdit ? "Update Variant" : "Create Variant"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default VariantFormModal;
