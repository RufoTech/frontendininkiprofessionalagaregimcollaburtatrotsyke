import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  Users, TrendingUp, DollarSign, Clock, Search,
  Plus, Edit2, Trash2, CreditCard, RefreshCw, CheckCircle, XCircle,
} from "lucide-react";
import {
  getAllBloggers,
  getBloggersOverview,
  createBlogger,
  updateBlogger,
  updateCommissionRate,
  payCommission,
  deleteBlogger,
  clearActionResult,
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
  gray:   "#95a5a6",
};

const card = {
  background:   "#fff",
  borderRadius: "12px",
  boxShadow:    "0 4px 24px rgba(0,0,0,0.07)",
  padding:      "24px",
  marginBottom: "24px",
};

const inputStyle = {
  width:        "100%",
  padding:      "10px 14px",
  border:       "1px solid #e0e0e0",
  borderRadius: "8px",
  fontSize:     "14px",
  outline:      "none",
  boxSizing:    "border-box",
};

const labelStyle = {
  display:      "block",
  marginBottom: "6px",
  fontSize:     "13px",
  fontWeight:   "600",
  color:        "#555",
};

const btnPrimary = {
  background:   colors.dark,
  color:        "#fff",
  border:       "none",
  borderRadius: "8px",
  padding:      "10px 20px",
  cursor:       "pointer",
  fontSize:     "14px",
  fontWeight:   "600",
  display:      "flex",
  alignItems:   "center",
  gap:          "8px",
};

const btnDanger = { ...btnPrimary, background: colors.red };
const btnGreen  = { ...btnPrimary, background: colors.green };
const btnGray   = { ...btnPrimary, background: colors.gray };

// ─── Stat kartı ────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div style={{ ...card, marginBottom: 0, display: "flex", alignItems: "center", gap: "16px" }}>
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: color + "20",
        display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={22} color={color} />
      </div>
      <div>
        <div style={{ fontSize: "13px", color: "#888", marginBottom: "2px" }}>{label}</div>
        <div style={{ fontSize: "22px", fontWeight: "700", color: colors.dark }}>{value}</div>
      </div>
    </div>
  );
}

// ─── Status rəngi ──────────────────────────────────────────────────────────
function RateBadge({ rate }) {
  const color = rate === 41 ? colors.purple : rate === 40 ? colors.blue : rate === 30 ? colors.orange : colors.red;
  return (
    <span style={{ background: color + "20", color, padding: "3px 10px",
      borderRadius: "20px", fontWeight: "700", fontSize: "13px" }}>
      {rate}%
    </span>
  );
}

function ActiveBadge({ active }) {
  return (
    <span style={{ background: active ? colors.green + "20" : colors.red + "20",
      color: active ? colors.green : colors.red, padding: "3px 10px",
      borderRadius: "20px", fontWeight: "600", fontSize: "12px",
      display: "flex", alignItems: "center", gap: "4px", width: "fit-content" }}>
      {active ? <CheckCircle size={12} /> : <XCircle size={12} />}
      {active ? "Aktiv" : "Deaktiv"}
    </span>
  );
}

// ─── Modal ─────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "#fff", borderRadius: "14px", padding: "28px",
        width: "100%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: colors.dark }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none",
            cursor: "pointer", fontSize: "20px", color: "#999" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── ANA KOMPONENT ────────────────────────────────────────────────────────
