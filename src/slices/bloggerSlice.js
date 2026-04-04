import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./bloggerApi";

// ════════════════════════════════════════════════════════════════════════════
//  localStorage köməkçiləri
// ════════════════════════════════════════════════════════════════════════════
const LS_KEY = "bloggerProfile";

function saveProfile(profile) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(profile)); } catch {}
}
function clearProfile() {
  try { localStorage.removeItem(LS_KEY); } catch {}
}
function loadProfile() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

// ════════════════════════════════════════════════════════════════════════════
//  ADMIN — ASYNC THUNK-LAR
// ════════════════════════════════════════════════════════════════════════════

export const getAllBloggers = createAsyncThunk(
  "blogger/getAll",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.fetchAllBloggers(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Xəta baş verdi");
    }
  }
);

export const getBloggersOverview = createAsyncThunk(
  "blogger/getOverview",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.fetchBloggersOverview();
      return data.overview;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Xəta baş verdi");
    }
  }
);

export const getBloggerById = createAsyncThunk(
  "blogger/getById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.fetchBloggerById(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Xəta baş verdi");
    }
  }
);

export const createBlogger = createAsyncThunk(
  "blogger/create",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.createBloggerApi(formData);
      return data.blogger;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Xəta baş verdi");
    }
  }
);

export const updateBlogger = createAsyncThunk(
  "blogger/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.updateBloggerApi(id, formData);
      return data.blogger;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Xəta baş verdi");
    }
  }
);

export const updateCommissionRate = createAsyncThunk(
  "blogger/updateRate",
  async ({ id, rate }, { rejectWithValue }) => {
    try {
      const { data } = await api.updateRateApi(id, rate);
      return data.blogger;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Xəta baş verdi");
    }
  }
);

export const payCommission = createAsyncThunk(
  "blogger/payCommission",
  async ({ id, body }, { rejectWithValue }) => {
    try {
      const { data } = await api.payCommissionApi(id, body);
      return { id, result: data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Xəta baş verdi");
    }
  }
);

export const deleteBlogger = createAsyncThunk(
  "blogger/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteBloggerApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Xəta baş verdi");
    }
  }
);

// ════════════════════════════════════════════════════════════════════════════
//  BLOGER ÖZ HESABI — ASYNC THUNK-LAR
// ════════════════════════════════════════════════════════════════════════════

export const registerBlogger = createAsyncThunk(
  "blogger/register",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.registerBloggerApi(formData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Xəta baş verdi");
    }
  }
);

export const bloggerLogin = createAsyncThunk(
  "blogger/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.bloggerLoginApi(credentials);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Xəta baş verdi");
    }
  }
);

export const bloggerLogout = createAsyncThunk(
  "blogger/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.bloggerLogoutApi();
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Xəta baş verdi");
    }
  }
);

export const getBloggerProfile = createAsyncThunk(
  "blogger/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.fetchBloggerProfile();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Xəta baş verdi");
    }
  }
);

export const getBloggerSales = createAsyncThunk(
  "blogger/getSales",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.fetchBloggerSales(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Xəta baş verdi");
    }
  }
);

