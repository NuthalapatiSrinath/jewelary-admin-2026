import api from "./axiosInstance";

const BASE_URL = "/admin/coupons";

const couponService = {
  // GET /api/admin/coupons
  getAllCoupons: async (params) => {
    try {
      const response = await api.get(BASE_URL, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST /api/admin/coupons
  createCoupon: async (data) => {
    try {
      const response = await api.post(BASE_URL, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT /api/admin/coupons/:id
  updateCoupon: async (id, data) => {
    try {
      const response = await api.put(`${BASE_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PATCH /api/admin/coupons/:id/status
  toggleStatus: async (id, currentStatus) => {
    // Current 'active' -> New 'inactive'
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const response = await api.patch(`${BASE_URL}/${id}/status`, {
        status: newStatus,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE /api/admin/coupons/:id
  deleteCoupon: async (id) => {
    try {
      const response = await api.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default couponService;
