import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLoginMutation } from '../redux/api/authApi'
import { useSelector, useDispatch } from 'react-redux'
import {
  ArrowRight,
  Copy,
  Eye,
  EyeOff,
  ExternalLink,
  LayoutDashboard,
  Loader2,
  Package,
  Settings,
  ShoppingBag,
  Store,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { bloggerLogin } from '../slices/bloggerSlice'

const BACKEND = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3011/commerce/mehsullar')
  .replace('/commerce/mehsullar', '')

const roleOptions = [
  { key: 'user', label: 'Alıcı' },
  { key: 'admin', label: 'Satıcı' },
  { key: 'blogger', label: 'Blogger' },
  { key: 'superadmin', label: 'SuperAdmin' },
]

const featurePoints = [
  'Daha təmiz giriş axını və premium vizual dil',
  'Satıcı, blogger və alıcı rolları üçün bir nöqtədən giriş',
  'Brendex panelinə daha sürətli keçid'
]

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [role, setRole] = useState('user')
  const [adminData, setAdminData] = useState(null)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [login, { isLoading }] = useLoginMutation()
  const { isAuthenticated } = useSelector((state) => state.userSlice)
  const { loading: bloggerLoading } = useSelector((state) => state.blogger)

  useEffect(() => {
    if (isAuthenticated && !adminData) navigate('/home')
  }, [isAuthenticated, navigate, adminData])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const msg = params.get('msg')
    if (msg) toast.error(msg)
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (role === 'blogger') {
      try {
        await dispatch(bloggerLogin({ email, password })).unwrap()
        toast.success('Xoş gəldiniz!')
        navigate('/blogger/dashboard')
      } catch (error) {
        toast.error(error || 'E-poçt və ya şifrə yanlışdır')
      }
      return
    }

    if (role === 'superadmin') {
      navigate('/superadmin/login')
      return
    }

    try {
      const result = await login({ email, password, role }).unwrap()
      toast.success('Xoş gəldiniz!')

      if (role === 'admin') {
        const storeSlug = result?.storeSlug || result?.store?.slug || result?.user?.storeSlug
        const storeName = result?.storeName || result?.store?.name || result?.user?.storeName || 'Mağazanız'
        setAdminData({
          storeName,
          storeLink: storeSlug ? `${window.location.origin}/store/${storeSlug}` : null,
          storeSlug,
        })
      } else {
        navigate('/home')
      }
    } catch (error) {
      toast.error(error?.data?.message || 'E-poçt və ya şifrə yanlışdır')
    }
  }

  const anyLoading = isLoading || bloggerLoading

  if (adminData) {
    return (
      <>
        <style>{`
          .admin-welcome {
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 24px;
          }
          .admin-welcome-card {
            width: min(100%, 560px);
            border-radius: 32px;
            padding: 32px;
            background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.94));
            border: 1px solid rgba(148,163,184,0.18);
            box-shadow: 0 28px 60px rgba(15,23,42,0.12);
          }
          .admin-welcome-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 12px;
            margin: 22px 0;
          }
          .admin-welcome-link {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 14px;
            border-radius: 18px;
            text-decoration: none;
            color: #0f172a;
            background: rgba(248,250,252,0.95);
            border: 1px solid rgba(148,163,184,0.18);
          }
        `}</style>

        <div className="admin-welcome">
          <div className="admin-welcome-card">
            <div style={{ width: 68, height: 68, borderRadius: 22, background: 'linear-gradient(135deg,#e8192c,#fb7185)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 18px 32px rgba(232,25,44,0.28)' }}>
              <Store size={30} />
            </div>

            <h1 style={{ margin: '20px 0 8px', fontSize: 32, fontWeight: 900, letterSpacing: '-0.05em', color: '#0f172a' }}>
              Mağazanız hazırdır
            </h1>
            <p style={{ margin: 0, color: '#64748b', lineHeight: 1.7 }}>
              {adminData.storeName} üçün giriş uğurla tamamlandı. Panel və mağaza linki bir yerdə toplandı ki, axın daha rahat olsun.
            </p>

            {adminData.storeLink && (
              <div style={{ marginTop: 20, borderRadius: 20, border: '1px solid rgba(232,25,44,0.12)', background: 'rgba(232,25,44,0.05)', padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#be123c', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Mağaza linki</div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 220, padding: '12px 14px', borderRadius: 16, background: '#fff', border: '1px solid rgba(148,163,184,0.18)', color: '#be123c', fontWeight: 700, wordBreak: 'break-all' }}>
                    {adminData.storeLink}
                  </div>
                  <button
                    onClick={() => { navigator.clipboard.writeText(adminData.storeLink); toast.success('Link kopyalandı!') }}
                    style={{ width: 46, height: 46, borderRadius: 16, border: 'none', background: '#e8192c', color: '#fff', cursor: 'pointer' }}
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            )}

            <div className="admin-welcome-grid">
              <Link to="/admin/products" className="admin-welcome-link">
                <LayoutDashboard size={18} color="#e8192c" />
                Dashboard
              </Link>
              <Link to="/admin/orders" className="admin-welcome-link">
                <ShoppingBag size={18} color="#e8192c" />
                Sifarişlər
              </Link>
              <Link to="/admin/products" className="admin-welcome-link">
                <Package size={18} color="#e8192c" />
                Məhsullar
              </Link>
              <Link to="/admin/product" className="admin-welcome-link">
                <Settings size={18} color="#e8192c" />
                Tənzimləmə
              </Link>
            </div>

            {adminData.storeLink && (
              <a
                href={adminData.storeLink}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  width: '100%',
                  height: 50,
                  borderRadius: 18,
                  textDecoration: 'none',
                  background: 'linear-gradient(135deg,#e8192c,#be123c)',
                  color: '#fff',
                  fontWeight: 800,
                  boxShadow: '0 18px 30px rgba(232,25,44,0.24)',
                  marginBottom: 10,
                }}
              >
                <ExternalLink size={16} />
                Mağazamı aç
              </a>
            )}

            <button
              className="auth-primary-btn"
              onClick={() => navigate('/admin/products')}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <LayoutDashboard size={16} />
              Admin panelinə keç
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{`
        .auth-layout {
          min-height: 100vh;
          display: grid;
          grid-template-columns: minmax(0, 460px) minmax(0, 1fr);
          font-family: 'Inter', sans-serif;
        }
        .auth-card-pane {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 28px;
        }
        .auth-card {
          width: min(100%, 420px);
          border-radius: 32px;
          padding: 30px;
          background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.92));
          border: 1px solid rgba(148,163,184,0.18);
          box-shadow: 0 28px 60px rgba(15,23,42,0.12);
          backdrop-filter: blur(16px);
        }
        .auth-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 22px;
          text-decoration: none;
          color: #0f172a;
        }
        .auth-brand-badge {
          width: 46px;
          height: 46px;
          border-radius: 16px;
          background: linear-gradient(135deg,#e8192c,#fb7185);
          color: #fff;
          display: grid;
          place-items: center;
          font-size: 22px;
          font-weight: 900;
          box-shadow: 0 14px 26px rgba(232,25,44,0.22);
        }
        .auth-role-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 20px 0;
        }
        .auth-role-chip {
          border: 1px solid rgba(148,163,184,0.18);
          background: #fff;
          color: #64748b;
          border-radius: 999px;
          padding: 9px 14px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }
        .auth-role-chip.active {
          color: #fff;
          border-color: transparent;
          background: linear-gradient(135deg,#e8192c,#be123c);
          box-shadow: 0 14px 24px rgba(232,25,44,0.2);
        }
        .auth-field {
          margin-bottom: 14px;
        }
        .auth-label {
          display: block;
          margin-bottom: 8px;
          color: #334155;
          font-size: 13px;
          font-weight: 700;
        }
        .auth-input-wrap {
          position: relative;
        }
        .auth-input {
          width: 100%;
          height: 54px;
          border-radius: 16px;
          border: 1px solid rgba(148,163,184,0.2);
          background: rgba(248,250,252,0.9);
          padding: 0 48px 0 16px;
          color: #0f172a;
          outline: none;
          transition: border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease;
        }
        .auth-input:focus {
          border-color: rgba(232,25,44,0.5);
          background: #fff;
          box-shadow: 0 0 0 5px rgba(232,25,44,0.08);
        }
        .auth-eye {
          position: absolute;
          top: 50%;
          right: 14px;
          transform: translateY(-50%);
          border: none;
          background: none;
          color: #94a3b8;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .auth-primary-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: none;
          border-radius: 18px;
          background: linear-gradient(135deg,#e8192c,#be123c);
          color: #fff;
          height: 54px;
          padding: 0 18px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 18px 30px rgba(232,25,44,0.24);
        }
        .auth-social-btn {
          width: 100%;
          height: 50px;
          border-radius: 16px;
          border: 1px solid rgba(148,163,184,0.18);
          background: rgba(255,255,255,0.82);
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          margin-top: 10px;
          font-weight: 700;
        }
        .auth-showcase {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          background: linear-gradient(140deg, #25070b 0%, #7f1520 45%, #ef4444 100%);
        }
        .auth-showcase::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 18% 20%, rgba(255,255,255,0.14), transparent 22%),
            radial-gradient(circle at 88% 18%, rgba(255,255,255,0.12), transparent 18%),
            radial-gradient(circle at 60% 80%, rgba(255,255,255,0.08), transparent 20%);
        }
        .auth-showcase-card {
          position: relative;
          z-index: 1;
          width: min(100%, 560px);
          padding: 34px;
          border-radius: 34px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(18px);
          color: #fff;
          box-shadow: 0 26px 60px rgba(0,0,0,0.18);
        }
        .auth-showcase-list {
          display: grid;
          gap: 12px;
          margin-top: 22px;
        }
        .auth-showcase-item {
          padding: 14px 16px;
          border-radius: 18px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
        }
        @media (max-width: 980px) {
          .auth-layout {
            grid-template-columns: 1fr;
          }
          .auth-showcase {
            display: none;
          }
          .auth-card-pane {
            padding: 16px;
          }
          .auth-card {
            padding: 22px;
            border-radius: 24px;
          }
        }
      `}</style>

      <div className="auth-spotlight" />

      <div className="auth-layout">
        <div className="auth-card-pane">
          <div className="auth-card">
            <Link to="/" className="auth-brand">
              <div className="auth-brand-badge">B</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.04em' }}>BRENDEX</div>
                <div style={{ color: '#64748b', fontSize: 12, fontWeight: 600 }}>Login experience redesigned</div>
              </div>
            </Link>

            <h1 style={{ margin: 0, fontSize: 34, fontWeight: 900, letterSpacing: '-0.05em', color: '#0f172a' }}>
              Hesabına daxil ol
            </h1>
            <p style={{ margin: '10px 0 0', color: '#64748b', lineHeight: 1.7 }}>
              Brendex paneli, mağaza idarəsi və bonus axınları indi daha vahid və rahat görünür.
            </p>

            <div className="auth-role-row">
              {roleOptions.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`auth-role-chip ${role === item.key ? 'active' : ''}`}
                  onClick={() => {
                    setRole(item.key)
                    if (item.key === 'superadmin') navigate('/superadmin/login')
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label className="auth-label">E-poçt ünvanı</label>
                <div className="auth-input-wrap">
                  <input
                    type="email"
                    className="auth-input"
                    placeholder="numune@mail.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">Şifrə</label>
                <div className="auth-input-wrap">
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="auth-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button type="button" className="auth-eye" onClick={() => setShowPass((prev) => !prev)}>
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '2px 0 18px', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/forgot-password" style={{ color: '#be123c', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
                  Şifrəni unutdum?
                </Link>
                <span style={{ color: '#64748b', fontSize: 12 }}>
                  Rol: <strong style={{ color: '#0f172a' }}>{roleOptions.find((item) => item.key === role)?.label}</strong>
                </span>
              </div>

              <button type="submit" disabled={anyLoading} className="auth-primary-btn" style={{ width: '100%', justifyContent: 'center' }}>
                {anyLoading ? <><Loader2 size={18} className="animate-spin" /> Gözləyin...</> : <>Daxil ol <ArrowRight size={16} /></>}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 12px' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(148,163,184,0.2)' }} />
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>və ya</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(148,163,184,0.2)' }} />
            </div>

            <button
              className="auth-social-btn"
              type="button"
              onClick={() => { window.location.href = `${BACKEND}/commerce/mehsullar/auth/google` }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Google ilə davam et
            </button>

            <button
              className="auth-social-btn"
              type="button"
              onClick={() => { window.location.href = `${BACKEND}/commerce/mehsullar/auth/apple` }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Apple ilə davam et
            </button>

            <div style={{ marginTop: 18, textAlign: 'center', color: '#64748b', fontSize: 13 }}>
              {role === 'blogger'
                ? <>Blogger hesabın yoxdur? <Link to="/blogger/register" style={{ color: '#be123c', fontWeight: 800, textDecoration: 'none' }}>Qeydiyyat</Link></>
                : <>Hesabın yoxdur? <Link to="/register" style={{ color: '#be123c', fontWeight: 800, textDecoration: 'none' }}>Qeydiyyatdan keç</Link></>
              }
              <div style={{ marginTop: 12, fontSize: 12 }}>
                Daxil olmaqla <Link to="/terms" style={{ color: '#0f172a', fontWeight: 700, textDecoration: 'none' }}>şərtlər və qaydalar</Link> ilə razılaşırsınız.
              </div>
            </div>
          </div>
        </div>

        <aside className="auth-showcase">
          <div className="auth-showcase-card">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Brendex access
            </div>
            <h2 style={{ margin: '18px 0 10px', fontSize: 42, lineHeight: 1.05, letterSpacing: '-0.05em', fontWeight: 900 }}>
              Bir girişlə daha peşəkar panel təcrübəsi
            </h2>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', lineHeight: 1.75, fontSize: 15 }}>
              Yeni dizayn auth ekranını sadəcə forma kimi yox, məhsul keyfiyyəti hissi verən giriş qapısı kimi təqdim edir.
            </p>

            <div className="auth-showcase-list">
              {featurePoints.map((item) => (
                <div key={item} className="auth-showcase-item">{item}</div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}

export default Login
