import React, { useState, useEffect } from "react";
import Modal from "../../common/Modal";
import {
  Loader2,
  Info,
  DollarSign,
  Ruler,
  Image as ImageIcon,
} from "lucide-react";

// --- HELPER COMPONENTS ---
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
  step,
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
      step={step}
      value={value || ""}
      onChange={onChange}
      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-amber-500 focus:bg-white text-slate-800 font-medium transition-all"
      required={required}
      placeholder={placeholder}
    />
  </div>
);

// ✅ FIXED: Safe handling of options
const SelectGroup = ({
  label,
  name,
  options,
  required = false,
  value,
  onChange,
}) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-slate-500 uppercase">
      {label} {required && "*"}
    </label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-amber-500 focus:bg-white text-slate-800 font-medium transition-all"
      required={required}
    >
      <option value="" className="text-slate-500">
        Select {label}
      </option>
      {options?.map((opt, idx) => {
        // Handle object options (like shapes) or string options (like colors)
        const val = typeof opt === "object" ? opt.value || opt._id : opt;
        // Fallback sequence: label -> code -> name -> the object itself (if string)
        const lbl =
          typeof opt === "object"
            ? opt.label || opt.code || opt.name || "Unknown"
            : opt;

        return (
          <option key={val || idx} value={val} className="text-slate-900">
            {lbl}
          </option>
        );
      })}
    </select>
  </div>
);

const EditDiamondModal = ({
  isOpen,
  onClose,
  onSave,
  diamond,
  filters,
  loading,
}) => {
  const initialState = {
    sku: "",
    stock: 1,
    available: true,
    location: "Natural",
    shape: "",
    carat: "",
    sizeRange: "",
    color: "",
    purity: "",
    cut: "",
    polish: "",
    symmetry: "",
    fluorescence: "",
    measurement: "",
    ratio: "",
    lab: "GIA",
    pricePerCarat: "",
    price: "",
    certNumber: "",
    certUrl: "",
    table: "",
    crownHeight: "",
    pavilionDepth: "",
    depth: "",
    crownAngle: "",
    pavilionAngle: "",
    comment: "",
    imageUrl: "",
    videoUrl: "",
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (isOpen && diamond) {
      setFormData({
        ...initialState,
        ...diamond,
        shape: diamond.shape?._id || diamond.shape || "",
      });
    }
  }, [isOpen, diamond]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePriceCalc = (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    if (newData.carat && newData.pricePerCarat) {
      const price = (
        parseFloat(newData.carat) * parseFloat(newData.pricePerCarat)
      ).toFixed(2);
      setFormData((prev) => ({ ...prev, price, [name]: value }));
    } else {
      handleChange(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Diamond: ${formData.sku}`}
    >
      <form onSubmit={handleSubmit} className="space-y-2">
        <SectionTitle icon={Info} title="Core Details" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InputGroup
            label="SKU"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            required
            placeholder="Unique ID"
          />
          <InputGroup
            label="Stock Qty"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
          />
          <SelectGroup
            label="Type"
            name="location"
            value={formData.location}
            onChange={handleChange}
            options={["Natural", "Lab Grown"]}
            required
          />
          <SelectGroup
            label="Shape"
            name="shape"
            value={formData.shape}
            onChange={handleChange}
            options={filters?.shapes}
            required
          />
        </div>

        <SectionTitle icon={Ruler} title="Grading & Specs" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InputGroup
            label="Carat"
            name="carat"
            type="number"
            step="0.01"
            value={formData.carat}
            onChange={handlePriceCalc}
            required
          />
          <SelectGroup
            label="Color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            options={filters?.colors}
          />
          <SelectGroup
            label="Clarity"
            name="purity"
            value={formData.purity}
            onChange={handleChange}
            options={filters?.clarities}
          />
          <SelectGroup
            label="Cut"
            name="cut"
            value={formData.cut}
            onChange={handleChange}
            options={filters?.cuts}
          />
          <InputGroup
            label="Polish"
            name="polish"
            value={formData.polish}
            onChange={handleChange}
          />
          <InputGroup
            label="Symmetry"
            name="symmetry"
            value={formData.symmetry}
            onChange={handleChange}
          />
          <InputGroup
            label="Fluorescence"
            name="fluorescence"
            value={formData.fluorescence}
            onChange={handleChange}
          />
          <InputGroup
            label="Lab"
            name="lab"
            value={formData.lab}
            onChange={handleChange}
            placeholder="GIA, IGI"
          />
        </div>

        <SectionTitle icon={DollarSign} title="Pricing" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-end">
          <InputGroup
            label="Price/Ct"
            name="pricePerCarat"
            type="number"
            step="0.01"
            value={formData.pricePerCarat}
            onChange={handlePriceCalc}
          />
          <InputGroup
            label="Total Price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <label className="flex items-center gap-2 h-10 bg-slate-50 px-3 rounded-lg border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
              className="w-4 h-4 accent-amber-500"
            />
            <span className="text-sm font-medium text-slate-700">
              Available for Sale
            </span>
          </label>
        </div>

        <SectionTitle icon={ImageIcon} title="Media & Files" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup
            label="Image URL"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://..."
          />
          <InputGroup
            label="Video URL"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <InputGroup
            label="Cert Number"
            name="certNumber"
            value={formData.certNumber}
            onChange={handleChange}
          />
          <InputGroup
            label="Cert URL"
            name="certUrl"
            value={formData.certUrl}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        <div className="mt-4">
          <label className="text-xs font-bold text-slate-500 uppercase">
            Internal Comment
          </label>
          <textarea
            name="comment"
            value={formData.comment || ""}
            onChange={handleChange}
            className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-amber-500 text-sm text-slate-800"
            rows="2"
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
            {loading && <Loader2 className="w-4 h-4 animate-spin" />} Update
            Diamond
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditDiamondModal;
