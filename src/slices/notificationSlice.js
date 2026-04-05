// store/slices/notificationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/commerce/mehsullar";
const BASE = `${API_BASE}/notifications`;

const parseJsonSafely = async (response) => {
    const text = await response.text();
    if (!text) return {};

    try {
        return JSON.parse(text);
    } catch {
        return {};
    }
};

// apiFetch — status kodu da qaytarır ki, 401 ayrıca işlənə bilsin
const apiFetch = (url, options = {}) =>
    fetch(url, { credentials: "include", cache: "no-store", ...options }).then(async (r) => {
        const data = await parseJsonSafely(r);
        if (!r.ok) {
            const err = new Error(data.message || "Xəta baş verdi");
            err.status = r.status;
            err.data = data;
            throw err;
        }
        return data;
    });

// ── Thunks ────────────────────────────────────────────────────────
export const fetchNotifications = createAsyncThunk(
    "notifications/fetchAll",
    async ({ page = 1, unreadOnly = false } = {}, { rejectWithValue }) => {
        try { return await apiFetch(`${BASE}?page=${page}&unreadOnly=${unreadOnly}`); }
        catch (e) {
            // 401 — istifadəçi giriş etməyib, xəta göstərmə, sadəcə boş qaytar
            if (e.status === 401) {
                return {
                    notifications: [],
                    unreadCount: 0,
                    total: 0,
                    totalPages: 1,
                    currentPage: 1,
                    unauthorized: true,
                };
            }
            return rejectWithValue(e.message);
        }
    }
);

export const fetchUnreadCount = createAsyncThunk(
    "notifications/fetchUnreadCount",
    async (_, { rejectWithValue }) => {
        try { return await apiFetch(`${BASE}/unread-count`); }
        catch (e) {
            if (e.status === 401) return { unreadCount: 0, unauthorized: true };
            return rejectWithValue(e.message);
        }
    }
);

export const markNotificationRead = createAsyncThunk(
    "notifications/markRead",
    async (id, { rejectWithValue }) => {
        try { return await apiFetch(`${BASE}/${id}/read`, { method: "PUT" }); }
        catch (e) { return rejectWithValue(e.message); }
    }
);

export const markAllNotificationsRead = createAsyncThunk(
    "notifications/markAllRead",
    async (_, { rejectWithValue }) => {
        try { return await apiFetch(`${BASE}/read-all`, { method: "PUT" }); }
        catch (e) { return rejectWithValue(e.message); }
    }
);

export const deleteNotification = createAsyncThunk(
    "notifications/deleteOne",
    async (id, { rejectWithValue }) => {
        try { await apiFetch(`${BASE}/${id}`, { method: "DELETE" }); return id; }
        catch (e) { return rejectWithValue(e.message); }
    }
);

export const deleteAllNotifications = createAsyncThunk(
    "notifications/deleteAll",
    async (_, { rejectWithValue }) => {
        try { return await apiFetch(BASE, { method: "DELETE" }); }
        catch (e) { return rejectWithValue(e.message); }
    }
);

// ── Slice ─────────────────────────────────────────────────────────
const notificationSlice = createSlice({
    name: "notifications",
    initialState: {
        items:       [],
        unreadCount: 0,
        total:       0,
        totalPages:  1,
        currentPage: 1,
        loading:     false,
        error:       null,   // null = xəta yoxdur, string = real server xəta mesajı
    },
    reducers: {
        clearError: (s) => { s.error = null; },
    },
    extraReducers: (builder) => {
        builder
            // fetchNotifications
            .addCase(fetchNotifications.pending,   (s) => { s.loading = true; s.error = null; })
            .addCase(fetchNotifications.fulfilled, (s, { payload: p }) => {
                s.loading     = false;
                s.items       = p.notifications  ?? [];
                s.unreadCount = p.unreadCount    ?? 0;
                s.total       = p.total          ?? 0;
                s.totalPages  = p.totalPages     ?? 1;
                s.currentPage = p.currentPage    ?? 1;
            })
            // rejected — 401-dən FƏRQLI real xəta (şəbəkə, 500 vs.)
            .addCase(fetchNotifications.rejected, (s, { payload }) => {
                s.loading = false;
                s.error   = payload || "Bildirişlər yüklənmədi";
            })

            // fetchUnreadCount
            .addCase(fetchUnreadCount.fulfilled, (s, { payload: p }) => {
                s.unreadCount = p?.unreadCount ?? 0;
            })

            // markNotificationRead
            .addCase(markNotificationRead.fulfilled, (s, { payload: p }) => {
                const n = s.items.find(i => i._id === p.notification._id);
                if (n && !n.isRead) { n.isRead = true; s.unreadCount = Math.max(0, s.unreadCount - 1); }
            })

            // markAllNotificationsRead
            .addCase(markAllNotificationsRead.fulfilled, (s) => {
                s.items.forEach(n => { n.isRead = true; });
                s.unreadCount = 0;
            })

            // deleteNotification
            .addCase(deleteNotification.fulfilled, (s, { payload: id }) => {
                const idx = s.items.findIndex(i => i._id === id);
                if (idx !== -1) {
                    if (!s.items[idx].isRead) s.unreadCount = Math.max(0, s.unreadCount - 1);
                    s.items.splice(idx, 1);
                    s.total = Math.max(0, s.total - 1);
                }
            })

            // deleteAllNotifications
            .addCase(deleteAllNotifications.fulfilled, (s) => {
                s.items = []; s.unreadCount = 0; s.total = 0;
            });
    },
});

export const { clearError } = notificationSlice.actions;
export default notificationSlice.reducer;
