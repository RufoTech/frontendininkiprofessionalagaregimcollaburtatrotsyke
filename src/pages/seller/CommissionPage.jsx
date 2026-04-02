import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMonthlyCommission,
  doWithdrawBalance,
  clearCommissionState,
  // doTransferCommission → ÇIXARILDI: PashaPay pulu özü bölür,
  // frontend-dən heç bir köçürmə əməliyyatı başlatmaq lazım deyil.
} from "../../slices/commissionSlice";
import BalanceWidget from "../../components/BalanceWidget";

const MONTHS = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun",
  "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr",
];

// Status badge konfiqurasiyası
// "transferred" → artıq yoxdur. Yeni statuslar: settled, pending, failed, refunded
const STATUS_CONFIG = {
  settled:  { label: "Köçürüldü",  bg: "#27ae60" },
  pending:  { label: "Gözləyir",   bg: "#f39c12" },
  failed:   { label: "Uğursuz",    bg: "#e74c3c" },
  refunded: { label: "Qaytarıldı", bg: "#8e44ad" },
};

const CommissionPage = () => {
  const dispatch = useDispatch();

  // withdrawResult — transferResult artıq yoxdur
  const { monthly, withdrawResult, loading, error } =
    useSelector((state) => state.commission);

  const { user: userWrapper } = useSelector((state) => state.userSlice);
  const user = userWrapper?.user;

  // sellerId — commissionController-da sellerId olaraq sellerInfo.storeName saxlanılıb
  const sellerId   = user?.sellerInfo?.storeName || null;

  const now = new Date();
  const [month, setMonth]                   = useState(now.getMonth() + 1);
  const [year, setYear]                     = useState(now.getFullYear());
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // Ay/il dəyişdikdə aylıq hesabatı yenilə
  useEffect(() => {
    if (sellerId) {
      dispatch(getMonthlyCommission({ sellerId, month, year }));
    }
  }, [sellerId, month, year, dispatch]);

  // Səhifə bağlananda state-i təmizlə
  useEffect(() => {
    return () => dispatch(clearCommissionState());
  }, [dispatch]);

  // Uğurlu çəkiş sonra aylıq hesabatı yenilə
  useEffect(() => {
    if (withdrawResult?.success && sellerId) {
      dispatch(getMonthlyCommission({ sellerId, month, year }));
    }
  }, [withdrawResult]);

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) return alert("Məbləğ daxil edin");
    dispatch(doWithdrawBalance({ sellerId, amount }));
    setWithdrawAmount("");
  };

  // ── GUARD-LAR ──────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div style={s.page}>
        <div style={s.error}>⚠️ Zəhmət olmasa giriş edin.</div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div style={s.page}>
        <div style={s.error}>⚠️ Bu səhifəyə yalnız adminlər daxil ola bilər.</div>
      </div>
    );
  }

  if (!sellerId) {
    return (
      <div style={s.page}>
        <div style={s.error}>
          ⚠️ Mağaza məlumatları tapılmadı. Zəhmət olmasa yenidən giriş edin.
        </div>
      </div>
    );
  }

  // ── RENDER ────────────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      <h1 style={s.title}>💰 Komisya Paneli</h1>

      {/* Balans kartları */}
      <BalanceWidget sellerId={sellerId} />

      {/* Ay / İl filtr */}
      <div style={s.filters}>
        <select
          style={s.select}
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {MONTHS.map((m, i) => (
            <option key={i} value={i + 1}>{m}</option>
          ))}
        </select>
        <select
          style={s.select}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {[2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Bildirişlər */}
      {error && <div style={s.error}>{error}</div>}
      {withdrawResult?.success && (
        <div style={s.success}>
          ✅ {withdrawResult.message} — Qalan balans:{" "}
          {withdrawResult.remainingBalance?.toFixed(2)} AZN
        </div>
      )}

      {/* Aylıq xülasə */}
      {monthly && (
        <div style={s.card}>
          <h2 style={s.cardTitle}>
            {MONTHS[month - 1]} {year} — Xülasə
          </h2>
          <div style={s.grid}>
            <div style={s.gridItem}>
              <span style={s.gridLabel}>Cəmi Satış</span>
              <span style={s.gridValue}>
                {monthly.totalOrderAmount?.toFixed(2)} AZN
              </span>
            </div>
            {/* Köhnə: "Komisya (8%)" → Yeni: faiz dinamik, sahə adı dəyişdi */}
            <div style={s.gridItem}>
              <span style={s.gridLabel}>Platform komisyası</span>
              <span style={{ ...s.gridValue, color: "#E8192C" }}>
                -{monthly.totalCommission?.toFixed(2)} AZN
              </span>
            </div>
            {/* Yeni: providerFee göstərilir — məlumat üçün */}
            <div style={s.gridItem}>
              <span style={s.gridLabel}>Ödəniş sistemi payı</span>
              <span style={{ ...s.gridValue, color: "#e67e22" }}>
                -{monthly.totalProviderFee?.toFixed(2)} AZN
              </span>
            </div>
            <div style={s.gridItem}>
              <span style={s.gridLabel}>Sizə çatan</span>
              <span style={{ ...s.gridValue, color: "#27ae60" }}>
                {monthly.totalSellerEarning?.toFixed(2)} AZN
              </span>
            </div>
            <div style={s.gridItem}>
              <span style={s.gridLabel}>Sifariş sayı</span>
              <span style={s.gridValue}>{monthly.totalOrders}</span>
            </div>
          </div>

          {/*
            Köhnə: "Transfer Et" düyməsi — Stripe ilə komisyanı köçürürdü.
            Yeni: Bu düymə ÇIXARILDI. PashaPay pulu sifariş anında özü bölür.
            Əvəzinə: settled/pending məbləğlər məlumat üçün göstərilir.
          */}
          {monthly.pendingSellerEarning > 0 ? (
            <div style={s.pendingBox}>
              <div>
                <p style={s.pendingTitle}>
                  ⏳ <strong>{monthly.pendingSellerEarning?.toFixed(2)} AZN</strong> settle gözlənilir
                </p>
                <p style={s.pendingNote}>
                  PashaPay ödənişi emal edir. Tamamlandıqda avtomatik balansınıza keçəcək.
                </p>
              </div>
              {monthly.settledSellerEarning > 0 && (
                <div style={s.settledChip}>
                  ✅ {monthly.settledSellerEarning?.toFixed(2)} AZN köçürüldü
                </div>
              )}
            </div>
          ) : (
            <div style={s.allDone}>
              ✅ Bu ayın bütün ödənişləri settle edilib
            </div>
          )}
        </div>
      )}

      {/* Sifarişlər cədvəli */}
      {monthly?.commissions?.length > 0 && (
        <div style={s.card}>
          <h2 style={s.cardTitle}>Sifarişlər</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={s.table}>
              <thead>
                <tr style={{ background: "#f8f9fa" }}>
                  <th style={s.th}>Tarix</th>
                  <th style={s.th}>Satış</th>
                  <th style={s.th}>Komisya</th>
                  <th style={s.th}>Provider payı</th>
                  <th style={s.th}>Sizə qalan</th>
                  <th style={s.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {monthly.commissions.map((c) => {
                  const statusCfg = STATUS_CONFIG[c.status] || STATUS_CONFIG.pending;
                  return (
                    <tr key={c._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={s.td}>
                        {new Date(c.createdAt).toLocaleDateString("az-AZ")}
                      </td>
                      <td style={s.td}>{c.orderAmount?.toFixed(2)} AZN</td>
                      <td style={{ ...s.td, color: "#E8192C" }}>
                        -{c.commissionAmount?.toFixed(2)} AZN
                      </td>
                      <td style={{ ...s.td, color: "#e67e22" }}>
                        -{c.providerFee?.toFixed(2)} AZN
                      </td>
                      <td style={{ ...s.td, color: "#27ae60" }}>
                        {c.sellerEarning?.toFixed(2)} AZN
                      </td>
                      <td style={s.td}>
                        <span style={{ ...s.badge, background: statusCfg.bg }}>
                          {statusCfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Boş vəziyyət */}
      {monthly && monthly.totalOrders === 0 && (
        <div style={s.empty}>
          📭 {MONTHS[month - 1]} {year} üçün sifariş tapılmadı
        </div>
      )}

      {/* Pul çəkiş */}
      <div style={s.card}>
        <h2 style={s.cardTitle}>💳 Balansdan Pul Çək</h2>
        <p style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
          Yalnız settle olmuş qazancınızı çəkə bilərsiniz
        </p>
        <div style={{ display: "flex", gap: "12px" }}>
          <input
            style={s.input}
            type="number"
            min="0"
            placeholder="Məbləğ (AZN)"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
          />
          <button
            style={{
              ...s.withdrawBtn,
              opacity: loading ? 0.6 : 1,
              cursor:  loading ? "not-allowed" : "pointer",
            }}
            onClick={handleWithdraw}
            disabled={loading}
          >
            {loading ? "..." : "Çək"}
          </button>
        </div>
      </div>
    </div>
  );
};

const s = {
  page:         { maxWidth: "1100px", margin: "0 auto", padding: "32px 24px", fontFamily: "'Segoe UI', sans-serif", color: "#1a1a2e" },
  title:        { fontSize: "28px", fontWeight: "800", marginBottom: "28px" },
  filters:      { display: "flex", gap: "12px", marginBottom: "24px" },
  select:       { padding: "10px 16px", borderRadius: "10px", border: "2px solid #e0e0e0", fontSize: "14px", cursor: "pointer", outline: "none" },
  error:        { background: "#fdecea", color: "#c0392b", padding: "12px 16px", borderRadius: "10px", marginBottom: "16px" },
  success:      { background: "#eafaf1", color: "#1e8449", padding: "12px 16px", borderRadius: "10px", marginBottom: "16px" },
  empty:        { textAlign: "center", color: "#aaa", padding: "32px", fontSize: "15px", background: "#fff", borderRadius: "20px", marginBottom: "24px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" },
  card:         { background: "#fff", borderRadius: "20px", padding: "28px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", marginBottom: "24px" },
  cardTitle:    { fontSize: "18px", fontWeight: "700", marginBottom: "20px" },
  grid:         { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "24px" },
  gridItem:     { background: "#f8f9fa", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "6px" },
  gridLabel:    { fontSize: "12px", color: "#888" },
  gridValue:    { fontSize: "20px", fontWeight: "700" },
  // Köhnə transferBox → yeni pendingBox (məlumat üçün, düymə yoxdur)
  pendingBox:   { background: "#fff8e1", borderRadius: "12px", padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", border: "1px solid #ffe082" },
  pendingTitle: { margin: "0 0 4px", fontSize: "15px", color: "#5d4037" },
  pendingNote:  { margin: 0, fontSize: "12px", color: "#8d6e63" },
  settledChip:  { background: "#eafaf1", color: "#1e8449", borderRadius: "20px", padding: "8px 16px", fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap" },
  allDone:      { background: "#eafaf1", color: "#1e8449", borderRadius: "12px", padding: "16px", textAlign: "center", fontWeight: "600" },
  table:        { width: "100%", borderCollapse: "collapse" },
  th:           { padding: "12px 16px", textAlign: "left", fontSize: "13px", color: "#888", fontWeight: "600" },
  td:           { padding: "14px 16px", fontSize: "14px" },
  badge:        { color: "#fff", borderRadius: "20px", padding: "4px 12px", fontSize: "12px", fontWeight: "600" },
  input:        { flex: 1, padding: "12px 16px", borderRadius: "12px", border: "2px solid #e0e0e0", fontSize: "15px", outline: "none" },
  withdrawBtn:  { background: "linear-gradient(135deg, #E8192C, #ff6b6b)", border: "none", borderRadius: "12px", padding: "12px 28px", fontSize: "15px", fontWeight: "700", color: "#fff", transition: "opacity 0.2s" },
};

export default CommissionPage;