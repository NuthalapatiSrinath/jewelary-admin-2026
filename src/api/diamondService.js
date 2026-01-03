import api from "./axiosInstance";

const BASE_URL = "/admin/diamonds";

const diamondService = {
  // GET /api/admin/diamonds
  getAllDiamonds: async (params) => {
    console.log("💎 [API REQUEST] Fetching all diamonds:", params);
    try {
      const response = await api.get(BASE_URL, { params });
      console.log(
        "✅ [API SUCCESS] Diamonds fetched:",
        response.data?.diamonds?.length
      );
      return response.data;
    } catch (error) {
      console.error("❌ [API ERROR] Fetching diamonds failed:", error);
      throw error;
    }
  },

  // GET /api/admin/diamonds/filters
  getFilters: async () => {
    console.log("💎 [API REQUEST] Fetching diamond filters");
    try {
      const response = await api.get(`${BASE_URL}/filters`);
      console.log(
        "✅ [API SUCCESS] Filters received:",
        Object.keys(response.data)
      );
      return response.data;
    } catch (error) {
      console.error("❌ [API ERROR] Fetching filters failed:", error);
      throw error;
    }
  },

  // GET /api/admin/diamonds/:id
  getDiamondById: async (id) => {
    console.log(`💎 [API REQUEST] Fetching diamond details for ID: ${id}`);
    try {
      const response = await api.get(`${BASE_URL}/${id}`);
      console.log(
        "✅ [API SUCCESS] Diamond details received:",
        response.data.sku
      );
      return response.data;
    } catch (error) {
      console.error(`❌ [API ERROR] Fetching diamond ${id} failed:`, error);
      throw error;
    }
  },

  // POST /api/admin/diamonds
  createDiamond: async (data) => {
    console.log("💎 [API REQUEST] Creating new diamond:", data);
    try {
      const response = await api.post(BASE_URL, data);
      console.log("✅ [API SUCCESS] Diamond created:", response.data._id);
      return response.data;
    } catch (error) {
      console.error("❌ [API ERROR] Creation failed:", error);
      throw error;
    }
  },

  // PUT /api/admin/diamonds/:id
  updateDiamond: async (id, data) => {
    console.log(`💎 [API REQUEST] Updating diamond ${id}:`, data);
    try {
      const response = await api.put(`${BASE_URL}/${id}`, data);
      console.log("✅ [API SUCCESS] Diamond updated:", response.data._id);
      return response.data;
    } catch (error) {
      console.error(`❌ [API ERROR] Update failed for ${id}:`, error);
      throw error;
    }
  },

  // DELETE /api/admin/diamonds/:id
  deleteDiamond: async (id) => {
    console.log(`💎 [API REQUEST] Deleting diamond ${id}`);
    try {
      const response = await api.delete(`${BASE_URL}/${id}`);
      console.log("✅ [API SUCCESS] Diamond deleted");
      return response.data;
    } catch (error) {
      console.error(`❌ [API ERROR] Delete failed for ${id}:`, error);
      throw error;
    }
  },

  // PATCH /api/admin/diamonds/:id/activate (or deactivate)
  toggleActivation: async (id, isActive) => {
    const action = isActive ? "activate" : "deactivate";
    console.log(`💎 [API REQUEST] Setting diamond ${id} status to: ${action}`);
    try {
      const response = await api.patch(`${BASE_URL}/${id}/${action}`);
      console.log(`✅ [API SUCCESS] Status changed to ${action}`);
      return response.data;
    } catch (error) {
      console.error(`❌ [API ERROR] Status toggle failed for ${id}:`, error);
      throw error;
    }
  },

  // POST /api/admin/diamonds/bulk
  bulkUpload: async (file) => {
    console.log("💎 [API REQUEST] Uploading bulk Excel file:", file.name);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post(`${BASE_URL}/bulk`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("✅ [API SUCCESS] Bulk upload processed:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [API ERROR] Bulk upload failed:", error);
      throw error;
    }
  },
};

export default diamondService;
