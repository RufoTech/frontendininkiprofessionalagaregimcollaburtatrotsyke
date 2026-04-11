// ════════════════════════════════════════════════════════════════════════════
//  SuperAdminCommissions.jsx
//  SuperAdmin üçün komisya idarəetmə paneli.
//
//  3 bölmə:
//    1. Webhook Simulyatoru  — pending → settled axınını demo üçün tetikləyir
//    2. Satıcı Balansları    — bütün satıcıların maliyyə vəziyyəti
//    3. Komisyalar           — bütün sifarişlərin komisya qeydləri (filtr ilə)
//
//  Route: /superadmin/commissions
//  Qorunur: SuperAdminRoute
// ════════════════════════════════════════════════════════════════════════════

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  doSimulateWebhook,
  getAdminAllCommissions,
  getAdminAllBalances,
  clearCommissionState,
} from "../../slices/commissionSlice";

// ── Rəng sabiti ─────────────────────────────────────────────────────────────
const RED = "#E8192C";

// ── Status badge ─────────────────────────────────────────────────────────────
const STATUS_MAP = {
  settled:  { label: "Köçürüldü",  bg: "#d1fae5", color: "#065f46" },
  pending:  { label: "Gözləyir",   bg: "#fef3c7", color: "#92400e" },
  failed:   { label: "Uğursuz",    bg: "#fee2e2", color: "#991b1b" },
  refunded: { label: "Qaytarıldı", bg: "#ede9fe", color: "#5b21b6" },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_MAP[status] || { label: status, bg: "#f3f4f6", color: "#374151" };
  return (
    <span style={{
      background: cfg.bg, color: cfg.color,
      padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700,
    }}>
      {cfg.label}
    </span>
  );
};

// ── Kart ─────────────────────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{
    background: "#fff", borderRadius: 20, padding: "28px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)", marginBottom: 24, ...style,
  }}>
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 20, color: "#111" }}>
    {children}
  </h2>
);

// ── Sadə cədvəl ──────────────────────────────────────────────────────────────
const Th = ({ children }) => (
  <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 12,
               color: "#888", fontWeight: 700, background: "#f8f9fa" }}>
    {children}
  </th>
);
const Td = ({ children, style = {} }) => (
  <td style={{ padding: "13px 14px", fontSize: 13, borderBottom: "1px solid #f5f5f5", ...style }}>
    {children}
  </td>
);

