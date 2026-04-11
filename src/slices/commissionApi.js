import axios from "axios";

const BASE = "/commerce/mehsullar/commission";

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

// GET /commission/status/:orderId
// Qaytarır: { success, status: "pending" | "settled" | "failed" }
export const fetchCommissionStatus = (orderId) =>
  axios.get(`${BASE}/status/${encodeURIComponent(orderId)}`, {
    withCredentials: true,
  });

// POST /commission/simulate-webhook
// Body: { providerOrderId, eventType: "SETTLED" | "FAILED" }
// Qaytarır: { received: true }  (simulation modunda)
// Yalnız SuperAdmin istifadə edə bilər.
export const simulateWebhook = (providerOrderId, eventType = "SETTLED") =>
  axios.post(
    `${BASE}/simulate-webhook`,
    { providerOrderId, eventType },
    { withCredentials: true }
  );

// GET /commission/admin/all?month=&year=&status=&sellerId=
// Qaytarır: { success, count, commissions[] }
export const fetchAdminAllCommissions = (params = {}) =>
  axios.get(`${BASE}/admin/all`, { params, withCredentials: true });

// GET /commission/admin/balances
// Qaytarır: { success, balances[] }
export const fetchAdminAllBalances = () =>
  axios.get(`${BASE}/admin/balances`, { withCredentials: true });