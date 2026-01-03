import api from "./axiosInstance";

const BASE_URL = "/admin/metals";

const metalService = {
  // GET /api/admin/metals
  getAllMetals: async () => {
    try {
      const response = await api.get(BASE_URL);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST /api/admin/metals
  createMetal: async (data) => {
    try {
      const response = await api.post(BASE_URL, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT /api/admin/metals/:metal_type
  updateMetal: async (metalType, data) => {
    try {
      // The API expects /:metal_type in the URL
      const response = await api.put(`${BASE_URL}/${metalType}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE /api/admin/metals/:metal_type
  deleteMetal: async (metalType) => {
    try {
      const response = await api.delete(`${BASE_URL}/${metalType}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default metalService;