export default function BloggerManagement() {
  const dispatch = useDispatch();
  const { bloggers: bloggersData, overview, loading, error, actionResult } = useSelector(
    (s) => s.blogger
  );

  // Filtr state
  const [search,   setSearch]   = useState("");
  const [rateFilter, setRateFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [page, setPage] = useState(1);

  // Modal state
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit,   setShowEdit]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  // Form state
  const [form, setForm] = useState({
    firstName: "", lastName: "", fatherName: "",
    email: "", phone: "", password: "", commissionRate: 40,
  });
  const [editForm, setEditForm] = useState({
    firstName: "", lastName: "", fatherName: "",
    email: "", phone: "", isActive: true,
  });

  // ── İlk yükləmə ──────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(getBloggersOverview());
    loadBloggers();
  }, []);

  useEffect(() => {
    loadBloggers();
  }, [page, rateFilter, activeFilter]);

  function loadBloggers(searchVal) {
    const params = { page, limit: 15 };
    const q = searchVal !== undefined ? searchVal : search;
    if (q)           params.search   = q;
    if (rateFilter)  params.rate     = rateFilter;
    if (activeFilter !== "") params.isActive = activeFilter;
    dispatch(getAllBloggers(params));
  }

  // ── actionResult izləmə ───────────────────────────────────────────────────
  useEffect(() => {
    if (!actionResult) return;
    const msgs = {
      created:     "Bloger yaradıldı",
      updated:     "Məlumatlar yeniləndi",
      rateUpdated: "Komissiya faizi yeniləndi",
      paid:        `${actionResult.result?.paidSales || ""} satış ödənildi`,
      deleted:     "Bloger silindi",
    };
    toast.success(msgs[actionResult.type] || "Əməliyyat uğurlu");
    dispatch(clearActionResult());
    setShowCreate(false);
    setShowEdit(false);
    dispatch(getBloggersOverview());
    loadBloggers();
  }, [actionResult]);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearBloggerError()); }
  }, [error]);

  // ── Axtarış ───────────────────────────────────────────────────────────────
  function handleSearchKey(e) {
    if (e.key === "Enter") { setPage(1); loadBloggers(search); }
  }

  // ── Yarat ─────────────────────────────────────────────────────────────────
  function handleCreate(e) {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      return toast.error("Ad, soyad, e-poçt və şifrə mütləqdir");
    }
    dispatch(createBlogger(form));
  }

  // ── Redaktə ───────────────────────────────────────────────────────────────
  function openEdit(b) {
    setEditTarget(b);
    setEditForm({
      firstName:  b.firstName,
      lastName:   b.lastName,
      fatherName: b.fatherName || "",
      email:      b.email,
      phone:      b.phone || "",
      isActive:   b.isActive,
    });
    setShowEdit(true);
  }

  function handleEdit(e) {
    e.preventDefault();
    dispatch(updateBlogger({ id: editTarget._id, formData: editForm }));
  }

  // ── Faiz dəyişdir ─────────────────────────────────────────────────────────
  async function handleRateChange(blogger) {
    const { value: rate } = await Swal.fire({
      title:       "Komissiya faizini dəyiş",
      input:       "select",
      inputOptions: { 20: "20%", 30: "30%", 40: "40%", 41: "41%" },
      inputValue:   String(blogger.commissionRate),
      showCancelButton: true,
      confirmButtonText: "Yenilə",
      cancelButtonText:  "Ləğv et",
      confirmButtonColor: colors.dark,
    });
    if (rate) dispatch(updateCommissionRate({ id: blogger._id, rate: Number(rate) }));
  }

  // ── Komissiya ödə ────────────────────────────────────────────────────────
  async function handlePay(blogger) {
    const pending = blogger.pendingCommission || 0;
    if (pending <= 0) return toast.error("Ödəniləcək komissiya yoxdur");

    const { isConfirmed } = await Swal.fire({
      title:             `${blogger.firstName} ${blogger.lastName}`,
      html:              `<b>${pending.toFixed(2)} AZN</b> gözləyən komissiya ödəniləcək.<br>Davam edirsiniz?`,
      icon:              "question",
      showCancelButton:  true,
      confirmButtonText: "Bəli, ödə",
      cancelButtonText:  "Ləğv et",
      confirmButtonColor: colors.green,
    });
    if (isConfirmed) dispatch(payCommission({ id: blogger._id, body: {} }));
  }

  // ── Sil ───────────────────────────────────────────────────────────────────
  async function handleDelete(blogger) {
    const { isConfirmed } = await Swal.fire({
      title:             "Silinsin?",
      html:              `<b>${blogger.firstName} ${blogger.lastName}</b> silinəcək.<br>Satış tarixçəsi qorunacaq.`,
      icon:              "warning",
      showCancelButton:  true,
      confirmButtonText: "Bəli, sil",
      cancelButtonText:  "Ləğv et",
      confirmButtonColor: colors.red,
    });
    if (isConfirmed) dispatch(deleteBlogger(blogger._id));
  }

  const bloggerList = bloggersData?.bloggers || [];
  const totalPages  = bloggersData?.pages    || 1;

  return (
    <div style={{ padding: "24px", fontFamily: "'Segoe UI', sans-serif",
      background: "#f5f6fa", minHeight: "100vh" }}>

      {/* Başlıq */}
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: colors.dark }}>
            Blogger İdarəetməsi
          </h1>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: "14px" }}>
            Referral komissiya sistemi — 6 aylıq ödəniş dövrü
          </p>
        </div>
        <button style={btnPrimary} onClick={() => setShowCreate(true)}>
          <Plus size={16} /> Yeni Blogger
        </button>
      </div>

      {/* Overview kartları */}
      {overview && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px", marginBottom: "24px" }}>
          <StatCard icon={Users}       label="Ümumi Blogger"    value={overview.totalBloggers}                     color={colors.blue} />
          <StatCard icon={CheckCircle} label="Aktiv"            value={overview.activeBloggers}                    color={colors.green} />
          <StatCard icon={TrendingUp}  label="Ümumi Referral"   value={overview.totalReferrals}                    color={colors.purple} />
          <StatCard icon={DollarSign}  label="Qazanılan (AZN)"  value={(overview.totalCommissionEarned || 0).toFixed(2)} color={colors.orange} />
          <StatCard icon={Clock}       label="Gözləyən (AZN)"   value={(overview.pendingCommission    || 0).toFixed(2)} color={colors.red} />
        </div>
      )}

      {/* Filtr paneli */}
      <div style={{ ...card, display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
        <div style={{ flex: 1, minWidth: "220px" }}>
          <label style={labelStyle}>Axtarış</label>
          <div style={{ position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%",
              transform: "translateY(-50%)", color: "#aaa" }} />
            <input
              style={{ ...inputStyle, paddingLeft: "36px" }}
              placeholder="Ad, e-poçt, promo kod..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKey}
            />
          </div>
        </div>
        <div style={{ minWidth: "140px" }}>
          <label style={labelStyle}>Faiz</label>
          <select style={inputStyle} value={rateFilter}
            onChange={(e) => { setRateFilter(e.target.value); setPage(1); }}>
            <option value="">Hamısı</option>
            <option value="20">20%</option>
            <option value="30">30%</option>
            <option value="40">40%</option>
            <option value="41">41%</option>
          </select>
        </div>
        <div style={{ minWidth: "140px" }}>
          <label style={labelStyle}>Status</label>
          <select style={inputStyle} value={activeFilter}
            onChange={(e) => { setActiveFilter(e.target.value); setPage(1); }}>
            <option value="">Hamısı</option>
            <option value="true">Aktiv</option>
            <option value="false">Deaktiv</option>
          </select>
        </div>
        <button style={btnGray} onClick={() => { setPage(1); loadBloggers(search); }}>
          <RefreshCw size={15} /> Axtar
        </button>
      </div>

      {/* Cədvəl */}
      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#aaa" }}>Yüklənir...</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ background: "#f8f9fa" }}>
                  {["Ad Soyad", "E-poçt", "Promo Kod", "Faiz", "Status",
                    "Referral", "Qazanılan", "Gözləyən", "Əməliyyat"].map((h) => (
                    <th key={h} style={{ padding: "14px 16px", textAlign: "left",
                      fontWeight: "700", color: "#555", whiteSpace: "nowrap",
                      borderBottom: "1px solid #eee" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bloggerList.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: "32px", textAlign: "center", color: "#aaa" }}>
                      Blogger tapılmadı
                    </td>
                  </tr>
                ) : (
                  bloggerList.map((b) => (
                    <tr key={b._id} style={{ borderBottom: "1px solid #f0f0f0" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#fafafa"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "12px 16px", fontWeight: "600", color: colors.dark }}>
                        {b.firstName} {b.lastName}
                        {b.fatherName && <span style={{ color: "#aaa", fontWeight: "400" }}> ({b.fatherName})</span>}
                      </td>
                      <td style={{ padding: "12px 16px", color: "#555" }}>{b.email}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <code style={{ background: "#f0f0f0", padding: "3px 8px",
                          borderRadius: "6px", fontSize: "12px" }}>{b.promoCode}</code>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <RateBadge rate={b.commissionRate} />
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <ActiveBadge active={b.isActive} />
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>{b.totalReferrals || 0}</td>
                      <td style={{ padding: "12px 16px", color: colors.green, fontWeight: "600" }}>
                        {(b.totalCommissionEarned || 0).toFixed(2)}
                      </td>
                      <td style={{ padding: "12px 16px", color: colors.orange, fontWeight: "600" }}>
                        {(b.pendingCommission || 0).toFixed(2)}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button title="Redaktə" onClick={() => openEdit(b)}
                            style={{ ...btnPrimary, padding: "6px 10px", background: colors.blue }}>
                            <Edit2 size={13} />
                          </button>
                          <button title="Faiz dəyiş" onClick={() => handleRateChange(b)}
                            style={{ ...btnPrimary, padding: "6px 10px", background: colors.purple }}>
                            <RefreshCw size={13} />
                          </button>
                          <button title="Komissiya ödə" onClick={() => handlePay(b)}
                            style={{ ...btnGreen, padding: "6px 10px" }}>
                            <CreditCard size={13} />
                          </button>
                          <button title="Sil" onClick={() => handleDelete(b)}
                            style={{ ...btnDanger, padding: "6px 10px" }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: "16px", display: "flex", justifyContent: "center", gap: "8px" }}>
            <button style={{ ...btnGray, padding: "6px 14px" }}
              disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Əvvəl</button>
            <span style={{ padding: "6px 14px", fontWeight: "600" }}>{page} / {totalPages}</span>
            <button style={{ ...btnGray, padding: "6px 14px" }}
              disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Sonra →</button>
          </div>
        )}
      </div>

      {/* ── Yarat Modalı ─────────────────────────────────────────────────── */}
      {showCreate && (
        <Modal title="Yeni Blogger Yarat" onClose={() => setShowCreate(false)}>
          <form onSubmit={handleCreate}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              {[
                ["firstName",  "Ad *"],
                ["lastName",   "Soyad *"],
                ["fatherName", "Ata adı"],
                ["phone",      "Telefon"],
              ].map(([field, lbl]) => (
                <div key={field}>
                  <label style={labelStyle}>{lbl}</label>
                  <input style={inputStyle} value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: "14px" }}>
              <label style={labelStyle}>E-poçt *</label>
              <input style={inputStyle} type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div style={{ marginTop: "14px" }}>
              <label style={labelStyle}>Şifrə *</label>
              <input style={inputStyle} type="password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div style={{ marginTop: "14px" }}>
              <label style={labelStyle}>Komissiya Faizi</label>
              <select style={inputStyle} value={form.commissionRate}
                onChange={(e) => setForm({ ...form, commissionRate: Number(e.target.value) })}>
                <option value={20}>20%</option>
                <option value={30}>30%</option>
                <option value={40}>40%</option>
                <option value={41}>41%</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px", justifyContent: "flex-end" }}>
              <button type="button" style={btnGray} onClick={() => setShowCreate(false)}>Ləğv et</button>
              <button type="submit" style={btnPrimary} disabled={loading}>
                {loading ? "Yüklənir..." : <><Plus size={15} /> Yarat</>}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Redaktə Modalı ──────────────────────────────────────────────── */}
      {showEdit && editTarget && (
        <Modal title={`Redaktə — ${editTarget.firstName} ${editTarget.lastName}`}
          onClose={() => setShowEdit(false)}>
          <form onSubmit={handleEdit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              {[
                ["firstName",  "Ad"],
                ["lastName",   "Soyad"],
                ["fatherName", "Ata adı"],
                ["phone",      "Telefon"],
              ].map(([field, lbl]) => (
                <div key={field}>
                  <label style={labelStyle}>{lbl}</label>
                  <input style={inputStyle} value={editForm[field]}
                    onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: "14px" }}>
              <label style={labelStyle}>E-poçt</label>
              <input style={inputStyle} type="email" value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
            </div>
            <div style={{ marginTop: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
              <input type="checkbox" id="isActive" checked={editForm.isActive}
                onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })} />
              <label htmlFor="isActive" style={{ ...labelStyle, margin: 0 }}>Aktiv hesab</label>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px", justifyContent: "flex-end" }}>
              <button type="button" style={btnGray} onClick={() => setShowEdit(false)}>Ləğv et</button>
              <button type="submit" style={btnPrimary} disabled={loading}>
                {loading ? "Yüklənir..." : <><Edit2 size={15} /> Yenilə</>}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
