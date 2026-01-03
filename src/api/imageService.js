import api from "./axiosInstance";

const BASE_URL = "/admin/images";

// Helper: Converts JS Object to FormData if a file is present
const preparePayload = (data) => {
  // If data already has a 'file' property (our internal flag from the modal), convert to FormData
  if (data.file instanceof File) {
    const formData = new FormData();
    // Append the file with the key 'image' (expected by your backend multer)
    formData.append("image", data.file);

    // Append all other fields
    Object.keys(data).forEach((key) => {
      if (key !== "file" && data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });
    return formData;
  }
  // Otherwise return JSON
  return data;
};

// Helper to send request with correct Content-Type
const sendRequest = async (method, url, rawData) => {
  const payload = preparePayload(rawData);
  const config =
    payload instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};

  const response = await api[method](url, payload, config);
  return response.data;
};

const imageService = {
  // --- 1. BANNERS ---
  getBanners: async (params) =>
    (await api.get(`${BASE_URL}/banners`, { params })).data,
  createBanner: async (data) =>
    sendRequest("post", `${BASE_URL}/banners`, data),
  updateBanner: async (id, data) =>
    sendRequest("put", `${BASE_URL}/banners/${id}`, data),
  deleteBanner: async (id) =>
    (await api.delete(`${BASE_URL}/banners/${id}`)).data,

  // --- 2. COLLECTIONS ---
  getCollections: async (params) =>
    (await api.get(`${BASE_URL}/collections`, { params })).data,
  createCollection: async (data) =>
    sendRequest("post", `${BASE_URL}/collections`, data),
  updateCollection: async (id, data) =>
    sendRequest("put", `${BASE_URL}/collections/${id}`, data),
  deleteCollection: async (id) =>
    (await api.delete(`${BASE_URL}/collections/${id}`)).data,

  // --- 3. FEATURED ---
  getFeatured: async (params) =>
    (await api.get(`${BASE_URL}/featured`, { params })).data,
  createFeatured: async (data) =>
    sendRequest("post", `${BASE_URL}/featured`, data),
  updateFeatured: async (id, data) =>
    sendRequest("put", `${BASE_URL}/featured/${id}`, data),
  deleteFeatured: async (id) =>
    (await api.delete(`${BASE_URL}/featured/${id}`)).data,

  // --- 4. REVIEWS ---
  getReviews: async (params) =>
    (await api.get(`${BASE_URL}/customer-reviews`, { params })).data,
  createReview: async (data) =>
    sendRequest("post", `${BASE_URL}/customer-reviews`, data),
  updateReview: async (id, data) =>
    sendRequest("put", `${BASE_URL}/customer-reviews/${id}`, data),
  deleteReview: async (id) =>
    (await api.delete(`${BASE_URL}/customer-reviews/${id}`)).data,

  // --- 5. DIAMOND TYPES ---
  getDiamondTypes: async () =>
    (await api.get(`${BASE_URL}/diamond-types`)).data,
  createDiamondType: async (data) =>
    sendRequest("post", `${BASE_URL}/diamond-types`, data),
  updateDiamondType: async (id, data) =>
    sendRequest("put", `${BASE_URL}/diamond-types/${id}`, data),
  deleteDiamondType: async (id) =>
    (await api.delete(`${BASE_URL}/diamond-types/${id}`)).data,

  // --- 6. ENGAGEMENT BANNER ---
  getEngagementBanner: async () =>
    (await api.get(`${BASE_URL}/engagement-ring-banner`)).data,
  createEngagementBanner: async (data) =>
    sendRequest("post", `${BASE_URL}/engagement-ring-banner`, data),
  updateEngagementBanner: async (id, data) =>
    sendRequest("put", `${BASE_URL}/engagement-ring-banner`, data),
  deleteEngagementBanner: async () =>
    (await api.delete(`${BASE_URL}/engagement-ring-banner`)).data,
};

export default imageService;
