import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  superAdminLogout,
  fetchAllUsers, fetchUserById,
  fetchAllAdmins, fetchAdminById, createAdminBySA, updateAdminBySA, deleteAdminBySA, updateAdminStatus,
  fetchAllBloggers, fetchBloggerById, createBloggerBySA, updateBloggerBySA, deleteBloggerBySA,
  updateBloggerCommission, payBloggerCommission,
  blockAdminBySA, unblockAdminBySA, setAdminLimitBySA,
  blockUserBySA, unblockUserBySA, deleteUserBySA,
  toggleBloggerStatusBySA,
  fetchAllSuperAdmins,
  clearSAResult, clearSAError, clearSelected,
} from "../../slices/superAdminSlice"
import toast from "react-hot-toast"
import {
  Users, Store, Rss, LogOut, Search, ChevronLeft, ChevronRight,
  Plus, Edit2, Trash2, CheckCircle, XCircle, Eye, X,
  ShieldCheck, TrendingUp, RefreshCw, DollarSign, Mail, Phone,
  Ban, LockOpen, Package, Shield,
} from "lucide-react"

/* ── Design tokens ───────────────────────────────────────────────── */
const RED   = "#E8192C"
const DARK  = "#1a0003"
const LIGHT = "#fff5f5"

/* ── Small helpers ────────────────────────────────────────────────── */
const Badge = ({ status }) => {
  const map = {
    approved: { bg: "#d1fae5", color: "#065f46", label: "Təsdiqlənib" },
    pending:  { bg: "#fef3c7", color: "#92400e", label: "Gözləyir"    },
    active:   { bg: "#d1fae5", color: "#065f46", label: "Aktiv"       },
    inactive: { bg: "#fee2e2", color: "#991b1b", label: "Deaktiv"     },
  }
  const s = map[status] || { bg: "#f3f4f6", color: "#374151", label: status }
  return (
    <span style={{ background: s.bg, color: s.color, padding: "2px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700 }}>
      {s.label}
    </span>
  )
}

const Avatar = ({ name = "", size = 36 }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%", background: RED,
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontWeight: 700, fontSize: size * 0.38, flexShrink: 0,
  }}>{(name[0] || "?").toUpperCase()}</div>
)

/* ── Modal wrapper ────────────────────────────────────────────────── */
const Modal = ({ title, onClose, children }) => (
  <div style={{
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 9999,
    display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
  }} onClick={onClose}>
    <div style={{
      background: "#fff", borderRadius: 20, padding: "32px 28px", width: "100%",
      maxWidth: 520, maxHeight: "90vh", overflowY: "auto",
      boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
    }} onClick={e => e.stopPropagation()}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#111" }}>{title}</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#888" }}><X size={20} /></button>
      </div>
      {children}
    </div>
  </div>
)

/* ── Input ────────────────────────────────────────────────────────── */
const Inp = ({ label, ...props }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 5 }}>{label}</label>}
    <input style={{
      width: "100%", padding: "10px 14px", border: "1.5px solid #eee", borderRadius: 10,
      fontSize: "max(16px,13px)", outline: "none", boxSizing: "border-box", background: "#fafafa",
    }} {...props} />
  </div>
)

const Sel = ({ label, children, ...props }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 5 }}>{label}</label>}
    <select style={{
      width: "100%", padding: "10px 14px", border: "1.5px solid #eee", borderRadius: 10,
      fontSize: "max(16px,13px)", outline: "none", boxSizing: "border-box", background: "#fafafa",
    }} {...props}>{children}</select>
  </div>
)

/* ── Btn ──────────────────────────────────────────────────────────── */
const Btn = ({ variant = "primary", children, ...props }) => {
  const styles = {
    primary:   { background: RED,        color: "#fff", border: "none" },
    secondary: { background: "#f3f4f6",  color: "#374151", border: "none" },
    danger:    { background: "#dc2626",  color: "#fff", border: "none" },
    outline:   { background: "transparent", color: RED, border: `1.5px solid ${RED}` },
  }
  return (
    <button style={{
      padding: "9px 18px", borderRadius: 10, fontWeight: 700, fontSize: 13,
      cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
      transition: "opacity 0.15s", ...styles[variant],
    }} {...props}>{children}</button>
  )
}

