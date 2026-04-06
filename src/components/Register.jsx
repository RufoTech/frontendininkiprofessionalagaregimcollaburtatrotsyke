import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useRegisterMutation } from '../redux/api/authApi'
import { registerBlogger } from '../slices/bloggerSlice'
import {
  User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2,
  CheckCircle, Store, MapPin, Phone, FileText, Hash,
  Copy, ExternalLink, Rss, ShieldCheck
} from 'lucide-react'
import toast from 'react-hot-toast'

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('user') // 'user' | 'admin' | 'blogger'

  // ── İstifadəçi / Admin formu ──
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'user', storeName: '', storeAddress: '',
    phone: '', taxNumber: '', vonNumber: '',
  })
  const [showPassword, setShowPassword]           = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [storeLink, setStoreLink]                 = useState(null)

  // ── Blogger formu ──
  const [bloggerForm, setBloggerForm] = useState({
    firstName: '', lastName: '', fatherName: '',
    email: '', phone: '', password: '', confirmPassword: '',
  })
  const [showBloggerPw, setShowBloggerPw]     = useState(false)
  const [bloggerLoading, setBloggerLoading]   = useState(false)

  const [register, { isLoading, isSuccess, error }] = useRegisterMutation()
  const { isAuthenticated } = useSelector((state) => state.userSlice)

  useEffect(() => {
    if (isAuthenticated && !(activeTab === 'admin' && storeLink)) {
      navigate('/home', { replace: true })
    }
  }, [activeTab, isAuthenticated, navigate, storeLink])

  useEffect(() => {
    if (isSuccess) {
      toast.success("Hesab uğurla yaradıldı!")
    }
    if (error) toast.error(error?.data?.message || "Qeydiyyat zamanı xəta baş verdi")
  }, [error, isSuccess])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleBloggerChange = (e) => {
    const { name, value } = e.target
    setBloggerForm(prev => ({ ...prev, [name]: value }))
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setFormData(prev => ({ ...prev, role: tab === 'blogger' ? 'user' : tab }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) { toast.error("Şifrələr eyni deyil"); return }
    if (formData.password.length < 8) { toast.error("Şifrə ən azı 8 simvol olmalıdır"); return }
    try {
      const payload = { 
        name: formData.name, 
        email: formData.email, 
        password: formData.password, // Changed from confirmPassword to password for clarity
        role: formData.role 
      }
      if (formData.role === 'admin') {
        payload.storeName    = formData.storeName
        payload.storeAddress = formData.storeAddress
        payload.phone        = formData.phone
        payload.taxNumber    = formData.taxNumber
        payload.vonNumber    = formData.vonNumber
      }
      const result = await register(payload).unwrap()
      if (formData.role === 'admin' && result?.storeSlug)
        setStoreLink(result?.storeLink || `${window.location.origin}/store/${result.storeSlug}`)
    } catch (_) {}
  }

  const handleBloggerSubmit = async (e) => {
    e.preventDefault()
    if (bloggerForm.password !== bloggerForm.confirmPassword) { toast.error("Şifrələr eyni deyil"); return }
    if (bloggerForm.password.length < 8) { toast.error("Şifrə ən azı 8 simvol olmalıdır"); return }
    setBloggerLoading(true)
    try {
      await dispatch(registerBlogger({
        firstName:  bloggerForm.firstName,
        lastName:   bloggerForm.lastName,
        fatherName: bloggerForm.fatherName,
        email:      bloggerForm.email,
        phone:      bloggerForm.phone,
        password:   bloggerForm.password,
      })).unwrap()
      toast.success("Blogger hesabı yaradıldı!")
      navigate('/blogger/dashboard')
    } catch (err) {
      toast.error(err || "Qeydiyyat xətası")
    } finally {
      setBloggerLoading(false)
    }
  }

  const isAdmin = activeTab === 'admin'

  // ════════════════════════════════════════════
  // ── MAĞAZA LİNKİ EKRANI ──
  // Admin qeydiyyatdan keçdikdən sonra görünür
  // ════════════════════════════════════════════
  if (storeLink) {
    return (
      <>
        <style>{`
          .link-page {
            min-height: 100vh; display: flex; align-items: center;
            justify-content: center; background: #fff;
            font-family: 'Inter', sans-serif; padding: 20px;
          }
          .link-card {
            background: #fff; border-radius: 24px; padding: 48px 40px;
            max-width: 520px; width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.08);
            border: 1.5px solid #f0f0f0; text-align: center;
          }
          .link-icon-wrap {
            width: 72px; height: 72px; background: #fff0f1; border-radius: 20px;
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 24px;
          }
          .link-title { font-family: 'Inter', sans-serif; font-size: 26px; font-weight: 800; color: #111; margin: 0 0 8px; }
          .link-sub { font-size: 14px; color: #888; margin: 0 0 32px; }
          .link-box {
            background: #fafafa; border: 1.5px solid #eee; border-radius: 14px;
            padding: 16px 20px; display: flex; align-items: center;
            justify-content: space-between; gap: 12px; margin-bottom: 16px; text-align: left;
          }
          .link-url { font-size: 13px; color: #E8192C; font-weight: 600; word-break: break-all; flex: 1; }
          .link-copy-btn {
            background: #E8192C; border: none; border-radius: 9px;
            width: 36px; height: 36px; display: flex; align-items: center;
            justify-content: center; cursor: pointer; flex-shrink: 0; transition: background 0.2s;
          }
          .link-copy-btn:hover { background: #c8111f; }
          .link-open-btn {
            width: 100%; padding: 13px; background: #E8192C; color: #fff;
            border: none; border-radius: 12px; font-family: 'Inter', sans-serif;
            font-size: 15px; font-weight: 700; cursor: pointer;
            display: flex; align-items: center; justify-content: center; gap: 8px;
            margin-bottom: 12px; transition: background 0.2s, transform 0.15s;
            box-shadow: 0 4px 16px rgba(232,25,44,0.25); text-decoration: none;
          }
          .link-open-btn:hover { background: #c8111f; transform: translateY(-1px); }
          .link-login-btn {
            width: 100%; padding: 13px; background: transparent; color: #888;
            border: 1.5px solid #eee; border-radius: 12px; font-family: 'Inter', sans-serif;
            font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s;
          }
          .link-login-btn:hover { border-color: #E8192C; color: #E8192C; }
          .link-note { font-size: 12px; color: #bbb; margin-top: 20px; line-height: 1.6; }
        `}</style>

        <div className="link-page">
          <div className="link-card">
            <div className="link-icon-wrap">
              <Store size={32} color="#E8192C" />
            </div>
            <h2 className="link-title">Mağazanız hazırdır! 🎉</h2>
            <p className="link-sub">
              Aşağıdakı unikal link sizin mağaza səhifənizdir.<br />
              Bu linki saxlayın — müştərilərinizlə paylaşa bilərsiniz.
            </p>

            <div className="link-box">
              <span className="link-url">{storeLink}</span>
              <button
                className="link-copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(storeLink)
                  toast.success("Link kopyalandı!")
                }}
                title="Kopyala"
              >
                <Copy size={15} color="#fff" />
              </button>
            </div>

            <a href={storeLink} target="_blank" rel="noreferrer" className="link-open-btn">
              <ExternalLink size={16} />
              Mağazamı Aç
            </a>

            <button className="link-login-btn" onClick={() => navigate('/login')}>
              Girişə keç
            </button>

            <p className="link-note">
              ⚠️ Bu linki yadda saxlayın.<br />
              <strong>{storeLink}</strong> ünvanından mağazanıza daxil ola bilərsiniz.
            </p>
          </div>
        </div>
      </>
    )
  }

  // ════════════════════════════════════════════
  // ── ƏSAS QEYDİYYAT FORMU ──
  // ════════════════════════════════════════════
  return (
    <>
      <style>{`
        .reg-root { min-height: 100vh; display: flex; font-family: 'Inter', sans-serif; background: #fff; }
        .reg-left { flex: 0 0 520px; display: flex; flex-direction: column; justify-content: center; padding: 48px 52px; position: relative; z-index: 2; background: #fff; overflow-y: auto; }
        .reg-logo { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 32px; text-decoration: none; }
        .reg-logo-icon { width: 40px; height: 40px; background: #E8192C; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; font-weight: 800; font-size: 22px; color: #fff; box-shadow: 0 4px 14px rgba(232,25,44,0.35); }
        .reg-logo-name { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 22px; color: #111; letter-spacing: -0.5px; }
        .reg-logo-name span { color: #E8192C; }
        .reg-heading { font-family: 'Inter', sans-serif; font-size: 26px; font-weight: 800; color: #111; line-height: 1.2; margin: 0 0 6px; }
        .reg-sub { font-size: 13px; color: #888; margin: 0 0 24px; }
        .role-toggle { display: flex; background: #f4f4f4; border-radius: 12px; padding: 4px; margin-bottom: 24px; gap: 4px; }
        .role-btn { flex: 1; padding: 10px 12px; border: none; border-radius: 9px; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; background: transparent; color: #888; transition: all 0.22s ease; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .role-btn.active { background: #fff; color: #E8192C; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
        .role-btn:hover:not(.active) { color: #555; }
        .reg-form { display: flex; flex-direction: column; gap: 15px; }
        .reg-label { display: block; font-size: 12px; font-weight: 500; color: #444; margin-bottom: 5px; }
        .reg-input-wrap { position: relative; }
        .reg-input-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #bbb; width: 15px; height: 15px; pointer-events: none; }
        .reg-input { width: 100%; padding: 11px 13px 11px 40px; border: 1.5px solid #eee; border-radius: 11px; background: #fafafa; font-size: max(16px, 13.5px); font-family: 'Inter', sans-serif; color: #111; outline: none; transition: border-color 0.2s, background 0.2s, box-shadow 0.2s; box-sizing: border-box; }
        .reg-input:focus { border-color: #E8192C; background: #fff; box-shadow: 0 0 0 3px rgba(232,25,44,0.07); }
        .reg-input::placeholder { color: #ccc; }
        .reg-eye-btn { position: absolute; right: 13px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #bbb; display: flex; padding: 0; transition: color 0.2s; }
        .reg-eye-btn:hover { color: #E8192C; }
        .seller-section { border: 1.5px dashed #f0c0c5; border-radius: 14px; padding: 18px; background: #fff8f8; display: flex; flex-direction: column; gap: 14px; animation: fadeIn 0.3s ease; }
        .seller-section-title { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; color: #E8192C; text-transform: uppercase; letter-spacing: 1.5px; margin: 0; display: flex; align-items: center; gap: 6px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .reg-btn { width: 100%; padding: 13px; background: #E8192C; color: #fff; border: none; border-radius: 12px; font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 4px; transition: background 0.2s, transform 0.15s, box-shadow 0.2s; box-shadow: 0 4px 16px rgba(232,25,44,0.25); }
        .reg-btn:hover:not(:disabled) { background: #c8111f; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(232,25,44,0.35); }
        .reg-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .reg-login-link { text-align: center; margin-top: 20px; font-size: 13px; color: #888; }
        .reg-login-link a { color: #E8192C; font-weight: 600; text-decoration: none; }
        .reg-login-link a:hover { text-decoration: underline; }
        .reg-right { flex: 1; position: relative; overflow: hidden; background: #0f0606; display: none; }
        @media (min-width: 1024px) { .reg-right { display: block; } }
        .reg-right-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.25; }
        .reg-right-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, #E8192C 0%, #7a0010 60%, #1a0003 100%); opacity: 0.88; }
        .reg-right-circle { position: absolute; width: 420px; height: 420px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.08); top: -80px; right: -80px; }
        .reg-right-circle2 { position: absolute; width: 260px; height: 260px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.06); bottom: 40px; left: -60px; }
        .reg-right-content { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; padding: 64px; color: #fff; }
        .reg-right-tagline { font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.5); margin-bottom: 20px; }
        .reg-right-title { font-family: 'Inter', sans-serif; font-size: 38px; font-weight: 800; line-height: 1.15; margin: 0 0 32px; color: #fff; }
        .reg-features { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px; }
        .reg-feature-item { display: flex; align-items: center; gap: 14px; font-size: 15px; color: rgba(255,255,255,0.85); }
        .reg-feature-dot { width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.12); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .reg-divider { width: 40px; height: 3px; background: #E8192C; border-radius: 2px; margin-bottom: 28px; }
        @media (max-width: 640px) { .reg-left { padding: 32px 20px; flex: 1; } }
      `}</style>

      <div className="reg-root">
        <div className="reg-left">
          <Link to="/" className="reg-logo">
            <div className="reg-logo-icon">B</div>
            <span className="reg-logo-name">BREND<span>EX</span></span>
          </Link>

          <h2 className="reg-heading">Yeni Hesab Yaradın 🚀</h2>
          <p className="reg-sub">Bütün imkanlardan yararlanmaq üçün qeydiyyatdan keçin.</p>

          <div className="role-toggle">
            <button type="button" className={`role-btn ${activeTab === 'user' ? 'active' : ''}`} onClick={() => handleTabChange('user')}>
              <User size={14} /> Alıcı
            </button>
            <button type="button" className={`role-btn ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => handleTabChange('admin')}>
              <Store size={14} /> Satıcı
            </button>
            <button type="button" className={`role-btn ${activeTab === 'blogger' ? 'active' : ''}`} onClick={() => handleTabChange('blogger')}>
              <Rss size={14} /> Blogger
            </button>
            <button type="button" className="role-btn" onClick={() => navigate('/superadmin/register')}>
              <ShieldCheck size={14} /> SuperAdmin
            </button>
          </div>

          {/* ── BLOGGER FORMU ── */}
          {activeTab === 'blogger' && (
            <form onSubmit={handleBloggerSubmit} className="reg-form">
              <div className="seller-section" style={{ marginBottom: 0 }}>
                <p className="seller-section-title"><Rss size={13} /> Blogger Məlumatları</p>
                <div>
                  <label className="reg-label">Ad</label>
                  <div className="reg-input-wrap">
                    <User className="reg-input-icon" />
                    <input type="text" name="firstName" value={bloggerForm.firstName} onChange={handleBloggerChange} required className="reg-input" placeholder="Adınız" />
                  </div>
                </div>
                <div>
                  <label className="reg-label">Soyad</label>
                  <div className="reg-input-wrap">
                    <User className="reg-input-icon" />
                    <input type="text" name="lastName" value={bloggerForm.lastName} onChange={handleBloggerChange} required className="reg-input" placeholder="Soyadınız" />
                  </div>
                </div>
                <div>
                  <label className="reg-label">Ata adı</label>
                  <div className="reg-input-wrap">
                    <User className="reg-input-icon" />
                    <input type="text" name="fatherName" value={bloggerForm.fatherName} onChange={handleBloggerChange} className="reg-input" placeholder="Ata adı (istəyə bağlı)" />
                  </div>
                </div>
                <div>
                  <label className="reg-label">E-poçt</label>
                  <div className="reg-input-wrap">
                    <Mail className="reg-input-icon" />
                    <input type="email" name="email" value={bloggerForm.email} onChange={handleBloggerChange} required className="reg-input" placeholder="email@nümunə.com" />
                  </div>
                </div>
                <div>
                  <label className="reg-label">Telefon</label>
                  <div className="reg-input-wrap">
                    <Phone className="reg-input-icon" />
                    <input type="tel" name="phone" value={bloggerForm.phone} onChange={handleBloggerChange} className="reg-input" placeholder="+994 50 000 00 00" />
                  </div>
                </div>
                <div>
                  <label className="reg-label">Şifrə</label>
                  <div className="reg-input-wrap">
                    <Lock className="reg-input-icon" />
                    <input type={showBloggerPw ? "text" : "password"} name="password" value={bloggerForm.password} onChange={handleBloggerChange} required className="reg-input" placeholder="••••••" />
                    <button type="button" className="reg-eye-btn" onClick={() => setShowBloggerPw(p => !p)}>
                      {showBloggerPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="reg-label">Şifrənin Təkrarı</label>
                  <div className="reg-input-wrap">
                    <Lock className="reg-input-icon" />
                    <input type="password" name="confirmPassword" value={bloggerForm.confirmPassword} onChange={handleBloggerChange} required className="reg-input" placeholder="••••••" />
                  </div>
                </div>
              </div>
              <button type="submit" disabled={bloggerLoading} className="reg-btn">
                {bloggerLoading ? <><Loader2 size={18} className="animate-spin" /> Qeydiyyat gedir...</> : <>Blogger Ol <ArrowRight size={16} /></>}
              </button>
            </form>
          )}

          {/* ── USER / ADMIN FORMU ── */}
          {activeTab !== 'blogger' && (
          <form onSubmit={handleSubmit} className="reg-form">
            <div>
              <label className="reg-label">Ad və Soyad</label>
              <div className="reg-input-wrap">
                <User className="reg-input-icon" />
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="reg-input" placeholder="Adınız" />
              </div>
            </div>
            <div>
              <label className="reg-label">E-poçt ünvanı</label>
              <div className="reg-input-wrap">
                <Mail className="reg-input-icon" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="reg-input" placeholder="nümunə@mail.com" />
              </div>
            </div>
            <div>
              <label className="reg-label">Şifrə</label>
              <div className="reg-input-wrap">
                <Lock className="reg-input-icon" />
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required className="reg-input" placeholder="••••••••" />
                <button type="button" className="reg-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="reg-label">Şifrənin Təkrarı</label>
              <div className="reg-input-wrap">
                <Lock className="reg-input-icon" />
                <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="reg-input" placeholder="••••••••" />
                <button type="button" className="reg-eye-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Satıcı məlumatları */}
            {isAdmin && (
              <div className="seller-section">
                <p className="seller-section-title">
                  <Store size={13} /> Mağaza Məlumatları
                </p>
                <div>
                  <label className="reg-label">Mağaza Adı</label>
                  <div className="reg-input-wrap">
                    <Store className="reg-input-icon" />
                    <input type="text" name="storeName" value={formData.storeName} onChange={handleChange} required={isAdmin} className="reg-input" placeholder="Mağazanızın adı" />
                  </div>
                </div>
                <div>
                  <label className="reg-label">Mağaza Ünvanı</label>
                  <div className="reg-input-wrap">
                    <MapPin className="reg-input-icon" />
                    <input type="text" name="storeAddress" value={formData.storeAddress} onChange={handleChange} required={isAdmin} className="reg-input" placeholder="Ünvan" />
                  </div>
                </div>
                <div>
                  <label className="reg-label">Telefon Nömrəsi</label>
                  <div className="reg-input-wrap">
                    <Phone className="reg-input-icon" />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required={isAdmin} className="reg-input" placeholder="+994 50 000 00 00" />
                  </div>
                </div>
                <div>
                  <label className="reg-label">Vergi Nömrəsi</label>
                  <div className="reg-input-wrap">
                    <FileText className="reg-input-icon" />
                    <input type="text" name="taxNumber" value={formData.taxNumber} onChange={handleChange} required={isAdmin} className="reg-input" placeholder="VÖEN" />
                  </div>
                </div>
                <div>
                  <label className="reg-label">VÖN Nömrəsi</label>
                  <div className="reg-input-wrap">
                    <Hash className="reg-input-icon" />
                    <input type="text" name="vonNumber" value={formData.vonNumber} onChange={handleChange} required={isAdmin} className="reg-input" placeholder="VÖN" />
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={isLoading} className="reg-btn">
              {isLoading ? (
                <><Loader2 size={18} className="animate-spin" /> Qeydiyyat gedir...</>
              ) : (
                <>Qeydiyyatı Tamamla <ArrowRight size={16} /></>
              )}
            </button>
          </form>
          )}

          <div className="reg-login-link">
            Artıq hesabınız var?{" "}
            <Link to="/login">Giriş edin</Link>
            <div style={{ marginTop: 12, fontSize: 11 }}>
              Qeydiyyatdan keçməklə <Link to="/terms" style={{ fontWeight: 600 }}>Şərtlər və Qaydalar</Link>ımızı qəbul edirsiniz.
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="reg-right">
          <img className="reg-right-img" src="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=2070&auto=format&fit=crop" alt="" />
          <div className="reg-right-overlay" />
          <div className="reg-right-circle" />
          <div className="reg-right-circle2" />
          <div className="reg-right-content">
            <p className="reg-right-tagline">Brendex platforması</p>
            <div className="reg-divider" />
            <h3 className="reg-right-title">
              {isAdmin ? 'Satıcı Hesabı ilə Çox Qazanın' : activeTab === 'blogger' ? 'Blogger Ol, Qazanmağa Başla' : 'Bizə Qoşulun və İmkanlardan Yararlanın'}
            </h3>
            <ul className="reg-features">
              {activeTab === 'blogger' ? (
                <>
                  <li className="reg-feature-item"><div className="reg-feature-dot"><CheckCircle size={14} color="#fff" /></div>Unikal promo kod alın</li>
                  <li className="reg-feature-item"><div className="reg-feature-dot"><CheckCircle size={14} color="#fff" /></div>Hər satışdan komissiya qazanın</li>
                  <li className="reg-feature-item"><div className="reg-feature-dot"><CheckCircle size={14} color="#fff" /></div>Panelinizi real vaxtda izləyin</li>
                </>
              ) : isAdmin ? (
                <>
                  <li className="reg-feature-item"><div className="reg-feature-dot"><CheckCircle size={14} color="#fff" /></div>Öz mağazanızı asanlıqla idarə edin</li>
                  <li className="reg-feature-item"><div className="reg-feature-dot"><CheckCircle size={14} color="#fff" /></div>Minlərlə müştəriyə çatın</li>
                  <li className="reg-feature-item"><div className="reg-feature-dot"><CheckCircle size={14} color="#fff" /></div>Satışlarınızı real vaxtda izləyin</li>
                </>
              ) : (
                <>
                  <li className="reg-feature-item"><div className="reg-feature-dot"><CheckCircle size={14} color="#fff" /></div>Eksklüziv endirimlər və kampaniyalar</li>
                  <li className="reg-feature-item"><div className="reg-feature-dot"><CheckCircle size={14} color="#fff" /></div>Sürətli və təhlükəsiz çatdırılma</li>
                  <li className="reg-feature-item"><div className="reg-feature-dot"><CheckCircle size={14} color="#fff" /></div>24/7 Müştəri dəstəyi</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register
