import { useEffect, useState } from "react";
import axios from "axios";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// OrderCommissionDetail.jsx
// Sifariş detalları səhifəsindəki komisya bloku.
//
// PashaPay modelinə uyğun dəyişikliklər:
//   • providerFee sətri əlavə edildi  (3% — PashaPay-ın payı)
//   • status "transferred" → "settled"
//   • statusBadge bütün 4 statusu idarə edir: settled/pending/failed/refunded
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const BASE = "http://localhost:4000/commerce/mehsullar/commission";

// Status badge konfiqurasiyası — bütün backend statusları burada
const STATUS_CONFIG = {
  settled:  { text: "✅ Hesabınıza köçürüldü", bg: "#eafaf1", color: "#1e8449" },
  pending:  { text: "⏳ Gözləyir",             bg: "#fff8e1", color: "#e67e22" },
  failed:   { text: "❌ Uğursuz",              bg: "#fdf2f2", color: "#c0392b" },
  refunded: { text: "↩️ Qaytarıldı",           bg: "#f0f3ff", color: "#2c3e8c" },
};

const OrderCommissionDetail = ({ orderId }) => {
  const [commission, setCommission] = useState(null);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    if (!orderId) return;
    axios
      .get(`${BASE}/order/${orderId}`, { withCredentials: true })
      // Backend birbaşa { success, orderAmount, ... } qaytarır —
      // commission adlı iç obyekt yoxdur
      .then((res) => setCommission(res.data))
      .catch(() => setCommission(null))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div style={styles.loading}>Yüklənir...</div>;
  if (!commission) return null;

  const statusCfg = STATUS_CONFIG[commission.status] || STATUS_CONFIG.pending;

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>💰 Komisya Məlumatı</h3>

      <div style={styles.rows}>
        <Row
          label="Sifarişin məbləği"
          value={`${commission.orderAmount?.toFixed(2)} AZN`}
        />
        <Row
          label={`Platform komisyası (${commission.commissionPercentage}%)`}
          value={`-${commission.commissionAmount?.toFixed(2)} AZN`}
          red
        />
        {/* PashaPay-ın payı — məlumat üçün göstərilir */}
        <Row
          label="Ödəniş sistemi payı (3%)"
          value={`-${commission.providerFee?.toFixed(2)} AZN`}
          red
        />
        <div style={styles.divider} />
        <Row
          label="Sizə qalan (87%)"
          value={`${commission.sellerEarning?.toFixed(2)} AZN`}
          green
          bold
        />
      </div>

      {/* Status badge — köhnə "transferred" yoxlaması silinib */}
      <div style={styles.badge(statusCfg)}>
        {statusCfg.text}
      </div>
    </div>
  );
};

const Row = ({ label, value, red, green, bold }) => (
  <div style={styles.row}>
    <span style={styles.label}>{label}</span>
    <span
      style={{
        ...styles.value,
        color:      red ? "#e74c3c" : green ? "#27ae60" : "#1a1a2e",
        fontWeight: bold ? "700" : "500",
        fontSize:   bold ? "18px" : "15px",
      }}
    >
      {value}
    </span>
  </div>
);

const styles = {
  card: {
    background:   "#fff",
    borderRadius: "16px",
    padding:      "24px",
    boxShadow:    "0 4px 16px rgba(0,0,0,0.08)",
    marginTop:    "20px",
  },
  title: {
    fontSize:     "16px",
    fontWeight:   "700",
    marginBottom: "16px",
    color:        "#1a1a2e",
  },
  rows:    { display: "flex", flexDirection: "column", gap: "10px" },
  row:     { display: "flex", justifyContent: "space-between", alignItems: "center" },
  label:   { fontSize: "14px", color: "#888" },
  value:   { fontSize: "15px" },
  divider: { height: "1px", background: "#f0f0f0", margin: "4px 0" },
  badge: ({ bg, color }) => ({
    marginTop:    "16px",
    display:      "inline-block",
    padding:      "6px 14px",
    borderRadius: "20px",
    fontSize:     "13px",
    fontWeight:   "600",
    background:   bg,
    color,
  }),
  loading: { color: "#888", fontSize: "14px", padding: "12px" },
};

export default OrderCommissionDetail;