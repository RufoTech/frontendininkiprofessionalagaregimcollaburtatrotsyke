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
  let bloggerInfo    = null
  let userInfo       = null

  try { superAdminInfo = JSON.parse(localStorage.getItem('superAdminInfo') || 'null') } catch {}
  try { bloggerInfo    = JSON.parse(localStorage.getItem('bloggerInfo')    || 'null') } catch {}
  try { userInfo       = JSON.parse(localStorage.getItem('userInfo')       || 'null') } catch {}

  if (superAdminInfo) return <Navigate to="/superadmin/dashboard" replace />
  if (bloggerInfo)    return <Navigate to="/blogger/dashboard"    replace />
  if (userInfo)       return <Navigate to="/home"                 replace />

  return children
}

export default GuestRoute
