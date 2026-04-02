import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./commissionApi";

// ════════════════════════════════════════════════════════════════════════════
//  ASYNC THUNK-LAR
// ════════════════════════════════════════════════════════════════════════════

// ── SATICI BALANSI ─────────────────────────────────────────────────────────
export const getSellerBalance = createAsyncThunk(
  "commission/getBalance",
  async (sellerId, { rejectWithValue }) => {
    try {
      const { data } = await api.fetchSellerBalance(sellerId);
      return data.balance;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Xəta baş verdi");
    }
  }
);

// ── AYLIK HESABAT ──────────────────────────────────────────────────────────
export const getMonthlyCommission = createAsyncThunk(
  "commission/getMonthly",
  async ({ sellerId, month, year }, { rejectWithValue }) => {
    try {
      const { data } = await api.fetchMonthlyCommission(sellerId, month, year);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Xəta baş verdi");
    }
  }
);

// ── BALANSİ ÇƏK ───────────────────────────────────────────────────────────
export const doWithdrawBalance = createAsyncThunk(
  "commission/withdraw",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.withdrawBalance(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Xəta baş verdi");
    }
  }
);

// ── QEYD: doTransferCommission ÇIXARILDI ──────────────────────────────────
// PashaPay pulu sifariş anında özü bölür (87/10/3).
// Frontend-dən heç bir "köçürmə" əməliyyatı başlatmaq lazım deyil.
// Backend PashaPay webhook-larını alıb Redux store-un bilmədiyi
// şəkildə avtomatik işləyir — satıcı balansı səhifəni yeniləyəndə
// (və ya polling ilə) yenilənmiş halda görünür.


// ════════════════════════════════════════════════════════════════════════════
//  SLICE
// ════════════════════════════════════════════════════════════════════════════
const commissionSlice = createSlice({
  name: "commission",
  initialState: {
    balance:        null,   // { availableBalance, pendingEarning, totalEarned,
                            //   totalWithdrawn, totalOrderAmount }
    monthly:        null,   // { totalOrderAmount, totalSellerEarning,
                            //   settledSellerEarning, pendingSellerEarning, ... }
    withdrawResult: null,
    loading:        false,
    error:          null,
  },
  reducers: {
    clearCommissionState: (state) => {
      state.error          = null;
      state.withdrawResult = null;
    },
  },
  extraReducers: (builder) => {
    const setPending  = (state)         => { state.loading = true;  state.error = null; };
    const setRejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      // ── getSellerBalance ────────────────────────────────────────────
      .addCase(getSellerBalance.pending,   setPending)
      .addCase(getSellerBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload;
      })
      .addCase(getSellerBalance.rejected,  setRejected)

      // ── getMonthlyCommission ────────────────────────────────────────
      .addCase(getMonthlyCommission.pending,   setPending)
      .addCase(getMonthlyCommission.fulfilled, (state, action) => {
        state.loading = false;
        state.monthly = action.payload;
      })
      .addCase(getMonthlyCommission.rejected,  setRejected)

      // ── doWithdrawBalance ───────────────────────────────────────────
      // Uğurlu çəkiş sonra Redux store-dakı balansı dərhal yeniləyirik.
      // API-yə yenidən sorğu göndərmədən UI-ı aktual saxlamaq üçün.
      .addCase(doWithdrawBalance.pending,   setPending)
      .addCase(doWithdrawBalance.fulfilled, (state, action) => {
        state.loading        = false;
        state.withdrawResult = action.payload;

        if (action.payload?.success && state.balance) {
          // Serverden gelen remainingBalance-i götür — daha etibarlı
          state.balance.availableBalance =
            action.payload.remainingBalance ?? state.balance.availableBalance;
          // totalWithdrawn-ı optimistik yenilə
          // (dəqiq dəyər üçün getSellerBalance yenidən çağırıla bilər)
        }
      })
      .addCase(doWithdrawBalance.rejected,  setRejected);
  },
});

export const { clearCommissionState } = commissionSlice.actions;
export default commissionSlice.reducer;