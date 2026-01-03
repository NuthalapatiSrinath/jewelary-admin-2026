import React from "react";
import DataTable from "../components/common/DataTable";
import { Eye, Edit, Trash2 } from "lucide-react";

const Dashboard = () => {
  // 1. Define Columns
  const columns = [
    { header: "ID", accessor: "id", className: "w-20" },
    { header: "Product Name", accessor: "name" },
    { header: "Price", accessor: "price", render: (row) => `$${row.price}` },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-bold ${
            row.status === "Active"
              ? "bg-success-bg text-success"
              : "bg-danger-bg text-danger"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <button className="p-2 hover:bg-page rounded text-primary">
            <Eye size={16} />
          </button>
          <button className="p-2 hover:bg-page rounded text-text-sub">
            <Edit size={16} />
          </button>
          <button className="p-2 hover:bg-page rounded text-danger">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  // 2. Mock Data (Replace with API data)
  const data = [
    { id: 1, name: "Gold Necklace 24k", price: 1200, status: "Active" },
    { id: 2, name: "Diamond Ring", price: 3500, status: "Inactive" },
    { id: 3, name: "Silver Bracelet", price: 150, status: "Active" },
  ];

  return (
    <div className="h-[600px] p-6">
      <DataTable
        title="Recent Inventory"
        columns={columns}
        data={data}
        // Add `pagination={{ page: 1, limit: 10, total: 100 }}` for server-side
      />
    </div>
  );
};

export default Dashboard;
