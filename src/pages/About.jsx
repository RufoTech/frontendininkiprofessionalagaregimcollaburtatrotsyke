import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, BadgeCheck, Globe2, ShieldCheck } from 'lucide-react'
import History from '../components/History'
import LogoSection from '../components/LogoSection'
import Shipping from '../components/Shipping'

const About = () => {
  const { t } = useTranslation()

  const stats = [
    { icon: Globe2, title: 'Marketplace', text: 'Brendex daha vahid vizual dildə təqdim olunur və istifadəçi üçün daha aydın görünür.' },
    { icon: BadgeCheck, title: 'Etibar', text: 'Brend, servis və tarix hissələri daha təmiz section quruluşunda toplandı.' },
    { icon: ShieldCheck, title: 'Keyfiyyət', text: 'Kontent blokları artıq daha rahat oxunur və mobil görünüşdə daha balanslıdır.' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <section
        className="page-section"
        style={{
          padding: 0,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #fff7f5 0%, #fff 42%, #fff1f2 100%)',
        }}
      >
        <div className="floating-orb floating-orb--rose" style={{ width: 240, height: 240, top: -70, right: -40 }} />
        <div className="floating-orb floating-orb--mint" style={{ width: 220, height: 220, bottom: -90, left: -40 }} />

        <div style={{ position: 'relative', zIndex: 1, padding: '34px 30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 22 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <nav style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#64748b', flexWrap: 'wrap' }}>
              <Link to="/home" style={{ color: '#be123c', textDecoration: 'none', fontWeight: 700 }}>{t("navbar.home")}</Link>
              <span>/</span>
              <span style={{ color: '#0f172a', fontWeight: 800 }}>{t("footer.about")}</span>
            </nav>

            <div>
              <span className="section-kicker">About Brendex</span>
              <h1 style={{ margin: '14px 0 0', fontSize: 'clamp(2.1rem, 4vw, 4.1rem)', lineHeight: 0.98, letterSpacing: '-0.05em', fontWeight: 900, color: '#0f172a' }}>
                Brendex hekayəsi indi daha premium təqdim olunur
              </h1>
              <p style={{ margin: '16px 0 0', color: '#5f6b7c', lineHeight: 1.8, maxWidth: 680, fontSize: 16 }}>
                {t("history.paragraph1")}
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <a
                href="#about-history"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '14px 18px',
                  borderRadius: 16,
                  background: 'linear-gradient(135deg,#e8192c,#be123c)',
                  color: '#fff',
                  textDecoration: 'none',
                  fontWeight: 800,
                  boxShadow: '0 18px 30px rgba(232,25,44,0.18)',
                }}
              >
                Tarixçəyə bax <ArrowRight size={16} />
              </a>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 12, alignContent: 'center' }}>
            {stats.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                style={{
                  borderRadius: 22,
                  padding: 18,
                  background: 'rgba(255,255,255,0.86)',
                  border: '1px solid rgba(148,163,184,0.14)',
                  boxShadow: '0 16px 32px rgba(15,23,42,0.06)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 14, background: 'rgba(232,25,44,0.08)', color: '#e8192c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} />
                  </div>
                  <strong style={{ fontSize: 16, color: '#0f172a' }}>{title}</strong>
                </div>
                <p style={{ margin: 0, color: '#64748b', lineHeight: 1.7 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about-history" className="page-section">
        <div className="section-heading" style={{ position: 'relative', zIndex: 1 }}>
          <div>
            <span className="section-kicker">Timeline</span>
            <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-0.04em', marginTop: 12 }}>Tarix və inkişaf yolu</h2>
          </div>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <History />
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading" style={{ position: 'relative', zIndex: 1 }}>
          <div>
            <span className="section-kicker">Service</span>
            <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-0.04em', marginTop: 12 }}>Çatdırılma və tərəfdaşlıq hissələri</h2>
          </div>
        </div>
        <div style={{ position: 'relative', zIndex: 1, display: 'grid', gap: 24 }}>
          <Shipping />
          <LogoSection />
        </div>
      </section>
    </div>
  )
}

export default About
