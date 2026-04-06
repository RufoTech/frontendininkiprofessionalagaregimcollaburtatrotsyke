import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchMyBonus, fetchReferral, fetchBonusConfig, redeemBonus, cancelRedeem, clearBonusResult, clearBonusError } from "../slices/bonusSlice"
import toast from "react-hot-toast"
import { Gift, Copy, TrendingUp, Clock, CheckCircle, XCircle, Star, Users, Zap } from "lucide-react"

const R = "#E8192C"

const Card = ({ children, style = {} }) => (
  <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", ...style }}>{children}</div>
)

const StatBox = ({ icon, label, value, color = R }) => (
  <div style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 14 }}>
    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#111" }}>{value}</div>
      <div style={{ fontSize: 12, color: "#888" }}>{label}</div>
    </div>
  </div>
)

export default function MyBonus() {
  const dispatch = useDispatch()
  const { myBonus, referral, config, loading, error, actionResult } = useSelector(s => s.bonus)
  const [redeemAmt, setRedeemAmt] = useState("")

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

  const handleCancelRedeem = () => dispatch(cancelRedeem())

  const referralData = referral?.referral || referral;

  const copyRef = async () => {
    const link = referralData?.referralLink || referralData?.referralCode || "";
    if (link) {
      try {
        await navigator.clipboard.writeText(link);
        toast.success("Kopyalandı!");
      } catch (err) {
        toast.error("Link kopyalanmadı!");
      }
    } else {
      toast.error("Referral linki tapılmadı, səhifəni yeniləyin!");
    }
  };
  const balance     = myBonus?.balance ?? 0
  const pending     = myBonus?.pendingRedemption ?? 0
  const txs         = myBonus?.transactions ?? []
  
  // Backend-dən gələn data: { success, config: { ... } }
  const configData = config?.config || config
  const maxRedeem   = configData ? Math.floor(balance * (configData.maxRedemptionPercent / 100) * 100) / 100 : 0

  const typeIcon = { earn: "⬆️", use: "⬇️", expire: "⏰" }
  const typeColor = { earn: "#16a34a", use: R, expire: "#d97706" }
  const srcLabel = { cart: "Alış-veriş", referral: "Referral", review: "Rəy", admin: "Admin", use: "İstifadə", expire: "Vaxtı bitdi" }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 16px", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`.mb-root { --primary:#E8192C; --rose50:#fff5f5; --rose100:#ffe4e6; --dark:#1c1c1e; --mid:#6b7280; font-family:'Inter',sans-serif; }`}</style>

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111", margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
          <Gift size={24} color={R} /> Bonus Hesabım
        </h1>
        <p style={{ fontSize: 14, color: "#888", margin: "4px 0 0" }}>Bonuslarınızı toplayın və alışlarınızda istifadə edin</p>
      </div>

      {/* ── STATS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 28 }}>
        <StatBox icon={<Star size={20} color={R} />} label="Mevcut Balans" value={`${balance.toFixed(2)} B`} />
        <StatBox icon={<Clock size={20} color="#d97706" />} label="Gözləyən" value={`${pending.toFixed(2)} B`} color="#d97706" />
        <StatBox icon={<Users size={20} color="#2563eb" />} label="Referallar" value={referralData?.totalReferrals ?? 0} color="#2563eb" />
        <StatBox icon={<Zap size={20} color="#16a34a" />} label="Ümumi Qazanılan" value={`${(referralData?.totalBonus ?? 0).toFixed(2)} B`} color="#16a34a" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

        {/* ── REDEEM ── */}
        <Card>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#111" }}>Bonus İstifadə Et</h3>
          {pending > 0 ? (
            <div>
              <div style={{ background: "#fef3c7", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#92400e" }}>
                <strong>{pending.toFixed(2)} B</strong> aktiv rezervasiyada. Sifarişdən sonra tətbiq ediləcək.
              </div>
              <button onClick={handleCancelRedeem} disabled={loading}
                style={{ width: "100%", padding: "11px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                <XCircle size={15} style={{ verticalAlign: "middle", marginRight: 6 }} />Rezervasiyanı Ləğv Et
              </button>
            </div>
          ) : (
            <form onSubmit={handleRedeem}>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>
                Maks. istifadə edilə bilən: <strong style={{ color: R }}>{maxRedeem.toFixed(2)} B</strong>
                {config && <span style={{ marginLeft: 6, fontSize: 11 }}>(Sifarişin {config.maxRedemptionPercent}%-i)</span>}
              </div>
              <input type="number" min="0.01" max={maxRedeem} step="0.01"
                value={redeemAmt} onChange={e => setRedeemAmt(e.target.value)}
                placeholder="Bonus miqdarı"
                style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #eee", borderRadius: 10, fontSize: "max(16px,14px)", outline: "none", marginBottom: 12, boxSizing: "border-box" }} />
              <button type="submit" disabled={loading || balance <= 0}
                style={{ width: "100%", padding: "11px", background: R, color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", opacity: balance <= 0 ? 0.5 : 1 }}>
                <CheckCircle size={15} style={{ verticalAlign: "middle", marginRight: 6 }} />Bonusları Tətbiq Et
              </button>
            </form>
          )}
        </Card>

        {/* ── REFERRAL ── */}
        <Card>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#111" }}>Referral Linkini Paylaş</h3>
          {referral ? (
            <>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>
                Dostunuz ilk alışını etdikdə hər ikiniz
                <strong style={{ color: R }}> {config?.referralBonusAmount ?? 1} bonus</strong> qazanırsınız.
              </div>
              <div style={{ background: "#fafafa", border: "1.5px solid #eee", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: R, fontWeight: 600, wordBreak: "break-all", flex: 1 }}>
                  {referral.referralLink || referral.referralCode}
                </span>
                <button onClick={copyRef} style={{ background: R, border: "none", borderRadius: 7, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <Copy size={13} color="#fff" />
                </button>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "#888" }}>Cəlb edilmiş:</span>
                <strong>{referral.totalReferrals ?? 0} nəfər</strong>
              </div>
            </>
          ) : (
            <p style={{ color: "#bbb", fontSize: 13 }}>Referral məlumatı yüklənir...</p>
          )}
        </Card>
      </div>

      {/* ── HOW IT WORKS ── */}
      {config && (
        <Card style={{ marginBottom: 20 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#111" }}>Bonus Necə Qazanılır?</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
            {[
              { icon: "🛒", title: "Alış-veriş", desc: `Hər ${config.cartStepAzn}₼ alışdan ${config.cartBaseBonus} bonus` },
              { icon: "⭐", title: "Rəy Yaz", desc: `Məhsul rəyindən ${config.reviewBonusAmount} bonus` },
              { icon: "👥", title: "Dost Dəvət Et", desc: `Hər referaldan ${config.referralBonusAmount} bonus` },
            ].map(i => (
              <div key={i.title} style={{ background: "#fafafa", borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{i.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{i.title}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{i.desc}</div>
              </div>
            ))}
          </div>
          {config.campaignActive && (
            <div style={{ marginTop: 14, background: "#fef3c7", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#92400e", fontWeight: 600 }}>
              🎉 Aktiv Kampaniya: <strong>{config.campaignName}</strong> — {config.campaignMultiplier}x çarpan aktiv!
            </div>
          )}
        </Card>
      )}

      {/* ── TRANSACTIONS ── */}
      <Card>
        <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#111" }}>
          <TrendingUp size={16} style={{ verticalAlign: "middle", marginRight: 6, color: R }} />
          Əməliyyat Tarixi
        </h3>
        {txs.length === 0 ? (
          <p style={{ color: "#bbb", fontSize: 13, textAlign: "center", padding: "20px 0" }}>Hələ heç bir əməliyyat yoxdur</p>
        ) : (
          <div style={{ maxHeight: 360, overflowY: "auto" }}>
            {txs.map((tx, i) => (
              <div key={tx._id || i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f5f5f5" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{typeIcon[tx.type] || "💫"}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "#111" }}>{srcLabel[tx.source] || tx.source}</div>
                    <div style={{ fontSize: 11, color: "#aaa" }}>{new Date(tx.createdAt).toLocaleString("az-AZ")}</div>
                  </div>
                </div>
                <span style={{ fontWeight: 700, fontSize: 14, color: typeColor[tx.type] || "#111" }}>
                  {tx.type === "earn" ? "+" : "-"}{tx.amount} B
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
