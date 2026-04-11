import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setIsAuthenticated, setUser, logout } from "../features/userSlice.js";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/commerce/mehsullar";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE, credentials: "include" }),
    endpoints: (builder) => ({

        // ── Qeydiyyat ──
        // Register sonrası da login kimi işləyir:
        //   sendToken cookie yazır + sellerInfo cavabda olur
        //   onQueryStarted dispatch(setUser({ user: data.user })) edir
        //   data.user = { id, name, email, role, sellerStatus, sellerInfo }
        //   { user: data.user } wrapping — Navbar user?.user?.role oxuyur
        register: builder.mutation({
            query(body) {
                return {
                    url: "/register",
                    method: "POST",
                    body,
                };
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // data.user mövcuddursa dispatch et
                    // data.user yoxdursa (xəta cavabı) dispatch etmə
                    if (data?.user) {
                        // { user: data.user } — Redux-da user.user.role formatı üçün
                        dispatch(setUser({ user: data.user }));
                        dispatch(setIsAuthenticated(true));
                    }
                } catch (err) {
                    // Xəta baş verdisə heç nə etmə — Register.jsx toast göstərir
                }
            },
        }),

        // ── Giriş ──
        // Login cavabı: { success, token, user: { id, name, email, role, sellerStatus, sellerInfo } }
        // sendToken-da sellerInfo əlavə edildiyindən admin login-də
        // AdminProducts, AddProduct düzgün işləyir
        login: builder.mutation({
            query(body) {
                return {
                    url: "/login",
                    method: "POST",
                    body,
                };
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // data.user mövcuddursa dispatch et
                    if (data?.user) {
                        // { user: data.user } — Redux-da user.user.role formatı üçün
                        dispatch(setUser({ user: data.user }));
                        dispatch(setIsAuthenticated(true));
                    }
                } catch (err) {
                    // Xəta baş verdisə heç nə etmə — Login.jsx toast göstərir
                }
            },
        }),

        // ── Çıxış ──
        logout: builder.query({
            query: () => "/logout",
        }),

        // ── Şifrəni sıfırla ──
        resetPassword: builder.mutation({
            query: ({ token, password, confirmPassword }) => ({
                url: `/password/reset/${token}`,
                method: "PUT",
                body: { password, confirmPassword },
            }),
        }),

        // ── Şifrəni unut ──
        forgotPassword: builder.mutation({
            query: (body) => ({
                url: "/password/forgot",
                method: "POST",
                body,
            }),
        }),

        // ════════════════════════════════════════════════════
        // ── MAĞAZA PROFİLİ — slug ilə ──
        // ════════════════════════════════════════════════════
        getStoreBySlug: builder.query({
            query: (slug) => `/store/${slug}`,
        }),

        // ════════════════════════════════════════════════════
        // ── MAĞAZA SLUG-U — satıcı adından ──
        // ProductDetail "Mağazaya bax" üçün
        // ════════════════════════════════════════════════════
        getStoreSlugBySeller: builder.query({
            query: (sellerName) => `/store/seller/${encodeURIComponent(sellerName)}`,
        }),

        // ── BÜTÜN MAĞAZALAR — reytinqə görə sıralı ──
        getAllStores: builder.query({
            query: ({ sort = "rating", page = 1, limit = 24 } = {}) =>
                `/stores?sort=${sort}&page=${page}&limit=${limit}`,
        }),

    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useLazyLogoutQuery,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useGetStoreBySlugQuery,
    useGetStoreSlugBySellerQuery,
    useLazyGetStoreSlugBySellerQuery,
    useGetAllStoresQuery,
} = authApi;
