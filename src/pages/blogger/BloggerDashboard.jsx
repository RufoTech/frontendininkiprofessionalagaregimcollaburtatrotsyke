import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
import {
  TrendingUp, DollarSign, Users, Clock, Copy, LogOut,
  CheckCircle, XCircle, Package,
} from "lucide-react";
import {
  getBloggerProfile,
  getBloggerSales,
  bloggerLogout,
  clearBloggerError,
} from "../../slices/bloggerSlice";

// ─── Stil sabitleri ────────────────────────────────────────────────────────
const colors = {
  red:    "#E8192C",
  green:  "#27ae60",
  orange: "#f39c12",
  purple: "#8e44ad",
  dark:   "#1a1a2e",
  blue:   "#2980b9",
};

const card = {
  background:   "#fff",
  borderRadius: "12px",
  boxShadow:    "0 4px 24px rgba(0,0,0,0.07)",
  padding:      "22px",
  marginBottom: "20px",
};

const inputStyle = {
  padding:      "9px 14px",
  border:       "1px solid #e0e0e0",
  borderRadius: "8px",
  fontSize:     "14px",
  outline:      "none",
};

const btnBase = {
  border:       "none",
  borderRadius: "8px",
  padding:      "9px 18px",
  cursor:       "pointer",
  fontSize:     "14px",
  fontWeight:   "600",
  display:      "flex",
  alignItems:   "center",
  gap:          "7px",
};

const MONTHS_AZ = ["Yan", "Fev", "Mar", "Apr", "May", "İyun",
                   "İyul", "Avq", "Sen", "Okt", "Noy", "Dek"];

// ─── Stat kartı ────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div style={{ ...card, marginBottom: 0, display: "flex", alignItems: "center", gap: "14px" }}>
      <div style={{ width: 46, height: 46, borderRadius: "50%", background: color + "20",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={20} color={color} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: "12px", color: "#888" }}>{label}</div>
        <div style={{ fontSize: "20px", fontWeight: "700", color: colors.dark }}>{value}</div>
        {sub && <div style={{ fontSize: "11px", color: "#aaa" }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─── Status badge ──────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    pending:   { color: colors.orange, label: "Gözləyir" },
    paid:      { color: colors.green,  label: "Ödənilib" },
    cancelled: { color: colors.red,    label: "Ləğv edilib" },
  };
  const { color, label } = map[status] || { color: "#aaa", label: status };
  return (
    <span style={{ background: color + "20", color, padding: "3px 10px",
      borderRadius: "20px", fontWeight: "600", fontSize: "12px" }}>
      {label}
    </span>
  );
}

// ─── Kopyala düyməsi ───────────────────────────────────────────────────────
function CopyBtn({ text }) {
  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => toast.success("Kopyalandı!"));
  }
  return (
    <button onClick={handleCopy}
      style={{ ...btnBase, padding: "5px 10px", background: "#f0f0f0", color: "#555" }}>
      <Copy size={13} />
    </button>
  );
}

