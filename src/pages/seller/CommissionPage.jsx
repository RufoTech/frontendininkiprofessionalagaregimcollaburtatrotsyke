import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMonthlyCommission,
  doWithdrawBalance,
  clearCommissionState,
} from "../../slices/commissionSlice";
import BalanceWidget from "../../components/BalanceWidget";

const MONTHS = [
  "Yanvar","Fevral","Mart","Aprel","May","İyun",
  "İyul","Avqust","Sentyabr","Oktyabr","Noyabr","Dekabr",
];

const STATUS_CONFIG = {
  settled:  { label: "Köçürüldü",  bg: "#dcfce7", color: "#15803d", dot: "#22c55e" },
  pending:  { label: "Gözləyir",   bg: "#fef9c3", color: "#854d0e", dot: "#eab308" },
  failed:   { label: "Uğursuz",    bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
  refunded: { label: "Qaytarıldı", bg: "#ede9fe", color: "#5b21b6", dot: "#a78bfa" },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: cfg.bg, color: cfg.color,
      padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
      {cfg.label}
    </span>
  );
};

// Bölgü progress bar: 3 hissə
const SplitBar = ({ brendex, provider, seller }) => {
  const total = (brendex || 0) + (provider || 0) + (seller || 0);
  if (!total) return null;
  const pct = (v) => ((v / total) * 100).toFixed(1);
  return (
    <div>
      <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", height: 10, marginBottom: 8 }}>
        <div style={{ width: `${pct(brendex)}%`, background: "#E8192C" }} title={`Brendex: ${pct(brendex)}%`} />
        <div style={{ width: `${pct(provider)}%`, background: "#f97316" }} title={`Provider: ${pct(provider)}%`} />
        <div style={{ width: `${pct(seller)}%`, background: "#22c55e" }} title={`Satıcı: ${pct(seller)}%`} />
      </div>
      <div style={{ display: "flex", gap: 14, fontSize: 11, color: "#6b7280" }}>
        <span><span style={{ color: "#E8192C", fontWeight: 700 }}>■</span> Brendex {pct(brendex)}%</span>
        <span><span style={{ color: "#f97316", fontWeight: 700 }}>■</span> Provider {pct(provider)}%</span>
        <span><span style={{ color: "#22c55e", fontWeight: 700 }}>■</span> Satıcı {pct(seller)}%</span>
      </div>
    </div>
  );
};

const TABS = [
  { key: "summary", label: "📊 Aylıq Hesabat" },
  { key: "orders",  label: "📋 Sifarişlər" },
  { key: "withdraw",label: "💳 Pul Çəkiş" },
];

