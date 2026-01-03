import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchVariantsByProduct,
  createVariant,
  updateVariant,
  deleteVariant,
  clearVariants,
} from "../../store/slices/variantSlice";

import DataTable from "../../components/common/DataTable";
import VariantFormModal from "../../components/modals/variants/VariantFormModal";
import DeleteDiamondModal from "../../components/modals/diamonds/DeleteDiamondModal"; // Reusing generic delete

import { Plus, Trash2, Edit, ArrowLeft, Layers, Gem } from "lucide-react";

const ProductVariants = () => {
  const { productId } = useParams(); // Expecting product ID or SKU in URL
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, loading } = useSelector((state) => state.variants);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    if (productId) {
      dispatch(fetchVariantsByProduct(productId));
    }
    return () => {
      dispatch(clearVariants());
    };
  }, [dispatch, productId]);

  const handleAdd = () => {
    setSelectedVariant(null);
    setIsFormOpen(true);
  };
  const handleEdit = (v) => {
    setSelectedVariant(v);
    setIsFormOpen(true);
  };
  const handleDeleteClick = (v) => {
    setSelectedVariant(v);
    setIsDeleteOpen(true);
  };

  const handleSave = async (data) => {
    let res;
    if (selectedVariant)
      res = await dispatch(updateVariant({ id: selectedVariant._id, data }));
    else res = await dispatch(createVariant(data));

    if (!res.error) {
      setIsFormOpen(false);
      setSelectedVariant(null);
    }
  };

  const confirmDelete = async () => {
    if (selectedVariant) {
      await dispatch(deleteVariant(selectedVariant._id));
      setIsDeleteOpen(false);
    }
  };

  const columns = [
    {
      header: "Variant SKU",
      accessor: "variantSku",
      render: (r) => (
        <span className="font-bold text-slate-800">{r.variantSku}</span>
      ),
    },
    {
      header: "Specs",
      accessor: "metalCode",
      render: (r) => (
        <div className="text-xs">
          <span className="font-semibold">{r.metalCode}</span> • {r.shape_code}
        </div>
      ),
    },
    {
      header: "Carat",
      accessor: "centerStoneWeight",
      render: (r) =>
        r.centerStoneWeight ? (
          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">
            {r.centerStoneWeight}ct
          </span>
        ) : (
          "-"
        ),
    },
    {
      header: "Price",
      accessor: "metalPrice",
      render: (r) => (
        <span className="font-bold text-green-700">
          ${(r.metalPrice || 0).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Stock",
      accessor: "stock",
      render: (r) => (
        <span
          className={`font-bold ${
            r.stock > 0 ? "text-slate-700" : "text-red-500"
          }`}
        >
          {r.stock}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-1">
          <button
            onClick={() => handleEdit(row)}
            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="p-1.5 hover:bg-red-50 text-red-600 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 w-full">
      <div className="mb-4">
        <button
          onClick={() => navigate("/products")}
          className="flex items-center text-slate-500 hover:text-slate-800 text-sm font-medium mb-2"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Products
        </button>
        <h1 className="text-2xl font-bold text-slate-800">
          Variants for: {productId}
        </h1>
      </div>

      <DataTable
        title="Product Variants"
        columns={columns}
        data={items}
        loading={loading}
        pagination={{ page: 1, limit: 100, total: items.length }} // Client-side pagination
        actionButton={
          <button
            onClick={handleAdd}
            className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} /> Add Variant
          </button>
        }
      />

      <VariantFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        variant={selectedVariant}
        productSku={productId}
        loading={loading}
      />

      <DeleteDiamondModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        diamond={{ sku: selectedVariant?.variantSku }}
        loading={loading}
      />
    </div>
  );
};

export default ProductVariants;
