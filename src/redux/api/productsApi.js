import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/commerce/mehsullar";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE,
  credentials: "include",
});

// 401 interceptor — istifadəçiyə aydın bildiriş verir
const baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result?.error?.status === 401) {
    // Yalnız bir dəfə toast göstər (eyni anda çoxlu 401 gəlsə)
    if (!window.__brendex401Shown) {
      window.__brendex401Shown = true;
      toast.error("Sessiya bitib, zəhmət olmasa yenidən daxil olun");
      setTimeout(() => { window.__brendex401Shown = false; }, 3000);
    }
  }
  return result;
};

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Cart", "Favorites", "Products", "Reviews"],
  endpoints: (builder) => ({

    getProducts: builder.query({
      query: (params) => ({
        url: "/products",
        params,
      }),
    }),

    getProductDetails: builder.query({
      query: (id) => `/products/${id}`,
    }),

    addProduct: builder.mutation({
      query: (productData) => ({
        url: "/admin/products",
        method: "POST",
        body: productData,
        // ❌ credentials buradan silindi - artıq baseQuery-dən gəlir
      }),
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: "DELETE",
      }),
    }),

    editProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/products/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),

    getCart: builder.query({
      query: () => "/products/cart",
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: "/products/cart",
        method: "POST",
        body: { productId, quantity },
        // ❌ credentials buradan silindi
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCartQuantity: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: `/products/cart/update/${productId}`,
        method: "PUT",
        body: { quantity },
        // ❌ credentials buradan silindi
      }),
      invalidatesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `/products/cart/${productId}`,
        method: "DELETE",
        // ❌ credentials buradan silindi
      }),
      invalidatesTags: ["Cart"],
    }),

    getFavorites: builder.query({
      query: () => "/products/favorites",
      providesTags: ["Favorites"],
      transformResponse: (response) => ({
        favorites: response?.favorites || [],
      }),
    }),

    addToFavorites: builder.mutation({
      query: (productId) => ({
        url: "/products/favorites",
        method: "POST",
        body: { productId },
        // ❌ credentials buradan silindi
      }),
      invalidatesTags: ["Favorites"],
    }),

    removeFromFavorites: builder.mutation({
      query: (productId) => ({
        url: `/products/favorites/${productId}`,
        method: "DELETE",
        // ❌ credentials buradan silindi
      }),
      invalidatesTags: ["Favorites"],
      async onQueryStarted(productId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            productApi.util.updateQueryData("getFavorites", undefined, (draft) => {
              draft.favorites = draft.favorites.filter(
                (favorite) => favorite._id !== productId
              );
            })
          );
        } catch {
          // Mutation uğursuz olarsa heç nə etməyə ehtiyac yoxdur
        }
      },
    }),

    getFilteredProducts: builder.query({
      query: (filters) => ({
        url: "/products/filter",
        params: filters,
      }),
    }),

    searchProducts: builder.query({
      query: ({ query, page = 1, limit = 10 }) => ({
        url: "/products/search",
        params: { query, page, limit },
      }),
    }),

    createOrUpdateReview: builder.mutation({
      query: (reviewData) => ({
        url: "/products/review",
        method: "PUT",
        body: reviewData,
      }),
      invalidatesTags: ["Products"],
    }),

    getProductReviews: builder.query({
      query: (id) => `/products/${id}/reviews`,
      providesTags: ["Reviews"],
    }),
  }),
});

export const {
  useGetProductDetailsQuery,
  useGetProductsQuery,
  useAddProductMutation,
  useDeleteProductMutation,
  useEditProductMutation,
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartQuantityMutation,
  useGetFavoritesQuery,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
  useSearchProductsQuery,
  useGetFilteredProductsQuery,
  useCreateOrUpdateReviewMutation,
  useGetProductReviewsQuery,
} = productApi;
