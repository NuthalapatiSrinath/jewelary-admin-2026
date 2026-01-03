import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts } from "../../store/slices/contactSlice";

import DataTable from "../../components/common/DataTable";
import ContactDetailsModal from "../../components/modals/contacts/ContactDetailsModal";
import { Eye, Mail, Phone, User, Calendar } from "lucide-react";

const Contacts = () => {
  const dispatch = useDispatch();
  const { items, pagination, loading } = useSelector((state) => state.contacts);

  const [queryParams, setQueryParams] = useState({ page: 1, limit: 20 });
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchContacts(queryParams));
  }, [dispatch, queryParams]);

  const handlePageChange = (p) =>
    setQueryParams((prev) => ({ ...prev, page: p }));
  const handleLimitChange = (l) =>
    setQueryParams((prev) => ({ ...prev, limit: l, page: 1 }));

  const handleView = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const columns = [
    {
      header: "Name",
      accessor: "name",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <User size={14} />
          </div>
          <span className="font-medium text-slate-900">{row.name}</span>
        </div>
      ),
    },
    {
      header: "Contact Info",
      accessor: "email",
      render: (row) => (
        <div className="flex flex-col text-sm">
          <div className="flex items-center gap-1.5 text-slate-700">
            <Mail size={12} className="text-slate-400" /> {row.email}
          </div>
          {row.phone && (
            <div className="flex items-center gap-1.5 text-slate-500 mt-0.5">
              <Phone size={12} className="text-slate-400" /> {row.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Date",
      accessor: "createdAt",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <Calendar size={14} className="text-slate-400" />
          {new Date(row.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      header: "Message Preview",
      accessor: "message",
      render: (row) => (
        <span className="text-sm text-slate-500 line-clamp-1 max-w-xs italic">
          "{row.message}"
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      render: (row) => (
        <button
          onClick={() => handleView(row)}
          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          title="View Details"
        >
          <Eye size={18} />
        </button>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 w-full max-w-7xl mx-auto">
      <DataTable
        title="Support Messages"
        columns={columns}
        data={items}
        loading={loading}
        pagination={{
          page: pagination.page || 1,
          limit: 20,
          total: pagination.total || 0,
        }}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        // Search is not supported by backend controller currently, so we omit onSearch
      />

      <ContactDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contact={selectedContact}
      />
    </div>
  );
};

export default Contacts;
