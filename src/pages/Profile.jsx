import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Mail, ShieldCheck, Package, LogOut } from 'lucide-react';
import { useLazyLogoutQuery } from '../redux/api/authApi';
import { logout } from '../redux/features/userSlice';
import { useDispatch } from 'react-redux';

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.userSlice);
  const [logoutApi] = useLazyLogoutQuery();

  const userData = user?.user || user || {};
  const name = userData.name || '—';
  const email = userData.email || '—';
  const role = userData.role || 'user';
  const avatarUrl = userData.avatar?.url;
  const initials = name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  const handleLogout = async () => {
    try { await logoutApi().unwrap(); } catch { /* ignore */ }
    dispatch(logout());
    navigate('/login');
  };

  const C = { primary: '#E8192C', soft: '#fff5f5', mid: '#6b7280', dark: '#1c1c1e' };

  return (
    <div style={{ minHeight: '100vh', background: '#f6f6f8', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '48px 16px', fontFamily: "'Sora', sans-serif" }}>
      <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 32px rgba(0,0,0,0.08)', width: '100%', maxWidth: 480, overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, ${C.primary}, #ff5a68)`, padding: '36px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          {avatarUrl
            ? <img src={avatarUrl} alt={name} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.6)' }} />
            : (
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: '#fff', border: '3px solid rgba(255,255,255,0.4)' }}>
                {initials}
              </div>
            )
          }
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{name}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 3, textTransform: 'capitalize' }}>{role}</div>
          </div>
        </div>

        {/* Info rows */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <InfoRow icon={<User size={16} color={C.primary} />} label={t('auth.name') || 'Ad'} value={name} />
          <InfoRow icon={<Mail size={16} color={C.primary} />} label={t('auth.email') || 'E-poçt'} value={email} />
          <InfoRow icon={<ShieldCheck size={16} color={C.primary} />} label={t('auth.role') || 'Rol'} value={role} />
        </div>

        {/* Actions */}
        <div style={{ padding: '0 28px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => navigate('/my-orders')}
            style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '13px 18px', borderRadius: 13, border: `1.5px solid #f3f4f6`, background: C.soft, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: C.dark, transition: 'all 0.18s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.primary}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#f3f4f6'}
          >
            <Package size={16} color={C.primary} />
            {t('navbar.myOrders') || 'Sifarişlərim'}
          </button>

          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '13px 18px', borderRadius: 13, border: `1.5px solid #fde8ea`, background: '#fff5f5', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: C.primary, transition: 'all 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.background = C.primary; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff5f5'; e.currentTarget.style.color = C.primary; }}
          >
            <LogOut size={16} />
            {t('navbar.logout') || 'Çıxış'}
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12, background: '#fafafa', border: '1.5px solid #f3f4f6' }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: '#fff0f1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#1c1c1e', marginTop: 1 }}>{value}</div>
      </div>
    </div>
  );
}
