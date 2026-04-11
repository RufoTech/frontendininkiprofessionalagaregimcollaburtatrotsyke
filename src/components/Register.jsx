import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useRegisterMutation } from '../redux/api/authApi'
import { registerBlogger } from '../slices/bloggerSlice'
import {
  ArrowRight,
  CheckCircle,
  Copy,
  Eye,
  EyeOff,
  ExternalLink,
  FileText,
  Hash,
  Lock,
  Mail,
  MapPin,
  Phone,
  Rss,
  ShieldCheck,
  Store,
  User,
} from 'lucide-react'
import toast from 'react-hot-toast'

const tabs = [
  { key: 'user', label: 'Alıcı', icon: User },
  { key: 'admin', label: 'Satıcı', icon: Store },
  { key: 'blogger', label: 'Blogger', icon: Rss },
]

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('user')
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'user', storeName: '', storeAddress: '',
    phone: '', taxNumber: '', vonNumber: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [storeLink, setStoreLink] = useState(null)
  const [bloggerForm, setBloggerForm] = useState({
    firstName: '', lastName: '', fatherName: '',
    email: '', phone: '', password: '', confirmPassword: '',
  })
  const [showBloggerPw, setShowBloggerPw] = useState(false)
  const [showBloggerConfirmPw, setShowBloggerConfirmPw] = useState(false)
  const [bloggerLoading, setBloggerLoading] = useState(false)

  const [register, { isLoading, isSuccess, error }] = useRegisterMutation()
  const { isAuthenticated } = useSelector((state) => state.userSlice)

  useEffect(() => {
    if (isAuthenticated && !(activeTab === 'admin' && storeLink)) {
      navigate('/home', { replace: true })
    }
  }, [activeTab, isAuthenticated, navigate, storeLink])

  useEffect(() => {
    if (isSuccess) toast.success('Hesab uğurla yaradıldı!')
    if (error) toast.error(error?.data?.message || 'Qeydiyyat zamanı xəta baş verdi')
  }, [error, isSuccess])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleBloggerChange = (event) => {
    const { name, value } = event.target
    setBloggerForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setFormData((prev) => ({ ...prev, role: tab === 'blogger' ? 'user' : tab }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      toast.error('Şifrələr eyni deyil')
      return
    }
    if (formData.password.length < 8) {
      toast.error('Şifrə ən azı 8 simvol olmalıdır')
      return
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      }

      if (formData.role === 'admin') {
        payload.storeName = formData.storeName
        payload.storeAddress = formData.storeAddress
        payload.phone = formData.phone
        payload.taxNumber = formData.taxNumber
        payload.vonNumber = formData.vonNumber
      }

      const result = await register(payload).unwrap()
      if (formData.role === 'admin' && result?.storeSlug) {
        setStoreLink(result?.storeLink || `${window.location.origin}/store/${result.storeSlug}`)
      }
    } catch {
      // Toast is handled above via RTK error state.
    }
  }

  const handleBloggerSubmit = async (event) => {
    event.preventDefault()
    if (bloggerForm.password !== bloggerForm.confirmPassword) {
      toast.error('Şifrələr eyni deyil')
      return
    }
    if (bloggerForm.password.length < 8) {
      toast.error('Şifrə ən azı 8 simvol olmalıdır')
      return
    }

    setBloggerLoading(true)
    try {
      await dispatch(registerBlogger({
        firstName: bloggerForm.firstName,
        lastName: bloggerForm.lastName,
        fatherName: bloggerForm.fatherName,
        email: bloggerForm.email,
        phone: bloggerForm.phone,
        password: bloggerForm.password,
      })).unwrap()
      toast.success('Blogger hesabı yaradıldı!')
      navigate('/blogger/dashboard')
    } catch (registerError) {
      toast.error(registerError || 'Qeydiyyat xətası')
    } finally {
      setBloggerLoading(false)
    }
  }

  const isAdmin = activeTab === 'admin'

  if (storeLink) {
    return (
      <>
        <style>{`
          .store-link-page {
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 24px;
            font-family: 'Inter', sans-serif;
          }
          .store-link-card {
            width: min(100%, 620px);
            border-radius: 34px;
            padding: 34px;
            background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.94));
            border: 1px solid rgba(148,163,184,0.18);
            box-shadow: 0 28px 60px rgba(15,23,42,0.12);
          }
        `}</style>
        <div className="store-link-page">
          <div className="store-link-card">
            <div style={{ width: 72, height: 72, borderRadius: 24, background: 'linear-gradient(135deg,#e8192c,#fb7185)', color: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 20px 32px rgba(232,25,44,0.28)' }}>
              <Store size={32} />
            </div>

            <h1 style={{ margin: '22px 0 8px', fontSize: 34, fontWeight: 900, letterSpacing: '-0.05em', color: '#0f172a' }}>
              Mağaza linkiniz hazırdır
            </h1>
            <p style={{ margin: 0, color: '#64748b', lineHeight: 1.75 }}>
              Qeydiyyat tamamlandı. Mağaza səhifənizi paylaşmaq və dərhal idarə etmək üçün link aşağıda toplandı.
            </p>

            <div style={{ marginTop: 22, borderRadius: 20, background: 'rgba(232,25,44,0.05)', border: '1px solid rgba(232,25,44,0.14)', padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#be123c', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                Unikal mağaza linki
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 220, padding: '12px 14px', borderRadius: 16, background: '#fff', border: '1px solid rgba(148,163,184,0.18)', color: '#be123c', fontWeight: 700, wordBreak: 'break-all' }}>
                  {storeLink}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(storeLink)
                    toast.success('Link kopyalandı!')
                  }}
                  style={{ width: 46, height: 46, borderRadius: 16, border: 'none', background: '#e8192c', color: '#fff', cursor: 'pointer' }}
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>

            <a
              href={storeLink}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                height: 54,
                marginTop: 18,
                borderRadius: 18,
                textDecoration: 'none',
                background: 'linear-gradient(135deg,#e8192c,#be123c)',
                color: '#fff',
                fontWeight: 800,
                boxShadow: '0 18px 30px rgba(232,25,44,0.24)',
              }}
            >
              <ExternalLink size={16} />
              Mağazamı aç
            </a>

            <button
              onClick={() => navigate('/login')}
              style={{
                width: '100%',
                height: 50,
                marginTop: 12,
                borderRadius: 18,
                border: '1px solid rgba(148,163,184,0.18)',
                background: '#fff',
                color: '#475569',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Girişə keç
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{`
        .register-layout {
          min-height: 100vh;
          display: grid;
          grid-template-columns: minmax(0, 520px) minmax(0, 1fr);
          font-family: 'Inter', sans-serif;
        }
        .register-pane {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 28px;
        }
        .register-card {
          width: min(100%, 460px);
          border-radius: 32px;
          padding: 28px;
          background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.92));
          border: 1px solid rgba(148,163,184,0.18);
          box-shadow: 0 28px 60px rgba(15,23,42,0.12);
        }
        .register-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          text-decoration: none;
          color: #0f172a;
        }
        .register-brand-badge {
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
        .register-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin: 20px 0;
        }
        .register-tab {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(148,163,184,0.18);
          background: #fff;
          color: #64748b;
          border-radius: 999px;
          padding: 10px 14px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }
        .register-tab.active {
          color: #fff;
          border-color: transparent;
          background: linear-gradient(135deg,#e8192c,#be123c);
          box-shadow: 0 14px 24px rgba(232,25,44,0.2);
        }
        .register-field {
          margin-bottom: 14px;
        }
        .register-label {
          display: block;
          margin-bottom: 8px;
          color: #334155;
          font-size: 13px;
          font-weight: 700;
        }
        .register-input-wrap {
          position: relative;
        }
        .register-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }
        .register-input {
          width: 100%;
          min-height: 54px;
          border-radius: 16px;
          border: 1px solid rgba(148,163,184,0.2);
          background: rgba(248,250,252,0.9);
          padding: 0 16px 0 44px;
          color: #0f172a;
          outline: none;
          transition: border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease;
        }
        .register-input:focus {
          border-color: rgba(232,25,44,0.5);
          background: #fff;
          box-shadow: 0 0 0 5px rgba(232,25,44,0.08);
        }
        .register-eye {
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
        .register-panel {
          margin-top: 16px;
          border-radius: 22px;
          padding: 18px;
          background: rgba(232,25,44,0.05);
          border: 1px solid rgba(232,25,44,0.12);
        }
        .register-submit {
          width: 100%;
          height: 54px;
          margin-top: 6px;
          border: none;
          border-radius: 18px;
          background: linear-gradient(135deg,#e8192c,#be123c);
          color: #fff;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 18px 30px rgba(232,25,44,0.24);
        }
        .register-showcase {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 42px;
          background: linear-gradient(140deg, #25070b 0%, #7f1520 45%, #ef4444 100%);
        }
        .register-showcase::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 16% 18%, rgba(255,255,255,0.14), transparent 22%),
            radial-gradient(circle at 84% 20%, rgba(255,255,255,0.12), transparent 18%),
            radial-gradient(circle at 58% 80%, rgba(255,255,255,0.08), transparent 20%);
        }
        .register-showcase-card {
          position: relative;
          z-index: 1;
          width: min(100%, 600px);
          padding: 34px;
          border-radius: 34px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(18px);
          color: #fff;
          box-shadow: 0 26px 60px rgba(0,0,0,0.18);
        }
        .register-showcase-list {
          display: grid;
          gap: 12px;
          margin-top: 22px;
        }
        .register-showcase-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 18px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
        }
        @media (max-width: 980px) {
          .register-layout {
            grid-template-columns: 1fr;
          }
          .register-showcase {
            display: none;
          }
          .register-pane {
            padding: 16px;
          }
          .register-card {
            padding: 22px;
            border-radius: 24px;
          }
        }
      `}</style>

      <div className="auth-spotlight" />

      <div className="register-layout">
        <div className="register-pane">
          <div className="register-card">
            <Link to="/" className="register-brand">
              <div className="register-brand-badge">B</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.04em' }}>BRENDEX</div>
                <div style={{ color: '#64748b', fontSize: 12, fontWeight: 600 }}>Registration experience redesigned</div>
              </div>
            </Link>

            <h1 style={{ margin: 0, fontSize: 34, fontWeight: 900, letterSpacing: '-0.05em', color: '#0f172a' }}>
              Yeni hesab yarat
            </h1>
            <p style={{ margin: '10px 0 0', color: '#64748b', lineHeight: 1.7 }}>
              Qeydiyyat axını indi daha nizamlıdır və alıcı, satıcı, blogger ssenarilərini daha səliqəli ayırır.
            </p>

            <div className="register-tabs">
              {tabs.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  className={`register-tab ${activeTab === key ? 'active' : ''}`}
                  onClick={() => handleTabChange(key)}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
              <button type="button" className="register-tab" onClick={() => navigate('/superadmin/register')}>
                <ShieldCheck size={14} />
                SuperAdmin
              </button>
            </div>

            {activeTab === 'blogger' ? (
              <form onSubmit={handleBloggerSubmit}>
                <div className="register-panel" style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#be123c', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                    Blogger məlumatları
                  </div>

                  <div className="register-field">
                    <label className="register-label">Ad</label>
                    <div className="register-input-wrap">
                      <User className="register-input-icon" size={16} />
                      <input className="register-input" name="firstName" value={bloggerForm.firstName} onChange={handleBloggerChange} required placeholder="Adınız" />
                    </div>
                  </div>

                  <div className="register-field">
                    <label className="register-label">Soyad</label>
                    <div className="register-input-wrap">
                      <User className="register-input-icon" size={16} />
                      <input className="register-input" name="lastName" value={bloggerForm.lastName} onChange={handleBloggerChange} required placeholder="Soyadınız" />
                    </div>
                  </div>

                  <div className="register-field">
                    <label className="register-label">Ata adı</label>
                    <div className="register-input-wrap">
                      <User className="register-input-icon" size={16} />
                      <input className="register-input" name="fatherName" value={bloggerForm.fatherName} onChange={handleBloggerChange} placeholder="İstəyə bağlı" />
                    </div>
                  </div>

                  <div className="register-field">
                    <label className="register-label">E-poçt</label>
                    <div className="register-input-wrap">
                      <Mail className="register-input-icon" size={16} />
                      <input className="register-input" type="email" name="email" value={bloggerForm.email} onChange={handleBloggerChange} required placeholder="email@numune.com" />
                    </div>
                  </div>

                  <div className="register-field">
                    <label className="register-label">Telefon</label>
                    <div className="register-input-wrap">
                      <Phone className="register-input-icon" size={16} />
                      <input className="register-input" name="phone" value={bloggerForm.phone} onChange={handleBloggerChange} placeholder="+994 50 000 00 00" />
                    </div>
                  </div>

                  <div className="register-field">
                    <label className="register-label">Şifrə</label>
                    <div className="register-input-wrap">
                      <Lock className="register-input-icon" size={16} />
                      <input className="register-input" type={showBloggerPw ? 'text' : 'password'} name="password" value={bloggerForm.password} onChange={handleBloggerChange} required placeholder="••••••••" />
                      <button type="button" className="register-eye" onClick={() => setShowBloggerPw((prev) => !prev)}>
                        {showBloggerPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="register-field" style={{ marginBottom: 0 }}>
                    <label className="register-label">Şifrənin təkrarı</label>
                    <div className="register-input-wrap">
                      <Lock className="register-input-icon" size={16} />
                      <input className="register-input" type={showBloggerConfirmPw ? 'text' : 'password'} name="confirmPassword" value={bloggerForm.confirmPassword} onChange={handleBloggerChange} required placeholder="••••••••" />
                      <button type="button" className="register-eye" onClick={() => setShowBloggerConfirmPw((prev) => !prev)}>
                        {showBloggerConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={bloggerLoading} className="register-submit">
                  {bloggerLoading ? <><ArrowRight size={16} className="animate-spin" /> Qeydiyyat gedir...</> : <>Blogger ol <ArrowRight size={16} /></>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="register-field">
                  <label className="register-label">Ad və soyad</label>
                  <div className="register-input-wrap">
                    <User className="register-input-icon" size={16} />
                    <input className="register-input" name="name" value={formData.name} onChange={handleChange} required placeholder="Adınız" />
                  </div>
                </div>

                <div className="register-field">
                  <label className="register-label">E-poçt</label>
                  <div className="register-input-wrap">
                    <Mail className="register-input-icon" size={16} />
                    <input className="register-input" type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="numune@mail.com" />
                  </div>
                </div>

                <div className="register-field">
                  <label className="register-label">Şifrə</label>
                  <div className="register-input-wrap">
                    <Lock className="register-input-icon" size={16} />
                    <input className="register-input" type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" />
                    <button type="button" className="register-eye" onClick={() => setShowPassword((prev) => !prev)}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="register-field">
                  <label className="register-label">Şifrənin təkrarı</label>
                  <div className="register-input-wrap">
                    <Lock className="register-input-icon" size={16} />
                    <input className="register-input" type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="••••••••" />
                    <button type="button" className="register-eye" onClick={() => setShowConfirmPassword((prev) => !prev)}>
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {isAdmin && (
                  <div className="register-panel">
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#be123c', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                      Mağaza məlumatları
                    </div>

                    <div className="register-field">
                      <label className="register-label">Mağaza adı</label>
                      <div className="register-input-wrap">
                        <Store className="register-input-icon" size={16} />
                        <input className="register-input" name="storeName" value={formData.storeName} onChange={handleChange} required={isAdmin} placeholder="Mağazanızın adı" />
                      </div>
                    </div>

                    <div className="register-field">
                      <label className="register-label">Mağaza ünvanı</label>
                      <div className="register-input-wrap">
                        <MapPin className="register-input-icon" size={16} />
                        <input className="register-input" name="storeAddress" value={formData.storeAddress} onChange={handleChange} required={isAdmin} placeholder="Ünvan" />
                      </div>
                    </div>

                    <div className="register-field">
                      <label className="register-label">Telefon</label>
                      <div className="register-input-wrap">
                        <Phone className="register-input-icon" size={16} />
                        <input className="register-input" name="phone" value={formData.phone} onChange={handleChange} required={isAdmin} placeholder="+994 50 000 00 00" />
                      </div>
                    </div>

                    <div className="register-field">
                      <label className="register-label">Vergi nömrəsi</label>
                      <div className="register-input-wrap">
                        <FileText className="register-input-icon" size={16} />
                        <input className="register-input" name="taxNumber" value={formData.taxNumber} onChange={handleChange} required={isAdmin} placeholder="VÖEN" />
                      </div>
                    </div>

                    <div className="register-field" style={{ marginBottom: 0 }}>
                      <label className="register-label">VÖN nömrəsi</label>
                      <div className="register-input-wrap">
                        <Hash className="register-input-icon" size={16} />
                        <input className="register-input" name="vonNumber" value={formData.vonNumber} onChange={handleChange} required={isAdmin} placeholder="VÖN" />
                      </div>
                    </div>
                  </div>
                )}

                <button type="submit" disabled={isLoading} className="register-submit">
                  {isLoading ? <><ArrowRight size={16} className="animate-spin" /> Qeydiyyat gedir...</> : <>Qeydiyyatı tamamla <ArrowRight size={16} /></>}
                </button>
              </form>
            )}

            <div style={{ marginTop: 18, textAlign: 'center', color: '#64748b', fontSize: 13 }}>
              Artıq hesabınız var? <Link to="/login" style={{ color: '#be123c', fontWeight: 800, textDecoration: 'none' }}>Giriş edin</Link>
              <div style={{ marginTop: 12, fontSize: 12 }}>
                Qeydiyyatdan keçməklə <Link to="/terms" style={{ color: '#0f172a', fontWeight: 700, textDecoration: 'none' }}>şərtlər və qaydalar</Link> ilə razılaşırsınız.
              </div>
            </div>
          </div>
        </div>

        <aside className="register-showcase">
          <div className="register-showcase-card">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Brendex onboarding
            </div>
            <h2 style={{ margin: '18px 0 10px', fontSize: 42, lineHeight: 1.05, letterSpacing: '-0.05em', fontWeight: 900 }}>
              {activeTab === 'blogger'
                ? 'Blogger kimi qoşul və satışdan komissiya qazan'
                : isAdmin
                  ? 'Mağazanı aç və satışları daha peşəkar idarə et'
                  : 'Yeni hesab yarat və daha rahat alış axınına başla'}
            </h2>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', lineHeight: 1.75, fontSize: 15 }}>
              Yeni vizual sistem qeydiyyat ekranını daha etibarlı göstərir və formaları istifadəçi üçün daha az yorucu edir.
            </p>

            <div className="register-showcase-list">
              {(activeTab === 'blogger'
                ? [
                    'Promo kod və komissiya yönümlü axın',
                    'Daha aydın şəxsi məlumat blokları',
                    'Blogger panelinə sürətli keçid',
                  ]
                : isAdmin
                  ? [
                      'Mağaza məlumatları üçün xüsusi blok',
                      'Qeydiyyatdan sonra mağaza linkinin birbaşa göstərilməsi',
                      'Daha peşəkar seller onboarding görünüşü',
                    ]
                  : [
                      'Sadə və anlaşılır istifadəçi qeydiyyatı',
                      'Daha güclü brend hissi',
                      'Mobil və desktop üçün daha rahat form ritmi',
                    ]
              ).map((item) => (
                <div key={item} className="register-showcase-item">
                  <CheckCircle size={18} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}

export default Register
