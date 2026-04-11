import React from 'react'
import { ArrowRight, Sparkles, ShieldCheck, Truck } from 'lucide-react'
import Categories from '../components/Categories'
import WeeklyDeal from '../components/WeeklyDeal'
import LogoSection from '../components/LogoSection'
import DiscountSubscribe from '../components/DiscountSubscribe'
import Sever from '../components/Sever'

const highlights = [
  { icon: Sparkles, title: 'Premium seçim', text: 'Elektronika, moda və ev məhsullarını vahid, daha güclü təqdimatla kəşf et.' },
  { icon: Truck, title: 'Sürətli çatdırılma', text: 'Ən çox axtarılan məhsullar daha görünən bloklarla istifadəçiyə yaxınlaşdırıldı.' },
  { icon: ShieldCheck, title: 'Etibarlı alış', text: 'Təmiz boşluq, yumşaq kontrast və daha aydın bölmələr alış axınını rahatlaşdırır.' },
]

const Home = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <section
        className="page-section"
        style={{
          padding: 0,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #2c0d12 0%, #7f1520 48%, #ef4444 100%)',
          color: '#fff',
        }}
      >
        <div className="floating-orb floating-orb--rose" style={{ width: 260, height: 260, top: -60, right: -50 }} />
        <div className="floating-orb floating-orb--mint" style={{ width: 220, height: 220, bottom: -90, left: -40 }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, padding: '38px 34px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                alignSelf: 'flex-start',
                padding: '8px 14px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Brendex Home
            </span>

            <div>
              <h1 style={{ margin: 0, fontSize: 'clamp(2.2rem, 4vw, 4.4rem)', lineHeight: 0.95, fontWeight: 900, letterSpacing: '-0.05em' }}>
                Daha premium
                <br />
                daha inandırıcı alış təcrübəsi
              </h1>
              <p style={{ margin: '16px 0 0', maxWidth: 620, color: 'rgba(255,255,255,0.8)', fontSize: 16, lineHeight: 1.7 }}>
                Ana səhifə blokları indi daha aydın ritmlə düzülür, kampaniyalar və kateqoriyalar isə vahid vizual dildə göstərilir.
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <a
                href="#home-categories"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '14px 18px',
                  borderRadius: 16,
                  background: '#fff',
                  color: '#9f1239',
                  textDecoration: 'none',
                  fontWeight: 800,
                  boxShadow: '0 18px 40px rgba(0,0,0,0.18)',
                }}
              >
                Kateqoriyalara bax <ArrowRight size={16} />
              </a>
              <a
                href="#home-deals"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '14px 18px',
                  borderRadius: 16,
                  background: 'rgba(255,255,255,0.12)',
                  color: '#fff',
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.24)',
                  fontWeight: 700,
                  backdropFilter: 'blur(12px)',
                }}
              >
                Kampaniyaları aç
              </a>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 12, alignContent: 'center' }}>
            {highlights.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                style={{
                  padding: 18,
                  borderRadius: 22,
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.16)',
                  backdropFilter: 'blur(14px)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 14, background: '#fff', color: '#d61f45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} />
                  </div>
                  <strong style={{ fontSize: 16 }}>{title}</strong>
                </div>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.78)', lineHeight: 1.6, fontSize: 14 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="home-categories" className="page-section">
        <div className="section-heading" style={{ position: 'relative', zIndex: 1 }}>
          <div>
            <span className="section-kicker">Kəşf et</span>
            <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.04em', marginTop: 12 }}>Aydın kateqoriya başlanğıcı</h2>
            <p style={{ color: '#5f6b7c', marginTop: 8, lineHeight: 1.7, maxWidth: 720 }}>
              İstifadəçi ilk baxışda əsas istiqamətləri görsün deyə kateqoriya bölməsi daha təmiz təqdimat kontekstinə yerləşdirildi.
            </p>
          </div>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Categories />
        </div>
      </section>

      <section id="home-deals" className="page-section">
        <div className="section-heading" style={{ position: 'relative', zIndex: 1 }}>
          <div>
            <span className="section-kicker">Top offers</span>
            <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.04em', marginTop: 12 }}>Həftənin vitrin kampaniyaları</h2>
            <p style={{ color: '#5f6b7c', marginTop: 8, lineHeight: 1.7, maxWidth: 720 }}>
              Endirim blokları və brend hissələri indi bir-biri ilə rəqabət aparmır, əksinə eyni premium ritmdə axır.
            </p>
          </div>
        </div>
        <div style={{ position: 'relative', zIndex: 1, display: 'grid', gap: 24 }}>
          <WeeklyDeal />
          <LogoSection />
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading" style={{ position: 'relative', zIndex: 1 }}>
          <div>
            <span className="section-kicker">Retention</span>
            <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.04em', marginTop: 12 }}>Abunə və etibar blokları</h2>
            <p style={{ color: '#5f6b7c', marginTop: 8, lineHeight: 1.7, maxWidth: 720 }}>
              Sadiqlik və qeydiyyat yönümlü hissələr daha nəfəs alan aralıqlarla quruldu ki, çağırışlar daha təbii hiss olunsun.
            </p>
          </div>
        </div>
        <div style={{ position: 'relative', zIndex: 1, display: 'grid', gap: 24 }}>
          <DiscountSubscribe />
          <Sever />
        </div>
      </section>
    </div>
  )
}

export default Home