// ─── ANA KOMPONENT ────────────────────────────────────────────────────────
export default function BloggerDashboard() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { profile, sales, loading, error } = useSelector((s) => s.blogger);

  const [salesFilter, setSalesFilter] = useState("all");   // all | pending | paid | cancelled
  const [salesPage,   setSalesPage]   = useState(1);

  // ── İlk yükləmə ──────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(getBloggerProfile()).unwrap().catch(() => navigate("/"));
  }, []);

  useEffect(() => {
    loadSales();
  }, [salesFilter, salesPage]);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearBloggerError()); }
  }, [error]);

  function loadSales() {
    const params = { page: salesPage, limit: 15 };
    if (salesFilter !== "all") params.status = salesFilter;
    dispatch(getBloggerSales(params));
  }

  // ── Çıxış ─────────────────────────────────────────────────────────────────
  async function handleLogout() {
    await dispatch(bloggerLogout());
    navigate("/");
  }

  if (!profile) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: "#aaa" }}>
        {loading ? "Yüklənir..." : "Giriş edilməyib"}
      </div>
    );
  }

  const blogger = profile.blogger;
  const stats   = profile.stats || {};

  // Komissiya dövrü progress
  const duration = blogger.commissionDuration || 6;
  const started  = blogger.commissionStartDate ? new Date(blogger.commissionStartDate) : null;
  const progressPct = (() => {
    if (!started) return 0;
    const total = duration * 30 * 24 * 60 * 60 * 1000;
    const elapsed = Date.now() - started.getTime();
    return Math.min(100, Math.round((elapsed / total) * 100));
  })();

  // Aylıq chart data (react-chartjs-2)
  const monthlySales = stats.monthlySales || [];
  const chartLabels  = monthlySales.map((m) => `${MONTHS_AZ[m._id.month - 1]} ${m._id.year}`);
  const chartData = {
    labels:   chartLabels,
    datasets: [
      {
        label:           "Komissiya (₼)",
        data:            monthlySales.map((m) => parseFloat((m.totalCommission  || 0).toFixed(2))),
        backgroundColor: colors.green + "cc",
        borderRadius:    6,
      },
      {
        label:           "Satış (₼)",
        data:            monthlySales.map((m) => parseFloat((m.totalSalesAmount || 0).toFixed(2))),
        backgroundColor: colors.blue  + "cc",
        borderRadius:    6,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" }, title: { display: false } },
    scales:  { y: { beginAtZero: true } },
  };

  const saleList   = sales?.sales  || [];
  const totalPages = sales?.pages  || 1;

  return (
    <div style={{ padding: "30px", background: "#f8f9fa", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>

      {/* Başlıq */}
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "800", color: colors.dark }}>
            Salam, {blogger.firstName} {blogger.lastName} 👋
          </h1>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: "14px" }}>
            Komissiya paneli — {blogger.commissionRate}% faiz
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => navigate("/blogger/products")}
            style={{ ...btnBase, background: colors.dark, color: "#fff" }}>
            <Package size={15} /> Məhsullarım
          </button>
          <button onClick={handleLogout}
            style={{ ...btnBase, background: colors.red, color: "#fff" }}>
            <LogOut size={15} /> Çıxış
          </button>
        </div>
      </div>

      {/* Stat kartları */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
        gap: "14px", marginBottom: "20px" }}>
        <StatCard icon={Users}       label="Ümumi Referral"   value={stats.totalReferrals || 0}
          color={colors.blue} />
        <StatCard icon={TrendingUp}  label="Satış Məbləği"    value={`${(stats.totalSalesAmount || 0).toFixed(2)} ₼`}
          color={colors.purple} />
        <StatCard icon={DollarSign}  label="Qazanılan"        value={`${(stats.totalCommissionEarned || 0).toFixed(2)} ₼`}
          color={colors.green} />
        <StatCard icon={Clock}       label="Gözləyən"         value={`${(stats.pendingCommission || 0).toFixed(2)} ₼`}
          color={colors.orange} />
        <StatCard icon={CheckCircle} label="Ödənilib"         value={`${(blogger.totalCommissionPaid || 0).toFixed(2)} ₼`}
          color={colors.green} sub={stats.daysRemaining !== null ? `${stats.daysRemaining} gün qalır` : undefined} />
      </div>

      {/* Komissiya dövrü progress */}
      {started && (
        <div style={{ ...card }}>
          <div style={{ display: "flex", justifyContent: "space-between",
            alignItems: "center", marginBottom: "10px" }}>
            <span style={{ fontWeight: "700", color: colors.dark }}>
              Komissiya Dövrü ({duration} ay)
            </span>
            <span style={{ fontSize: "13px", color: stats.commissionActive ? colors.green : colors.red,
              fontWeight: "600" }}>
              {stats.commissionActive
                ? <><CheckCircle size={14} style={{ verticalAlign: "middle" }} /> Aktiv</>
                : <><XCircle    size={14} style={{ verticalAlign: "middle" }} /> Bitmişdir</>}
            </span>
          </div>
          <div style={{ background: "#f0f0f0", borderRadius: "99px", height: "10px", overflow: "hidden" }}>
            <div style={{ width: `${progressPct}%`, height: "100%", borderRadius: "99px",
              background: stats.commissionActive ? colors.green : colors.red,
              transition: "width 0.6s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between",
            fontSize: "12px", color: "#aaa", marginTop: "6px" }}>
            <span>Başlanğıc: {started.toLocaleDateString("az-AZ")}</span>
            <span>{progressPct}% keçib</span>
            <span>Qalır: {stats.daysRemaining ?? 0} gün</span>
          </div>
        </div>
      )}

      {/* Promo kodu kartı */}
      <div style={{ ...card }}>
        <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: "700", color: colors.dark }}>
          Promo Məlumatları
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <div>
            <div style={{ fontSize: "12px", color: "#888", marginBottom: "6px" }}>Promo Kod</div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <code style={{ background: "#f0f0f0", padding: "8px 14px", borderRadius: "8px",
                fontWeight: "700", fontSize: "16px", color: colors.dark, letterSpacing: "1px" }}>
                {blogger.promoCode}
              </code>
              <CopyBtn text={blogger.promoCode} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#888", marginBottom: "6px" }}>Promo Link</div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input readOnly value={blogger.promoLink || ""}
                style={{ ...inputStyle, flex: 1, color: colors.blue, fontSize: "12px" }} />
              <CopyBtn text={blogger.promoLink || ""} />
            </div>
          </div>
        </div>
      </div>

      {/* Aylıq Chart */}
      {monthlySales.length > 0 && (
        <div style={{ ...card }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: "700", color: colors.dark }}>
            Son 6 Aylıq Komissiya Dinamikası
          </h3>
          <Bar data={chartData} options={chartOptions} height={90} />
        </div>
      )}

      {/* Satış Tarixçəsi */}
      <div style={{ ...card }}>
        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: colors.dark }}>
            Satış Tarixçəsi
          </h3>
          <div style={{ display: "flex", gap: "8px" }}>
            {[["all", "Hamısı"], ["pending", "Gözləyir"], ["paid", "Ödənilib"], ["cancelled", "Ləğv"]].map(
              ([val, lbl]) => (
                <button key={val} onClick={() => { setSalesFilter(val); setSalesPage(1); }}
                  style={{ ...btnBase, padding: "6px 14px",
                    background: salesFilter === val ? colors.dark : "#f0f0f0",
                    color:      salesFilter === val ? "#fff"      : "#555" }}>
                  {lbl}
                </button>
              )
            )}
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "30px", textAlign: "center", color: "#aaa" }}>Yüklənir...</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ background: "#f8f9fa" }}>
                  {["Tarix", "Sifariş", "Məhsullar", "Metod", "Satış", "Komissiya", "Status"].map((h) => (
                    <th key={h} style={{ padding: "12px 14px", textAlign: h === "Status" ? "center" : "left",
                      fontWeight: "700", fontSize: "12px", color: "#555", borderBottom: "1px solid #eee",
                      textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {saleList.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#aaa" }}>
                      <Package size={32} style={{ display: "block", margin: "0 auto 8px", opacity: 0.3 }} />
                      Hələ satışınız yoxdur.
                    </td>
                  </tr>
                ) : (
                  saleList.map((s) => (
                    <tr key={s._id} style={{ borderBottom: "1px solid #f0f0f0" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#fafafa"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "12px 14px", color: "#555", fontSize: "13px" }}>
                        {new Date(s.saleDate).toLocaleDateString("az-AZ")}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <code style={{ fontSize: "11px", background: "#f0f0f0", color: "#111",
                          padding: "2px 6px", borderRadius: "4px", fontWeight: "600" }}>
                          #{s.order?._id?.slice(-8) || "—"}
                        </code>
                      </td>
                      <td style={{ padding: "12px 14px", maxWidth: "220px" }}>
                        <div style={{ fontSize: "13px", color: colors.dark, fontWeight: "500" }}>
                          {s.products && s.products.length > 0 ? (
                            s.products.map((p, idx) => (
                              <div key={idx} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={`${p.name} (x${p.quantity})`}>
                                • {p.name} <span style={{ color: "#888", fontSize: "11px" }}>x{p.quantity}</span>
                              </div>
                            ))
                          ) : (
                            <span style={{ color: "#aaa" }}>Məlumat yoxdur</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ 
                          fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "6px",
                          background: s.method === "link" ? "#e0f2fe" : "#fef2f2",
                          color: s.method === "link" ? "#0369a1" : "#E8192C",
                          textTransform: "uppercase"
                        }}>
                          {s.method === "link" ? "LİNK" : "KOD"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 14px", fontWeight: "700", color: colors.dark }}>
                        {(s.orderAmount || 0).toFixed(2)} ₼
                      </td>
                      <td style={{ padding: "12px 14px", color: colors.green, fontWeight: "700" }}>
                        {(s.commissionAmount || 0).toFixed(2)} ₼
                        <div style={{ fontSize: "10px", color: "#aaa", fontWeight: "400" }}>{s.commissionRate}%</div>
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "center" }}>
                        <StatusBadge status={s.paymentStatus} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center",
            gap: "8px", marginTop: "14px" }}>
            <button disabled={salesPage === 1} onClick={() => setSalesPage((p) => p - 1)}
              style={{ ...btnBase, padding: "6px 14px", background: "#f0f0f0", color: "#555" }}>
              ← Əvvəl
            </button>
            <span style={{ padding: "6px 14px", fontWeight: "600" }}>
              {salesPage} / {totalPages}
            </span>
            <button disabled={salesPage === totalPages} onClick={() => setSalesPage((p) => p + 1)}
              style={{ ...btnBase, padding: "6px 14px", background: "#f0f0f0", color: "#555" }}>
              Sonra →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