// ════════════════════════════════════════════════════════════════════════════
//  SLICE
// ════════════════════════════════════════════════════════════════════════════
const bloggerSlice = createSlice({
  name: "blogger",
  initialState: {
    // Admin tərəfi
    bloggers:       [],
    currentBlogger: null,
    overview:       null,
    // Bloger öz hesabı — localStorage-dan yüklənir
    profile:        loadProfile(),   // { blogger: {...}, stats: {...} } | null
    sales:          null,
    // UI
    loading:        false,
    error:          null,
    actionResult:   null,
  },
  reducers: {
    clearBloggerError:   (state) => { state.error = null; },
    clearActionResult:   (state) => { state.actionResult = null; },
    clearCurrentBlogger: (state) => { state.currentBlogger = null; },
    // Birbaşa profili sil (logout alternativ)
    clearBloggerProfile: (state) => {
      state.profile = null;
      state.sales   = null;
      clearProfile();
    },
  },
  extraReducers: (builder) => {
    const setPending  = (state)         => { state.loading = true;  state.error = null; };
    const setRejected = (state, action) => { state.loading = false; state.error = action.payload; };

    // ── Profili saxla helper ──────────────────────────────────────────
    function setAndPersist(state, payload) {
      state.loading = false;
      state.profile = payload;
      saveProfile(payload);
    }

    builder
      // ── getAllBloggers ──────────────────────────────────────────────
      .addCase(getAllBloggers.pending,   setPending)
      .addCase(getAllBloggers.fulfilled, (state, action) => {
        state.loading  = false;
        state.bloggers = action.payload;
      })
      .addCase(getAllBloggers.rejected,  setRejected)

      // ── getBloggersOverview ─────────────────────────────────────────
      .addCase(getBloggersOverview.pending,   setPending)
      .addCase(getBloggersOverview.fulfilled, (state, action) => {
        state.loading  = false;
        state.overview = action.payload;
      })
      .addCase(getBloggersOverview.rejected,  setRejected)

      // ── getBloggerById ──────────────────────────────────────────────
      .addCase(getBloggerById.pending,   setPending)
      .addCase(getBloggerById.fulfilled, (state, action) => {
        state.loading        = false;
        state.currentBlogger = action.payload;
      })
      .addCase(getBloggerById.rejected,  setRejected)

      // ── createBlogger (admin) ───────────────────────────────────────
      .addCase(createBlogger.pending,   setPending)
      .addCase(createBlogger.fulfilled, (state, action) => {
        state.loading      = false;
        state.actionResult = { type: "created", blogger: action.payload };
        if (state.bloggers?.bloggers) {
          state.bloggers.bloggers.unshift(action.payload);
          state.bloggers.total = (state.bloggers.total || 0) + 1;
        }
      })
      .addCase(createBlogger.rejected,  setRejected)

      // ── updateBlogger ───────────────────────────────────────────────
      .addCase(updateBlogger.pending,   setPending)
      .addCase(updateBlogger.fulfilled, (state, action) => {
        state.loading      = false;
        state.actionResult = { type: "updated" };
        if (state.bloggers?.bloggers) {
          const idx = state.bloggers.bloggers.findIndex(
            (b) => b._id === action.payload._id
          );
          if (idx !== -1) state.bloggers.bloggers[idx] = action.payload;
        }
      })
      .addCase(updateBlogger.rejected,  setRejected)

      // ── updateCommissionRate ────────────────────────────────────────
      .addCase(updateCommissionRate.pending,   setPending)
      .addCase(updateCommissionRate.fulfilled, (state, action) => {
        state.loading      = false;
        state.actionResult = { type: "rateUpdated" };
        if (state.bloggers?.bloggers) {
          const idx = state.bloggers.bloggers.findIndex(
            (b) => b._id === action.payload._id
          );
          if (idx !== -1) state.bloggers.bloggers[idx] = {
            ...state.bloggers.bloggers[idx],
            commissionRate: action.payload.commissionRate,
          };
        }
      })
      .addCase(updateCommissionRate.rejected,  setRejected)

      // ── payCommission ───────────────────────────────────────────────
      .addCase(payCommission.pending,   setPending)
      .addCase(payCommission.fulfilled, (state, action) => {
        state.loading      = false;
        state.actionResult = { type: "paid", result: action.payload.result };
        if (state.bloggers?.bloggers) {
          const idx = state.bloggers.bloggers.findIndex(
            (b) => b._id === action.payload.id
          );
          if (idx !== -1) state.bloggers.bloggers[idx].pendingCommission = 0;
        }
      })
      .addCase(payCommission.rejected,  setRejected)

      // ── deleteBlogger ───────────────────────────────────────────────
      .addCase(deleteBlogger.pending,   setPending)
      .addCase(deleteBlogger.fulfilled, (state, action) => {
        state.loading      = false;
        state.actionResult = { type: "deleted" };
        if (state.bloggers?.bloggers) {
          state.bloggers.bloggers = state.bloggers.bloggers.filter(
            (b) => b._id !== action.payload
          );
          state.bloggers.total = Math.max(0, (state.bloggers.total || 1) - 1);
        }
      })
      .addCase(deleteBlogger.rejected,  setRejected)

      // ── registerBlogger ─────────────────────────────────────────────
      .addCase(registerBlogger.pending,   setPending)
      .addCase(registerBlogger.fulfilled, (state, action) => {
        setAndPersist(state, action.payload);
      })
      .addCase(registerBlogger.rejected,  setRejected)

      // ── bloggerLogin ────────────────────────────────────────────────
      .addCase(bloggerLogin.pending,   setPending)
      .addCase(bloggerLogin.fulfilled, (state, action) => {
        setAndPersist(state, action.payload);
      })
      .addCase(bloggerLogin.rejected,  setRejected)

      // ── bloggerLogout ───────────────────────────────────────────────
      .addCase(bloggerLogout.fulfilled, (state) => {
        state.profile = null;
        state.sales   = null;
        clearProfile();
      })

      // ── getBloggerProfile ───────────────────────────────────────────
      .addCase(getBloggerProfile.pending,   setPending)
      .addCase(getBloggerProfile.fulfilled, (state, action) => {
        setAndPersist(state, action.payload);
      })
      .addCase(getBloggerProfile.rejected,  setRejected)

      // ── getBloggerSales ─────────────────────────────────────────────
      .addCase(getBloggerSales.pending,   setPending)
      .addCase(getBloggerSales.fulfilled, (state, action) => {
        state.loading = false;
        state.sales   = action.payload;
      })
      .addCase(getBloggerSales.rejected,  setRejected);
  },
});

export const {
  clearBloggerError,
  clearActionResult,
  clearCurrentBlogger,
  clearBloggerProfile,
} = bloggerSlice.actions;
export default bloggerSlice.reducer;
