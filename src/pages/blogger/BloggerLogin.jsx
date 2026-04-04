import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { bloggerLogin } from "../../slices/bloggerSlice"
import { Lock, Mail, Eye, EyeOff, Loader2, PenTool } from "lucide-react"
import toast from "react-hot-toast"

const BloggerLogin = () => {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { isLoggedIn, loading, error } = useSelector((s) => s.blogger)

  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw]     = useState(false)

  useEffect(() => { if (isLoggedIn) navigate("/blogger/dashboard", { replace: true }) }, [isLoggedIn, navigate])
  useEffect(() => { if (error) toast.error(error) }, [error])

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(bloggerLogin({ email, password }))
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg,#0a1a0a 0%,#1a3a1a 50%,#0a1a0a 100%)",
      fontFamily: "'Sora',sans-serif", padding: "24px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap');
        .bl-card { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.12);
          border-radius:24px; padding:48px 40px; width:100%; max-width:420px;
          backdrop-filter:blur(16px); }
        .bl-logo { display:flex; align-items:center; gap:12px; justify-content:center; margin-bottom:32px; }
        .bl-logo-box { width:52px; height:52px; background:#16a34a; border-radius:16px;
          display:flex; align-items:center; justify-content:center;
          box-shadow:0 8px 24px rgba(22,163,74,0.45); }
        .bl-title { font-size:28px; font-weight:800; color:#fff; text-align:center; margin-bottom:6px; }
        .bl-sub   { font-size:13px; color:rgba(255,255,255,0.45); text-align:center; margin-bottom:36px; }
        .bl-label { display:block; font-size:12px; font-weight:600; color:rgba(255,255,255,0.6); margin-bottom:6px; }
        .bl-field { position:relative; margin-bottom:18px; }
        .bl-icon  { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:rgba(255,255,255,0.3); width:16px; height:16px; pointer-events:none; }
        .bl-input { width:100%; padding:13px 13px 13px 42px; background:rgba(255,255,255,0.07);
          border:1.5px solid rgba(255,255,255,0.12); border-radius:12px; color:#fff;
          font-size:max(16px,14px); font-family:'Sora',sans-serif; outline:none;
          transition:border-color 0.2s, background 0.2s; box-sizing:border-box; }
        .bl-input::placeholder { color:rgba(255,255,255,0.25); }
        .bl-input:focus { border-color:rgba(22,163,74,0.7); background:rgba(255,255,255,0.10); }
        .bl-eye { position:absolute; right:12px; top:50%; transform:translateY(-50%);
          background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.35); display:flex; padding:4px; }
        .bl-btn { width:100%; padding:14px; background:#16a34a; color:#fff; border:none; border-radius:12px;
          font-family:'Sora',sans-serif; font-size:15px; font-weight:700; cursor:pointer;
          display:flex; align-items:center; justify-content:center; gap:8px; margin-top:8px;
          transition:background 0.2s, transform 0.15s; box-shadow:0 6px 20px rgba(22,163,74,0.4); }
        .bl-btn:hover:not(:disabled) { background:#15803d; transform:translateY(-1px); }
        .bl-btn:disabled { opacity:0.65; cursor:not-allowed; }
        .bl-footer { text-align:center; margin-top:24px; font-size:13px; color:rgba(255,255,255,0.4); }
        .bl-footer a { color:#4ade80; font-weight:600; text-decoration:none; }
        .bl-footer a:hover { text-decoration:underline; }
        .bl-badge { display:flex; align-items:center; gap:6px; justify-content:center;
          margin-top:28px; font-size:11px; color:rgba(255,255,255,0.28); }
        @media(max-width:480px){ .bl-card { padding:36px 24px; } }
      `}</style>

      <div className="bl-card">
        <div className="bl-logo">
          <div className="bl-logo-box"><PenTool size={26} color="#fff" /></div>
        </div>
        <h1 className="bl-title">Blogger Paneli</h1>
        <p className="bl-sub">Brendex Blogger hesabınıza daxil olun</p>

        <form onSubmit={handleSubmit}>
          <div className="bl-field">
            <label className="bl-label">E-poçt</label>
            <Mail className="bl-icon" />
            <input className="bl-input" type="email" placeholder="blogger@brendex.az"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="bl-field">
            <label className="bl-label">Şifrə</label>
            <Lock className="bl-icon" />
            <input className="bl-input" type={showPw ? "text" : "password"} placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" className="bl-eye" onClick={() => setShowPw(p => !p)}>
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          <button type="submit" disabled={loading} className="bl-btn">
            {loading ? <><Loader2 size={17} className="animate-spin" /> Yüklənir...</> : "Daxil ol"}
          </button>
        </form>

        <p className="bl-footer">
          Hesabınız yoxdur? <Link to="/blogger/register">Qeydiyyat</Link>
        </p>
        <p className="bl-badge"><PenTool size={13} /> Brendex Blogger Platforması</p>
      </div>
    </div>
  )
}

export default BloggerLogin
