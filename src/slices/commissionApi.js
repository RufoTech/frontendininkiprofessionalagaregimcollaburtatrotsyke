import axios from "axios";

const BASE = "http://localhost:3010/commerce/mehsullar/commission";

// GET /commission/balance/:sellerId
// Qaytarır: { availableBalance, pendingEarning, totalEarned,
//             totalWithdrawn, totalOrderAmount }
export const fetchSellerBalance = (sellerId) =>
  axios.get(`${BASE}/balance/${encodeURIComponent(sellerId)}`, {
    withCredentials: true,
  });

// GET /commission/monthly/:sellerId?month=3&year=2026
// Qaytarır: { totalOrderAmount, totalCommission, totalProviderFee,
//             totalSellerEarning, settledSellerEarning, pendingSellerEarning,
//             totalOrders, commissions[] }
export const fetchMonthlyCommission = (sellerId, month, year) =>
  axios.get(
    `${BASE}/monthly/${encodeURIComponent(sellerId)}?month=${month}&year=${year}`,
    { withCredentials: true }
  );

// GET /commission/order/:orderId
// Qaytarır: { orderAmount, commissionPercentage, commissionAmount,
//             providerFee, sellerEarning, status, settledAt }
export const fetchOrderCommission = (orderId) =>
  axios.get(`${BASE}/order/${orderId}`, { withCredentials: true });

// POST /commission/withdraw
// Body: { sellerId, amount }
// Qaytarır: { success, message, remainingBalance, pendingEarning }
export const withdrawBalance = (data) =>
  axios.post(`${BASE}/withdraw`, data, { withCredentials: true });

// transferCommission() ÇIXARILDI.
// PashaPay pulu SİFARİŞ ANINDA avtomatik bölür (87% / 10% / 3%).
// Frontend-dən heç bir köçürmə əməliyyatı başlatmaq lazım deyil.