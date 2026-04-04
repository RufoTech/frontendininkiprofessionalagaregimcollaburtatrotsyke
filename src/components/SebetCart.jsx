"use client"

import { useState } from "react"
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartQuantityMutation,
  useGetProductsQuery,
  useAddToCartMutation,
} from "../redux/api/productsApi"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Trash2, Plus, Minus, ArrowRight, ChevronLeft, Shield, RotateCcw, Loader2, ShoppingBag, Heart } from "lucide-react"

/* ─── ProductCard (tövsiyə olunanlar üçün) ─── */
const MiniCard = ({ product, onAdd }) => {
  const [hov, setHov] = useState(false)
  const navigate = useNavigate()
  const img = product.images?.[0]?.url || "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg"
  const disc = product.discount > 0
  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff", borderRadius: 16, overflow: "hidden",
        boxShadow: hov ? "0 8px 28px rgba(232,25,44,.14)" : "0 2px 10px rgba(0,0,0,.06)",
        transform: hov ? "translateY(-4px)" : "none",
        transition: "all .28s cubic-bezier(.34,1.56,.64,1)",
        cursor: "pointer", border: "1.5px solid #f5f5f5",
      }}
    >
      <div style={{ position: "relative", height: 130, background: "#f8f8f8", overflow: "hidden" }}>
        <img src={img} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {disc && (
          <span style={{
            position: "absolute", top: 8, left: 8,
            background: "#E8192C", color: "#fff",
            fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 20,
          }}>-{product.discount}%</span>
        )}
        <button
          onClick={e => { e.stopPropagation(); onAdd(product._id) }}
          style={{
            position: "absolute", bottom: 8, right: 8,
            background: "#E8192C", border: "none", borderRadius: "50%",
            width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", boxShadow: "0 4px 12px rgba(232,25,44,.4)",
          }}
        >
          <Plus size={14} color="#fff" />
        </button>
      </div>
      <div style={{ padding: "10px 12px 12px" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#111", marginBottom: 4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {product.name}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "#E8192C" }}>{product.price} ₼</span>
          {product.originalPrice && (
            <span style={{ fontSize: 10, color: "#aaa", textDecoration: "line-through" }}>{product.originalPrice} ₼</span>
          )}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   SEBET CART
══════════════════════════════════════════ */
const SebetCart = () => {
  const navigate = useNavigate()
  const { data: cartData, isLoading, error } = useGetCartQuery()
  const [removeFromCart]  = useRemoveFromCartMutation()
  const [updateQuantity]  = useUpdateCartQuantityMutation()
  const [addToCart]       = useAddToCartMutation()
  const { data: productsData, isLoading: productsLoading } = useGetProductsQuery({})

  const items    = cartData?.cart || []
  const subtotal = items.reduce((s, it) => s + it.product.price * it.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 5
  const total    = subtotal + shipping

  const handleQty = async (productId, qty, stock, delta) => {
    const next = qty + delta
    if (next < 1)     { toast.error("Minimum say 1 olmalıdır"); return }
    if (next > stock) { toast.error("Stokda kifayət qədər məhsul yoxdur"); return }
    try { await updateQuantity({ productId, quantity: next }).unwrap() }
    catch { toast.error("Xəta baş verdi") }
  }

  const handleRemove = async (productId) => {
    try { await removeFromCart(productId).unwrap(); toast.success("Məhsul silindi") }
    catch { toast.error("Silinmə zamanı xəta baş verdi") }
  }

  const handleAdd = async (productId) => {
    try { await addToCart({ productId, quantity: 1 }).unwrap(); toast.success("Məhsul səbətə əlavə edildi") }
    catch { toast.error("Xəta baş verdi") }
  }

  const allProducts = productsData?.products || productsData?.data || (Array.isArray(productsData) ? productsData : [])

  /* ─── Yüklənir ─── */
  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f8f8", fontFamily: "'Sora',sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <Loader2 size={36} color="#E8192C" style={{ animation: "spin 1s linear infinite", marginBottom: 12 }} />
          <p style={{ color: "#aaa", fontSize: 14 }}>Səbətiniz yüklənir...</p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  /* ─── BOŞ SƏBƏT ─── */
  if (error || !items.length) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8f8f8", fontFamily: "'Sora',sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');`}</style>

        {/* Header */}
        <div style={{ background: "#fff", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #f0f0f0", position: "sticky", top: 0, zIndex: 10 }}>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 8, display: "flex", alignItems: "center" }}>
            <ChevronLeft size={22} color="#111" />
          </button>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: "#111", margin: 0 }}>Səbət</h1>
        </div>

        {/* Empty state */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px 40px" }}>
          <div style={{ width: 130, height: 130, background: "linear-gradient(135deg,#fff5f5,#ffe4e6)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
            <ShoppingBag size={60} color="#E8192C" strokeWidth={1.2} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111", marginBottom: 10 }}>Səbətiniz boşdur</h2>
          <p style={{ fontSize: 14, color: "#888", textAlign: "center", lineHeight: 1.6, maxWidth: 260, marginBottom: 28 }}>
            Gəlin bunu düzəldək! Arzuladığınız məhsulları tapmaq üçün indi başlayın.
          </p>
          <button
            onClick={() => navigate("/shop")}
            style={{
              background: "#E8192C", color: "#fff", border: "none",
              borderRadius: 40, padding: "14px 32px",
              fontSize: 14, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8,
              boxShadow: "0 8px 24px rgba(232,25,44,.4)",
            }}
          >
            <ShoppingBag size={16} /> Alış-verişə başla
          </button>
        </div>

        {/* Tövsiyə olunanlar */}
        <div style={{ padding: "0 20px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111", margin: 0 }}>Sizin üçün tövsiyə olunanlar</h3>
            <Link to="/shop" style={{ fontSize: 12, color: "#E8192C", fontWeight: 600, textDecoration: "none" }}>Hamısına bax</Link>
          </div>
          {productsLoading ? (
            <div style={{ textAlign: "center", padding: 40 }}><Loader2 size={24} color="#E8192C" style={{ animation: "spin 1s linear infinite" }} /></div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              {allProducts.slice(0, 6).map(p => <MiniCard key={p._id} product={p} onAdd={handleAdd} />)}
            </div>
          )}
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  /* ─── DOLU SƏBƏT ─── */
  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8", fontFamily: "'Sora',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}

        .cart-item { background:#fff; border-radius:16px; padding:14px; display:flex; align-items:center; gap:12px; box-shadow:0 2px 10px rgba(0,0,0,.05); margin-bottom:10px; }
        .cart-qty-btn { width:30px; height:30px; border-radius:50%; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .18s; flex-shrink:0; }
        .cart-qty-btn:active { transform:scale(.9); }
        .checkout-btn { width:100%; background:#E8192C; color:#fff; border:none; borderRadius:40px; padding:16px; font-size:15px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; font-family:'Sora',sans-serif; box-shadow:0 8px 24px rgba(232,25,44,.4); transition:all .2s; }
        .checkout-btn:hover { transform:translateY(-2px); box-shadow:0 12px 32px rgba(232,25,44,.5); }
        .checkout-btn:active { transform:scale(.97); }

        @media(min-width:900px){
          .cart-layout{ display:grid; grid-template-columns:1fr 360px; gap:20px; }
        }
      `}</style>

      {/* ── Header ── */}
      <div style={{ background: "#fff", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #f0f0f0", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 8, display: "flex" }}>
          <ChevronLeft size={22} color="#111" />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 800, color: "#111", margin: 0 }}>Səbət</h1>
        <span style={{ background: "#E8192C", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
          {items.length}
        </span>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px 40px" }}>
        <div className="cart-layout">

          {/* ── Məhsullar ── */}
          <div>
            {items.map((item) => {
              const img = item.product.images?.[0]?.url || "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg"
              return (
                <div key={item.product._id} className="cart-item">
                  {/* Şəkil */}
                  <Link to={`/product/${item.product._id}`} style={{ flexShrink: 0 }}>
                    <div style={{ width: 72, height: 72, borderRadius: 12, overflow: "hidden", background: "#f5f5f5" }}>
                      <img src={img} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  </Link>

                  {/* Məlumat */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link to={`/product/${item.product._id}`} style={{ textDecoration: "none" }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.product.name}
                      </p>
                    </Link>
                    <p style={{ fontSize: 11, color: "#aaa", marginBottom: 6 }}>
                      {[item.product.color && `Rəng: ${item.product.color}`, item.product.size && `Ölçü: ${item.product.size}`, item.product.memory && `Yaddaş: ${item.product.memory}`].filter(Boolean).join(", ")}
                    </p>
                    <span style={{ fontSize: 15, fontWeight: 800, color: "#E8192C" }}>
                      {(item.product.price * item.quantity).toFixed(2)} ₼
                    </span>
                  </div>

                  {/* Miqdar */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <button
                      className="cart-qty-btn"
                      style={{ background: item.quantity <= 1 ? "#f5f5f5" : "#E8192C" }}
                      onClick={() => handleQty(item.product._id, item.quantity, item.product.stock, -1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={12} color={item.quantity <= 1 ? "#ccc" : "#fff"} />
                    </button>
                    <span style={{ fontSize: 15, fontWeight: 800, color: "#111", minWidth: 20, textAlign: "center" }}>{item.quantity}</span>
                    <button
                      className="cart-qty-btn"
                      style={{ background: "#fff3f4", border: "1.5px solid #E8192C" }}
                      onClick={() => handleQty(item.product._id, item.quantity, item.product.stock, 1)}
                    >
                      <Plus size={12} color="#E8192C" />
                    </button>
                  </div>

                  {/* Sil */}
                  <button
                    onClick={() => handleRemove(item.product._id)}
                    style={{ background: "#fff5f5", border: "none", borderRadius: 10, padding: "8px", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <Trash2 size={16} color="#E8192C" />
                  </button>
                </div>
              )
            })}

            <Link to="/shop" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#E8192C", fontWeight: 600, textDecoration: "none", marginTop: 8 }}>
              <ChevronLeft size={16} /> Alış-verişə davam et
            </Link>
          </div>

          {/* ── Sifariş xülasəsi ── */}
          <div>
            <div style={{ background: "#fff", borderRadius: 20, padding: "22px 20px", boxShadow: "0 4px 20px rgba(0,0,0,.07)", position: "sticky", top: 80 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "#111", marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid #f0f0f0" }}>
                SİFARİŞ MƏLUMAT
              </h3>

              <div style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 14 }}>
                  <span style={{ color: "#888" }}>Məhsullar</span>
                  <span style={{ fontWeight: 700, color: "#111" }}>{subtotal.toFixed(2)} ₼</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 14 }}>
                  <span style={{ color: "#888" }}>Çatdırılma</span>
                  <span style={{ fontWeight: 700, color: shipping === 0 ? "#16a34a" : "#111" }}>
                    {shipping === 0 ? "Pulsuz" : `${shipping} ₼`}
                  </span>
                </div>
                {subtotal <= 100 && (
                  <div style={{ background: "#fff5f5", borderRadius: 10, padding: "10px 12px", fontSize: 11, color: "#E8192C", fontWeight: 600 }}>
                    💡 {(100 - subtotal).toFixed(2)} ₼ daha əlavə et — pulsuz çatdırılma!
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "2px dashed #f0f0f0", marginBottom: 22 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#111" }}>Cəmi</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: "#E8192C" }}>{total.toFixed(2)} ₼</span>
              </div>

              <button className="checkout-btn" style={{ borderRadius: 40 }} onClick={() => navigate("/payment")}>
                Sifarişi tamamla <ArrowRight size={16} />
              </button>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginTop: 16, fontSize: 11, color: "#aaa" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Shield size={12} color="#E8192C" /> Təhlükəsiz ödəniş
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <RotateCcw size={12} color="#E8192C" /> Asan qaytarılma
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tövsiyə olunanlar ── */}
        {allProducts.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111", margin: 0 }}>Sizin üçün tövsiyə olunanlar</h3>
              <Link to="/shop" style={{ fontSize: 12, color: "#E8192C", fontWeight: 600, textDecoration: "none" }}>Hamısına bax</Link>
            </div>
            {productsLoading ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <Loader2 size={24} color="#E8192C" style={{ animation: "spin 1s linear infinite" }} />
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px,1fr))", gap: 14 }}>
                {allProducts.slice(0, 8).map(p => <MiniCard key={p._id} product={p} onAdd={handleAdd} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SebetCart
