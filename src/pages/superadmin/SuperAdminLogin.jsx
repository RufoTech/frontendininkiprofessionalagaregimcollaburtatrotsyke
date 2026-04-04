import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { superAdminLogin } from "../../slices/superAdminSlice"
import { Lock, Mail, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react"
import toast from "react-hot-toast"

const SuperAdminLogin = () => {
  const dispatch   = useDispatch()
  const navigate   = useNavigate()
  const { isLoggedIn, loading, error } = useSelector((s) => s.superAdmin)

  const [email, setEmail]           = useState("")
  const [password, setPassword]     = useState("")
  const [showPw, setShowPw]         = useState(false)

  useEffect(() => { if (isLoggedIn) navigate("/superadmin/dashboard", { replace: true }) }, [isLoggedIn, navigate])
  useEffect(() => { if (error) toast.error(error) }, [error])

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(superAdminLogin({ email, password }))
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg,#1a0003 0%,#3d0008 50%,#1a0003 100%)",
      fontFamily: "'Sora',sans-serif", padding: "24px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap');
        .sa-card { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.12);
          border-radius:24px; padding:48px 40px; width:100%; max-width:420px;
          backdrop-filter:blur(16px); }
        .sa-logo { display:flex; align-items:center; gap:12px; justify-content:center; margin-bottom:32px; }
        .sa-logo-box { width:52px; height:52px; background:#E8192C; border-radius:16px;
          display:flex; align-items:center; justify-content:center;
          box-shadow:0 8px 24px rgba(232,25,44,0.45); }
        .sa-title { font-size:28px; font-weight:800; color:#fff; text-align:center; margin-bottom:6px; }
        .sa-sub   { font-size:13px; color:rgba(255,255,255,0.45); text-align:center; margin-bottom:36px; }
        .sa-label { display:block; font-size:12px; font-weight:600; color:rgba(255,255,255,0.6); margin-bottom:6px; }
        .sa-field { position:relative; margin-bottom:18px; }
        .sa-icon  { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:rgba(255,255,255,0.3); width:16px; height:16px; pointer-events:none; }
        .sa-input { width:100%; padding:13px 13px 13px 42px; background:rgba(255,255,255,0.07);
          border:1.5px solid rgba(255,255,255,0.12); border-radius:12px; color:#fff;
          font-size:max(16px,14px); font-family:'Sora',sans-serif; outline:none;
          transition:border-color 0.2s, background 0.2s; box-sizing:border-box; }
        .sa-input::placeholder { color:rgba(255,255,255,0.25); }
        .sa-input:focus { border-color:rgba(232,25,44,0.7); background:rgba(255,255,255,0.10); }
        .sa-eye { position:absolute; right:12px; top:50%; transform:translateY(-50%);
          background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.35); display:flex; padding:4px; }
        .sa-btn { width:100%; padding:14px; background:#E8192C; color:#fff; border:none; border-radius:12px;
          font-family:'Sora',sans-serif; font-size:15px; font-weight:700; cursor:pointer;
          display:flex; align-items:center; justify-content:center; gap:8px; margin-top:8px;
          transition:background 0.2s, transform 0.15s; box-shadow:0 6px 20px rgba(232,25,44,0.4); }
        .sa-btn:hover:not(:disabled) { background:#c8111f; transform:translateY(-1px); }
        .sa-btn:disabled { opacity:0.65; cursor:not-allowed; }
        .sa-badge { display:flex; align-items:center; gap:6px; justify-content:center;
          margin-top:28px; font-size:11px; color:rgba(255,255,255,0.28); }
        @media(max-width:480px){ .sa-card { padding:36px 24px; } }
      `}</style>

      <div className="sa-card">
        <div className="sa-logo">
          <div className="sa-logo-box"><ShieldCheck size={26} color="#fff" /></div>
        </div>
        <h1 className="sa-title">SuperAdmin Paneli</h1>
        <p className="sa-sub">Yalnız səlahiyyətli istifadəçilər üçün</p>

        <form onSubmit={handleSubmit}>
          <div className="sa-field">
            <label className="sa-label">E-poçt</label>
            <Mail className="sa-icon" />
            <input className="sa-input" type="email" placeholder="admin@brendex.az"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="sa-field">
            <label className="sa-label">Şifrə</label>
            <Lock className="sa-icon" />
            <input className="sa-input" type={showPw ? "text" : "password"} placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" className="sa-eye" onClick={() => setShowPw(p => !p)}>
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          <button type="submit" disabled={loading} className="sa-btn">
            {loading ? <><Loader2 size={17} className="animate-spin" /> Yüklənir...</> : "Daxil ol"}
          </button>
        </form>

        <p className="sa-badge"><ShieldCheck size={13} /> Güclü şifrələmə ilə qorunur</p>
      </div>
    </div>
  )
}

export default SuperAdminLogin
