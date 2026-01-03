import React, { useState, useEffect, useRef } from "react";
import Modal from "../../common/Modal";
import {
  Loader2,
  Info,
  DollarSign,
  Ruler,
  Image as ImageIcon,
  Video,
  Upload,
  X,
  Link as LinkIcon,
  Edit,
} from "lucide-react";

const EditDiamondModal = ({
  isOpen,
  onClose,
  onSave,
  diamond,
  filters,
  loading,
}) => {
  const [localLoading, setLocalLoading] = useState(false);

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

  // File States
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");

  useEffect(() => {
    if (isOpen && diamond) {
      setFormData({
        ...initialState,
        ...diamond,
        shape: diamond.shape?._id || diamond.shape || "",
      });
      setImagePreview(diamond.imageUrl || "");
      setVideoPreview(diamond.videoUrl || "");
      setImageFile(null);
      setVideoFile(null);
    }
  }, [isOpen, diamond]);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "image") {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(file));
      }
    }
  };

  const clearMedia = (type) => {
    if (type === "image") {
      setImageFile(null);
      setImagePreview("");
      setFormData((prev) => ({ ...prev, imageUrl: "" }));
    } else {
      setVideoFile(null);
      setVideoPreview("");
      setFormData((prev) => ({ ...prev, videoUrl: "" }));
    }
  };

  const handlePriceCalc = (e) => {
    handleChange(e);
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    if (newData.carat && newData.pricePerCarat) {
      const price = (
        parseFloat(newData.carat) * parseFloat(newData.pricePerCarat)
      ).toFixed(2);
      setFormData((prev) => ({ ...prev, price }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    const submissionData = { ...formData };

    try {
      if (imageFile) submissionData.imageUrl = await toBase64(imageFile);
      if (videoFile) submissionData.videoUrl = await toBase64(videoFile);
      await onSave(submissionData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  // --- Sub-components (Duplicated to be self-contained) ---
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
    onChangeOverride,
  }) => (
    <div className="space-y-1">
      <label className="text-xs font-bold text-slate-500 uppercase">
        {label} {required && "*"}
      </label>
      <input
        name={name}
        type={type}
        step={step}
        value={formData[name] || ""}
        onChange={onChangeOverride || handleChange}
        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-amber-500 focus:bg-white text-slate-800 font-medium transition-all"
        required={required}
        placeholder={placeholder}
      />
    </div>
  );

  const SelectGroup = ({ label, name, options, required = false }) => (
    <div className="space-y-1">
      <label className="text-xs font-bold text-slate-500 uppercase">
        {label} {required && "*"}
      </label>
      <select
        name={name}
        value={formData[name] || ""}
        onChange={handleChange}
        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-amber-500 focus:bg-white text-slate-800 font-medium transition-all"
        required={required}
      >
        <option value="" className="text-slate-500">
          Select {label}
        </option>
        {options?.map((opt) => {
          const val = opt.value || opt._id || opt;
          const lbl = opt.label || opt;
          return (
            <option key={val} value={val} className="text-slate-900">
              {lbl}
            </option>
          );
        })}
      </select>
    </div>
  );

  const MediaInput = ({
    label,
    icon: Icon,
    type,
    previewUrl,
    onFileChange,
    onClear,
    urlName,
  }) => {
    const fileInputRef = useRef(null);
    return (
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase flex justify-between">
          {label}
          {previewUrl && (
            <button
              type="button"
              onClick={onClear}
              className="text-red-500 hover:text-red-700 text-xs flex items-center"
            >
              <X size={12} /> Clear
            </button>
          )}
        </label>
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
          {previewUrl ? (
            <div className="relative h-32 bg-slate-100 flex items-center justify-center group">
              {type === "image" ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-full w-full object-contain"
                />
              ) : (
                <video
                  src={previewUrl}
                  className="h-full w-full object-contain"
                  controls
                />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 bg-white/90 rounded-full text-slate-700 hover:text-indigo-600"
                >
                  <Edit size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors border-b border-slate-200 border-dashed"
            >
              <Icon size={24} className="text-slate-300 mb-2" />
              <span className="text-sm text-slate-500 font-medium flex items-center gap-1">
                <Upload size={14} /> Upload{" "}
                {type === "image" ? "Image" : "Video"}
              </span>
              <span className="text-xs text-slate-400 mt-1">
                or paste URL below
              </span>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            accept={type === "image" ? "image/*" : "video/*"}
            className="hidden"
          />
          <div className="flex items-center bg-white px-2 border-t border-slate-200">
            <LinkIcon size={14} className="text-slate-400 mr-2 flex-shrink-0" />
            <input
              name={urlName}
              value={formData[urlName] || ""}
              onChange={(e) => {
                handleChange(e);
                if (type === "image") setImagePreview(e.target.value);
                else setVideoPreview(e.target.value);
              }}
              placeholder={`Or paste ${type} URL...`}
              className="flex-1 py-2 text-sm outline-none text-slate-700 bg-transparent"
            />
          </div>
        </div>
      </div>
    );
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
          <InputGroup label="SKU" name="sku" required placeholder="Unique ID" />
          <InputGroup label="Stock Qty" name="stock" type="number" />
          <SelectGroup
            label="Type"
            name="location"
            options={["Natural", "Lab Grown"]}
            required
          />
          <SelectGroup
            label="Shape"
            name="shape"
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
            required
            onChangeOverride={handlePriceCalc}
          />
          <SelectGroup label="Color" name="color" options={filters?.colors} />
          <SelectGroup
            label="Clarity"
            name="purity"
            options={filters?.clarities}
          />
          <SelectGroup label="Cut" name="cut" options={filters?.cuts} />
          <InputGroup label="Polish" name="polish" />
          <InputGroup label="Symmetry" name="symmetry" />
          <InputGroup label="Fluorescence" name="fluorescence" />
          <InputGroup label="Lab" name="lab" placeholder="GIA, IGI" />
        </div>

        <SectionTitle icon={DollarSign} title="Pricing" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-end">
          <InputGroup
            label="Price/Ct"
            name="pricePerCarat"
            type="number"
            step="0.01"
            onChangeOverride={handlePriceCalc}
          />
          <InputGroup
            label="Total Price"
            name="price"
            type="number"
            step="0.01"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MediaInput
            label="Diamond Image"
            icon={ImageIcon}
            type="image"
            urlName="imageUrl"
            previewUrl={imagePreview}
            onFileChange={(e) => handleFileChange(e, "image")}
            onClear={() => clearMedia("image")}
          />
          <MediaInput
            label="360° Video"
            icon={Video}
            type="video"
            urlName="videoUrl"
            previewUrl={videoPreview}
            onFileChange={(e) => handleFileChange(e, "video")}
            onClear={() => clearMedia("video")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <InputGroup label="Cert Number" name="certNumber" />
          <InputGroup
            label="Cert URL"
            name="certUrl"
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
            disabled={localLoading || loading}
            className="flex-1 py-3 text-slate-600 bg-slate-100 rounded-lg font-bold hover:bg-slate-200 transition-colors disabled:opacity-70"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={localLoading || loading}
            className="flex-1 py-3 text-white bg-amber-500 rounded-lg font-bold hover:bg-amber-600 shadow-lg shadow-amber-500/25 transition-all flex justify-center items-center gap-2 disabled:opacity-70"
          >
            {(localLoading || loading) && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}{" "}
            Update Diamond
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditDiamondModal;
