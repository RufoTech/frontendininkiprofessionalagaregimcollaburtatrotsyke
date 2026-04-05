import { Navigate } from 'react-router-dom'

// =====================================================================
// GUEST ROUTE — artıq daxil olmuş istifadəçiləri yönləndirir
// ---------------------------------------------------------------------
// Login/register kimi auth səhifələrini qoruyur.
// Əgər istifadəçi artıq daxil olubsa → roluna uyğun səhifəyə yönləndir.
//
// Yoxlama ardıcıllığı:
//   1. SuperAdmin (superAdminInfo localStorage-da) → /superadmin/dashboard
//   2. Blogger (bloggerInfo localStorage-da)        → /blogger/dashboard
//   3. Adi istifadəçi (userInfo localStorage-da)   → /home
//   4. Heç biri yoxdursa → uşaq komponent göstər (auth formu)
// =====================================================================
const GuestRoute = ({ children }) => {
  let superAdminInfo = null
  let bloggerProfile = null
  let userInfo       = null
  let isAuthenticated = false

  try { superAdminInfo = JSON.parse(localStorage.getItem('superAdminInfo') || 'null') } catch {}
  try { bloggerProfile = JSON.parse(localStorage.getItem('bloggerProfile') || 'null') } catch {}
  try { userInfo       = JSON.parse(localStorage.getItem('user') || 'null') } catch {}
  try { isAuthenticated = JSON.parse(localStorage.getItem('isAuthenticated') || 'false') } catch {}

  if (superAdminInfo) return <Navigate to="/superadmin/dashboard" replace />
  if (bloggerProfile?.blogger) return <Navigate to="/blogger/dashboard" replace />
  if (isAuthenticated && userInfo?.user?.role === 'admin') return <Navigate to="/admin/products" replace />
  if (isAuthenticated && userInfo) return <Navigate to="/home" replace />

  return children
}

export default GuestRoute
