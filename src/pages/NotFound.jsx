import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Compass, SearchX } from 'lucide-react';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <section
      style={{
        minHeight: 'calc(100vh - 120px)',
        display: 'grid',
        placeItems: 'center',
        padding: '24px 0',
      }}
    >
      <div
        className="page-section"
        style={{
          width: 'min(920px, 100%)',
          padding: 0,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #20070c 0%, #6b1220 44%, #ef4444 100%)',
          color: '#fff',
        }}
      >
        <div className="floating-orb floating-orb--rose" style={{ width: 260, height: 260, top: -90, right: -30 }} />
        <div className="floating-orb floating-orb--mint" style={{ width: 220, height: 220, bottom: -90, left: -40 }} />

        <div style={{ position: 'relative', zIndex: 1, padding: '38px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 26, alignItems: 'center' }}>
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Error page
            </span>
            <div style={{ marginTop: 18, fontSize: 'clamp(5rem, 15vw, 9rem)', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.08em' }}>
              404
            </div>
            <h1 style={{ margin: '12px 0 8px', fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1, fontWeight: 900, letterSpacing: '-0.05em' }}>
              {t("notFound.title")}
            </h1>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', lineHeight: 1.75, maxWidth: 520 }}>
              {t("notFound.desc")}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 22 }}>
              <Link
                to="/home"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '14px 18px',
                  borderRadius: 16,
                  background: '#fff',
                  color: '#be123c',
                  fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow: '0 18px 30px rgba(0,0,0,0.16)',
                }}
              >
                <ArrowLeft size={16} />
                {t("notFound.backHome")}
              </Link>
              <Link
                to="/shop"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '14px 18px',
                  borderRadius: 16,
                  background: 'rgba(255,255,255,0.12)',
                  color: '#fff',
                  fontWeight: 700,
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <Compass size={16} />
                Mağazaya keç
              </Link>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 14 }}>
            <div
              style={{
                borderRadius: 28,
                padding: 24,
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.16)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div style={{ width: 64, height: 64, borderRadius: 22, background: '#fff', color: '#e8192c', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <SearchX size={28} />
              </div>
              <strong style={{ display: 'block', fontSize: 22, marginBottom: 8 }}>Axtardığın səhifə tapılmadı</strong>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.78)', lineHeight: 1.7 }}>
                Dizayn dili yeniləndiyi üçün xəta səhifəsi də artıq sistemlə uyğundur və istifadəçini çıxışsız qoymur.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
