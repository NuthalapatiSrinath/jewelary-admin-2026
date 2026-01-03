import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  bulkUploadProducts,
} from "../../store/slices/productSlice";

// Components
import DataTable from "../../components/common/DataTable";
import ProductFormModal from "../../components/modals/products/ProductFormModal";
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
  Package,
  Calendar,
} from "lucide-react";

const Products = () => {
  const dispatch = useDispatch();
  const { items, pagination, loading } = useSelector((state) => state.products);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 50,
    search: "",
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [processingIds, setProcessingIds] = useState(new Set());

  useEffect(() => {
    dispatch(fetchProducts(queryParams));
  }, [dispatch, queryParams]);

  const handlePageChange = (p) =>
    setQueryParams((prev) => ({ ...prev, page: p }));
  const handleLimitChange = (l) =>
    setQueryParams((prev) => ({ ...prev, limit: l, page: 1 }));
  const handleSearch = (t) =>
    setQueryParams((prev) => ({ ...prev, search: t, page: 1 }));

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };
  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const handleSave = async (data) => {
    let res;
    if (selectedProduct)
      res = await dispatch(updateProduct({ id: selectedProduct._id, data }));
    else res = await dispatch(createProduct(data));

    if (!res.error) {
      setIsFormOpen(false);
      setSelectedProduct(null);
      dispatch(fetchProducts(queryParams));
    }
  };

  const confirmDelete = async () => {
    if (selectedProduct) {
      await dispatch(deleteProduct(selectedProduct._id));
      setIsDeleteOpen(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    setProcessingIds((prev) => new Set(prev).add(id));
    try {
      await dispatch(toggleProductStatus({ id, currentStatus }));
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
      dispatch(bulkUploadProducts(e.target.files[0]));
    }
  };

  const downloadTemplate = () => {
    const headers = [
      {
        productSku: "RING-001",
        productName: "Solitaire Ring",
        defaultPrice: 1500,
        active: true,
      },
    ];
    const ws = XLSX.utils.json_to_sheet(headers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "product_template.xlsx");
  };

  // --- Expanded Row showing ALL details ---
  const renderExpandedRow = (row) => (
    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-bold text-slate-800 mb-1">Description</h4>
          <p className="text-slate-600 leading-relaxed">
            {row.description || "No description provided."}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-bold text-slate-800 mb-1">Logistics</h4>
            <div className="text-slate-600 space-y-1">
              <div className="flex items-center gap-2">
                <Calendar size={14} /> Lead Time: {row.lead_days || "-"} days
              </div>
              {row.delivery_date && (
                <div>
                  Delivery By:{" "}
                  {new Date(row.delivery_date).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-1">Settings</h4>
            <div className="flex flex-wrap gap-2">
              {row.readyToShip && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  RTS
                </span>
              )}
              {row.engravingAllowed && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  Engraving
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Arrays */}
      {(row.availableMetalTypes?.length > 0 ||
        row.availableShapes?.length > 0) && (
        <div className="pt-3 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {row.availableMetalTypes?.length > 0 && (
              <div>
                <span className="font-bold text-slate-700 block mb-1">
                  Allowed Metals:
                </span>
                <div className="flex flex-wrap gap-1">
                  {row.availableMetalTypes.map((m) => (
                    <span
                      key={m}
                      className="px-2 py-0.5 bg-slate-200 text-slate-700 text-xs rounded"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {row.availableShapes?.length > 0 && (
              <div>
                <span className="font-bold text-slate-700 block mb-1">
                  Allowed Shapes:
                </span>
                <div className="flex flex-wrap gap-1">
                  {row.availableShapes.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 bg-slate-200 text-slate-700 text-xs rounded"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const columns = [
    {
      header: "Image",
      accessor: "imageUrl1",
      className: "w-16 text-center",
      render: (row) => (
        <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
          {row.imageUrl1 ? (
            <img
              src={row.imageUrl1}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <Package className="text-slate-300" />
          )}
        </div>
      ),
    },
    {
      header: "SKU",
      accessor: "productSku",
      render: (r) => (
        <span className="font-bold text-slate-900">{r.productSku}</span>
      ),
    },
    {
      header: "Name",
      accessor: "productName",
      render: (r) => (
        <span className="font-medium text-slate-800">{r.productName}</span>
      ),
    },
    {
      header: "Category",
      accessor: "categories",
      render: (r) => (
        <span className="text-xs bg-slate-100 px-2 py-1 rounded">
          {r.categories}
        </span>
      ),
    },
    {
      header: "Price",
      accessor: "defaultPrice",
      render: (r) => (
        <span className="font-bold text-amber-600">
          ${r.defaultPrice?.toLocaleString()}
        </span>
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
            className={`p-1 rounded-full ${
              row.active
                ? "text-green-600 bg-green-50"
                : "text-red-600 bg-red-50"
            }`}
          >
            {isProcessing ? (
              <Loader2 size={14} className="animate-spin" />
            ) : row.active ? (
              <CheckCircle size={16} />
            ) : (
              <XCircle size={16} />
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
            onClick={() => handleEdit(row)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-2 w-full">
      <DataTable
        title="Product Catalog"
        columns={columns}
        data={items}
        loading={loading}
        pagination={{
          page: pagination.page || 1,
          limit: 50,
          total: pagination.total || 0,
        }}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSearch={handleSearch}
        renderExpandedRow={renderExpandedRow}
        actionButton={
          <div className="flex gap-2">
            <button
              onClick={downloadTemplate}
              className="p-2 border rounded hover:bg-slate-50"
            >
              <Download size={18} />
            </button>
            <label className="p-2 border rounded hover:bg-slate-50 cursor-pointer">
              <FileSpreadsheet size={18} />
              <input type="file" hidden onChange={handleBulkUpload} />
            </label>
            <button
              onClick={handleAdd}
              className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-indigo-700"
            >
              <Plus size={16} /> Add
            </button>
          </div>
        }
      />
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        product={selectedProduct}
        loading={loading}
      />
      <DeleteDiamondModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        diamond={{ sku: selectedProduct?.productSku }}
        loading={loading}
      />
    </div>
  );
};

export default Products;
