import React, { useState, useEffect, useRef } from "react";
import Modal from "../../common/Modal";
import {
  Info,
  Image as ImageIcon,
  Link as LinkIcon,
  Type,
  ListOrdered,
  Save,
  Loader2,
  User,
  UploadCloud,
  RefreshCw,
  X,
} from "lucide-react";

// Input Component
const InputGroup = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  icon: Icon,
  type = "text",
  rows,
}) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
      {Icon && <Icon size={12} />} {label} {required && "*"}
    </label>
    {rows ? (
      <textarea
        name={name}
        value={value || ""}
        onChange={onChange}
        required={required}
        rows={rows}
        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-amber-500 transition-all resize-none"
        placeholder={placeholder}
      />
    ) : (
      <input
        name={name}
        type={type}
        value={value || ""}
        onChange={onChange}
        required={required}
        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-amber-500 transition-all"
        placeholder={placeholder}
      />
    )}
  </div>
);

const ImageFormModal = ({ isOpen, onClose, onSave, type, item, loading }) => {
  const isEdit = !!item;
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const initialState = {
    image_url: "",
    title: "",
    subtitle: "",
    description: "",
    category: "",
    display_text: "",
    link_url: "",
    button_text: "",
    sort_order: "0",
    customer_name: "",
    review_text: "",
    rating: "5",
    active: true,
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (isOpen) {
      if (item) {
        setFormData({ ...initialState, ...item });
        setPreviewUrl(item.image_url);
      } else {
        setFormData(initialState);
        setPreviewUrl("");
      }
      setSelectedFile(null);
    }
  }, [isOpen, item, type]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Combine form data with the file object (if selected)
    const finalData = { ...formData };
    if (selectedFile) {
      finalData.file = selectedFile; // Service will convert this to FormData
    }

    onSave(finalData);
  };

  const getTitle = () => {
    const action = isEdit ? "Edit" : "Add";
    switch (type) {
      case "banner":
        return `${action} Banner`;
      case "collection":
        return `${action} Collection`;
      case "featured":
        return `${action} Featured`;
      case "review":
        return `${action} Review`;
      case "diamondType":
        return `${action} Diamond Info`;
      case "engagementBanner":
        return `${action} Eng. Banner`;
      default:
        return `${action} Item`;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* --- Image Upload --- */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase flex justify-between">
            <span>Image Preview</span>
            {previewUrl && (
              <span
                className="text-[10px] text-blue-600 cursor-pointer hover:underline"
                onClick={triggerFileInput}
              >
                Change Image
              </span>
            )}
          </label>

          <div
            onClick={triggerFileInput}
            className={`
              relative w-full h-48 rounded-xl overflow-hidden border-2 border-dashed transition-all cursor-pointer group
              ${
                previewUrl
                  ? "border-indigo-300 bg-slate-50"
                  : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50"
              }
            `}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />

            {previewUrl ? (
              <>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                  <RefreshCw size={24} className="mb-2" />
                  <span className="text-sm font-bold">Click to Replace</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <UploadCloud size={32} className="mb-2" />
                <p className="text-sm font-medium text-slate-600">
                  Click to upload image
                </p>
                <p className="text-xs mt-1">SVG, PNG, JPG (Max 5MB)</p>
              </div>
            )}
          </div>

          {!selectedFile && (
            <div className="relative mt-2">
              <ImageIcon
                size={14}
                className="absolute left-3 top-3 text-slate-400"
              />
              <input
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="Or paste image URL directly..."
                className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 outline-none focus:border-amber-500 font-mono"
              />
            </div>
          )}
        </div>

        <div className="h-px bg-slate-100 w-full" />

        {/* --- Fields --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(type === "banner" || type === "engagementBanner") && (
            <>
              <InputGroup
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Big Sale!"
                icon={Type}
              />
              <InputGroup
                label="Subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="Up to 50% off"
                icon={Info}
              />
              <InputGroup
                label="Button Text"
                name="button_text"
                value={formData.button_text}
                onChange={handleChange}
                placeholder="Shop Now"
              />
              <InputGroup
                label="Link URL"
                name="link_url"
                value={formData.link_url}
                onChange={handleChange}
                placeholder="/shop"
                icon={LinkIcon}
              />
            </>
          )}

          {type === "collection" && (
            <>
              <InputGroup
                label="Category Key"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="rings"
                icon={Type}
              />
              <InputGroup
                label="Display Text"
                name="display_text"
                value={formData.display_text}
                onChange={handleChange}
                required
                placeholder="Rings"
                icon={Info}
              />
              <div className="md:col-span-2">
                <InputGroup
                  label="Link URL"
                  name="link_url"
                  value={formData.link_url}
                  onChange={handleChange}
                  placeholder="/collections/rings"
                  icon={LinkIcon}
                />
              </div>
            </>
          )}

          {type === "featured" && (
            <>
              <InputGroup
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="New Arrival"
                icon={Type}
              />
              <InputGroup
                label="Subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="Check it out"
                icon={Info}
              />
              <div className="md:col-span-2">
                <InputGroup
                  label="Link URL"
                  name="link_url"
                  value={formData.link_url}
                  onChange={handleChange}
                  placeholder="/product/123"
                  icon={LinkIcon}
                />
              </div>
            </>
          )}

          {type === "review" && (
            <>
              <InputGroup
                label="Customer Name"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                required
                placeholder="Jane Doe"
                icon={User}
              />
              <InputGroup
                label="Rating (1-5)"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                type="number"
                placeholder="5"
              />
              <div className="md:col-span-2">
                <InputGroup
                  label="Review"
                  name="review_text"
                  value={formData.review_text}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Loved it!"
                />
              </div>
            </>
          )}

          {type === "diamondType" && (
            <>
              <InputGroup
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Natural Diamonds"
                icon={Type}
              />
              <div className="md:col-span-2">
                <InputGroup
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Description..."
                />
              </div>
              <div className="md:col-span-2">
                <InputGroup
                  label="Link URL"
                  name="link_url"
                  value={formData.link_url}
                  onChange={handleChange}
                  placeholder="/diamonds/natural"
                  icon={LinkIcon}
                />
              </div>
            </>
          )}

          {type !== "engagementBanner" && (
            <div className="md:col-span-2">
              <InputGroup
                label="Sort Order"
                name="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={handleChange}
                icon={ListOrdered}
              />
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save size={18} />
            )}{" "}
            {isEdit ? "Update" : "Save"} Item
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ImageFormModal;
