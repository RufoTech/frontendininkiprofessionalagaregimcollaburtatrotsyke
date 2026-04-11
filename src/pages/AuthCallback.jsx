// =====================================================================
// AUTH CALLBACK — Google / Apple OAuth redirect sonrası işləyir
// URL: /auth/callback?data=<base64>
// Backend cookie-ni artıq set edib, burada user datanı Redux-a yazırıq.
// =====================================================================
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, setIsAuthenticated } from "../redux/features/userSlice";

export default function AuthCallback() {
    const navigate = useNavigate();
    const dispatch  = useDispatch();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const data   = params.get("data");
        const error  = params.get("error");

        if (error) {
            const messages = {
                google_cancelled: "Google girişi ləğv edildi",
                apple_cancelled:  "Apple girişi ləğv edildi",
                apple_not_configured: "Apple girişi hələ aktiv deyil",
                blocked: "Hesabınız bloklanmışdır",
                google_failed: "Google girişi uğursuz oldu",
                apple_failed:  "Apple girişi uğursuz oldu",
            };
            const msg = messages[error] || "Giriş uğursuz oldu";
            navigate(`/login?msg=${encodeURIComponent(msg)}`, { replace: true });
            return;
        }

        if (data) {
            try {
                const user = JSON.parse(atob(data));
                dispatch(setUser({ user }));
                dispatch(setIsAuthenticated(true));
                navigate("/home", { replace: true });
            } catch {
                navigate("/login", { replace: true });
            }
        } else {
            navigate("/login", { replace: true });
        }
    }, []);

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Inter, sans-serif",
            background: "#fff",
        }}>
            <div style={{ textAlign: "center" }}>
                <div style={{
                    width: 48, height: 48, borderRadius: "50%",
                    border: "3px solid #E8192C",
                    borderTopColor: "transparent",
                    animation: "spin .8s linear infinite",
                    margin: "0 auto 16px",
                }} />
                <p style={{ color: "#888", fontSize: 14, margin: 0 }}>Giriş edilir...</p>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
