import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE = "/commerce/mehsullar/bonus";
const cfg  = { withCredentials: true };

// ── Ümumi konfiqurasiya (public) ─────────────────────────────────────
export const fetchBonusConfig = createAsyncThunk("bonus/fetchConfig", async (_, { rejectWithValue }) => {
    try { const { data } = await axios.get(`${BASE}/config`, cfg); return data; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

// ── Mənim bonuslarım ─────────────────────────────────────────────────
export const fetchMyBonus = createAsyncThunk("bonus/fetchMy", async (_, { rejectWithValue }) => {
    try { const { data } = await axios.get(`${BASE}/my`, cfg); return data; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

// ── Referral məlumatı ────────────────────────────────────────────────
export const fetchReferral = createAsyncThunk("bonus/fetchReferral", async (_, { rejectWithValue }) => {
    try { const { data } = await axios.get(`${BASE}/referral`, cfg); return data; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

// ── Bonus istifadə et ────────────────────────────────────────────────
export const redeemBonus = createAsyncThunk("bonus/redeem", async (amount, { rejectWithValue }) => {
    try { const { data } = await axios.post(`${BASE}/redeem`, { amount }, cfg); return data; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

// ── Bonus istifadəsini ləğv et ───────────────────────────────────────
export const cancelRedeem = createAsyncThunk("bonus/cancelRedeem", async (_, { rejectWithValue }) => {
    try { const { data } = await axios.post(`${BASE}/cancel-redeem`, {}, cfg); return data; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

// ── Admin: konfiq yenilə ─────────────────────────────────────────────
export const updateBonusConfig = createAsyncThunk("bonus/updateConfig", async (payload, { rejectWithValue }) => {
    try { const { data } = await axios.put(`${BASE}/admin/config`, payload, cfg); return data; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

// ── Admin: kampaniya başlat ──────────────────────────────────────────
export const startCampaign = createAsyncThunk("bonus/startCampaign", async (payload, { rejectWithValue }) => {
    try { const { data } = await axios.post(`${BASE}/admin/campaign`, payload, cfg); return data; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

// ── Admin: kampaniya bitir ───────────────────────────────────────────
export const endCampaign = createAsyncThunk("bonus/endCampaign", async (_, { rejectWithValue }) => {
    try { const { data } = await axios.delete(`${BASE}/admin/campaign`, cfg); return data; }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

// ── Admin: əməliyyat siyahısı ────────────────────────────────────────
export const fetchAdminTransactions = createAsyncThunk("bonus/adminTx", async (params = {}, { rejectWithValue }) => {
    try {
        const q = new URLSearchParams(params).toString();
        const { data } = await axios.get(`${BASE}/admin/transactions?${q}`, cfg);
        return data;
    } catch (e) { return rejectWithValue(e.response?.data?.message || "Xəta"); }
});

const bonusSlice = createSlice({
    name: "bonus",
    initialState: {
        config:       null,
        myBonus:      null,   // { balance, transactions, pendingRedemption }
        referral:     null,   // { referralCode, referralLink, totalReferrals, totalBonus }
        adminTx:      null,   // { transactions, total, pages }
        loading:      false,
        error:        null,
        actionResult: null,
    },
    reducers: {
        clearBonusError:  (s) => { s.error = null; },
        clearBonusResult: (s) => { s.actionResult = null; },
    },
    extraReducers: (b) => {
        const pending  = (s) => { s.loading = true;  s.error = null; };
        const rejected = (s, a) => { s.loading = false; s.error = a.payload; };

        b.addCase(fetchBonusConfig.pending, pending)
         .addCase(fetchBonusConfig.fulfilled, (s, a) => { s.loading = false; s.config = a.payload; })
         .addCase(fetchBonusConfig.rejected, rejected)

         .addCase(fetchMyBonus.pending, pending)
         .addCase(fetchMyBonus.fulfilled, (s, a) => { s.loading = false; s.myBonus = a.payload; })
         .addCase(fetchMyBonus.rejected, rejected)

         .addCase(fetchReferral.pending, pending)
         .addCase(fetchReferral.fulfilled, (s, a) => { s.loading = false; s.referral = a.payload; })
         .addCase(fetchReferral.rejected, rejected)

         .addCase(redeemBonus.pending, pending)
         .addCase(redeemBonus.fulfilled, (s, a) => {
             s.loading = false;
             s.actionResult = { type: "redeem", message: a.payload.message };
             if (s.myBonus) s.myBonus.balance = a.payload.remainingBalance ?? s.myBonus.balance;
         })
         .addCase(redeemBonus.rejected, rejected)

         .addCase(cancelRedeem.pending, pending)
         .addCase(cancelRedeem.fulfilled, (s, a) => {
             s.loading = false;
             s.actionResult = { type: "cancelRedeem", message: a.payload.message };
         })
         .addCase(cancelRedeem.rejected, rejected)

         .addCase(updateBonusConfig.pending, pending)
         .addCase(updateBonusConfig.fulfilled, (s, a) => {
             s.loading = false;
             s.actionResult = { type: "configUpdated", message: "Konfiqurasiya yeniləndi" };
             s.config = { ...s.config, ...a.payload.config };
         })
         .addCase(updateBonusConfig.rejected, rejected)

         .addCase(startCampaign.pending, pending)
         .addCase(startCampaign.fulfilled, (s) => {
             s.loading = false;
             s.actionResult = { type: "campaignStarted", message: "Kampaniya başladı" };
         })
         .addCase(startCampaign.rejected, rejected)

         .addCase(endCampaign.pending, pending)
         .addCase(endCampaign.fulfilled, (s) => {
             s.loading = false;
             s.actionResult = { type: "campaignEnded", message: "Kampaniya bitdi" };
         })
         .addCase(endCampaign.rejected, rejected)

         .addCase(fetchAdminTransactions.pending, pending)
         .addCase(fetchAdminTransactions.fulfilled, (s, a) => { s.loading = false; s.adminTx = a.payload; })
         .addCase(fetchAdminTransactions.rejected, rejected);
    },
});

export const { clearBonusError, clearBonusResult } = bonusSlice.actions;
export default bonusSlice.reducer;
