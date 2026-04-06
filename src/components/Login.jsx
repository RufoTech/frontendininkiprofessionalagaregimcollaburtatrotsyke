import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLoginMutation } from '../redux/api/authApi'
import { useSelector, useDispatch } from 'react-redux'
import { Eye, EyeOff, Loader2, Copy, ExternalLink, LayoutDashboard, Package, ShoppingBag, Settings, Store, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { bloggerLogin } from '../slices/bloggerSlice'

const Login = () => {
  const [email,       setEmail]       = useState('')
  const [password,    setPassword]    = useState('')
  const [showPass,    setShowPass]    = useState(false)
  const [role,        setRole]        = useState('user')
  const [showRoles,   setShowRoles]   = useState(false)
  const [adminData,   setAdminData]   = useState(null)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [login, { isLoading }] = useLoginMutation()
  const { isAuthenticated }    = useSelector(s => s.userSlice)
  const { loading: bloggerLoading } = useSelector(s => s.blogger)

  useEffect(() => {
    if (isAuthenticated && !adminData) navigate('/home')
  }, [isAuthenticated, navigate, adminData])

  const handleSubmit = async e => {
    e.preventDefault()
    if (role === 'blogger') {
      try {
        await dispatch(bloggerLogin({ email, password })).unwrap()
        toast.success('Xoş gəldiniz!')
        navigate('/blogger/dashboard')
      } catch (err) { toast.error(err || 'E-poçt və ya şifrə yanlışdır') }
      return
    }
    if (role === 'superadmin') { navigate('/superadmin/login'); return }
    try {
      const result = await login({ email, password, role }).unwrap()
      toast.success('Xoş gəldiniz!')
      if (role === 'admin') {
        const storeSlug = result?.storeSlug || result?.store?.slug || result?.user?.storeSlug
        const storeName = result?.storeName || result?.store?.name || result?.user?.storeName || 'Mağazanız'
        setAdminData({ storeName, storeLink: storeSlug ? `${window.location.origin}/store/${storeSlug}` : null, storeSlug })
      } else { navigate('/home') }
    } catch (err) { toast.error(err?.data?.message || 'E-poçt və ya şifrə yanlışdır') }
  }

  const anyLoading = isLoading || bloggerLoading

  // ── ADMİN GİRİŞ SONRASI ──────────────────────────────────────
  if (adminData) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          .ap-root { min-height:100vh; background:#F5F5F5; display:flex; align-items:center; justify-content:center; padding:20px; font-family:'Inter',sans-serif; }
          .ap-card { background:#fff; border-radius:24px; padding:36px 32px; max-width:480px; width:100%; box-shadow:0 4px 24px rgba(0,0,0,0.08); }
          .ap-icon { width:60px; height:60px; background:#fff0f1; border-radius:18px; display:flex; align-items:center; justify-content:center; margin-bottom:16px; }
          .ap-title { font-size:20px; font-weight:700; color:#1A1A1A; margin:0 0 4px; }
          .ap-sub { font-size:13px; color:#888; margin:0 0 20px; }
          .ap-link-box { background:#fafafa; border:1.5px solid #eee; border-radius:12px; padding:12px 16px; display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:20px; }
          .ap-link-url { font-size:12px; color:#E8192C; font-weight:600; word-break:break-all; flex:1; }
          .ap-copy { background:#E8192C; border:none; border-radius:9px; width:34px; height:34px; display:flex; align-items:center; justify-content:center; cursor:pointer; }
          .ap-divider { height:1px; background:#f0f0f0; margin:16px 0; }
          .ap-label { font-size:11px; font-weight:700; color:#bbb; text-transform:uppercase; letter-spacing:1.4px; margin-bottom:10px; }
          .ap-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:16px; }
          @media(max-width:460px) { .ap-grid { grid-template-columns:1fr; } }
          .ap-btn { background:#fafafa; border:1.5px solid #eee; border-radius:12px; padding:12px 14px; display:flex; align-items:center; gap:10px; text-decoration:none; color:inherit; transition:all .2s; }
          .ap-btn:hover { border-color:#E8192C; background:#fff8f8; }
          .ap-btn-icon { width:34px; height:34px; background:#fff0f1; border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
          .ap-primary { width:100%; height:46px; background:#E8192C; color:#fff; border:none; border-radius:12px; font-family:'Inter',sans-serif; font-size:14px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; margin-bottom:8px; transition:background .2s; text-decoration:none; }
          .ap-primary:hover { background:#c8111f; }
          .ap-secondary { width:100%; height:44px; background:transparent; color:#555; border:1.5px solid #eee; border-radius:12px; font-family:'Inter',sans-serif; font-size:13px; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:all .2s; }
          .ap-secondary:hover { border-color:#E8192C; color:#E8192C; }
        `}</style>
        <div className="ap-root">
          <div className="ap-card">
            <div className="ap-icon"><Store size={28} color="#E8192C" /></div>
            <h2 className="ap-title">Xoş gəldiniz! 🎉</h2>
            <p className="ap-sub">{adminData.storeName} — Admin Paneli</p>
            {adminData.storeLink && (
              <>
                <p className="ap-label">Mağaza Linkiniz</p>
                <div className="ap-link-box">
                  <span className="ap-link-url">{adminData.storeLink}</span>
                  <button className="ap-copy" onClick={() => { navigator.clipboard.writeText(adminData.storeLink); toast.success('Kopyalandı!') }}>
                    <Copy size={14} color="#fff" />
                  </button>
                </div>
              </>
            )}
            <div className="ap-divider" />
            <p className="ap-label">Funksiyalar</p>
            <div className="ap-grid">
              <Link to="/admin/products" className="ap-btn">
                <div className="ap-btn-icon"><LayoutDashboard size={16} color="#E8192C" /></div>
                <div><div style={{fontSize:12,fontWeight:700}}>Dashboard</div><div style={{fontSize:11,color:'#999'}}>Statistika</div></div>
              </Link>
              <Link to="/admin/products" className="ap-btn">
                <div className="ap-btn-icon"><Package size={16} color="#E8192C" /></div>
                <div><div style={{fontSize:12,fontWeight:700}}>Məhsullar</div><div style={{fontSize:11,color:'#999'}}>İdarəetmə</div></div>
              </Link>
              <Link to="/admin/orders" className="ap-btn">
                <div className="ap-btn-icon"><ShoppingBag size={16} color="#E8192C" /></div>
                <div><div style={{fontSize:12,fontWeight:700}}>Sifarişlər</div><div style={{fontSize:11,color:'#999'}}>İzləmə</div></div>
              </Link>
              <Link to="/admin/product" className="ap-btn">
                <div className="ap-btn-icon"><Settings size={16} color="#E8192C" /></div>
                <div><div style={{fontSize:12,fontWeight:700}}>Parametrlər</div><div style={{fontSize:11,color:'#999'}}>Tənzimləmə</div></div>
              </Link>
            </div>
            {adminData.storeLink && (
              <a href={adminData.storeLink} target="_blank" rel="noreferrer" className="ap-primary">
                <ExternalLink size={15} /> Mağazamı Aç
              </a>
            )}
            <button className="ap-secondary" onClick={() => navigate('/admin/products')}>
              <LayoutDashboard size={15} /> Admin Panelinə Keç
            </button>
          </div>
        </div>
      </>
    )
  }

  // ── GİRİŞ FORMU ──────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; }

        .login-page {
          min-height: 100vh;
          background: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 20px;
          font-family: 'Inter', sans-serif;
        }

        .login-wrap { width: 100%; max-width: 400px; }

        /* Logo */
        .login-logo {
          width: 72px; height: 72px;
          background: #E8192C;
          border-radius: 22px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
          box-shadow: 0 8px 24px rgba(232,25,44,0.35);
        }
        .login-logo-letter {
          font-size: 36px; font-weight: 800; color: #fff;
          line-height: 1;
        }

        .login-title {
          font-size: 26px; font-weight: 800; color: #1A1A1A;
          text-align: center; margin: 0 0 6px;
        }
        .login-sub {
          font-size: 14px; color: #888;
          text-align: center; margin: 0 0 32px;
        }

        /* Fields */
        .login-field { margin-bottom: 16px; }
        .login-label { display:block; font-size:13px; font-weight:600; color:#444; margin-bottom:8px; }

        .login-phone-wrap {
          display: flex; align-items: center;
          border: 1.5px solid #E8E8E8; border-radius: 14px;
          background: #FAFAFA; overflow: hidden;
          transition: border-color .2s;
        }
        .login-phone-wrap:focus-within { border-color: #E8192C; background: #fff; box-shadow: 0 0 0 4px rgba(232,25,44,0.06); }

        .login-phone-prefix {
          display: flex; align-items: center; gap: 6px;
          padding: 0 12px 0 14px;
          border-right: 1.5px solid #E8E8E8;
          font-size: 13px; font-weight: 600; color: #1A1A1A;
          white-space: nowrap; flex-shrink: 0;
          height: 50px;
        }
        .login-phone-input {
          flex: 1; border: none; background: transparent; outline: none;
          font-family: 'Inter', sans-serif; font-size: 14px; color: #1A1A1A;
          padding: 0 14px; height: 50px;
        }
        .login-phone-input::placeholder { color: #C4C4C4; }

        .login-input-wrap { position: relative; }
        .login-input {
          width: 100%; height: 50px; padding: 0 46px 0 16px;
          border: 1.5px solid #E8E8E8; border-radius: 14px;
          background: #FAFAFA; font-family: 'Inter', sans-serif;
          font-size: 14px; color: #1A1A1A; outline: none; transition: .2s;
        }
        .login-input::placeholder { color: #C4C4C4; }
        .login-input:focus { border-color: #E8192C; background: #fff; box-shadow: 0 0 0 4px rgba(232,25,44,0.06); }
        .login-eye {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #C4C4C4; padding: 4px;
          display: flex; align-items: center;
        }
        .login-eye:hover { color: #888; }

        .login-forgot { text-align: right; margin: -4px 0 20px; }
        .login-forgot a { font-size: 13px; color: #888; text-decoration: none; font-weight: 500; }
        .login-forgot a:hover { color: #E8192C; }

        /* Main button */
        .login-btn {
          width: 100%; height: 52px;
          background: linear-gradient(135deg, #E8192C 0%, #C0001A 100%);
          color: #fff; border: none; border-radius: 14px;
          font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 700;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 6px 20px rgba(232,25,44,0.35);
          transition: all .2s; margin-bottom: 20px;
        }
        .login-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(232,25,44,0.4); }
        .login-btn:disabled { opacity: .7; cursor: not-allowed; }

        /* Divider */
        .login-divider { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .login-divider-line { flex: 1; height: 1px; background: #F0F0F0; }
        .login-divider-text { font-size: 12px; color: #C4C4C4; font-weight: 600; }

        /* Social buttons */
        .social-btn {
          width: 100%; height: 48px;
          background: #fff; border: 1.5px solid #E8E8E8; border-radius: 14px;
          font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; color: #1A1A1A;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;
          margin-bottom: 10px; transition: all .2s;
        }
        .social-btn:hover { border-color: #C4C4C4; background: #FAFAFA; }
        .social-icon { width: 20px; height: 20px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 14px; }

        /* Footer */
        .login-footer { text-align: center; font-size: 13px; color: #888; margin-top: 20px; }
        .login-footer a { color: #E8192C; font-weight: 700; text-decoration: none; }

        /* Role row */
        .login-role-row {
          display: flex; justify-content: center; gap: 6px;
          margin-bottom: 20px; flex-wrap: wrap;
        }
        .role-chip {
          padding: 6px 14px; border-radius: 50px;
          border: 1.5px solid #E8E8E8; background: #fff;
          font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600;
          color: #888; cursor: pointer; transition: all .2s; display: flex; align-items: center; gap: 5px;
        }
        .role-chip.active { border-color: #E8192C; color: #E8192C; background: #fff8f8; }

        @media (max-width: 440px) {
          .login-logo { width: 64px; height: 64px; border-radius: 18px; }
          .login-logo-letter { font-size: 30px; }
          .login-title { font-size: 22px; }
        }
      `}</style>

      <div className="login-page">
        <div className="login-wrap">
          {/* Logo */}
          <div className="login-logo">
            <span className="login-logo-letter">B</span>
          </div>

          <h1 className="login-title">Xoş gəlmisiniz!</h1>
          <p className="login-sub">BRENDEX hesabınıza daxil olun</p>

          {/* Role chips */}
          <div className="login-role-row">
            {[
              { key: 'user',       label: 'Alıcı',     icon: '🛍️' },
              { key: 'admin',      label: 'Satıcı',    icon: '🏪' },
              { key: 'blogger',    label: 'Blogger',   icon: '✍️' },
              { key: 'superadmin', label: 'SuperAdmin', icon: '🛡️' },
            ].map(r => (
              <button
                key={r.key}
                type="button"
                className={`role-chip ${role === r.key ? 'active' : ''}`}
                onClick={() => {
                  setRole(r.key)
                  if (r.key === 'superadmin') navigate('/superadmin/login')
                }}
              >
                {r.icon} {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email (phone-style input) */}
            <div className="login-field">
              <label className="login-label">
                {role === 'user' ? 'E-poçt ünvanı' : role === 'admin' ? 'Satıcı e-poçtu' : 'E-poçt'}
              </label>
              <div className="login-phone-wrap">
                <div className="login-phone-prefix">
                  📧
                </div>
                <input
                  type="email"
                  className="login-phone-input"
                  placeholder="nümunə@mail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <label className="login-label">Şifrə</label>
              <div className="login-input-wrap">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="login-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button type="button" className="login-eye" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="login-forgot">
              <Link to="/forgot-password">Şifrəni unutdum?</Link>
            </div>

            <button type="submit" disabled={anyLoading} className="login-btn">
              {anyLoading
                ? <><Loader2 size={18} className="animate-spin" /> Gözləyin...</>
                : <>Daxil ol <ArrowRight size={16} /></>
              }
            </button>
          </form>

          <div className="login-divider">
            <div className="login-divider-line" />
            <span className="login-divider-text">və ya</span>
            <div className="login-divider-line" />
          </div>

          {/* Social buttons (cosmetic) */}
          <button
            className="social-btn"
            type="button"
            onClick={() => toast('Google ilə giriş tezliklə əlavə ediləcək')}
          >
            <div className="social-icon">
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
              </svg>
            </div>
            Google ilə davam et
          </button>

          <button
            className="social-btn"
            type="button"
            onClick={() => toast('Apple ilə giriş tezliklə əlavə ediləcək')}
          >
            <div className="social-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </div>
            Apple ilə davam et
          </button>

          <div className="login-footer">
            {role === 'blogger'
              ? <>Blogger hesabın yoxdur? <Link to="/blogger/register">Qeydiyyat</Link></>
              : <>Hesabın yoxdur? <Link to="/register">Qeydiyyatdan keç</Link></>
            }
            <div style={{ marginTop: 12, fontSize: 12 }}>
              Daxil olmaqla <Link to="/terms" style={{ fontWeight: 600 }}>Şərtlər və Qaydalar</Link>ımızı qəbul edirsiniz.
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
