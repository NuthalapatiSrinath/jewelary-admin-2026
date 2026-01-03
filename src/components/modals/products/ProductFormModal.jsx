import React, { useState, useEffect } from "react";
import Modal from "../../common/Modal";
import {
  Loader2,
  Info,
  DollarSign,
  Package,
  Image as ImageIcon,
  Settings,
  Calendar,
  Layers,
} from "lucide-react";

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
  helpText,
}) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-slate-500 uppercase flex justify-between">
      <span>
        {label} {required && "*"}
      </span>
    </label>
    <input
      name={name}
      type={type}
      value={value || ""}
      onChange={onChange}
      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-amber-500 focus:bg-white text-slate-800 font-medium transition-all placeholder:font-normal placeholder:text-slate-400"
      required={required}
      placeholder={placeholder}
    />
    {helpText && <p className="text-[10px] text-slate-400">{helpText}</p>}
  </div>
);

const ToggleGroup = ({ label, name, checked, onChange }) => (
  <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors h-full">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="w-5 h-5 accent-amber-500"
    />
    <span className="text-sm font-bold text-slate-700">{label}</span>
  </label>
);

const ProductFormModal = ({ isOpen, onClose, onSave, product, loading }) => {
  const isEdit = !!product;

  const initialState = {
    // Identity
    productSku: "",
    productName: "",
    description: "",

    // Classification
    categories: "",
    style: "",
    defaultShape: "",

    // Configuration Arrays (Comma Separated)
    availableMetalTypes: "",
    availableShapes: "",

    // Pricing & Weight
    defaultPrice: "",
    discountPercent: "0",
    defaultMetalWeight: "",

    // Logistics
    lead_days: "",
    delivery_date: "",

    // Media
    imageUrl1: "",
    imageUrl2: "",

    // Settings
    readyToShip: false,
    engravingAllowed: false,
    active: true,
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (isOpen) {
      if (product) {
        // Parse arrays back to strings for editing
        const safeJoin = (arr) =>
          Array.isArray(arr) ? arr.join(", ") : arr || "";

        // Format Date for Input (YYYY-MM-DD)
        let formattedDate = "";
        if (product.delivery_date) {
          formattedDate = new Date(product.delivery_date)
            .toISOString()
            .split("T")[0];
        }

        setFormData({
          ...initialState,
          ...product,
          availableMetalTypes: safeJoin(product.availableMetalTypes),
          availableShapes: safeJoin(product.availableShapes),
          delivery_date: formattedDate,
        });
      } else {
        setFormData(initialState);
      }
    }
  }, [isOpen, product]);

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
      title={isEdit ? `Edit: ${formData.productSku}` : "Add New Product"}
    >
      <form onSubmit={handleSubmit} className="space-y-2">
        {/* --- Core Info --- */}
        <SectionTitle icon={Info} title="Basic Information" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup
            label="Product SKU"
            name="productSku"
            value={formData.productSku}
            onChange={handleChange}
            required
            placeholder="RING-001"
          />
          <InputGroup
            label="Product Name"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            required
            placeholder="Solitaire Ring"
          />
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-amber-500 text-sm h-20"
              placeholder="Enter product description..."
            />
          </div>
        </div>

        {/* --- Classification --- */}
        <SectionTitle icon={Package} title="Classification" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <InputGroup
            label="Category"
            name="categories"
            value={formData.categories}
            onChange={handleChange}
            placeholder="Ring, Necklace"
          />
          <InputGroup
            label="Style"
            name="style"
            value={formData.style}
            onChange={handleChange}
            placeholder="Halo, Pave"
          />
          <InputGroup
            label="Default Shape"
            name="defaultShape"
            value={formData.defaultShape}
            onChange={handleChange}
            placeholder="Round"
          />
        </div>

        {/* --- Advanced Configuration --- */}
        <SectionTitle icon={Layers} title="Configuration Options" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup
            label="Available Metals"
            name="availableMetalTypes"
            value={formData.availableMetalTypes}
            onChange={handleChange}
            placeholder="14k_white_gold, 18k_yellow_gold"
            helpText="Comma separated (e.g. 14k_white_gold, platinum)"
          />
          <InputGroup
            label="Available Shapes"
            name="availableShapes"
            value={formData.availableShapes}
            onChange={handleChange}
            placeholder="Round, Oval, Princess"
            helpText="Comma separated (e.g. Round, Oval)"
          />
        </div>

        {/* --- Pricing & Logistics --- */}
        <SectionTitle icon={DollarSign} title="Pricing & Logistics" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InputGroup
            label="Base Price ($)"
            name="defaultPrice"
            type="number"
            value={formData.defaultPrice}
            onChange={handleChange}
            required
          />
          <InputGroup
            label="Discount (%)"
            name="discountPercent"
            type="number"
            value={formData.discountPercent}
            onChange={handleChange}
          />
          <InputGroup
            label="Metal Wt (g)"
            name="defaultMetalWeight"
            type="number"
            value={formData.defaultMetalWeight}
            onChange={handleChange}
          />
          <InputGroup
            label="Lead Time (Days)"
            name="lead_days"
            type="number"
            value={formData.lead_days}
            onChange={handleChange}
          />
        </div>
        <div className="mt-2">
          <InputGroup
            label="Expected Delivery Date"
            name="delivery_date"
            type="date"
            value={formData.delivery_date}
            onChange={handleChange}
          />
        </div>

        {/* --- Media --- */}
        <SectionTitle icon={ImageIcon} title="Product Images" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup
            label="Primary Image URL"
            name="imageUrl1"
            value={formData.imageUrl1}
            onChange={handleChange}
            placeholder="https://..."
          />
          <InputGroup
            label="Secondary Image URL"
            name="imageUrl2"
            value={formData.imageUrl2}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        {/* --- Settings --- */}
        <SectionTitle icon={Settings} title="Settings" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ToggleGroup
            label="Active"
            name="active"
            checked={formData.active}
            onChange={handleChange}
          />
          <ToggleGroup
            label="Ready to Ship"
            name="readyToShip"
            checked={formData.readyToShip}
            onChange={handleChange}
          />
          <ToggleGroup
            label="Engraving Allowed"
            name="engravingAllowed"
            checked={formData.engravingAllowed}
            onChange={handleChange}
          />
        </div>

        {/* --- Actions --- */}
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
            className="flex-1 py-3 text-white bg-amber-500 rounded-lg font-bold hover:bg-amber-600 flex justify-center items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}{" "}
            {isEdit ? "Update Product" : "Create Product"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductFormModal;
