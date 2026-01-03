import api from "./axiosInstance";

const BASE_URL = "/admin/variants";

const variantService = {
  // GET /api/admin/variants/product/:productId
  getVariantsByProduct: async (productId) => {
    try {
      const response = await api.get(`${BASE_URL}/product/${productId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST /api/admin/variants
  createVariant: async (data) => {
    try {
      const response = await api.post(BASE_URL, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT /api/admin/variants/:id
  updateVariant: async (id, data) => {
    try {
      const response = await api.put(`${BASE_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE /api/admin/variants/:id
  deleteVariant: async (id) => {
    try {
      const response = await api.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default variantService;
