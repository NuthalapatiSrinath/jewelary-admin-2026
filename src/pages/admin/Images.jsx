import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBanners,
  fetchCollections,
  fetchFeatured,
  fetchReviews,
  fetchDiamondTypes,
  fetchEngagementBanner,
  createMedia,
  updateMedia,
  deleteMedia,
} from "../../store/slices/imageSlice";

import ImageFormModal from "../../components/modals/images/ImageFormModal";
import DeleteDiamondModal from "../../components/modals/diamonds/DeleteDiamondModal";
import {
  Plus,
  Trash2,
  Edit,
  Layout,
  Layers,
  Star,
  MessageSquare,
  Gem,
  HeartHandshake,
  Link as LinkIcon,
  ImageIcon,
} from "lucide-react";

// --- Tab Button ---
const TabButton = ({ active, label, icon: Icon, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap
      ${
        active
          ? "bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
      }
    `}
  >
    <Icon size={16} /> {label}
  </button>
);

// --- Detail Row Helper ---
const DetailRow = ({ label, value, icon: Icon, isLink }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 text-xs text-slate-600 mb-1.5">
      {Icon && <Icon size={12} className="mt-0.5 text-slate-400 shrink-0" />}
      <div className="overflow-hidden">
        {label && (
          <span className="font-semibold text-slate-700 mr-1">{label}:</span>
        )}
        {isLink ? (
          <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[10px] text-blue-600 break-all">
            {value}
          </span>
        ) : (
          <span className="break-words line-clamp-2">{value}</span>
        )}
      </div>
    </div>
  );
};

// --- Star Rating ---
const StarRating = ({ rating }) => (
  <div className="flex text-amber-400 text-[10px]">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={12}
        fill={i < rating ? "currentColor" : "none"}
        className={i < rating ? "text-amber-400" : "text-slate-200"}
      />
    ))}
  </div>
);

// --- Image Card ---
const ImageCard = ({ item, onEdit, onDelete, type }) => (
  <div className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
    {/* Image Section */}
    <div className="aspect-video w-full bg-slate-100 relative overflow-hidden shrink-0">
      {item.image_url ? (
        <img
          src={item.image_url}
          alt="Media"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-300">
          <ImageIcon size={32} />
        </div>
      )}

      {/* Actions Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
        <button
          onClick={() => onEdit(item)}
          className="p-2 bg-white text-indigo-600 rounded-full hover:bg-indigo-50 shadow-sm transform hover:scale-110"
          title="Edit"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={() => onDelete(item)}
          className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50 shadow-sm transform hover:scale-110"
          title="Delete"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {item.sort_order !== undefined && (
        <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm font-mono font-bold">
          #{item.sort_order}
        </div>
      )}
    </div>

    {/* Details Section */}
    <div className="p-4 flex-1 flex flex-col">
      <div className="mb-3 border-b border-slate-100 pb-2">
        <h4 className="font-bold text-slate-800 text-sm truncate">
          {item.title ||
            item.display_text ||
            item.customer_name ||
            item.category ||
            "Untitled"}
        </h4>
        {type === "review" && item.rating && (
          <div className="mt-1">
            <StarRating rating={Number(item.rating)} />
          </div>
        )}
      </div>

      <div className="flex-1 space-y-1">
        {(type === "banner" || type === "engagementBanner") && (
          <>
            <DetailRow label="Subtitle" value={item.subtitle} />
            <DetailRow
              label="Button"
              value={item.button_text}
              className="text-indigo-600"
            />
            <DetailRow value={item.link_url} icon={LinkIcon} isLink />
          </>
        )}

        {type === "collection" && (
          <>
            <DetailRow label="Key" value={item.category} icon={Layers} />
            <DetailRow label="Display" value={item.display_text} />
            <DetailRow value={item.link_url} icon={LinkIcon} isLink />
          </>
        )}

        {type === "featured" && (
          <>
            <DetailRow label="Subtitle" value={item.subtitle} />
            <DetailRow value={item.link_url} icon={LinkIcon} isLink />
          </>
        )}

        {type === "review" && (
          <div className="relative pl-3 mt-1">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-200"></div>
            <p className="text-xs text-slate-600 italic line-clamp-4">
              "{item.review_text}"
            </p>
          </div>
        )}

        {type === "diamondType" && (
          <>
            <DetailRow value={item.description} />
            <DetailRow value={item.link_url} icon={LinkIcon} isLink />
          </>
        )}
      </div>
    </div>
  </div>
);

const Images = () => {
  const dispatch = useDispatch();
  // Destructure all states from slice
  const {
    banners,
    collections,
    featured,
    reviews,
    diamondTypes,
    engagementBanner,
    loading,
  } = useSelector((state) => state.images);

  const [activeTab, setActiveTab] = useState("banner");

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Initial Fetch
  useEffect(() => {
    dispatch(fetchBanners());
    dispatch(fetchCollections());
    dispatch(fetchFeatured());
    dispatch(fetchReviews());
    dispatch(fetchDiamondTypes());
    dispatch(fetchEngagementBanner());
  }, [dispatch]);

  // Handlers
  const handleAdd = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };
  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };
  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleSave = async (data) => {
    // If updating engagement banner (singleton), we might need logic to pass ID if it exists
    // The service handles upsert for singletons, but updateMedia needs an ID if updating standard lists
    let res;

    // Special handling for singleton Engagement Banner update
    if (activeTab === "engagementBanner" && engagementBanner) {
      res = await dispatch(
        updateMedia({ type: activeTab, id: engagementBanner._id, data })
      );
    } else if (selectedItem) {
      res = await dispatch(
        updateMedia({ type: activeTab, id: selectedItem._id, data })
      );
    } else {
      res = await dispatch(createMedia({ type: activeTab, data }));
    }

    if (!res.error) {
      setIsFormOpen(false);
      setSelectedItem(null);
    }
  };

  const confirmDelete = async () => {
    if (selectedItem) {
      await dispatch(deleteMedia({ type: activeTab, id: selectedItem._id }));
      setIsDeleteOpen(false);
      setSelectedItem(null);
    }
  };

  // Helper to get current data list
  const getCurrentData = () => {
    switch (activeTab) {
      case "banner":
        return Array.isArray(banners) ? banners : [];
      case "collection":
        return Array.isArray(collections) ? collections : [];
      case "featured":
        return Array.isArray(featured) ? featured : [];
      case "review":
        return Array.isArray(reviews) ? reviews : [];
      case "diamondType":
        return Array.isArray(diamondTypes) ? diamondTypes : [];
      // Wrap singleton in array for uniform rendering
      case "engagementBanner":
        return engagementBanner ? [engagementBanner] : [];
      default:
        return [];
    }
  };

  const currentItems = getCurrentData();

  return (
    <div className="p-4 md:p-6 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Media Library</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage website banners, content, and reviews.
          </p>
        </div>
        {/* Only show Add button if list mode OR if singleton is empty */}
        {(activeTab !== "engagementBanner" || !engagementBanner) && (
          <button
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <Plus size={18} /> Add{" "}
            {activeTab === "engagementBanner" ? "Banner" : "New"}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-4 mb-2 gap-2 border-b border-slate-200 no-scrollbar">
        <TabButton
          active={activeTab === "banner"}
          onClick={() => setActiveTab("banner")}
          label="Home Banners"
          icon={Layout}
        />
        <TabButton
          active={activeTab === "collection"}
          onClick={() => setActiveTab("collection")}
          label="Collections"
          icon={Layers}
        />
        <TabButton
          active={activeTab === "featured"}
          onClick={() => setActiveTab("featured")}
          label="Featured"
          icon={Star}
        />
        <TabButton
          active={activeTab === "review"}
          onClick={() => setActiveTab("review")}
          label="Reviews"
          icon={MessageSquare}
        />
        <TabButton
          active={activeTab === "diamondType"}
          onClick={() => setActiveTab("diamondType")}
          label="Diamond Types"
          icon={Gem}
        />
        <TabButton
          active={activeTab === "engagementBanner"}
          onClick={() => setActiveTab("engagementBanner")}
          label="Engagement Banner"
          icon={HeartHandshake}
        />
      </div>

      {/* Content Grid */}
      {loading && currentItems.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-slate-400">
          <div className="animate-pulse flex flex-col items-center">
            <ImageIcon size={48} className="mb-2 opacity-50" />
            <span>Loading content...</span>
          </div>
        </div>
      ) : currentItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
            <ImageIcon size={32} className="text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">No content found</h3>
          <p className="text-slate-500 text-sm mt-1">
            {activeTab === "engagementBanner"
              ? "Set up your engagement banner."
              : "Add new items to get started."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
          {currentItems.map((item) => (
            <ImageCard
              key={item._id || "singleton"}
              item={item}
              type={activeTab}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      <ImageFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        type={activeTab}
        item={selectedItem}
        loading={loading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteDiamondModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        diamond={{
          sku:
            selectedItem?.title ||
            selectedItem?.display_text ||
            selectedItem?.customer_name ||
            "this item",
        }}
        loading={loading}
      />
    </div>
  );
};

export default Images;
