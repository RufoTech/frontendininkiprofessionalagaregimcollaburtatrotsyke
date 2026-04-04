import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// SuperAdminRoute — yalnız daxil olmuş superadminlər üçün marşrut qoruyucusu.
// Redux state- də isLoggedIn yoxdur VƏ localStorage-da superAdminInfo yoxdursa
// → /superadmin/login-ə yönləndirilir.
// Refresh halında Redux state sıfırlanır, amma localStorage saxlanılır —
// buna görə hər ikisini yoxlamaq lazımdır.
const SuperAdminRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((s) => s.superAdmin);
  const stored = (() => {
    try { return !!localStorage.getItem("superAdminInfo"); }
    catch { return false; }
  })();

  if (!isLoggedIn && !stored) {
    return <Navigate to="/superadmin/login" replace />;
  }

  return children;
};

export default SuperAdminRoute;