/* ════════════════════════════════════════════════════════════════════
   SUPERADMIN DASHBOARD
════════════════════════════════════════════════════════════════════ */
export default function SuperAdminDashboard() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { isLoggedIn, adminInfo, users, totalUsers, admins, bloggers, totalBloggers,
          superAdmins, selectedUser, selectedAdmin, selectedBlogger, loading, error, actionResult }
    = useSelector(s => s.superAdmin)

  const [tab, setTab] = useState("users")   // users | admins | bloggers | superadmins
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const LIMIT = 15

  // Modal states
  const [detailModal,   setDetailModal]   = useState(null)   // "user"|"admin"|"blogger"
  const [createModal,   setCreateModal]   = useState(null)   // "admin"|"blogger"
  const [editModal,     setEditModal]     = useState(null)   // { type, item }
  const [commModal,     setCommModal]     = useState(null)   // blogger item
  const [payModal,      setPayModal]      = useState(null)   // blogger item
  const [statusModal,   setStatusModal]   = useState(null)   // admin item
  const [blockModal,    setBlockModal]    = useState(null)   // admin item (bloklamaq üçün)
  const [limitModal,    setLimitModal]    = useState(null)   // admin item (limit üçün)
  const [blockReason,   setBlockReason]   = useState("")
  const [limitValue,    setLimitValue]    = useState("")
  const [userBlockModal, setUserBlockModal] = useState(null)  // user item (bloklamaq üçün)
  const [userBlockReason, setUserBlockReason] = useState("")

  // Form states
  const [adminForm,   setAdminForm]   = useState({ name:"",email:"",password:"",storeName:"",storeAddress:"",phone:"",taxNumber:"",vonNumber:"" })
  const [bloggerForm, setBloggerForm] = useState({ firstName:"",lastName:"",fatherName:"",email:"",phone:"",password:"",commissionRate:40 })
  const [commRate,    setCommRate]    = useState(40)
  const [payAmount,   setPayAmount]   = useState("")
  const [newStatus,   setNewStatus]   = useState("approved")

  /* ── Auth guard ─────────────────────────────────────────────────── */
  useEffect(() => { if (!isLoggedIn) navigate("/superadmin/login", { replace: true }) }, [isLoggedIn, navigate])

  /* ── Load data on tab/search/page change ────────────────────────── */
  const load = useCallback(() => {
    if (tab === "users")       dispatch(fetchAllUsers({ page, limit: LIMIT, search }))
    if (tab === "admins")      dispatch(fetchAllAdmins())
    if (tab === "bloggers")    dispatch(fetchAllBloggers({ page, limit: LIMIT, search }))
    if (tab === "superadmins") dispatch(fetchAllSuperAdmins())
  }, [tab, page, search, dispatch])

  useEffect(() => { load() }, [load])

  /* ── Toast on action result ─────────────────────────────────────── */
  useEffect(() => {
    if (actionResult?.message) { toast.success(actionResult.message); dispatch(clearSAResult()); load() }
    if (error) { toast.error(error); dispatch(clearSAError()) }
  }, [actionResult, error, dispatch, load])

  /* ── Logout ─────────────────────────────────────────────────────── */
  const handleLogout = () => { dispatch(superAdminLogout()).then(() => navigate("/superadmin/login")) }

  /* ── View detail ────────────────────────────────────────────────── */
  const viewUser    = (id) => { dispatch(fetchUserById(id));    setDetailModal("user") }
  const viewAdmin   = (id) => { dispatch(fetchAdminById(id));   setDetailModal("admin") }
  const viewBlogger = (id) => { dispatch(fetchBloggerById(id)); setDetailModal("blogger") }

  /* ── Create Admin ───────────────────────────────────────────────── */
  const handleCreateAdmin = (e) => {
    e.preventDefault()
    dispatch(createAdminBySA({ ...adminForm, role: "admin" })).then(() => {
      setCreateModal(null)
      setAdminForm({ name:"",email:"",password:"",storeName:"",storeAddress:"",phone:"",taxNumber:"",vonNumber:"" })
    })
  }

  /* ── Create Blogger ─────────────────────────────────────────────── */
  const handleCreateBlogger = (e) => {
    e.preventDefault()
    dispatch(createBloggerBySA(bloggerForm)).then(() => {
      setCreateModal(null)
      setBloggerForm({ firstName:"",lastName:"",fatherName:"",email:"",phone:"",password:"",commissionRate:40 })
    })
  }

  /* ── Update Admin Status ────────────────────────────────────────── */
  const handleUpdateStatus = (e) => {
    e.preventDefault()
    dispatch(updateAdminStatus({ id: statusModal._id, status: newStatus }))
      .then(() => setStatusModal(null))
  }

  /* ── Update blogger commission ──────────────────────────────────── */
  const handleCommission = (e) => {
    e.preventDefault()
    dispatch(updateBloggerCommission({ id: commModal._id, commissionRate: Number(commRate) }))
      .then(() => setCommModal(null))
  }

  /* ── Pay commission ─────────────────────────────────────────────── */
  const handlePay = (e) => {
    e.preventDefault()
    dispatch(payBloggerCommission({ id: payModal._id, amount: Number(payAmount) }))
      .then(() => { setPayModal(null); setPayAmount("") })
  }

  /* ── Delete ─────────────────────────────────────────────────────── */
  const handleDeleteAdmin   = (id) => { if (window.confirm("Silmək istəyirsiniz?")) dispatch(deleteAdminBySA(id)) }
  const handleDeleteBlogger = (id) => { if (window.confirm("Silmək istəyirsiniz?")) dispatch(deleteBloggerBySA(id)) }
  const handleDeleteUser    = (id) => { if (window.confirm("Bu istifadəçini silmək istəyirsiniz?")) dispatch(deleteUserBySA(id)) }

  /* ── User Block / Unblock ────────────────────────────────────────── */
  const handleUserBlock = (e) => {
    e.preventDefault()
    if (!userBlockModal) return
    dispatch(blockUserBySA({ id: userBlockModal._id, reason: userBlockReason }))
      .then(() => { setUserBlockModal(null); setUserBlockReason("") })
  }
  const handleUserUnblock = (id) => {
    if (window.confirm("Bloku açmaq istəyirsiniz?")) dispatch(unblockUserBySA(id))
  }

  /* ── Blogger Status Toggle ───────────────────────────────────────── */
  const handleToggleBlogger = (id, isActive) => {
    const msg = isActive ? "Bu bloggeri deaktiv etmək istəyirsiniz?" : "Bu bloggeri aktivləşdirmək istəyirsiniz?"
    if (window.confirm(msg)) dispatch(toggleBloggerStatusBySA(id))
  }

  /* ── Block ──────────────────────────────────────────────────────── */
  const handleBlock = (e) => {
    e.preventDefault()
    if (!blockModal) return
    dispatch(blockAdminBySA({ id: blockModal._id, reason: blockReason }))
      .then(() => { setBlockModal(null); setBlockReason("") })
  }

  /* ── Unblock ────────────────────────────────────────────────────── */
  const handleUnblock = (id) => {
    if (window.confirm("Bloku açmaq istəyirsiniz?")) dispatch(unblockAdminBySA(id))
  }

  /* ── Product Limit ──────────────────────────────────────────────── */
  const handleLimit = (e) => {
    e.preventDefault()
    if (!limitModal) return
    dispatch(setAdminLimitBySA({ id: limitModal._id, limit: Number(limitValue) || 0 }))
      .then(() => { setLimitModal(null); setLimitValue("") })
  }

  /* ── Filtered admins (local) ────────────────────────────────────── */
  const filteredAdmins = admins.filter(a =>
    !search || a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.email?.toLowerCase().includes(search.toLowerCase())
  )

  /* ── Pages ──────────────────────────────────────────────────────── */
  const totalPages = tab === "users"    ? Math.ceil(totalUsers / LIMIT)
                   : tab === "bloggers" ? Math.ceil(totalBloggers / LIMIT)
                   : 1

  /* ─────────────────────── RENDER ──────────────────────────────── */
  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", fontFamily: "'Inter',sans-serif" }}>
      <style>{`.sa-root { --primary:#E8192C; --zinc950:#09090b; --zinc900:#18181b; --zinc800:#27272a; --zinc400:#a1a1aa; font-family:'Inter',sans-serif; }`}</style>

      {/* ── TOP NAV ── */}
      <header style={{
        background: DARK, color: "#fff", padding: "0 24px", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 2px 12px rgba(0,0,0,0.35)", position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ShieldCheck size={22} color={RED} />
          <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: -0.5 }}>
            Brend<span style={{ color: RED }}>ex</span> SuperAdmin
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{adminInfo?.name || "SuperAdmin"}</span>
          <button onClick={handleLogout} style={{
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff", borderRadius: 8, padding: "7px 14px", cursor: "pointer",
            fontSize: 13, display: "flex", alignItems: "center", gap: 6,
          }}><LogOut size={14} /> Çıxış</button>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>

        {/* ── STAT CARDS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
          {[
            { icon: <Users  size={22} color={RED} />, label: "İstifadəçilər", value: totalUsers,            tab: "users"       },
            { icon: <Store  size={22} color={RED} />, label: "Satıcılar",      value: admins.length,         tab: "admins"      },
            { icon: <Rss    size={22} color={RED} />, label: "Bloggerlər",     value: totalBloggers,         tab: "bloggers"    },
            { icon: <Shield size={22} color={RED} />, label: "SuperAdminlər",  value: (superAdmins || []).length, tab: "superadmins" },
          ].map(c => (
            <div key={c.tab} onClick={() => { setTab(c.tab); setSearch(""); setPage(1) }}
              style={{
                background: "#fff", borderRadius: 16, padding: "20px 24px",
                border: `2px solid ${tab === c.tab ? RED : "transparent"}`,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 14,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                transition: "border-color 0.2s",
              }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: LIGHT, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {c.icon}
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#111" }}>{c.value ?? "—"}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{c.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── TAB TOOLBAR ── */}
        <div style={{
          background: "#fff", borderRadius: 16, padding: "16px 20px", marginBottom: 20,
          display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}>
          <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
            <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#bbb" }} />
            <input placeholder="Axtar..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              style={{ width: "100%", padding: "9px 9px 9px 36px", border: "1.5px solid #eee", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
          <button onClick={load} style={{ background: "#f3f4f6", border: "none", borderRadius: 10, padding: "9px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600 }}>
            <RefreshCw size={14} /> Yenilə
          </button>
          {tab === "admins" && (
            <Btn onClick={() => setCreateModal("admin")}><Plus size={14} /> Satıcı əlavə et</Btn>
          )}
          {tab === "bloggers" && (
            <Btn onClick={() => setCreateModal("blogger")}><Plus size={14} /> Blogger əlavə et</Btn>
          )}
        </div>

        {/* ── TABLE ── */}
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: 60, textAlign: "center", color: "#bbb" }}>Yüklənir...</div>
          ) : (

            /* ── USERS TABLE ── */
            tab === "users" ? (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8f9fa", fontSize: 12, color: "#888" }}>
                    {["İstifadəçi", "E-poçt", "Bonus", "Telefon", "Qeydiyyat", "Status", "Əməliyyatlar"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#bbb" }}>İstifadəçi tapılmadı</td></tr>
                  ) : users.map(u => (
                    <tr key={u._id} style={{ borderTop: "1px solid #f0f0f0", background: u.isBlocked ? "#fff5f5" : "transparent" }}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Avatar name={u.name} size={32} />
                          <div>
                            <span style={{ fontWeight: 600, fontSize: 13, color: "#111" }}>{u.name}</span>
                            {u.isBlocked && <div style={{ fontSize: 10, color: "#dc2626", fontWeight: 700, marginTop: 1 }}>🔒 BLOKLU</div>}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "#555" }}>{u.email}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: RED }}>{(u.bonusBalance || 0).toFixed(1)} B</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "#888" }}>{u.phone || "—"}</td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: "#aaa" }}>{new Date(u.createdAt).toLocaleDateString("az-AZ")}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <Badge status={u.isBlocked ? "inactive" : "active"} />
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", gap: 5 }}>
                          <button onClick={() => viewUser(u._id)} title="Ətraflı bax"
                            style={{ background: LIGHT, border: "none", borderRadius: 7, padding: "6px 9px", cursor: "pointer", color: RED }}>
                            <Eye size={13} />
                          </button>
                          {u.isBlocked ? (
                            <button onClick={() => handleUserUnblock(u._id)} title="Bloku aç"
                              style={{ background: "#f0fdf4", border: "none", borderRadius: 7, padding: "6px 9px", cursor: "pointer", color: "#16a34a" }}>
                              <LockOpen size={13} />
                            </button>
                          ) : (
                            <button onClick={() => { setUserBlockModal(u); setUserBlockReason("") }} title="Blokla"
                              style={{ background: "#fff7ed", border: "none", borderRadius: 7, padding: "6px 9px", cursor: "pointer", color: "#ea580c" }}>
                              <Ban size={13} />
                            </button>
                          )}
                          <button onClick={() => handleDeleteUser(u._id)} title="Sil"
                            style={{ background: "#fef2f2", border: "none", borderRadius: 7, padding: "6px 9px", cursor: "pointer", color: "#dc2626" }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            /* ── ADMINS TABLE ── */
            ) : tab === "admins" ? (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8f9fa", fontSize: 12, color: "#888" }}>
                    {["Satıcı", "E-poçt", "Mağaza", "Status", "Əməliyyatlar"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.length === 0 ? (
                    <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#bbb" }}>Satıcı tapılmadı</td></tr>
                  ) : filteredAdmins.map(a => (
                    <tr key={a._id} style={{
                      borderTop: "1px solid #f0f0f0",
                      background: a.isBlocked ? "#fff5f5" : "transparent",
                    }}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Avatar name={a.name} size={32} />
                          <div>
                            <span style={{ fontWeight: 600, fontSize: 13, color: "#111" }}>{a.name}</span>
                            {a.isBlocked && (
                              <div style={{ fontSize: 10, color: "#dc2626", fontWeight: 700, marginTop: 2 }}>
                                🔒 BLOKLU
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "#555" }}>{a.email}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "#555" }}>
                        {a.sellerInfo?.storeName || "—"}
                        {a.productLimit > 0 && (
                          <div style={{ fontSize: 10, color: "#f59e0b", fontWeight: 700, marginTop: 2 }}>
                            📦 Limit: {a.productLimit}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "12px 16px" }}><Badge status={a.sellerStatus} /></td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          <button onClick={() => viewAdmin(a._id)} title="Bax"
                            style={{ background: LIGHT, border: "none", borderRadius: 7, padding: "6px 10px", cursor: "pointer", color: RED }}>
                            <Eye size={13} />
                          </button>
                          <button onClick={() => { setStatusModal(a); setNewStatus(a.sellerStatus === "approved" ? "pending" : "approved") }} title="Status dəyişdir"
                            style={{ background: "#f0fdf4", border: "none", borderRadius: 7, padding: "6px 10px", cursor: "pointer", color: "#16a34a" }}>
                            <CheckCircle size={13} />
                          </button>
                          {a.isBlocked ? (
                            <button onClick={() => handleUnblock(a._id)} title="Bloku aç"
                              style={{ background: "#f0fdf4", border: "none", borderRadius: 7, padding: "6px 10px", cursor: "pointer", color: "#16a34a" }}>
                              <LockOpen size={13} />
                            </button>
                          ) : (
                            <button onClick={() => { setBlockModal(a); setBlockReason("") }} title="Blokla"
                              style={{ background: "#fff7ed", border: "none", borderRadius: 7, padding: "6px 10px", cursor: "pointer", color: "#ea580c" }}>
                              <Ban size={13} />
                            </button>
                          )}
                          <button onClick={() => { setLimitModal(a); setLimitValue(a.productLimit || "") }} title="Məhsul limiti"
                            style={{ background: "#fefce8", border: "none", borderRadius: 7, padding: "6px 10px", cursor: "pointer", color: "#ca8a04" }}>
                            <Package size={13} />
                          </button>
                          <button onClick={() => handleDeleteAdmin(a._id)} title="Sil"
                            style={{ background: "#fef2f2", border: "none", borderRadius: 7, padding: "6px 10px", cursor: "pointer", color: "#dc2626" }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            /* ── SUPERADMINS TABLE ── */
            ) : tab === "superadmins" ? (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8f9fa", fontSize: 12, color: "#888" }}>
                    {["SuperAdmin", "E-poçt", "Qeydiyyat Tarixi"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(superAdmins || []).length === 0 ? (
                    <tr><td colSpan={3} style={{ padding: 40, textAlign: "center", color: "#bbb" }}>SuperAdmin tapılmadı</td></tr>
                  ) : (superAdmins || []).map(sa => (
                    <tr key={sa._id} style={{ borderTop: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: DARK, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>
                            {(sa.name?.[0] || "S").toUpperCase()}
                          </div>
                          <div>
                            <span style={{ fontWeight: 600, fontSize: 13, color: "#111" }}>{sa.name}</span>
                            {sa._id === adminInfo?._id && (
                              <div style={{ fontSize: 10, color: RED, fontWeight: 700 }}>Siz</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "#555" }}>{sa.email}</td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: "#aaa" }}>{new Date(sa.createdAt).toLocaleDateString("az-AZ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

            /* ── BLOGGERS TABLE ── */
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8f9fa", fontSize: 12, color: "#888" }}>
                    {["Blogger", "E-poçt", "Promo Kod", "Komissiya", "Ümumi Satış", "Status", "Əməliyyatlar"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bloggers.length === 0 ? (
                    <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#bbb" }}>Blogger tapılmadı</td></tr>
                  ) : bloggers.map(b => (
                    <tr key={b._id} style={{ borderTop: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Avatar name={b.firstName} size={32} />
                          <span style={{ fontWeight: 600, fontSize: 13, color: "#111" }}>{b.firstName} {b.lastName}</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "#555" }}>{b.email}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <code style={{ background: "#f3f4f6", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{b.promoCode}</code>
                      </td>
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: RED }}>{b.commissionRate}%</td>
                      <td style={{ padding: "12px 16px", fontSize: 13 }}>{(b.totalSalesAmount || 0).toFixed(2)} ₼</td>
                      <td style={{ padding: "12px 16px" }}><Badge status={b.isActive ? "active" : "inactive"} /></td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", gap: 5 }}>
                          <button onClick={() => viewBlogger(b._id)} title="Bax" style={{ background: LIGHT, border: "none", borderRadius: 7, padding: "6px 9px", cursor: "pointer", color: RED }}><Eye size={13} /></button>
                          <button onClick={() => { setCommModal(b); setCommRate(b.commissionRate) }} title="Komissiya"
                            style={{ background: "#f0fdf4", border: "none", borderRadius: 7, padding: "6px 9px", cursor: "pointer", color: "#16a34a" }}><TrendingUp size={13} /></button>
                          <button onClick={() => setPayModal(b)} title="Ödə"
                            style={{ background: "#eff6ff", border: "none", borderRadius: 7, padding: "6px 9px", cursor: "pointer", color: "#2563eb" }}><DollarSign size={13} /></button>
                          <button onClick={() => handleToggleBlogger(b._id, b.isActive)} title={b.isActive ? "Deaktiv et" : "Aktivləşdir"}
                            style={{ background: b.isActive ? "#fff7ed" : "#f0fdf4", border: "none", borderRadius: 7, padding: "6px 9px", cursor: "pointer", color: b.isActive ? "#ea580c" : "#16a34a" }}>
                            {b.isActive ? <Ban size={13} /> : <CheckCircle size={13} />}
                          </button>
                          <button onClick={() => handleDeleteBlogger(b._id)} title="Sil"
                            style={{ background: "#fef2f2", border: "none", borderRadius: 7, padding: "6px 9px", cursor: "pointer", color: "#dc2626" }}><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}

          {/* ── PAGINATION ── */}
          {totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px 0", borderTop: "1px solid #f0f0f0" }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={{ background: "none", border: "1px solid #eee", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "#555" }}>
                <ChevronLeft size={15} />
              </button>
              <span style={{ fontSize: 13, color: "#555" }}>Səhifə {page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                style={{ background: "none", border: "1px solid #eee", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "#555" }}>
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════ MODALS ═══════════════ */}

      {/* ── USER DETAIL ── */}
      {detailModal === "user" && selectedUser && (
        <Modal title="İstifadəçi Məlumatları" onClose={() => { setDetailModal(null); dispatch(clearSelected()) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
            <Avatar name={selectedUser.name} size={52} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 17 }}>{selectedUser.name}</div>
              <div style={{ fontSize: 13, color: "#888" }}>{selectedUser.email}</div>
            </div>
          </div>
          {[
            ["Telefon",          selectedUser.phone || "—"],
            ["Bonus Balansı",    `${(selectedUser.bonusBalance || 0).toFixed(2)} bonus`],
            ["Referral Kodu",    selectedUser.referralCode || "—"],
            ["Qeydiyyat",        new Date(selectedUser.createdAt).toLocaleString("az-AZ")],
            ["Telefon Doğrulama", selectedUser.isPhoneVerified ? "✅ Doğrulanıb" : "❌ Doğrulanmayıb"],
            ["Blok Statusu",     selectedUser.isBlocked ? `🔒 Bloklu — ${selectedUser.blockReason || "Səbəb göstərilməyib"}` : "✅ Aktiv"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f0f0f0", fontSize: 13 }}>
              <span style={{ color: "#888", fontWeight: 600 }}>{k}</span>
              <span style={{ color: "#111", fontWeight: 700 }}>{v}</span>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            {selectedUser.isBlocked ? (
              <Btn variant="outline" style={{ flex: 1 }} onClick={() => { handleUserUnblock(selectedUser._id); setDetailModal(null) }}>
                <LockOpen size={13} /> Bloku Aç
              </Btn>
            ) : (
              <Btn variant="outline" style={{ flex: 1 }} onClick={() => { setUserBlockModal(selectedUser); setUserBlockReason(""); setDetailModal(null) }}>
                <Ban size={13} /> Blokla
              </Btn>
            )}
            <Btn variant="danger" style={{ flex: 1 }} onClick={() => { handleDeleteUser(selectedUser._id); setDetailModal(null) }}>
              <Trash2 size={13} /> Sil
            </Btn>
          </div>
        </Modal>
      )}

      {/* ── ADMIN DETAIL ── */}
      {detailModal === "admin" && selectedAdmin && (
        <Modal title="Satıcı Məlumatları" onClose={() => { setDetailModal(null); dispatch(clearSelected()) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
            <Avatar name={selectedAdmin.name} size={52} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 17 }}>{selectedAdmin.name}</div>
              <div style={{ fontSize: 13, color: "#888" }}>{selectedAdmin.email}</div>
              <Badge status={selectedAdmin.sellerStatus} />
            </div>
          </div>
          {[
            ["Mağaza Adı",    selectedAdmin.sellerInfo?.storeName   || "—"],
            ["Mağaza Ünvanı", selectedAdmin.sellerInfo?.storeAddress || "—"],
            ["Telefon",       selectedAdmin.sellerInfo?.phone        || "—"],
            ["VÖEN",          selectedAdmin.sellerInfo?.taxNumber    || "—"],
            ["Qeydiyyat",     new Date(selectedAdmin.createdAt).toLocaleString("az-AZ")],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f0f0f0", fontSize: 13 }}>
              <span style={{ color: "#888", fontWeight: 600 }}>{k}</span>
              <span style={{ color: "#111", fontWeight: 700 }}>{v}</span>
            </div>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <Btn variant="outline" style={{ flex: 1 }}
              onClick={() => { setStatusModal(selectedAdmin); setNewStatus(selectedAdmin.sellerStatus === "approved" ? "pending" : "approved"); setDetailModal(null) }}>
              <CheckCircle size={14} /> Status dəyiş
            </Btn>
            <Btn variant="danger" style={{ flex: 1 }} onClick={() => { handleDeleteAdmin(selectedAdmin._id); setDetailModal(null) }}>
              <Trash2 size={14} /> Sil
            </Btn>
          </div>
        </Modal>
      )}

      {/* ── BLOGGER DETAIL ── */}
      {detailModal === "blogger" && selectedBlogger && (
        <Modal title="Blogger Məlumatları" onClose={() => { setDetailModal(null); dispatch(clearSelected()) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
            <Avatar name={selectedBlogger.firstName} size={52} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 17 }}>{selectedBlogger.firstName} {selectedBlogger.lastName}</div>
              <div style={{ fontSize: 13, color: "#888" }}>{selectedBlogger.email}</div>
              <Badge status={selectedBlogger.isActive ? "active" : "inactive"} />
            </div>
          </div>
          {[
            ["Promo Kod",     selectedBlogger.promoCode],
            ["Komissiya",     `${selectedBlogger.commissionRate}%`],
            ["Ümumi Satış",   `${(selectedBlogger.totalSalesAmount || 0).toFixed(2)} ₼`],
            ["Qazanılan",     `${(selectedBlogger.totalCommissionEarned || 0).toFixed(2)} ₼`],
            ["Ödənilən",      `${(selectedBlogger.totalCommissionPaid || 0).toFixed(2)} ₼`],
            ["Referallar",    selectedBlogger.totalReferrals || 0],
            ["Telefon",       selectedBlogger.phone || "—"],
            ["Qeydiyyat",     new Date(selectedBlogger.createdAt).toLocaleString("az-AZ")],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f0f0f0", fontSize: 13 }}>
              <span style={{ color: "#888", fontWeight: 600 }}>{k}</span>
              <span style={{ color: "#111", fontWeight: 700 }}>{v}</span>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            <Btn variant="outline" onClick={() => { setCommModal(selectedBlogger); setCommRate(selectedBlogger.commissionRate); setDetailModal(null) }}><TrendingUp size={13} /> Komissiya</Btn>
            <Btn onClick={() => { setPayModal(selectedBlogger); setDetailModal(null) }}><DollarSign size={13} /> Ödə</Btn>
            <Btn variant="danger" onClick={() => { handleDeleteBlogger(selectedBlogger._id); setDetailModal(null) }}><Trash2 size={13} /> Sil</Btn>
          </div>
        </Modal>
      )}

      {/* ── USER BLOCK MODAL ── */}
      {userBlockModal && (
        <Modal title={`${userBlockModal.name} — Blokla`} onClose={() => setUserBlockModal(null)}>
          <form onSubmit={handleUserBlock}>
            <Inp
              label="Blok səbəbi"
              placeholder="Məsələn: Qaydaları pozub, spam göndərib..."
              value={userBlockReason}
              onChange={e => setUserBlockReason(e.target.value)}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <Btn type="submit" variant="danger" style={{ flex: 1 }} disabled={loading}>
                <Ban size={14} /> Blokla
              </Btn>
              <Btn type="button" variant="secondary" style={{ flex: 1 }} onClick={() => setUserBlockModal(null)}>Ləğv et</Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* ── CREATE ADMIN ── */}
      {createModal === "admin" && (
        <Modal title="Yeni Satıcı Yarat" onClose={() => setCreateModal(null)}>
          <form onSubmit={handleCreateAdmin}>
            <Inp label="Ad" required placeholder="Ad Soyad" value={adminForm.name} onChange={e => setAdminForm(p => ({...p, name: e.target.value}))} />
            <Inp label="E-poçt" type="email" required placeholder="email@..." value={adminForm.email} onChange={e => setAdminForm(p => ({...p, email: e.target.value}))} />
            <Inp label="Şifrə" type="password" required placeholder="••••••••" value={adminForm.password} onChange={e => setAdminForm(p => ({...p, password: e.target.value}))} />
            <Inp label="Mağaza Adı" required value={adminForm.storeName} onChange={e => setAdminForm(p => ({...p, storeName: e.target.value}))} />
            <Inp label="Mağaza Ünvanı" required value={adminForm.storeAddress} onChange={e => setAdminForm(p => ({...p, storeAddress: e.target.value}))} />
            <Inp label="Telefon" type="tel" required value={adminForm.phone} onChange={e => setAdminForm(p => ({...p, phone: e.target.value}))} />
            <Inp label="VÖEN" required value={adminForm.taxNumber} onChange={e => setAdminForm(p => ({...p, taxNumber: e.target.value}))} />
            <Inp label="VÖN" required value={adminForm.vonNumber} onChange={e => setAdminForm(p => ({...p, vonNumber: e.target.value}))} />
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <Btn type="submit" style={{ flex: 1 }} disabled={loading}>Yarat</Btn>
              <Btn variant="secondary" type="button" onClick={() => setCreateModal(null)} style={{ flex: 1 }}>İmtina</Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* ── CREATE BLOGGER ── */}
      {createModal === "blogger" && (
        <Modal title="Yeni Blogger Yarat" onClose={() => setCreateModal(null)}>
          <form onSubmit={handleCreateBlogger}>
            <Inp label="Ad" required value={bloggerForm.firstName} onChange={e => setBloggerForm(p => ({...p, firstName: e.target.value}))} />
            <Inp label="Soyad" required value={bloggerForm.lastName} onChange={e => setBloggerForm(p => ({...p, lastName: e.target.value}))} />
            <Inp label="Ata adı" value={bloggerForm.fatherName} onChange={e => setBloggerForm(p => ({...p, fatherName: e.target.value}))} />
            <Inp label="E-poçt" type="email" required value={bloggerForm.email} onChange={e => setBloggerForm(p => ({...p, email: e.target.value}))} />
            <Inp label="Telefon" type="tel" value={bloggerForm.phone} onChange={e => setBloggerForm(p => ({...p, phone: e.target.value}))} />
            <Inp label="Şifrə" type="password" required value={bloggerForm.password} onChange={e => setBloggerForm(p => ({...p, password: e.target.value}))} />
            <Sel label="Komissiya Dərəcəsi" value={bloggerForm.commissionRate} onChange={e => setBloggerForm(p => ({...p, commissionRate: Number(e.target.value)}))}>
              {[20, 30, 40, 41].map(r => <option key={r} value={r}>{r}%</option>)}
            </Sel>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <Btn type="submit" style={{ flex: 1 }} disabled={loading}>Yarat</Btn>
              <Btn variant="secondary" type="button" onClick={() => setCreateModal(null)} style={{ flex: 1 }}>İmtina</Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* ── ADMIN STATUS ── */}
      {statusModal && (
        <Modal title="Admin Statusunu Dəyiş" onClose={() => setStatusModal(null)}>
          <form onSubmit={handleUpdateStatus}>
            <p style={{ fontSize: 14, color: "#555", marginBottom: 16 }}>
              <strong>{statusModal.name}</strong> üçün status seçin:
            </p>
            <Sel value={newStatus} onChange={e => setNewStatus(e.target.value)}>
              <option value="approved">Təsdiqlənib</option>
              <option value="pending">Gözləyir</option>
            </Sel>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <Btn type="submit" style={{ flex: 1 }} disabled={loading}>Yadda saxla</Btn>
              <Btn variant="secondary" type="button" onClick={() => setStatusModal(null)} style={{ flex: 1 }}>İmtina</Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* ── BLOGGER COMMISSION ── */}
      {commModal && (
        <Modal title="Komissiya Dərəcəsini Dəyiş" onClose={() => setCommModal(null)}>
          <form onSubmit={handleCommission}>
            <p style={{ fontSize: 14, color: "#555", marginBottom: 16 }}>
              <strong>{commModal.firstName} {commModal.lastName}</strong> üçün:
            </p>
            <Sel label="Yeni Komissiya %" value={commRate} onChange={e => setCommRate(e.target.value)}>
              {[20, 30, 40, 41].map(r => <option key={r} value={r}>{r}%</option>)}
            </Sel>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <Btn type="submit" style={{ flex: 1 }} disabled={loading}>Yadda saxla</Btn>
              <Btn variant="secondary" type="button" onClick={() => setCommModal(null)} style={{ flex: 1 }}>İmtina</Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* ── PAY COMMISSION ── */}
      {payModal && (
        <Modal title="Komissiya Ödə" onClose={() => setPayModal(null)}>
          <form onSubmit={handlePay}>
            <p style={{ fontSize: 14, color: "#555", marginBottom: 16 }}>
              <strong>{payModal.firstName}</strong> — Gözləyən: <strong style={{ color: RED }}>
                {((payModal.totalCommissionEarned || 0) - (payModal.totalCommissionPaid || 0)).toFixed(2)} ₼
              </strong>
            </p>
            <Inp label="Ödəniş Məbləği (₼)" type="number" min="0" step="0.01" required
              value={payAmount} onChange={e => setPayAmount(e.target.value)} />
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <Btn type="submit" style={{ flex: 1 }} disabled={loading}>Ödə</Btn>
              <Btn variant="secondary" type="button" onClick={() => setPayModal(null)} style={{ flex: 1 }}>İmtina</Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* ── ADMIN BLOKLA ── */}
      {blockModal && (
        <Modal title="Admini Blokla" onClose={() => setBlockModal(null)}>
          <form onSubmit={handleBlock}>
            <p style={{ fontSize: 14, color: "#555", marginBottom: 16 }}>
              <strong style={{ color: "#dc2626" }}>{blockModal.name}</strong> ({blockModal.sellerInfo?.storeName}) bloklanacaq.
              Bu admin giriş edə bilməyəcək.
            </p>
            <Inp
              label="Blok səbəbi (isteğe bağlı)"
              type="text"
              placeholder="Məsələn: Qayda pozuntusu"
              value={blockReason}
              onChange={e => setBlockReason(e.target.value)}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <Btn variant="danger" type="submit" style={{ flex: 1 }} disabled={loading}>
                <Ban size={14} /> Blokla
              </Btn>
              <Btn variant="secondary" type="button" onClick={() => setBlockModal(null)} style={{ flex: 1 }}>İmtina</Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* ── MƏHSUL LİMİTİ ── */}
      {limitModal && (
        <Modal title="Məhsul Limiti Qoymaq" onClose={() => setLimitModal(null)}>
          <form onSubmit={handleLimit}>
            <p style={{ fontSize: 14, color: "#555", marginBottom: 16 }}>
              <strong>{limitModal.name}</strong> ({limitModal.sellerInfo?.storeName}) üçün məhsul limiti.
              <br />
              <span style={{ fontSize: 12, color: "#aaa" }}>0 daxil etsəniz limit ləğv edilər.</span>
            </p>
            <Inp
              label="Maksimum məhsul sayı"
              type="number"
              min="0"
              step="1"
              placeholder="0 = limit yoxdur"
              value={limitValue}
              onChange={e => setLimitValue(e.target.value)}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <Btn type="submit" style={{ flex: 1 }} disabled={loading}>
                <Package size={14} /> Limiti Təyin Et
              </Btn>
              <Btn variant="secondary" type="button" onClick={() => setLimitModal(null)} style={{ flex: 1 }}>İmtina</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
