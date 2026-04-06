import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  Package, Plus, Edit2, Trash2, LayoutDashboard, Search,
  ChevronLeft, AlertCircle, ShoppingBag, Eye
} from "lucide-react";
import {
  getBloggerProducts,
  deleteBloggerProduct,
  clearActionResult,
  clearBloggerError
} from "../../slices/bloggerSlice";

const colors = {
  red:    "#E8192C",
  green:  "#27ae60",
  orange: "#f39c12",
  purple: "#8e44ad",
  dark:   "#1a1a2e",
  blue:   "#2980b9",
  light:  "#f5f6fa"
};

const cardStyle = {
  background: "#fff",
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  padding: "24px",
  border: "1px solid #f0f0f0"
};

const btnBase = {
  border: "none",
  borderRadius: "10px",
  padding: "10px 18px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "700",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  transition: "all 0.2s"
};

export default function BloggerProducts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error, actionResult, profile } = useSelector((s) => s.blogger);

  useEffect(() => {
    dispatch(getBloggerProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearBloggerError());
    }
    if (actionResult?.type === "productDeleted") {
      toast.success("Məhsul silindi");
      dispatch(clearActionResult());
    }
  }, [error, actionResult, dispatch]);

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: "Məhsulu silmək istəyirsiniz?",
      text: `${name} adlı məhsul həmişəlik silinəcək.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: colors.red,
      cancelButtonColor: "#aaa",
      confirmButtonText: "Bəli, sil",
      cancelButtonText: "Ləğv et"
    });

    if (result.isConfirmed) {
      dispatch(deleteBloggerProduct(id));
    }
  };

  if (!profile) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: colors.light }}>
        <p style={{ color: "#888" }}>Giriş edilməyib...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px", background: colors.light, minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      {/* BAŞLIQ PANELI */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "15px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
            <Link to="/blogger/dashboard" style={{ color: colors.blue, display: "flex", alignItems: "center", gap: "4px", fontSize: "14px", fontWeight: "600", textDecoration: "none" }}>
              <ChevronLeft size={16} /> Paneldə qayıt
            </Link>
          </div>
          <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "800", color: colors.dark, display: "flex", alignItems: "center", gap: "12px" }}>
            <Package size={28} color={colors.red} /> Məhsullarım
          </h1>
          <p style={{ margin: "5px 0 0", color: "#888", fontSize: "14px" }}>
            Cəmi {products?.length || 0} məhsulunuz var
          </p>
        </div>
        
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => navigate("/blogger/add-product")}
            style={{ ...btnBase, background: colors.red, color: "#fff", boxShadow: "0 4px 14px rgba(232, 25, 44, 0.3)" }}>
            <Plus size={18} /> Yeni Məhsul
          </button>
        </div>
      </div>

      {loading && products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "100px 0" }}>
          <div style={{ width: "40px", height: "40px", border: `3px solid ${colors.red}20`, borderTopColor: colors.red, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : products.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: "center", padding: "80px 20px" }}>
          <ShoppingBag size={64} color="#eee" style={{ marginBottom: "20px" }} />
          <h3 style={{ fontSize: "20px", fontWeight: "700", color: colors.dark, marginBottom: "10px" }}>Hələ məhsulunuz yoxdur</h3>
          <p style={{ color: "#888", marginBottom: "25px", maxWidth: "400px", margin: "0 auto 25px" }}>
            Öz brendinizi yaratmaq üçün ilk məhsulunuzu indi əlavə edin!
          </p>
          <button onClick={() => navigate("/blogger/add-product")}
            style={{ ...btnBase, background: colors.dark, color: "#fff", margin: "0 auto" }}>
            <Plus size={18} /> İlk məhsulu yarat
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
          {products.map((p) => (
            <div key={p._id} style={cardStyle} className="product-card">
              <div style={{ position: "relative", height: "200px", borderRadius: "12px", overflow: "hidden", marginBottom: "16px", background: "#f9f9f9" }}>
                {p.images && p.images[0] ? (
                  <img src={p.images[0].url} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc" }}>
                    <Package size={48} />
                  </div>
                )}
                <div style={{ position: "absolute", top: "12px", right: "12px", background: "white", padding: "4px 10px", borderRadius: "20px", fontSize: "14px", fontWeight: "800", color: colors.red, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
                  {p.price} ₼
                </div>
              </div>
              
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "12px", color: colors.blue, fontWeight: "700", textTransform: "uppercase", marginBottom: "4px" }}>{p.category}</div>
                <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: colors.dark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
                   <span style={{ fontSize: "13px", color: p.stock > 0 ? colors.green : colors.red, fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
                     {p.stock > 0 ? <Plus size={14} /> : <AlertCircle size={14} />}
                     Stok: {p.stock} ədəd
                   </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", borderTop: "1px solid #f0f0f0", paddingTop: "16px" }}>
                <button onClick={() => navigate(`/blogger/edit-product/${p._id}`)}
                  style={{ ...btnBase, padding: "8px 12px", background: "#f0f0f0", color: colors.dark, flex: 1, justifyContent: "center" }}>
                  <Edit2 size={15} /> Redaktə
                </button>
                <button onClick={() => handleDelete(p._id, p.name)}
                  style={{ ...btnBase, padding: "8px 12px", background: "#fff0f1", color: colors.red, flex: 1, justifyContent: "center" }}>
                  <Trash2 size={15} /> Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <style>{`
        .product-card { transition: transform 0.2s ease, box-shadow 0.2s ease; cursor: default; }
        .product-card:hover { transform: translateY(-5px); boxShadow: 0 10px 30px rgba(0,0,0,0.1) !important; }
      `}</style>
    </div>
  );
}
