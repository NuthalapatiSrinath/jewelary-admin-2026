import api from "./axiosInstance";

const BASE_URL = "/contacts"; // Note: Ensure this matches your backend route prefix

const contactService = {
  // GET /api/contacts/admin
  getAllContacts: async (params) => {
    try {
      const response = await api.get(`${BASE_URL}/admin`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ✅ CRITICAL: This line is required for the import to work
export default contactService;