// ════════════════════════════════════════════════════════
export default function CommissionPage() {
  const dispatch = useDispatch();
  const { monthly, withdrawResult, loading, error } = useSelector((s) => s.commission);
  const { user: userWrapper } = useSelector((s) => s.userSlice);
  const user = userWrapper?.user;
  const sellerId = user?.sellerInfo?.storeName || null;

  const now = new Date();
  const [month,          setMonth]          = useState(now.getMonth() + 1);
  const [year,           setYear]           = useState(now.getFullYear());
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [activeTab,      setActiveTab]      = useState("summary");

  useEffect(() => {
    if (sellerId) dispatch(getMonthlyCommission({ sellerId, month, year }));
  }, [sellerId, month, year, dispatch]);

  useEffect(() => () => dispatch(clearCommissionState()), [dispatch]);

  useEffect(() => {
    if (withdrawResult?.success && sellerId)
      dispatch(getMonthlyCommission({ sellerId, month, year }));
  }, [withdrawResult]);

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) return alert("Məbləğ daxil edin");
    dispatch(doWithdrawBalance({ sellerId, amount }));
    setWithdrawAmount("");
  };

  // Sifarişlər üçün ortalama split hesabı (ilk commissiyadan götürülür)
  const sampleC = monthly?.commissions?.[0];

  if (!user) return <Guard msg="Zəhmət olmasa giriş edin." />;
  if (user.role !== "admin") return <Guard msg="Bu səhifəyə yalnız adminlər daxil ola bilər." />;
  if (!sellerId) return <Guard msg="Mağaza məlumatları tapılmadı. Yenidən giriş edin." />;

  return (
    <>
      <style>{css}</style>
      <div className="cp-root">

        {/* ── BAŞLIQ ─────────────────────────────────────────── */}
        <div className="cp-header">
          <div>
            <h1 className="cp-title">Komisya Paneli</h1>
            <p className="cp-subtitle">{user?.sellerInfo?.storeName}</p>
          </div>
          {/* Ay / İl seçici */}
          <div className="cp-period">
            <select className="cp-select" value={month} onChange={e => setMonth(Number(e.target.value))}>
              {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
            <select className="cp-select" value={year} onChange={e => setYear(Number(e.target.value))}>
              {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {/* ── BALANS KARTLARI ─────────────────────────────────── */}
        <BalanceWidget sellerId={sellerId} />

        {/* ── BİLDİRİŞLƏR ────────────────────────────────────── */}
        {error && <div className="cp-alert cp-alert-error">⚠️ {error}</div>}
        {withdrawResult?.success && (
          <div className="cp-alert cp-alert-success">
            ✅ Uğurla çəkildi — Qalan balans: <strong>{withdrawResult.remainingBalance?.toFixed(2)} AZN</strong>
          </div>
        )}

        {/* ── TAB BAR ─────────────────────────────────────────── */}
        <div className="cp-tabs">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`cp-tab ${activeTab === t.key ? "cp-tab-active" : ""}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════
            TAB 1 — AYLIK HESABAT
        ════════════════════════════════════════════════════ */}
        {activeTab === "summary" && (
          <div className="cp-card">
            {loading && <div className="cp-loading">Yüklənir...</div>}

            {monthly ? (
              <>
                <div className="cp-card-head">
                  <h2 className="cp-card-title">
                    {MONTHS[month - 1]} {year} — Hesabat
                  </h2>
                  <span className="cp-badge-orders">{monthly.totalOrders} sifariş</span>
                </div>

                {/* Əsas ədədlər */}
                <div className="cp-stats-grid">
                  <StatBox label="Cəmi Satış" value={monthly.totalOrderAmount} color="#1a1a2e" big />
                  <StatBox label="Sizə çatan" value={monthly.totalSellerEarning} color="#15803d" big />
                  <StatBox label="Settle olmuş" value={monthly.settledSellerEarning} color="#0284c7" />
                  <StatBox label="Gözləyən" value={monthly.pendingSellerEarning} color="#b45309" />
                  <StatBox label="Platform komisyası" value={monthly.totalCommission} color="#dc2626" minus />
                  <StatBox label="Ödəniş sistemi payı" value={monthly.totalProviderFee} color="#ea580c" minus />
                </div>

                {/* Split bölgüsü */}
                {sampleC && (
                  <div className="cp-split-section">
                    <p className="cp-split-label">Ödəniş bölgüsü (faiz)</p>
                    <SplitBar
                      brendex={sampleC.brendexCommission}
                      provider={sampleC.providerFee}
                      seller={sampleC.sellerEarning}
                    />
                  </div>
                )}

                {/* Pending vəziyyət */}
                {monthly.pendingSellerEarning > 0 ? (
                  <div className="cp-pending-box">
                    <div className="cp-pending-pulse" />
                    <div>
                      <p className="cp-pending-title">
                        <strong>{monthly.pendingSellerEarning?.toFixed(2)} AZN</strong> settle gözlənilir
                      </p>
                      <p className="cp-pending-note">
                        PashaPay ödənişi emal edir. Tamamlandıqda avtomatik balansınıza keçəcək.
                      </p>
                    </div>
                    {monthly.settledSellerEarning > 0 && (
                      <div className="cp-settled-chip">
                        ✅ {monthly.settledSellerEarning?.toFixed(2)} AZN köçürüldü
                      </div>
                    )}
                  </div>
                ) : monthly.totalOrders > 0 ? (
                  <div className="cp-all-done">✅ Bu ayın bütün ödənişləri settle edilib</div>
                ) : null}
              </>
            ) : !loading ? (
              <Empty month={MONTHS[month - 1]} year={year} />
            ) : null}
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            TAB 2 — SİFARİŞLƏR
        ════════════════════════════════════════════════════ */}
        {activeTab === "orders" && (
          <div className="cp-card">
            <h2 className="cp-card-title">Sifarişlər — {MONTHS[month - 1]} {year}</h2>
            {loading && <div className="cp-loading">Yüklənir...</div>}

            {monthly?.commissions?.length > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <table className="cp-table">
                  <thead>
                    <tr>
                      <th>Tarix</th>
                      <th>Provider ID</th>
                      <th>Satış</th>
                      <th>Brendex payı</th>
                      <th>Provider payı</th>
                      <th>Sizə qalan</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthly.commissions.map((c) => (
                      <tr key={c._id}>
                        <td className="cp-td-date">
                          {new Date(c.createdAt).toLocaleDateString("az-AZ")}
                        </td>
                        <td>
                          <span className="cp-mono">{c.providerOrderId || "—"}</span>
                        </td>
                        <td className="cp-td-bold">{c.orderAmount?.toFixed(2)} AZN</td>
                        <td className="cp-td-red">−{c.brendexCommission?.toFixed(2)} AZN</td>
                        <td className="cp-td-orange">−{c.providerFee?.toFixed(2)} AZN</td>
                        <td className="cp-td-green">{c.sellerEarning?.toFixed(2)} AZN</td>
                        <td><StatusBadge status={c.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : !loading ? (
              <Empty month={MONTHS[month - 1]} year={year} />
            ) : null}
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            TAB 3 — PUL ÇƏKİŞ
        ════════════════════════════════════════════════════ */}
        {activeTab === "withdraw" && (
          <div className="cp-card">
            <h2 className="cp-card-title">Pul Çəkiş</h2>
            <p className="cp-withdraw-note">
              Yalnız settle olmuş qazancınızı çəkə bilərsiniz. Gözləyən məbləğlər hələ mövcud deyil.
            </p>

            <div className="cp-withdraw-row">
              <div className="cp-input-wrap">
                <span className="cp-input-prefix">AZN</span>
                <input
                  className="cp-input"
                  type="number"
                  min="0"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(e.target.value)}
                />
              </div>
              <button
                className="cp-withdraw-btn"
                onClick={handleWithdraw}
                disabled={loading}
                style={{ opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
              >
                {loading ? "Göndərilir..." : "Çək"}
              </button>
            </div>

            <div className="cp-withdraw-info">
              <div className="cp-info-row">
                <span>Mövcud balans</span>
                <span className="cp-info-val-green">
                  {/* BalanceWidget-dən Redux store-dan alınır */}
                </span>
              </div>
              <p className="cp-withdraw-disclaimer">
                Çəkiş tələbi təsdiqləndikdən sonra 1–3 iş günü içərisində hesabınıza köçürüləcək.
              </p>
            </div>
          </div>
        )}

      </div>
    </>
  );
}

// ── Kiçik köməkçi komponentlər ────────────────────────────────────────────
const Guard = ({ msg }) => (
  <div style={{ maxWidth: 500, margin: "80px auto", textAlign: "center", padding: 24, fontFamily: "sans-serif" }}>
    <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
    <p style={{ color: "#6b7280", fontSize: 15 }}>{msg}</p>
  </div>
);

const Empty = ({ month, year }) => (
  <div style={{ textAlign: "center", padding: "48px 24px" }}>
    <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
    <p style={{ color: "#9ca3af", fontSize: 14 }}>
      {month} {year} üçün sifariş tapılmadı
    </p>
  </div>
);

const StatBox = ({ label, value, color, big, minus }) => (
  <div className={`cp-stat-box ${big ? "cp-stat-box-big" : ""}`}>
    <p className="cp-stat-label">{label}</p>
    <p className="cp-stat-val" style={{ color }}>
      {minus ? "−" : ""}{value?.toFixed(2) ?? "—"} <span style={{ fontSize: "0.55em", opacity: 0.7 }}>AZN</span>
    </p>
  </div>
);

// ── CSS ────────────────────────────────────────────────────────────────────
const css = `
*, *::before, *::after { box-sizing: border-box; }

.cp-root {
  max-width: 1100px;
  margin: 0 auto;
  padding: 36px 24px;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  color: #1a1a2e;
}

.cp-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 28px;
}

.cp-title {
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 4px;
  letter-spacing: -0.5px;
}

.cp-subtitle {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

.cp-period {
  display: flex;
  gap: 10px;
}

.cp-select {
  padding: 9px 14px;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  background: #fff;
  cursor: pointer;
  outline: none;
  transition: border-color .15s;
}
.cp-select:focus { border-color: #E8192C; }

.cp-alert {
  padding: 13px 18px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
}
.cp-alert-error   { background: #fee2e2; color: #991b1b; }
.cp-alert-success { background: #dcfce7; color: #15803d; }

/* ── TABS ── */
.cp-tabs {
  display: flex;
  gap: 4px;
  background: #f3f4f6;
  padding: 4px;
  border-radius: 14px;
  margin-bottom: 24px;
  width: fit-content;
}

.cp-tab {
  padding: 9px 20px;
  border: none;
  border-radius: 11px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  background: transparent;
  color: #6b7280;
  transition: all .18s;
  white-space: nowrap;
}
.cp-tab:hover    { color: #1a1a2e; background: rgba(255,255,255,0.6); }
.cp-tab-active   { background: #fff; color: #E8192C; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }

/* ── KART ── */
.cp-card {
  background: #fff;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.07);
  margin-bottom: 24px;
}

.cp-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
}

.cp-card-title {
  font-size: 17px;
  font-weight: 800;
  margin: 0 0 20px;
  color: #111;
}

.cp-badge-orders {
  background: #f3f4f6;
  color: #374151;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 99px;
}

/* ── STATS GRID ── */
.cp-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 14px;
  margin-bottom: 24px;
}

.cp-stat-box {
  background: #f9fafb;
  border-radius: 14px;
  padding: 16px 18px;
  border: 1.5px solid #f3f4f6;
}

.cp-stat-box-big {
  background: linear-gradient(135deg, #fafafa, #f3f4f6);
  border-color: #e5e7eb;
}

.cp-stat-label {
  font-size: 11px;
  color: #9ca3af;
  font-weight: 600;
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.cp-stat-val {
  font-size: 22px;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.5px;
}

/* ── SPLIT BAR ── */
.cp-split-section {
  padding: 20px;
  background: #f9fafb;
  border-radius: 14px;
  margin-bottom: 20px;
  border: 1.5px solid #f3f4f6;
}

.cp-split-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 12px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

/* ── PENDING BOX ── */
.cp-pending-box {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  background: #fffbeb;
  border: 1.5px solid #fde68a;
  border-radius: 14px;
  padding: 18px 20px;
  position: relative;
}

.cp-pending-pulse {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #eab308;
  flex-shrink: 0;
  animation: cpPulse 1.4s ease-in-out infinite;
}

@keyframes cpPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(1.4); }
}

.cp-pending-title {
  margin: 0 0 4px;
  font-size: 14px;
  color: #92400e;
}
.cp-pending-note {
  margin: 0;
  font-size: 12px;
  color: #b45309;
}

.cp-settled-chip {
  margin-left: auto;
  background: #dcfce7;
  color: #15803d;
  border-radius: 99px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.cp-all-done {
  background: #dcfce7;
  color: #15803d;
  border-radius: 12px;
  padding: 14px 20px;
  font-weight: 600;
  font-size: 14px;
}

.cp-loading {
  text-align: center;
  color: #9ca3af;
  padding: 40px;
  font-size: 14px;
}

/* ── CƏDVƏL ── */
.cp-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.cp-table thead tr {
  background: #f9fafb;
}
.cp-table th {
  padding: 11px 14px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  white-space: nowrap;
}
.cp-table td {
  padding: 13px 14px;
  border-bottom: 1px solid #f3f4f6;
}
.cp-table tbody tr:hover { background: #fafafa; }
.cp-table tbody tr:last-child td { border-bottom: none; }

.cp-td-date   { color: #6b7280; white-space: nowrap; }
.cp-td-bold   { font-weight: 700; color: #1a1a2e; }
.cp-td-red    { color: #dc2626; font-weight: 600; }
.cp-td-orange { color: #ea580c; font-weight: 600; }
.cp-td-green  { color: #16a34a; font-weight: 700; }

.cp-mono {
  font-family: monospace;
  font-size: 11px;
  background: #f3f4f6;
  padding: 2px 7px;
  border-radius: 5px;
  color: #374151;
}

/* ── PUL ÇƏKİŞ ── */
.cp-withdraw-note {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 20px;
  line-height: 1.6;
}

.cp-withdraw-row {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
}

.cp-input-wrap {
  flex: 1;
  position: relative;
  max-width: 280px;
}

.cp-input-prefix {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  font-weight: 700;
  color: #9ca3af;
}

.cp-input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  outline: none;
  transition: border-color .15s;
  background: #fafafa;
}
.cp-input:focus { border-color: #E8192C; background: #fff; }

.cp-withdraw-btn {
  background: linear-gradient(135deg, #E8192C, #ff5a68);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 12px 28px;
  font-size: 15px;
  font-weight: 700;
  transition: transform .15s, box-shadow .15s;
  white-space: nowrap;
}
.cp-withdraw-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(232,25,44,0.35);
}

.cp-withdraw-info {
  background: #f9fafb;
  border-radius: 14px;
  padding: 18px 20px;
  border: 1.5px solid #f3f4f6;
}

.cp-info-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}
.cp-info-val-green { color: #16a34a; }

.cp-withdraw-disclaimer {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
  line-height: 1.6;
}

@media (max-width: 640px) {
  .cp-root     { padding: 20px 16px; }
  .cp-title    { font-size: 20px; }
  .cp-tabs     { width: 100%; }
  .cp-tab      { padding: 8px 12px; font-size: 12px; flex: 1; text-align: center; }
  .cp-stat-val { font-size: 18px; }
  .cp-withdraw-row { flex-direction: column; align-items: stretch; }
  .cp-input-wrap   { max-width: 100%; }
}
`;
