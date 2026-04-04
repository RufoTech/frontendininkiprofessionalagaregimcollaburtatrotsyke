import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setIsAuthenticated, setUser, logout } from "../features/userSlice.js";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/commerce/mehsullar", credentials: "include" }),
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
            query: (body) => {
                console.log("Sending forgot password request", body);
                return {
                    url: "/password/forgot",
                    method: "POST",
                    body,
                };
            },
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                    console.log("Forgot password request successful", result);
                } catch (error) {
                    console.error("Forgot password request failed", error);
                }
            },
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
            query: (sellerName) => `/store-by-seller/${encodeURIComponent(sellerName)}`,
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
} = authApi;