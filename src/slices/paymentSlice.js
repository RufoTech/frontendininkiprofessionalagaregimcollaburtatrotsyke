// src/slices/paymentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ===================== PAYMENT SESSION YARAT =====================
// Backend: POST /commerce/mehsullar/products/create-payment-intent (endpoint adı əvvəlki kimi qalır, amma funksionallıq fərqlidir)
export const createPaymentSession = createAsyncThunk(
    'payment/createPaymentSession',
    async ({ amount, currency, cardNumber, expiry, cvv }, thunkAPI) => {
        try {
            const response = await axios.post(
                '/commerce/mehsullar/products/create-payment-intent',
                { amount, currency, cardNumber, expiry, cvv },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Ödəniş xətası baş verdi';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const paymentSlice = createSlice({
    name: 'payment',
    initialState: {
        loading:      false,
        paymentId:    null,
        redirectUrl:  null,
        provider:     null,
        error:        null,
    },
    reducers: {
        resetPaymentState: (state) => {
            state.loading      = false;
            state.paymentId    = null;
            state.redirectUrl  = null;
            state.provider     = null;
            state.error        = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPaymentSession.pending, (state) => {
                state.loading      = true;
                state.error        = null;
                state.paymentId    = null;
                state.redirectUrl  = null;
                state.provider     = null;
            })
            .addCase(createPaymentSession.fulfilled, (state, action) => {
                state.loading      = false;
                state.paymentId    = action.payload.paymentId;
                state.provider     = action.payload.provider;
                state.redirectUrl  = action.payload.redirectUrl;
            })
            .addCase(createPaymentSession.rejected, (state, action) => {
                state.loading = false;
                state.error   = action.payload;
            });
    },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;