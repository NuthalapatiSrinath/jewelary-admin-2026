import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import {
  fetchDiamonds,
  fetchDiamondFilters,
  deleteDiamond,
  createDiamond,
  updateDiamond,
  toggleDiamondStatus,
  bulkUploadDiamonds,
} from "../../store/slices/diamondSlice";

// Components
import DataTable from "../../components/common/DataTable";
import AddDiamondModal from "../../components/modals/diamonds/AddDiamondModal";
import EditDiamondModal from "../../components/modals/diamonds/EditDiamondModal";
import DeleteDiamondModal from "../../components/modals/diamonds/DeleteDiamondModal";

import {
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  Download,
  Loader2,
  Gem,
  Video,
  Link as LinkIcon,
} from "lucide-react";

const Diamonds = () => {
  const dispatch = useDispatch();
  const { items, pagination, loading, filters } = useSelector(
    (state) => state.diamonds
  );

  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 50,
    search: "",
    shape: "",
    diamondType: "",
    cut: "",
    color: "",
    clarity: "",
  });

  // --- CORRECT MODAL STATES ---
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedDiamond, setSelectedDiamond] = useState(null);
  const [processingIds, setProcessingIds] = useState(new Set());

  useEffect(() => {
    dispatch(fetchDiamonds(queryParams));
  }, [dispatch, queryParams]);
  useEffect(() => {
    if (!filters) dispatch(fetchDiamondFilters());
  }, [dispatch, filters]);

  const handlePageChange = (p) =>
    setQueryParams((prev) => ({ ...prev, page: p }));
  const handleLimitChange = (l) =>
    setQueryParams((prev) => ({ ...prev, limit: l, page: 1 }));
  const handleSearch = (t) =>
    setQueryParams((prev) => ({ ...prev, search: t, page: 1 }));
  const handleFilterChange = (e) =>
    setQueryParams((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      page: 1,
    }));

  // --- FIXED HANDLERS ---
  const handleAdd = () => {
    setSelectedDiamond(null);
    setIsAddOpen(true); // ✅ Fixed: Sets the correct state
  };

  const handleEditClick = (diamond) => {
    setSelectedDiamond(diamond);
    setIsEditOpen(true); // ✅ Fixed: Sets the correct state
  };

  const handleDeleteClick = (diamond) => {
    setSelectedDiamond(diamond);
    setIsDeleteOpen(true);
  };

  const handleSaveCreate = async (data) => {
    const res = await dispatch(createDiamond(data));
    if (!res.error) {
      setIsAddOpen(false);
      dispatch(fetchDiamonds(queryParams));
    }
  };

  const handleSaveUpdate = async (data) => {
    if (!selectedDiamond) return;
    const res = await dispatch(
      updateDiamond({ id: selectedDiamond._id, data })
    );
    if (!res.error) {
      setIsEditOpen(false);
      setSelectedDiamond(null);
      dispatch(fetchDiamonds(queryParams));
    }
  };

  const confirmDelete = async (id) => {
    await dispatch(deleteDiamond(id));
    setIsDeleteOpen(false);
  };

  const handleToggleStatus = async (id, currentStatus) => {
    setProcessingIds((prev) => new Set(prev).add(id));
    try {
      await dispatch(toggleDiamondStatus({ id, currentStatus }));
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleBulkUpload = (e) => {
    if (
      e.target.files[0] &&
      window.confirm(`Upload ${e.target.files[0].name}?`)
    ) {
      dispatch(bulkUploadDiamonds(e.target.files[0]));
    }
  };

  const downloadTemplate = () => {
    const headers = [
      {
        sku: "DIA-001",
        shape: "Round",
        carat: 1.0,
        color: "D",
        purity: "VS1",
        cut: "Ex",
        price: 5000,
        pricePerCarat: 5000,
        stock: 1,
        location: "Natural",
        lab: "GIA",
        certNumber: "123456",
        polish: "Ex",
        symmetry: "Ex",
        fluorescence: "None",
        table: 57,
        depth: 61.5,
        measurement: "6.5x6.5x4.0",
        imageUrl: "",
        videoUrl: "",
      },
    ];
    const ws = XLSX.utils.json_to_sheet(headers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "diamond_upload_template.xlsx");
  };

  const renderExpandedRow = (row) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600 bg-slate-50/80 p-5 rounded-lg border border-slate-100 shadow-inner">
      <div>
        <h4 className="font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1 uppercase text-xs">
          Measurements
        </h4>
        <div className="grid grid-cols-2 gap-y-1.5">
          <span>Measurements:</span>{" "}
          <span className="font-medium text-slate-800">
            {row.measurement || "-"}
          </span>
          <span>Table:</span>{" "}
          <span className="font-medium text-slate-800">
            {row.table ? `${row.table}%` : "-"}
          </span>
          <span>Depth:</span>{" "}
          <span className="font-medium text-slate-800">
            {row.depth ? `${row.depth}%` : "-"}
          </span>
          <span>Ratio:</span>{" "}
          <span className="font-medium text-slate-800">{row.ratio || "-"}</span>
        </div>
      </div>
      <div>
        <h4 className="font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1 uppercase text-xs">
          Grading
        </h4>
        <div className="grid grid-cols-2 gap-y-1.5">
          <span>Polish:</span>{" "}
          <span className="font-medium text-slate-800">
            {row.polish || "-"}
          </span>
          <span>Symmetry:</span>{" "}
          <span className="font-medium text-slate-800">
            {row.symmetry || "-"}
          </span>
          <span>Fluorescence:</span>{" "}
          <span className="font-medium text-slate-800">
            {row.fluorescence || "-"}
          </span>
          <span>Lab:</span>{" "}
          <span className="font-medium text-slate-800">{row.lab || "-"}</span>
        </div>
      </div>
      <div>
        <h4 className="font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1 uppercase text-xs">
          Media & Cert
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-2 bg-white p-2 rounded border border-slate-200">
            <span className="font-bold text-xs">CERT:</span>{" "}
            {row.certNumber || "N/A"}
            {row.certUrl && (
              <a
                href={row.certUrl}
                target="_blank"
                rel="noreferrer"
                className="ml-auto text-blue-600 hover:underline flex items-center gap-1 text-xs font-bold"
              >
                <LinkIcon size={12} /> VIEW
              </a>
            )}
          </div>
          {row.videoUrl && (
            <a
              href={row.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-amber-600 font-bold text-xs hover:underline"
            >
              <Video size={14} /> WATCH 360° VIDEO
            </a>
          )}
        </div>
      </div>
    </div>
  );

  const columns = [
    {
      header: "Image",
      accessor: "imageUrl",
      className: "w-16 text-center",
      render: (row) => (
        <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
          {row.imageUrl ? (
            <img
              src={row.imageUrl}
              alt={row.sku}
              className="w-full h-full object-cover"
            />
          ) : (
            <Gem className="w-6 h-6 text-slate-300" />
          )}
        </div>
      ),
    },
    {
      header: "SKU",
      accessor: "sku",
      render: (row) => (
        <span className="font-bold text-slate-900">{row.sku}</span>
      ),
    },
    {
      header: "Loc",
      accessor: "location",
      render: (r) => (
        <span
          className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${
            r.location === "Natural"
              ? "text-blue-700 bg-blue-50 border-blue-100"
              : "text-purple-700 bg-purple-50 border-purple-100"
          }`}
        >
          {r.location === "Natural" ? "NAT" : "LAB"}
        </span>
      ),
    },
    {
      header: "Shape",
      accessor: "shape",
      render: (row) => (
        <span className="capitalize px-2 py-1 bg-slate-100 rounded text-slate-700 text-xs font-semibold border border-slate-200">
          {row.shape?.label || row.shape?.code || "-"}
        </span>
      ),
    },
    {
      header: "Carat",
      accessor: "carat",
      render: (r) => (
        <span className="font-bold text-slate-800">{r.carat}</span>
      ),
    },
    {
      header: "Color",
      accessor: "color",
      render: (r) => (
        <span className="font-medium text-slate-700">{r.color || "-"}</span>
      ),
    },
    {
      header: "Clarity",
      accessor: "purity",
      render: (r) => (
        <span className="font-medium text-slate-700">{r.purity || "-"}</span>
      ),
    },
    {
      header: "Cut",
      accessor: "cut",
      render: (r) => (
        <span className="font-medium text-slate-700">{r.cut || "-"}</span>
      ),
    },
    {
      header: "Pol",
      accessor: "polish",
      render: (r) => (
        <span className="text-slate-500 text-xs">{r.polish || "-"}</span>
      ),
    },
    {
      header: "Sym",
      accessor: "symmetry",
      render: (r) => (
        <span className="text-slate-500 text-xs">{r.symmetry || "-"}</span>
      ),
    },
    {
      header: "Fluor",
      accessor: "fluorescence",
      render: (r) => (
        <span className="text-slate-500 text-xs">{r.fluorescence || "-"}</span>
      ),
    },
    {
      header: "Lab",
      accessor: "lab",
      render: (r) => (
        <span className="text-slate-600 font-medium text-xs">
          {r.lab || "-"}
        </span>
      ),
    },
    {
      header: "Price",
      accessor: "price",
      render: (row) => (
        <div className="font-bold text-amber-600">
          ${row.price?.toLocaleString()}
        </div>
      ),
    },
    {
      header: "Stk",
      accessor: "stock",
      render: (r) => (
        <span className="font-mono text-slate-700">{r.stock}</span>
      ),
    },
    {
      header: "Status",
      accessor: "active",
      className: "text-center",
      render: (row) => {
        const isProcessing = processingIds.has(row._id);
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus(row._id, row.active);
            }}
            disabled={isProcessing}
            className={`inline-flex items-center justify-center p-1.5 rounded-full transition-all ${
              row.active
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            } ${isProcessing ? "opacity-50" : ""}`}
          >
            {isProcessing ? (
              <Loader2 size={14} className="animate-spin" />
            ) : row.active ? (
              <CheckCircle size={14} />
            ) : (
              <XCircle size={14} />
            )}
          </button>
        );
      },
    },
    {
      header: "Actions",
      className: "text-right",
      render: (row) => (
        <div
          className="flex justify-end gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => handleEditClick(row)}
            className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded transition-colors"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const selectClass =
    "h-10 px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white font-medium focus:border-amber-500 outline-none shadow-sm cursor-pointer hover:border-slate-400 transition-all min-w-[140px]";
  const optionClass = "text-slate-900 bg-white";

  return (
    <div className="p-2 w-full">
      <DataTable
        title="Diamond Inventory"
        columns={columns}
        data={items}
        loading={loading}
        pagination={{
          page: pagination.currentPage,
          limit: pagination.itemsPerPage,
          total: pagination.totalItems,
        }}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSearch={handleSearch}
        renderExpandedRow={renderExpandedRow}
        actionButton={
          <div className="flex flex-col xl:flex-row gap-4 items-end xl:items-center w-full xl:w-auto mt-4 xl:mt-0">
            <div className="flex flex-wrap gap-2">
              <select
                name="shape"
                onChange={handleFilterChange}
                className={selectClass}
              >
                <option value="" className={optionClass}>
                  All Shapes
                </option>
                {filters?.shapes?.map((s) => (
                  <option key={s._id} value={s.code} className={optionClass}>
                    {s.label} ({s.code})
                  </option>
                ))}
              </select>
              <select
                name="diamondType"
                onChange={handleFilterChange}
                className={selectClass}
              >
                <option value="" className={optionClass}>
                  All Types
                </option>
                <option value="Natural" className={optionClass}>
                  Natural
                </option>
                <option value="Lab Grown" className={optionClass}>
                  Lab Grown
                </option>
              </select>
              <select
                name="color"
                onChange={handleFilterChange}
                className={selectClass}
              >
                <option value="" className={optionClass}>
                  All Colors
                </option>
                {filters?.colors?.map((c) => (
                  <option key={c} value={c} className={optionClass}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                name="clarity"
                onChange={handleFilterChange}
                className={selectClass}
              >
                <option value="" className={optionClass}>
                  All Clarities
                </option>
                {filters?.clarities?.map((c) => (
                  <option key={c} value={c} className={optionClass}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                name="cut"
                onChange={handleFilterChange}
                className={selectClass}
              >
                <option value="" className={optionClass}>
                  All Cuts
                </option>
                {filters?.cuts?.map((c) => (
                  <option key={c} value={c} className={optionClass}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={downloadTemplate}
                className="flex items-center justify-center w-10 h-10 bg-white border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-all shadow-sm"
              >
                <Download size={18} />
              </button>
              <label className="flex items-center justify-center w-10 h-10 bg-white border border-slate-300 text-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 transition-all shadow-sm">
                <FileSpreadsheet size={18} />
                <input
                  type="file"
                  hidden
                  accept=".xlsx, .xls"
                  onChange={handleBulkUpload}
                />
              </label>
              <button
                onClick={handleAdd}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 h-10 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-lg active:scale-95"
              >
                <Plus className="w-4 h-4" />{" "}
                <span className="hidden sm:inline">Add Diamond</span>{" "}
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        }
      />

      <AddDiamondModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={handleSaveCreate}
        filters={filters}
        loading={loading}
      />
      <EditDiamondModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSaveUpdate}
        diamond={selectedDiamond}
        filters={filters}
        loading={loading}
      />
      <DeleteDiamondModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        diamond={selectedDiamond}
        loading={loading}
      />
    </div>
  );
};

export default Diamonds;
