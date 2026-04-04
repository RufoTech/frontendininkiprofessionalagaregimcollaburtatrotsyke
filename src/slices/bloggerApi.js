import axios from "axios";

const BASE = "http://localhost:3010/commerce/mehsullar";

// ─── ADMIN: BLOGER YÖNETIMI ────────────────────────────────────────────────

// GET /superadmin/bloggers?page=1&limit=20&search=...&rate=40&isActive=true
export const fetchAllBloggers = (params = {}) =>
  axios.get(`${BASE}/superadmin/bloggers`, {
    params,
    withCredentials: true,
  });

// GET /superadmin/bloggers/stats/overview
export const fetchBloggersOverview = () =>
  axios.get(`${BASE}/superadmin/bloggers/stats/overview`, {
    withCredentials: true,
  });

// GET /superadmin/bloggers/:id
export const fetchBloggerById = (id) =>
  axios.get(`${BASE}/superadmin/bloggers/${id}`, {
    withCredentials: true,
  });

// POST /superadmin/bloggers/create
// Body: { firstName, lastName, fatherName, email, phone, password, commissionRate }
export const createBloggerApi = (data) =>
  axios.post(`${BASE}/superadmin/bloggers/create`, data, {
    withCredentials: true,
  });

// PUT /superadmin/bloggers/:id
// Body: { firstName, lastName, fatherName, email, phone, isActive }
export const updateBloggerApi = (id, data) =>
  axios.put(`${BASE}/superadmin/bloggers/${id}`, data, {
    withCredentials: true,
  });

// PUT /superadmin/bloggers/:id/commission
// Body: { commissionRate: 20|30|40|41 }
export const updateRateApi = (id, rate) =>
  axios.put(
    `${BASE}/superadmin/bloggers/${id}/commission`,
    { commissionRate: rate },
    { withCredentials: true }
  );

// POST /superadmin/bloggers/:id/pay-commission
// Body (optional): { saleIds: ["id1","id2"] }
export const payCommissionApi = (id, body = {}) =>
  axios.post(`${BASE}/superadmin/bloggers/${id}/pay-commission`, body, {
    withCredentials: true,
  });

// DELETE /superadmin/bloggers/:id
export const deleteBloggerApi = (id) =>
  axios.delete(`${BASE}/superadmin/bloggers/${id}`, {
    withCredentials: true,
  });

// ─── BLOGER: ÖZ HESABI ────────────────────────────────────────────────────

// POST /blogger/register
// Body: { firstName, lastName, fatherName, email, phone, password }
export const registerBloggerApi = (data) =>
  axios.post(`${BASE}/blogger/register`, data, {
    withCredentials: true,
  });

// POST /blogger/login
// Body: { email, password }
export const bloggerLoginApi = (data) =>
  axios.post(`${BASE}/blogger/login`, data, {
    withCredentials: true,
  });

// GET /blogger/logout
export const bloggerLogoutApi = () =>
  axios.get(`${BASE}/blogger/logout`, {
    withCredentials: true,
  });

// GET /blogger/profile
export const fetchBloggerProfile = () =>
  axios.get(`${BASE}/blogger/profile`, {
    withCredentials: true,
  });

// GET /blogger/sales?page=1&limit=20&status=pending&startDate=...&endDate=...
export const fetchBloggerSales = (params = {}) =>
  axios.get(`${BASE}/blogger/sales`, {
    params,
    withCredentials: true,
  });
