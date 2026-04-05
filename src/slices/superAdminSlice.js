import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE = "/commerce/mehsullar/superadmin";
const cfg  = { withCredentials: true };

// ── AUTH ──────────────────────────────────────────────────────────────
export const superAdminLogin = createAsyncThunk("superAdmin/login", async (creds, { rejectWithValue }) => {
    try { const { data } = await axios.post(`${BASE}/login`, creds, cfg); return data; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Giriş xətası"); }
});

export const superAdminRegister = createAsyncThunk("superAdmin/register", async ({ name, email, password }, { rejectWithValue }) => {
    try { const { data } = await axios.post(`${BASE}/register`, { name, email, password }, cfg); return data; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Qeydiyyat xətası"); }
});

export const superAdminLogout = createAsyncThunk("superAdmin/logout", async (_, { rejectWithValue }) => {
    try { await axios.get(`${BASE}/logout`, cfg); return true; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

// ── USERS ─────────────────────────────────────────────────────────────
export const fetchAllUsers = createAsyncThunk("superAdmin/fetchUsers", async (params = {}, { rejectWithValue }) => {
    try {
        const q = new URLSearchParams(params).toString();
        const { data } = await axios.get(`${BASE}/users?${q}`, cfg);
        return data;
    } catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

export const fetchUserById = createAsyncThunk("superAdmin/fetchUserById", async (id, { rejectWithValue }) => {
    try { const { data } = await axios.get(`${BASE}/users/${id}`, cfg); return data.user; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

// ── ADMINS/SELLERS ────────────────────────────────────────────────────
export const fetchAllAdmins = createAsyncThunk("superAdmin/fetchAdmins", async (_, { rejectWithValue }) => {
    try { const { data } = await axios.get(`${BASE}/admins`, cfg); return data; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

export const fetchAdminById = createAsyncThunk("superAdmin/fetchAdminById", async (id, { rejectWithValue }) => {
    try { const { data } = await axios.get(`${BASE}/admins/${id}`, cfg); return data.admin; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

export const createAdminBySA = createAsyncThunk("superAdmin/createAdmin", async (payload, { rejectWithValue }) => {
    try { const { data } = await axios.post(`${BASE}/admins`, payload, cfg); return data; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

export const updateAdminBySA = createAsyncThunk("superAdmin/updateAdmin", async ({ id, payload }, { rejectWithValue }) => {
    try { const { data } = await axios.put(`${BASE}/admins/${id}`, payload, cfg); return data; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

export const deleteAdminBySA = createAsyncThunk("superAdmin/deleteAdmin", async (id, { rejectWithValue }) => {
    try { await axios.delete(`${BASE}/admins/${id}`, cfg); return id; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

export const updateAdminStatus = createAsyncThunk("superAdmin/updateAdminStatus", async ({ id, status, reason }, { rejectWithValue }) => {
    try { const { data } = await axios.patch(`${BASE}/admins/${id}/status`, { status, reason }, cfg); return { id, ...data }; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

export const blockAdminBySA = createAsyncThunk("superAdmin/blockAdmin", async ({ id, reason }, { rejectWithValue }) => {
    try { const { data } = await axios.patch(`${BASE}/admins/${id}/block`, { reason }, cfg); return { id, ...data }; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

export const unblockAdminBySA = createAsyncThunk("superAdmin/unblockAdmin", async (id, { rejectWithValue }) => {
    try { const { data } = await axios.patch(`${BASE}/admins/${id}/unblock`, {}, cfg); return { id, ...data }; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

export const setAdminLimitBySA = createAsyncThunk("superAdmin/setAdminLimit", async ({ id, limit }, { rejectWithValue }) => {
    try { const { data } = await axios.patch(`${BASE}/admins/${id}/product-limit`, { limit }, cfg); return { id, limit, ...data }; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

// ── BLOGGERS ──────────────────────────────────────────────────────────
export const fetchAllBloggers = createAsyncThunk("superAdmin/fetchBloggers", async (params = {}, { rejectWithValue }) => {
    try {
        const q = new URLSearchParams(params).toString();
        const { data } = await axios.get(`${BASE}/bloggers?${q}`, cfg);
        return data;
    } catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

export const fetchBloggerById = createAsyncThunk("superAdmin/fetchBloggerById", async (id, { rejectWithValue }) => {
    try { const { data } = await axios.get(`${BASE}/bloggers/${id}`, cfg); return data.blogger; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

export const createBloggerBySA = createAsyncThunk("superAdmin/createBlogger", async (payload, { rejectWithValue }) => {
    try { const { data } = await axios.post(`${BASE}/bloggers/create`, payload, cfg); return data; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

export const updateBloggerBySA = createAsyncThunk("superAdmin/updateBlogger", async ({ id, payload }, { rejectWithValue }) => {
    try { const { data } = await axios.put(`${BASE}/bloggers/${id}`, payload, cfg); return data; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

export const deleteBloggerBySA = createAsyncThunk("superAdmin/deleteBlogger", async (id, { rejectWithValue }) => {
    try { await axios.delete(`${BASE}/bloggers/${id}`, cfg); return id; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

export const updateBloggerCommission = createAsyncThunk("superAdmin/updateBloggerCommission", async ({ id, commissionRate }, { rejectWithValue }) => {
    try { const { data } = await axios.put(`${BASE}/bloggers/${id}/commission`, { commissionRate }, cfg); return { id, commissionRate, ...data }; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

export const payBloggerCommission = createAsyncThunk("superAdmin/payBloggerCommission", async ({ id, amount }, { rejectWithValue }) => {
    try { const { data } = await axios.post(`${BASE}/bloggers/${id}/pay-commission`, { amount }, cfg); return data; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

// ── USER BLOCK / UNBLOCK / DELETE ────────────────────────────────────
export const blockUserBySA = createAsyncThunk("superAdmin/blockUser", async ({ id, reason }, { rejectWithValue }) => {
    try { const { data } = await axios.patch(`${BASE}/users/${id}/block`, { reason }, cfg); return { id, ...data }; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

export const unblockUserBySA = createAsyncThunk("superAdmin/unblockUser", async (id, { rejectWithValue }) => {
    try { const { data } = await axios.patch(`${BASE}/users/${id}/unblock`, {}, cfg); return { id, ...data }; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

export const deleteUserBySA = createAsyncThunk("superAdmin/deleteUser", async (id, { rejectWithValue }) => {
    try { await axios.delete(`${BASE}/users/${id}`, cfg); return id; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

// ── BLOGGER STATUS TOGGLE ─────────────────────────────────────────────
export const toggleBloggerStatusBySA = createAsyncThunk("superAdmin/toggleBloggerStatus", async (id, { rejectWithValue }) => {
    try { const { data } = await axios.patch(`${BASE}/bloggers/${id}/toggle-status`, {}, cfg); return { id, isActive: data.isActive }; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

// ── SUPERADMINS ───────────────────────────────────────────────────────
export const fetchAllSuperAdmins = createAsyncThunk("superAdmin/fetchSuperAdmins", async (_, { rejectWithValue }) => {
    try { const { data } = await axios.get(`${BASE}/superadmins`, cfg); return data; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

// ── localStorage persistence ──────────────────────────────────────────
const savedAdmin = (() => {
    try { return JSON.parse(localStorage.getItem("superAdminInfo") || "null"); } catch { return null; }
})();

const superAdminSlice = createSlice({
    name: "superAdmin",
    initialState: {
        adminInfo:      savedAdmin,
        isLoggedIn:     !!savedAdmin,
        users:          [],  totalUsers: 0,
        admins:         [],  totalAdmins: 0,
        bloggers:       [],  totalBloggers: 0,
        superAdmins:    [],
        selectedUser:   null,
        selectedAdmin:  null,
        selectedBlogger: null,
        loading:        false,
        error:          null,
        actionResult:   null,
    },
    reducers: {
        clearSAError:  (s) => { s.error = null; },
        clearSAResult: (s) => { s.actionResult = null; },
        clearSelected: (s) => { s.selectedUser = null; s.selectedAdmin = null; s.selectedBlogger = null; },
    },
    extraReducers: (b) => {
        const p = (s) => { s.loading = true; s.error = null; };
        const r = (s, a) => { s.loading = false; s.error = a.payload; };

        // Auth
        b.addCase(superAdminLogin.pending, p)
         .addCase(superAdminLogin.fulfilled, (s, a) => {
             s.loading = false;
             s.isLoggedIn = true;
             s.adminInfo  = a.payload.superAdmin || a.payload.user || a.payload;
             localStorage.setItem("superAdminInfo", JSON.stringify(s.adminInfo));
         })
         .addCase(superAdminLogin.rejected, r)

         .addCase(superAdminRegister.pending, p)
         .addCase(superAdminRegister.fulfilled, (s, a) => {
             s.loading = false;
             s.isLoggedIn = true;
             s.adminInfo  = a.payload.superAdmin || a.payload.user || a.payload;
             localStorage.setItem("superAdminInfo", JSON.stringify(s.adminInfo));
         })
         .addCase(superAdminRegister.rejected, r)

         .addCase(superAdminLogout.fulfilled, (s) => {
             s.isLoggedIn = false; s.adminInfo = null;
             localStorage.removeItem("superAdminInfo");
         })

        // Users
         .addCase(fetchAllUsers.pending, p)
         .addCase(fetchAllUsers.fulfilled, (s, a) => { s.loading = false; s.users = a.payload.users; s.totalUsers = a.payload.total; })
         .addCase(fetchAllUsers.rejected, r)

         .addCase(fetchUserById.fulfilled, (s, a) => { s.selectedUser = a.payload; })

        // Admins
         .addCase(fetchAllAdmins.pending, p)
         .addCase(fetchAllAdmins.fulfilled, (s, a) => { s.loading = false; s.admins = a.payload.admins || a.payload; s.totalAdmins = a.payload.total || a.payload.length; })
         .addCase(fetchAllAdmins.rejected, r)

         .addCase(fetchAdminById.fulfilled, (s, a) => { s.selectedAdmin = a.payload; })

         .addCase(createAdminBySA.pending, p)
         .addCase(createAdminBySA.fulfilled, (s) => { s.loading = false; s.actionResult = { type: "adminCreated", message: "Admin yaradıldı" }; })
         .addCase(createAdminBySA.rejected, r)

         .addCase(updateAdminBySA.pending, p)
         .addCase(updateAdminBySA.fulfilled, (s) => { s.loading = false; s.actionResult = { type: "adminUpdated", message: "Admin yeniləndi" }; })
         .addCase(updateAdminBySA.rejected, r)

         .addCase(deleteAdminBySA.pending, p)
         .addCase(deleteAdminBySA.fulfilled, (s, a) => { s.loading = false; s.admins = s.admins.filter(ad => ad._id !== a.payload); s.actionResult = { type: "adminDeleted" }; })
         .addCase(deleteAdminBySA.rejected, r)

         .addCase(updateAdminStatus.pending, p)
         .addCase(updateAdminStatus.fulfilled, (s, a) => {
             s.loading = false;
             const idx = s.admins.findIndex(ad => ad._id === a.payload.id);
             if (idx !== -1) s.admins[idx] = { ...s.admins[idx], sellerStatus: a.payload.status };
             s.actionResult = { type: "statusUpdated", message: "Status yeniləndi" };
         })
         .addCase(updateAdminStatus.rejected, r)

         .addCase(blockAdminBySA.pending, p)
         .addCase(blockAdminBySA.fulfilled, (s, a) => {
             s.loading = false;
             const idx = s.admins.findIndex(ad => ad._id === a.payload.id);
             if (idx !== -1) s.admins[idx] = { ...s.admins[idx], isBlocked: true, blockReason: a.payload.admin?.blockReason || "" };
             s.actionResult = { type: "adminBlocked", message: "Admin bloklandı" };
         })
         .addCase(blockAdminBySA.rejected, r)

         .addCase(unblockAdminBySA.pending, p)
         .addCase(unblockAdminBySA.fulfilled, (s, a) => {
             s.loading = false;
             const idx = s.admins.findIndex(ad => ad._id === a.payload.id);
             if (idx !== -1) s.admins[idx] = { ...s.admins[idx], isBlocked: false, blockReason: "" };
             s.actionResult = { type: "adminUnblocked", message: "Admin blokdan çıxarıldı" };
         })
         .addCase(unblockAdminBySA.rejected, r)

         .addCase(setAdminLimitBySA.pending, p)
         .addCase(setAdminLimitBySA.fulfilled, (s, a) => {
             s.loading = false;
             const idx = s.admins.findIndex(ad => ad._id === a.payload.id);
             if (idx !== -1) s.admins[idx] = { ...s.admins[idx], productLimit: a.payload.limit };
             s.actionResult = { type: "limitUpdated", message: "Məhsul limiti güncəlləndi" };
         })
         .addCase(setAdminLimitBySA.rejected, r)

        // Bloggers
         .addCase(fetchAllBloggers.pending, p)
         .addCase(fetchAllBloggers.fulfilled, (s, a) => { s.loading = false; s.bloggers = a.payload.bloggers; s.totalBloggers = a.payload.total; })
         .addCase(fetchAllBloggers.rejected, r)

         .addCase(fetchBloggerById.fulfilled, (s, a) => { s.selectedBlogger = a.payload; })

         .addCase(createBloggerBySA.pending, p)
         .addCase(createBloggerBySA.fulfilled, (s) => { s.loading = false; s.actionResult = { type: "bloggerCreated", message: "Blogger yaradıldı" }; })
         .addCase(createBloggerBySA.rejected, r)

         .addCase(updateBloggerBySA.pending, p)
         .addCase(updateBloggerBySA.fulfilled, (s) => { s.loading = false; s.actionResult = { type: "bloggerUpdated", message: "Blogger yeniləndi" }; })
         .addCase(updateBloggerBySA.rejected, r)

         .addCase(deleteBloggerBySA.pending, p)
         .addCase(deleteBloggerBySA.fulfilled, (s, a) => { s.loading = false; s.bloggers = s.bloggers.filter(b => b._id !== a.payload); s.actionResult = { type: "bloggerDeleted" }; })
         .addCase(deleteBloggerBySA.rejected, r)

         .addCase(updateBloggerCommission.pending, p)
         .addCase(updateBloggerCommission.fulfilled, (s, a) => {
             s.loading = false;
             const idx = s.bloggers.findIndex(b => b._id === a.payload.id);
             if (idx !== -1) s.bloggers[idx] = { ...s.bloggers[idx], commissionRate: a.payload.commissionRate };
             s.actionResult = { type: "commissionUpdated", message: "Komissiya yeniləndi" };
         })
         .addCase(updateBloggerCommission.rejected, r)

         .addCase(payBloggerCommission.pending, p)
         .addCase(payBloggerCommission.fulfilled, (s) => { s.loading = false; s.actionResult = { type: "commissionPaid", message: "Komissiya ödənildi" }; })
         .addCase(payBloggerCommission.rejected, r)

        // User block/unblock/delete
         .addCase(blockUserBySA.pending, p)
         .addCase(blockUserBySA.fulfilled, (s, a) => {
             s.loading = false;
             const idx = s.users.findIndex(u => u._id === a.payload.id);
             if (idx !== -1) s.users[idx] = { ...s.users[idx], isBlocked: true, blockReason: a.payload.user?.blockReason || "" };
             s.actionResult = { type: "userBlocked", message: "İstifadəçi bloklandı" };
         })
         .addCase(blockUserBySA.rejected, r)

         .addCase(unblockUserBySA.pending, p)
         .addCase(unblockUserBySA.fulfilled, (s, a) => {
             s.loading = false;
             const idx = s.users.findIndex(u => u._id === a.payload.id);
             if (idx !== -1) s.users[idx] = { ...s.users[idx], isBlocked: false, blockReason: "" };
             s.actionResult = { type: "userUnblocked", message: "İstifadəçi blokdan çıxarıldı" };
         })
         .addCase(unblockUserBySA.rejected, r)

         .addCase(deleteUserBySA.pending, p)
         .addCase(deleteUserBySA.fulfilled, (s, a) => {
             s.loading = false;
             s.users = s.users.filter(u => u._id !== a.payload);
             s.totalUsers = Math.max(0, s.totalUsers - 1);
             s.actionResult = { type: "userDeleted", message: "İstifadəçi silindi" };
         })
         .addCase(deleteUserBySA.rejected, r)

        // Blogger toggle
         .addCase(toggleBloggerStatusBySA.pending, p)
         .addCase(toggleBloggerStatusBySA.fulfilled, (s, a) => {
             s.loading = false;
             const idx = s.bloggers.findIndex(b => b._id === a.payload.id);
             if (idx !== -1) s.bloggers[idx] = { ...s.bloggers[idx], isActive: a.payload.isActive };
             s.actionResult = { type: "bloggerToggled", message: `Blogger ${a.payload.isActive ? "aktivləşdirildi" : "deaktiv edildi"}` };
         })
         .addCase(toggleBloggerStatusBySA.rejected, r)

        // SuperAdmins
         .addCase(fetchAllSuperAdmins.pending, p)
         .addCase(fetchAllSuperAdmins.fulfilled, (s, a) => { s.loading = false; s.superAdmins = a.payload.superAdmins || []; })
         .addCase(fetchAllSuperAdmins.rejected, r);
    },
});

export const { clearSAError, clearSAResult, clearSelected } = superAdminSlice.actions;
export default superAdminSlice.reducer;
