import React from "react";
import Modal from "../../common/Modal";
import { User, Mail, Phone, Calendar, MessageSquare } from "lucide-react";

const ContactDetailsModal = ({ isOpen, onClose, contact }) => {
  if (!contact) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Message Details">
      <div className="space-y-6">
        {/* Header Info */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <User size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold">Name</p>
              <p className="text-sm font-medium text-slate-900">
                {contact.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold">
                Date Received
              </p>
              <p className="text-sm font-medium text-slate-900">
                {new Date(contact.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <Mail size={16} className="text-slate-400" />
            <a
              href={`mailto:${contact.email}`}
              className="text-sm text-blue-600 hover:underline"
            >
              {contact.email}
            </a>
          </div>
          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <Phone size={16} className="text-slate-400" />
            <a
              href={`tel:${contact.phone}`}
              className="text-sm text-slate-700 hover:text-slate-900"
            >
              {contact.phone || "N/A"}
            </a>
          </div>
        </div>

        {/* Message Body */}
        <div>
          <div className="flex items-center gap-2 mb-2 text-slate-800 font-bold text-sm">
            <MessageSquare size={16} className="text-amber-500" /> Message
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {contact.message}
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ContactDetailsModal;