// ════════════════════════════════════════════════════════════════════════════
//  ANA KOMPONENT
// ════════════════════════════════════════════════════════════════════════════
export default function SuperAdminCommissions() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { adminCommissions, adminBalances, simulateResult, loading, error } =
    useSelector((s) => s.commission);
  const { isLoggedIn } = useSelector((s) => s.superAdmin);

  // ── Filtr state-ləri ─────────────────────────────────────────────────────
  const now = new Date();
  const [filterMonth,  setFilterMonth]  = useState("");
  const [filterYear,   setFilterYear]   = useState(now.getFullYear());
  const [filterStatus, setFilterStatus] = useState("");

  // ── Simulyator state-ləri ────────────────────────────────────────────────
  const [simOrderId,   setSimOrderId]   = useState("");
  const [simEventType, setSimEventType] = useState("SETTLED");

  // ── Auth guard ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) navigate("/superadmin/login", { replace: true });
  }, [isLoggedIn, navigate]);

  // ── İlkin data yüklə ─────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(getAdminAllBalances());
    dispatch(getAdminAllCommissions());
  }, [dispatch]);

  // ── Filtr dəyişdikdə yenidən yüklə ──────────────────────────────────────
  const applyFilter = () => {
    const params = {};
    if (filterMonth)  params.month  = filterMonth;
    if (filterYear)   params.year   = filterYear;
    if (filterStatus) params.status = filterStatus;
    dispatch(getAdminAllCommissions(params));
  };

  // ── Simulyator: göndər ───────────────────────────────────────────────────
  const handleSimulate = () => {
    if (!simOrderId.trim()) return alert("providerOrderId daxil edin");
    dispatch(clearCommissionState());
    dispatch(doSimulateWebhook({ providerOrderId: simOrderId.trim(), eventType: simEventType }))
      .unwrap()
      .then(() => {
        // Balansları və komisyaları yenilə
        dispatch(getAdminAllBalances());
        dispatch(getAdminAllCommissions());
      })
      .catch(() => {});
  };

  // ── Cleanup ──────────────────────────────────────────────────────────────
  useEffect(() => () => dispatch(clearCommissionState()), [dispatch]);

  const MONTHS = [
    "Yanvar","Fevral","Mart","Aprel","May","İyun",
    "İyul","Avqust","Sentyabr","Oktyabr","Noyabr","Dekabr",
  ];

  // ════════════════════════════════════════════════════════════════════════
  //  RENDER
  // ════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 24px",
                  fontFamily: "'Segoe UI', sans-serif", color: "#111" }}>

      {/* ── Başlıq + geri düyməsi ───────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <button
          onClick={() => navigate("/superadmin/dashboard")}
          style={{ background: "#f3f4f6", border: "none", borderRadius: 10,
                   padding: "8px 16px", fontWeight: 700, cursor: "pointer", fontSize: 13 }}
        >
          ← Geri
        </button>
        <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0 }}>
          💰 Komisya İdarəetmə Paneli
        </h1>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          BÖLMƏ 1 — WEBHOOK SİMULYATORU
      ══════════════════════════════════════════════════════════════ */}
      <Card>
        <CardTitle>🔧 Webhook Simulyatoru</CardTitle>
        <p style={{ fontSize: 13, color: "#666", marginBottom: 20, lineHeight: 1.6 }}>
          Demo rejimində <code style={{ background: "#f5f5f5", padding: "1px 6px", borderRadius: 4 }}>pending</code> statusundakı
          sifarişi <code style={{ background: "#d1fae5", padding: "1px 6px", borderRadius: 4 }}>settled</code> etmək üçün
          commission-dəki <strong>providerOrderId</strong>-ni daxil edib "Tetiklə" düyməsini basın.
          <br />
          <span style={{ fontSize: 11, color: "#999" }}>
            Format: <em>sim_order_1712345678901</em> — sifarişi yaradanda commission sənədindən alınır.
          </span>
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600,
                            color: "#555", marginBottom: 6 }}>
              providerOrderId
            </label>
            <input
              style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0e0e0",
                       borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box" }}
              placeholder="sim_order_..."
              value={simOrderId}
              onChange={(e) => setSimOrderId(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600,
                            color: "#555", marginBottom: 6 }}>
              Event Növü
            </label>
            <select
              style={{ padding: "10px 14px", border: "1.5px solid #e0e0e0",
                       borderRadius: 10, fontSize: 13, outline: "none", cursor: "pointer" }}
              value={simEventType}
              onChange={(e) => setSimEventType(e.target.value)}
            >
              <option value="SETTLED">SETTLED (uğurlu)</option>
              <option value="FAILED">FAILED (uğursuz)</option>
            </select>
          </div>

          <button
            onClick={handleSimulate}
            disabled={loading}
            style={{
              background: loading ? "#ccc" : `linear-gradient(135deg, ${RED}, #ff6b6b)`,
              color: "#fff", border: "none", borderRadius: 10,
              padding: "10px 24px", fontWeight: 700, fontSize: 14,
              cursor: loading ? "not-allowed" : "pointer", whiteSpace: "nowrap",
            }}
          >
            {loading ? "Göndərilir..." : "⚡ Tetiklə"}
          </button>
        </div>

        {/* Nəticə */}
        {simulateResult && (
          <div style={{
            marginTop: 16, padding: "14px 18px", borderRadius: 12, fontSize: 13,
            background: simulateResult.success ? "#d1fae5" : "#fee2e2",
            color:      simulateResult.success ? "#065f46" : "#991b1b",
            border:     `1px solid ${simulateResult.success ? "#a7f3d0" : "#fecaca"}`,
          }}>
            {simulateResult.success
              ? `✅ Webhook tetikləndi — komisya statusu yeniləndi.`
              : `❌ Xəta: ${simulateResult.message}`}
          </div>
        )}
        {error && !simulateResult && (
          <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 10,
                        background: "#fee2e2", color: "#991b1b", fontSize: 13 }}>
            ❌ {error}
          </div>
        )}
      </Card>

      {/* ══════════════════════════════════════════════════════════════
          BÖLMƏ 2 — SATICI BALANSLARI
      ══════════════════════════════════════════════════════════════ */}
      <Card>
        <CardTitle>🏦 Satıcı Balansları</CardTitle>

        {!adminBalances && loading && (
          <div style={{ textAlign: "center", padding: 32, color: "#aaa" }}>Yüklənir...</div>
        )}

        {adminBalances?.length === 0 && (
          <div style={{ textAlign: "center", padding: 32, color: "#aaa" }}>
            Hələ heç bir satıcı balansı yoxdur.
          </div>
        )}

        {adminBalances?.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <Th>Satıcı ID</Th>
                  <Th>Mövcud Balans</Th>
                  <Th>Gözləyən Qazanc</Th>
                  <Th>Ümumi Qazanc</Th>
                  <Th>Çəkilən</Th>
                  <Th>Cəmi Satış</Th>
                </tr>
              </thead>
              <tbody>
                {adminBalances.map((b) => (
                  <tr key={b._id}>
                    <Td>
                      <span style={{ fontFamily: "monospace", fontSize: 11, color: "#888" }}>
                        {String(b.sellerId).slice(-8)}...
                      </span>
                    </Td>
                    <Td style={{ color: "#065f46", fontWeight: 700 }}>
                      {b.availableBalance?.toFixed(2)} AZN
                    </Td>
                    <Td style={{ color: "#92400e" }}>
                      {b.pendingEarning?.toFixed(2)} AZN
                    </Td>
                    <Td>{b.totalEarned?.toFixed(2)} AZN</Td>
                    <Td>{b.totalWithdrawn?.toFixed(2)} AZN</Td>
                    <Td>{b.totalOrderAmount?.toFixed(2)} AZN</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ══════════════════════════════════════════════════════════════
          BÖLMƏ 3 — BÜTÜN KOMİSYALAR
      ══════════════════════════════════════════════════════════════ */}
      <Card>
        <CardTitle>📋 Bütün Komisyalar</CardTitle>

        {/* Filtr sətri */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap",
                      alignItems: "flex-end", marginBottom: 20 }}>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600,
                            color: "#888", marginBottom: 4 }}>Ay</label>
            <select
              style={{ padding: "8px 12px", border: "1.5px solid #e0e0e0",
                       borderRadius: 8, fontSize: 12, outline: "none" }}
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            >
              <option value="">Hamısı</option>
              {MONTHS.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600,
                            color: "#888", marginBottom: 4 }}>İl</label>
            <select
              style={{ padding: "8px 12px", border: "1.5px solid #e0e0e0",
                       borderRadius: 8, fontSize: 12, outline: "none" }}
              value={filterYear}
              onChange={(e) => setFilterYear(Number(e.target.value))}
            >
              {[2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600,
                            color: "#888", marginBottom: 4 }}>Status</label>
            <select
              style={{ padding: "8px 12px", border: "1.5px solid #e0e0e0",
                       borderRadius: 8, fontSize: 12, outline: "none" }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Hamısı</option>
              <option value="pending">Gözləyir</option>
              <option value="settled">Köçürüldü</option>
              <option value="failed">Uğursuz</option>
              <option value="refunded">Qaytarıldı</option>
            </select>
          </div>

          <button
            onClick={applyFilter}
            disabled={loading}
            style={{
              background: RED, color: "#fff", border: "none", borderRadius: 8,
              padding: "8px 18px", fontWeight: 700, fontSize: 12,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            Filtr Et
          </button>
        </div>

        {/* Cəmi sayı */}
        {adminCommissions && (
          <p style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>
            Cəmi: <strong>{adminCommissions.count}</strong> komisya qeydi
          </p>
        )}

        {!adminCommissions && loading && (
          <div style={{ textAlign: "center", padding: 32, color: "#aaa" }}>Yüklənir...</div>
        )}

        {adminCommissions?.commissions?.length === 0 && (
          <div style={{ textAlign: "center", padding: 32, color: "#aaa" }}>
            Seçilmiş filtrlərə uyğun komisya tapılmadı.
          </div>
        )}

        {adminCommissions?.commissions?.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <Th>Tarix</Th>
                  <Th>Provider Order ID</Th>
                  <Th>Satış</Th>
                  <Th>Brendex %</Th>
                  <Th>Provider %</Th>
                  <Th>Satıcı Qazancı</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {adminCommissions.commissions.map((c) => (
                  <tr key={c._id}>
                    <Td>{new Date(c.createdAt).toLocaleDateString("az-AZ")}</Td>
                    <Td>
                      <span style={{ fontFamily: "monospace", fontSize: 11, color: "#555",
                                     background: "#f5f5f5", padding: "2px 6px", borderRadius: 4 }}>
                        {c.providerOrderId || "—"}
                      </span>
                    </Td>
                    <Td style={{ fontWeight: 600 }}>{c.orderAmount?.toFixed(2)} AZN</Td>
                    <Td style={{ color: RED }}>
                      {c.brendexCommission?.toFixed(2)} AZN
                      <span style={{ fontSize: 10, color: "#aaa", marginLeft: 4 }}>
                        ({c.brendexCommissionPercent}%)
                      </span>
                    </Td>
                    <Td style={{ color: "#e67e22" }}>
                      {c.providerFee?.toFixed(2)} AZN
                      <span style={{ fontSize: 10, color: "#aaa", marginLeft: 4 }}>
                        ({c.providerFeePercent}%)
                      </span>
                    </Td>
                    <Td style={{ color: "#065f46", fontWeight: 600 }}>
                      {c.sellerEarning?.toFixed(2)} AZN
                    </Td>
                    <Td><StatusBadge status={c.status} /></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
