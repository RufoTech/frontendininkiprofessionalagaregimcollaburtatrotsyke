import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  User, Mail, Lock, Eye, EyeOff, Phone,
  ArrowRight, Loader2, CheckCircle, TrendingUp,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { registerBlogger } from '../../slices/bloggerSlice'

export default function BloggerRegister() {
  const dispatch   = useDispatch()
  const navigate   = useNavigate()
  const { loading } = useSelector((s) => s.blogger)

  const [form, setForm] = useState({
    firstName:  '',
    lastName:   '',
    fatherName: '',
    email:      '',
    phone:      '',
    password:   '',
    confirm:    '',
  })
  const [showPwd,  setShowPwd]  = useState(false)
  const [showConf, setShowConf] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      return toast.error('Ad, soyad, e-poçt və şifrə mütləqdir')
    }
    if (form.password !== form.confirm) {
      return toast.error('Şifrələr uyğun gəlmir')
    }
    if (form.password.length < 6) {
      return toast.error('Şifrə ən az 6 simvol olmalıdır')
    }

    try {
      await dispatch(registerBlogger({
        firstName:  form.firstName,
        lastName:   form.lastName,
        fatherName: form.fatherName,
        email:      form.email,
        phone:      form.phone,
        password:   form.password,
      })).unwrap()

      toast.success('Qeydiyyat uğurludur! Xoş gəldiniz 🎉')
      navigate('/blogger/dashboard')
    } catch (err) {
      toast.error(err || 'Qeydiyyat uğursuz oldu')
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .breg-root {
          min-height: 100vh; display: flex;
          font-family: 'DM Sans', sans-serif; background: #fff;
        }
        .breg-left {
          flex: 0 0 540px; display: flex; flex-direction: column;
          justify-content: center; padding: 40px 52px;
          background: #fff; overflow-y: auto;
        }
        @media (max-width: 900px) { .breg-left { flex: 1; padding: 32px 22px 48px; } }

        .breg-logo {
          display: inline-flex; align-items: center; gap: 10px;
          margin-bottom: 28px; text-decoration: none;
        }
        .breg-logo-icon {
          width: 40px; height: 40px; background: #E8192C; border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-weight: 800; font-size: 22px; color: #fff;
          box-shadow: 0 4px 14px rgba(232,25,44,0.3);
        }
        .breg-logo-name {
          font-family: 'Syne', sans-serif; font-weight: 800; font-size: 22px; color: #111;
        }
        .breg-logo-name span { color: #E8192C; }

        .breg-heading {
          font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800;
          color: #111; margin-bottom: 6px;
        }
        .breg-sub { font-size: 14px; color: #888; margin-bottom: 26px; }

        .breg-info-banner {
          background: #fff8f8; border: 1.5px dashed #f0c0c5; border-radius: 12px;
          padding: 12px 16px; display: flex; align-items: flex-start; gap: 10px;
          font-size: 13px; color: #c0343f; margin-bottom: 20px; line-height: 1.5;
        }

        .breg-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 480px) { .breg-grid { grid-template-columns: 1fr; } }

        .breg-field { display: flex; flex-direction: column; gap: 6px; }
        .breg-field.full { grid-column: 1 / -1; }

        .breg-label {
          font-size: 13px; font-weight: 600; color: #444;
        }
        .breg-input-wrap { position: relative; }
        .breg-input-icon {
          position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
          color: #bbb; pointer-events: none;
        }
        .breg-input {
          width: 100%; padding: 13px 13px 13px 42px;
          border: 1.5px solid #eee; border-radius: 12px;
          background: #fafafa; font-size: max(16px, 14px); outline: none;
          transition: 0.2s; box-sizing: border-box;
        }
        .breg-input:focus {
          border-color: #E8192C; background: #fff;
          box-shadow: 0 0 0 4px rgba(232,25,44,0.05);
        }
        .breg-eye {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #bbb; padding: 6px;
        }

        .breg-btn {
          width: 100%; padding: 14px; background: #E8192C; color: #fff;
          border: none; border-radius: 13px;
          font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          gap: 10px; margin-top: 6px; box-shadow: 0 4px 16px rgba(232,25,44,0.22);
          transition: 0.2s; min-height: 50px;
        }
        .breg-btn:hover:not(:disabled) { background: #c8111f; transform: translateY(-1px); }
        .breg-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .breg-footer { text-align: center; margin-top: 18px; font-size: 14px; color: #888; }

        .breg-right {
          flex: 1; background: #0f0606; display: none; position: relative; overflow: hidden;
        }
        @media (min-width: 901px) { .breg-right { display: block; } }
        .breg-right-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #E8192C 0%, #7a0010 60%, #1a0003 100%);
          opacity: 0.93; z-index: 1;
        }
        .breg-right-content {
          position: absolute; inset: 0; z-index: 2;
          display: flex; flex-direction: column; justify-content: center;
          padding: 80px; color: #fff;
        }
        .breg-right-title {
          font-family: 'Syne', sans-serif; font-size: 40px; font-weight: 800;
          line-height: 1.15; margin-bottom: 24px;
        }
        .breg-feature {
          display: flex; align-items: center; gap: 12px;
          color: rgba(255,255,255,0.9); font-size: 15px; margin-bottom: 14px;
        }
      `}</style>

      <div className="breg-root">
        {/* ── SOL PANEL ──────────────────────────────────────── */}
        <div className="breg-left">
          <Link to="/" className="breg-logo">
            <div className="breg-logo-icon">B</div>
            <span className="breg-logo-name">Brend<span>ex</span></span>
          </Link>

          <h2 className="breg-heading">Blogger Qeydiyyatı 🚀</h2>
          <p className="breg-sub">
            Referral sisteminə qoşulun, alıcılar gətirin, komissiya qazanın.
          </p>

          <div className="breg-info-banner">
            <TrendingUp size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>
              Qeydiyyatdan keçdikdən sonra promo kodunuz avtomatik yaradılır.
              Komissiya faiziniz admin tərəfindən təyin edilir (default: 40%).
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="breg-grid">
              {/* Ad */}
              <div className="breg-field">
                <label className="breg-label">Ad *</label>
                <div className="breg-input-wrap">
                  <User size={16} className="breg-input-icon" />
                  <input className="breg-input" name="firstName" value={form.firstName}
                    onChange={handleChange} placeholder="Adınız" required />
                </div>
              </div>

              {/* Soyad */}
              <div className="breg-field">
                <label className="breg-label">Soyad</label>
                <div className="breg-input-wrap">
                  <User size={16} className="breg-input-icon" />
                  <input className="breg-input" name="lastName" value={form.lastName}
                    onChange={handleChange} placeholder="Soyadınız" />
                </div>
              </div>

              {/* Ata adı */}
              <div className="breg-field">
                <label className="breg-label">Ata adı</label>
                <div className="breg-input-wrap">
                  <User size={16} className="breg-input-icon" />
                  <input className="breg-input" name="fatherName" value={form.fatherName}
                    onChange={handleChange} placeholder="Ata adı" />
                </div>
              </div>

              {/* Telefon */}
              <div className="breg-field">
                <label className="breg-label">Telefon</label>
                <div className="breg-input-wrap">
                  <Phone size={16} className="breg-input-icon" />
                  <input className="breg-input" name="phone" value={form.phone}
                    onChange={handleChange} placeholder="+994 XX XXX XX XX" type="tel" />
                </div>
              </div>

              {/* E-poçt */}
              <div className="breg-field full">
                <label className="breg-label">E-poçt *</label>
                <div className="breg-input-wrap">
                  <Mail size={16} className="breg-input-icon" />
                  <input className="breg-input" name="email" value={form.email}
                    onChange={handleChange} placeholder="nümunə@mail.com"
                    type="email" required autoComplete="email" />
                </div>
              </div>

              {/* Şifrə */}
              <div className="breg-field">
                <label className="breg-label">Şifrə *</label>
                <div className="breg-input-wrap">
                  <Lock size={16} className="breg-input-icon" />
                  <input className="breg-input" name="password" value={form.password}
                    onChange={handleChange} placeholder="••••••••"
                    type={showPwd ? 'text' : 'password'} required />
                  <button type="button" className="breg-eye" onClick={() => setShowPwd(!showPwd)}>
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Şifrə təsdiqi */}
              <div className="breg-field">
                <label className="breg-label">Şifrəni təsdiqlə *</label>
                <div className="breg-input-wrap">
                  <Lock size={16} className="breg-input-icon" />
                  <input className="breg-input" name="confirm" value={form.confirm}
                    onChange={handleChange} placeholder="••••••••"
                    type={showConf ? 'text' : 'password'} required />
                  <button type="button" className="breg-eye" onClick={() => setShowConf(!showConf)}>
                    {showConf ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className="breg-btn" disabled={loading}
              style={{ marginTop: '20px' }}>
              {loading
                ? <><Loader2 size={18} className="animate-spin" /> Qeydiyyat aparılır...</>
                : <>Qeydiyyatdan Keç <ArrowRight size={17} /></>}
            </button>
          </form>

          <div className="breg-footer">
            Artıq hesabınız var?{' '}
            <Link to="/login" style={{ color: '#E8192C', fontWeight: '700', textDecoration: 'none' }}>
              Daxil olun
            </Link>
          </div>
        </div>

        {/* ── SAĞ PANEL ─────────────────────────────────────── */}
        <div className="breg-right">
          <div className="breg-right-overlay" />
          <div className="breg-right-content">
            <p style={{ textTransform: 'uppercase', letterSpacing: '3px', fontSize: '11px',
              opacity: 0.6, marginBottom: '18px' }}>
              Brendex Blogger Proqramı
            </p>
            <h3 className="breg-right-title">
              Referral sistemi ilə<br />qazanmağa başlayın.
            </h3>
            <div style={{ width: '44px', height: '4px', background: '#fff',
              borderRadius: '2px', marginBottom: '28px' }} />
            <div className="breg-feature">
              <CheckCircle size={17} />
              <span>Unikal promo kod ilə alıcı gətirin</span>
            </div>
            <div className="breg-feature">
              <CheckCircle size={17} />
              <span>Hər satışdan komissiya qazanın (20–41%)</span>
            </div>
            <div className="breg-feature">
              <CheckCircle size={17} />
              <span>6 aylıq ödəniş dövrü ilə sabit gəlir</span>
            </div>
            <div className="breg-feature">
              <CheckCircle size={17} />
              <span>Real vaxtda statistikanızı izləyin</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
