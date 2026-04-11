import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchMyBonus, fetchReferral, fetchBonusConfig, redeemBonus, cancelRedeem, clearBonusResult, clearBonusError } from "../slices/bonusSlice"
import toast from "react-hot-toast"
import { Gift, Copy, TrendingUp, Clock, CheckCircle, XCircle, Star, Users, Zap, X, ShoppingCart, MessageSquare, UserPlus, ChevronRight, ArrowUpRight, Info } from "lucide-react"

const R   = "#E8192C"
const R2  = "#b8001e"
const R_S = "#fff5f5"

// ── Bonus tipi modalı üçün detallar ─────────────────────────────────
const getBonusDetail = (key, cfg) => {
  const c = cfg || {}
  const step    = c.cartStepAzn        || 25
  const base    = c.cartBaseBonus      || 1
  const review  = c.reviewBonusAmount  || 1
  const ref     = c.referralBonusAmount || 1
  const maxPct  = c.maxRedemptionPercent || 10

  const details = {
    cart: {
      icon:  <ShoppingCart size={32} color={R} />,
      emoji: "🛒",
      title: "Alış-veriş Bonusu",
      color: R,
      bg:    R_S,
      steps: [
        { label: "Necə qazanılır?", text: `Hər ${step}₼ alışdan ${base} bonus coin qazanırsınız.` },
        { label: "Nümunə", text: `50₼ alış etdikdə → ${Math.floor(50 / step) * base} bonus coin` },
        { label: "100₼ alış", text: `→ ${Math.floor(100 / step) * base} bonus coin` },
        { label: "Maksimum istifadə", text: `Bonus coinlər sifarişin ${maxPct}%-nə qədər tətbiq edilə bilər.` },
        { label: "Kampaniya", text: c.campaignActive ? `"${c.campaignName}" kampaniyası aktiv — ${c.campaignMultiplier}x çarpan!` : "Hazırda aktiv kampaniya yoxdur." },
      ],
    },
    review: {
      icon:  <MessageSquare size={32} color="#7c3aed" />,
      emoji: "⭐",
      title: "Rəy Bonusu",
      color: "#7c3aed",
      bg:    "#f5f3ff",
      steps: [
        { label: "Necə qazanılır?", text: `Satın aldığınız məhsul haqqında rəy yazdıqda ${review} bonus coin qazanırsınız.` },
        { label: "Şərt", text: "Rəy yazmaq üçün həmin məhsulu almış olmalısınız." },
        { label: "Məhdudiyyət", text: "Hər məhsul üçün 1 rəy → 1 bonus coin." },
        { label: "Niyə rəy?", text: "Rəylər digər alıcıların düzgün seçim etməsinə kömək edir." },
        { label: "Fayda", text: "Nə qədər çox rəy yazsanız, bir o qədər çox bonus toplayırsınız." },
      ],
    },
    referral: {
      icon:  <UserPlus size={32} color="#059669" />,
      emoji: "👥",
      title: "Referral Bonusu",
      color: "#059669",
      bg:    "#f0fdf4",
      steps: [
        { label: "Necə qazanılır?", text: `Dostunuz referral linkinizlə qeydiyyat keçdikdə hər ikiniz ${ref} bonus coin qazanırsınız.` },
        { label: "Şərt", text: "Dostunuz ilk alışını tamamlamalıdır." },
        { label: "Limit", text: "Sonsuz sayda dost dəvət edə bilərsiniz — hər dəfə bonus alırsınız." },
        { label: "Link paylaşın", text: "Sosial mediada, mesajlaşmada — istədiyiniz yerdə paylaşın." },
        { label: "İzləyin", text: "Neçə nəfər qeydiyyat keçdiyini \"Referallar\" bölməsindən izləyin." },
      ],
    },
  }
  return details[key] || null
}

