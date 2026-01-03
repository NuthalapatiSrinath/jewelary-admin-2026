import api from "./axiosInstance";

const BASE_URL = "/admin/orders";

const orderService = {
  // GET /api/admin/orders
  getAllOrders: async (params) => {
    try {
      const response = await api.get(BASE_URL, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /api/admin/orders/:id
  getOrderById: async (id) => {
    try {
      const response = await api.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT /api/admin/orders/:id
  updateOrderStatus: async (id, data) => {
    try {
      const response = await api.put(`${BASE_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /api/admin/orders/stats
  getOrderStats: async () => {
    try {
      const response = await api.get(`${BASE_URL}/stats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default orderService;
