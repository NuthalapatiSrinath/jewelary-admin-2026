import api from "./axiosInstance";

const BASE_URL = "/admin/products";

const productService = {
  getAllProducts: async (params) => {
    const response = await api.get(BASE_URL, { params });
    return response.data;
  },

  createProduct: async (data) => {
    const response = await api.post(BASE_URL, data);
    return response.data;
  },

  updateProduct: async (id, data) => {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  },

  toggleStatus: async (id, currentStatus) => {
    // Controller has specific endpoints for activate/deactivate
    const action = currentStatus ? "deactivate" : "activate";
    const response = await api.patch(`${BASE_URL}/${id}/${action}`);
    return response.data;
  },

  bulkUpload: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`${BASE_URL}/bulk-upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};

export default productService;