// ── Modal komponenti ─────────────────────────────────────────────────
const BonusModal = ({ bonusKey, cfg, onClose }) => {
  const detail = getBonusDetail(bonusKey, cfg)
  if (!detail) return null
  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(4px)", zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        animation: "mFd .18s ease",
      }}
    >
      <style>{`@keyframes mFd { from { opacity:0; transform:scale(.94) } to { opacity:1; transform:scale(1) } }`}</style>
      <div style={{
        background: "#fff", borderRadius: 24, padding: "32px 28px",
        maxWidth: 480, width: "100%", position: "relative",
        boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
        border: `2px solid ${detail.bg}`,
      }}>
        {/* Kapat düyməsi */}
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "#f5f5f5", border: "none", borderRadius: "50%", width: 34, height: 34, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <X size={16} color="#555" />
        </button>

        {/* Başlıq */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: detail.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {detail.icon}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111" }}>{detail.title}</h2>
            <p style={{ margin: "3px 0 0", fontSize: 13, color: "#888" }}>Ətraflı məlumat</p>
          </div>
        </div>

        {/* Məzmun */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {detail.steps.map((s, i) => (
            <div key={i} style={{ background: detail.bg, borderRadius: 12, padding: "12px 16px", borderLeft: `4px solid ${detail.color}` }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: detail.color, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontSize: 13, color: "#333", lineHeight: 1.55 }}>{s.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function MyBonus() {
  const dispatch = useDispatch()
  const { myBonus, referral, config, loading, error, actionResult } = useSelector(s => s.bonus)
  const [redeemAmt, setRedeemAmt] = useState("")
  const [activeBonus, setActiveBonus] = useState(null)

  useEffect(() => {
    dispatch(fetchMyBonus())
    dispatch(fetchReferral())
    dispatch(fetchBonusConfig())
  }, [dispatch])

  useEffect(() => {
    if (actionResult?.message) { toast.success(actionResult.message); dispatch(clearBonusResult()); dispatch(fetchMyBonus()) }
    if (error) { toast.error(error); dispatch(clearBonusError()) }
  }, [actionResult, error, dispatch])

  const handleRedeem = (e) => {
    e.preventDefault()
    if (!redeemAmt || Number(redeemAmt) <= 0) { toast.error("Məbləği daxil edin"); return }
    dispatch(redeemBonus(Number(redeemAmt)))
    setRedeemAmt("")
  }

  const copyRef = async () => {
    const link = referralData?.referralLink || referralData?.referralCode || ""
    if (!link) { toast.error("Referral linki tapılmadı!"); return }
    try { await navigator.clipboard.writeText(link); toast.success("Kopyalandı!") }
    catch { toast.error("Link kopyalanmadı!") }
  }

  const referralData = referral?.referral || referral
  const configData   = config?.config || config
  const balance      = myBonus?.balance ?? 0
  const pending      = myBonus?.pendingRedemption ?? 0
  const txs          = myBonus?.transactions ?? []
  const maxRedeem    = configData ? Math.floor(balance * (configData.maxRedemptionPercent / 100) * 100) / 100 : 0

  const typeIcon  = { earn: "⬆️", use: "⬇️", expire: "⏰" }
  const typeColor = { earn: "#16a34a", use: R, expire: "#d97706" }
  const srcLabel  = { cart: "Alış-veriş", referral: "Referral", review: "Rəy", admin: "Admin", use: "İstifadə", expire: "Vaxtı bitdi" }

  const bonusTypes = [
    { key: "cart",     emoji: "🛒", title: "Alış-veriş",    desc: configData ? `Hər ${configData.cartStepAzn}₼ alışdan ${configData.cartBaseBonus} bonus` : "Alış edərək bonus qazanın", color: R,        bg: R_S },
    { key: "review",   emoji: "⭐", title: "Rəy Yaz",        desc: configData ? `Məhsul rəyindən ${configData.reviewBonusAmount} bonus` : "Rəy yazaraq bonus qazanın",           color: "#7c3aed", bg: "#f5f3ff" },
    { key: "referral", emoji: "👥", title: "Dost Dəvət Et", desc: configData ? `Hər referaldan ${configData.referralBonusAmount} bonus` : "Dost dəvət edərək bonus qazanın",     color: "#059669", bg: "#f0fdf4" },
  ]

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", fontFamily: "'DM Sans', 'Inter', sans-serif" }}>

      {/* ── HERO BANNER ── */}
      <div style={{ background: `linear-gradient(135deg, ${R} 0%, ${R2} 100%)`, padding: "48px 24px 64px", position: "relative", overflow: "hidden" }}>
        {/* Dekorativ dairələr */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -20, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Gift size={26} color="#fff" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: "#fff", fontFamily: "'Syne', sans-serif" }}>Bonus Hesabım</h1>
              <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.75)" }}>Bonuslarınızı toplayın, alışlarınızda qənaət edin</p>
            </div>
          </div>

          {/* Balans kartı */}
          <div style={{ marginTop: 24, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", borderRadius: 20, padding: "24px 28px", border: "1.5px solid rgba(255,255,255,0.2)", display: "inline-block", minWidth: 240 }}>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>Mövcud Balans</p>
            <p style={{ margin: "4px 0 0", fontSize: 42, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{balance.toFixed(2)} <span style={{ fontSize: 20 }}>B</span></p>
            {pending > 0 && <p style={{ margin: "8px 0 0", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>⏳ {pending.toFixed(2)} B gözləmədə</p>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "-28px auto 0", padding: "0 24px 48px", position: "relative", zIndex: 2 }}>

        {/* ── STAT KUTUCUQLARI ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 24 }}>
          {[
            { icon: <Star size={20} color={R} />,          label: "Mövcud Balans",    value: `${balance.toFixed(2)} B`,                      color: R,        bg: R_S },
            { icon: <Clock size={20} color="#d97706" />,   label: "Gözləyən",         value: `${pending.toFixed(2)} B`,                       color: "#d97706", bg: "#fffbeb" },
            { icon: <Users size={20} color="#2563eb" />,   label: "Referallar",       value: referralData?.totalReferrals ?? 0,               color: "#2563eb", bg: "#eff6ff" },
            { icon: <Zap size={20} color="#16a34a" />,     label: "Ümumi Qazanılan",  value: `${(referralData?.totalBonus ?? 0).toFixed(2)} B`, color: "#16a34a", bg: "#f0fdf4" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 14, border: `1.5px solid ${s.bg}` }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#111" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#888", fontWeight: 500 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── REDEEM + REFERRAL ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>

          {/* Bonus İstifadə Et */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "24px 22px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1.5px solid #f0f0f0" }}>
            <h3 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 800, color: "#111", display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircle size={18} color={R} /> Bonus İstifadə Et
            </h3>
            {pending > 0 ? (
              <div>
                <div style={{ background: "#fef3c7", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#92400e", borderLeft: `4px solid #d97706` }}>
                  <strong>{pending.toFixed(2)} B</strong> aktiv rezervasiyada. Sifarişdən sonra tətbiq ediləcək.
                </div>
                <button onClick={() => dispatch(cancelRedeem())} disabled={loading}
                  style={{ width: "100%", padding: "12px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <XCircle size={16} /> Rezervasiyanı Ləğv Et
                </button>
              </div>
            ) : (
              <form onSubmit={handleRedeem}>
                <div style={{ fontSize: 13, color: "#888", marginBottom: 14, padding: "10px 14px", background: R_S, borderRadius: 10, borderLeft: `3px solid ${R}` }}>
                  Maks. istifadə: <strong style={{ color: R }}>{maxRedeem.toFixed(2)} B</strong>
                  {configData && <span style={{ marginLeft: 6, fontSize: 11, color: "#aaa" }}>(sifarişin {configData.maxRedemptionPercent}%-i)</span>}
                </div>
                <input type="number" min="0.01" max={maxRedeem} step="0.01"
                  value={redeemAmt} onChange={e => setRedeemAmt(e.target.value)}
                  placeholder="Bonus miqdarı daxil edin"
                  style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #eee", borderRadius: 12, fontSize: "max(16px,14px)", outline: "none", marginBottom: 12, boxSizing: "border-box", fontFamily: "inherit", transition: "border .2s" }}
                  onFocus={e => e.currentTarget.style.borderColor = R}
                  onBlur={e => e.currentTarget.style.borderColor = "#eee"}
                />
                <button type="submit" disabled={loading || balance <= 0}
                  style={{ width: "100%", padding: "12px", background: `linear-gradient(135deg,${R},${R2})`, color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer", opacity: balance <= 0 ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: `0 4px 14px rgba(232,25,44,0.3)` }}>
                  <CheckCircle size={16} /> Bonusları Tətbiq Et
                </button>
              </form>
            )}
          </div>

          {/* Referral */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "24px 22px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1.5px solid #f0f0f0" }}>
            <h3 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 800, color: "#111", display: "flex", alignItems: "center", gap: 8 }}>
              <Users size={18} color="#059669" /> Referral Linkini Paylaş
            </h3>
            {referral ? (
              <>
                <div style={{ fontSize: 13, color: "#666", marginBottom: 14, padding: "10px 14px", background: "#f0fdf4", borderRadius: 10, borderLeft: "3px solid #059669" }}>
                  Dostunuz ilk alışını etdikdə hər ikiniz
                  <strong style={{ color: "#059669" }}> {configData?.referralBonusAmount ?? 1} bonus</strong> qazanırsınız.
                </div>
                <div style={{ background: "#f8f9fa", border: "1.5px solid #eee", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: 12, color: R, fontWeight: 700, wordBreak: "break-all", flex: 1 }}>
                    {referral.referralLink || referralData?.referralCode}
                  </span>
                  <button onClick={copyRef} style={{ background: `linear-gradient(135deg,${R},${R2})`, border: "none", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                    <Copy size={13} color="#fff" />
                  </button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "8px 0", borderTop: "1px solid #f5f5f5" }}>
                  <span style={{ color: "#888" }}>Cəlb edilmiş:</span>
                  <strong style={{ color: "#059669" }}>{referral.totalReferrals ?? 0} nəfər</strong>
                </div>
              </>
            ) : (
              <p style={{ color: "#bbb", fontSize: 13 }}>Referral məlumatı yüklənir...</p>
            )}
          </div>
        </div>

        {/* ── BONUS NÖVLƏRİ (kliklenebilir) ── */}
        {configData && (
          <div style={{ background: "#fff", borderRadius: 20, padding: "24px 22px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1.5px solid #f0f0f0", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#111", display: "flex", alignItems: "center", gap: 8 }}>
                <Info size={18} color={R} /> Bonus Necə Qazanılır?
              </h3>
              <span style={{ fontSize: 12, color: "#aaa" }}>Ətraflı məlumat üçün klikləyin</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
              {bonusTypes.map(bt => (
                <button key={bt.key} onClick={() => setActiveBonus(bt.key)}
                  style={{
                    background: bt.bg, border: `1.5px solid ${bt.color}20`,
                    borderRadius: 16, padding: "18px 16px",
                    cursor: "pointer", textAlign: "left", transition: "all 0.2s",
                    position: "relative", overflow: "hidden",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${bt.color}20`; e.currentTarget.style.borderColor = bt.color }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = `${bt.color}20` }}
                >
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{bt.emoji}</div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: "#111", marginBottom: 5 }}>{bt.title}</div>
                  <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>{bt.desc}</div>
                  <div style={{ position: "absolute", bottom: 12, right: 12, display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 700, color: bt.color }}>
                    Ətraflı <ChevronRight size={12} />
                  </div>
                </button>
              ))}
            </div>

            {configData.campaignActive && (
              <div style={{ marginTop: 16, background: "#fef3c7", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#92400e", fontWeight: 600, borderLeft: "4px solid #d97706", display: "flex", alignItems: "center", gap: 8 }}>
                🎉 Aktiv Kampaniya: <strong>{configData.campaignName}</strong> — {configData.campaignMultiplier}x çarpan aktiv!
              </div>
            )}
          </div>
        )}

        {/* ── ƏMƏLİYYAT TARİXİ ── */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "24px 22px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1.5px solid #f0f0f0" }}>
          <h3 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 800, color: "#111", display: "flex", alignItems: "center", gap: 8 }}>
            <TrendingUp size={18} color={R} /> Əməliyyat Tarixi
          </h3>
          {txs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
              <p style={{ color: "#bbb", fontSize: 14 }}>Hələ heç bir əməliyyat yoxdur</p>
            </div>
          ) : (
            <div style={{ maxHeight: 380, overflowY: "auto" }}>
              {txs.map((tx, i) => (
                <div key={tx._id || i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f8f8f8" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: tx.type === "earn" ? "#f0fdf4" : tx.type === "use" ? R_S : "#fffbeb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                      {typeIcon[tx.type] || "💫"}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "#111" }}>{srcLabel[tx.source] || tx.source}</div>
                      <div style={{ fontSize: 11, color: "#bbb" }}>{new Date(tx.createdAt).toLocaleString("az-AZ")}</div>
                    </div>
                  </div>
                  <span style={{
                    fontWeight: 800, fontSize: 14, color: typeColor[tx.type] || "#111",
                    background: tx.type === "earn" ? "#f0fdf4" : tx.type === "use" ? R_S : "#fffbeb",
                    padding: "4px 12px", borderRadius: 99,
                  }}>
                    {tx.type === "earn" ? "+" : "-"}{tx.amount} B
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL ── */}
      {activeBonus && (
        <BonusModal bonusKey={activeBonus} cfg={configData} onClose={() => setActiveBonus(null)} />
      )}
    </div>
  )
}
