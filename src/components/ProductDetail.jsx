"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  useGetProductDetailsQuery,
  useAddToCartMutation,
  useAddToFavoritesMutation,
  useCreateOrUpdateReviewMutation,
  useGetProductReviewsQuery,
} from "../redux/api/productsApi"
import { useLazyGetStoreSlugBySellerQuery } from "../redux/api/authApi"

import {
  Heart,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Star,
  User,
  CheckCircle,
  AlertCircle,
  Zap,
  Store,
  Minus,
  Plus,
  ChevronDown,
  Share2,
  ArrowLeft,
  Shield,
  Truck,
  RotateCcw,
  ThumbsUp,
  BadgeCheck,
  Clock,
  Package,
} from "lucide-react"

import { toast, Toaster } from "react-hot-toast"
import StarRatings from "react-star-ratings"

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════ */
const C = {
  red:         "#E8192C",
  redDark:     "#C0001A",
  redLight:    "#FFF5F5",
  redMid:      "#FFE0E3",
  redBorder:   "#FCCDD1",
  green:       "#00A650",
  greenLight:  "#F0FDF4",
  greenBorder: "#BBF7D0",
  white:       "#FFFFFF",
  bg:          "#F5F5F5",
  border:      "#E8E8E8",
  borderMid:   "#D1D1D1",
  textDark:    "#0F1111",
  textMid:     "#565959",
  textLight:   "#767676",
  priceRed:    "#B12704",
  star:        "#FFA41C",
  shadow:      "0 2px 8px rgba(0,0,0,0.10)",
  shadowSm:    "0 1px 3px rgba(0,0,0,0.07)",
}

const font = "'Sora','Segoe UI',system-ui,sans-serif"

/* ── Helpers ── */
const Divider = () => (
  <div style={{ height: 1, background: C.border, margin: "16px 0" }} />
)

const Section = ({ children, style = {} }) => (
  <div style={{
    background: C.white,
    borderRadius: 16,
    padding: "16px",
    boxShadow: C.shadowSm,
    ...style,
  }}>
    {children}
  </div>
)

const GreenBadge = ({ children }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 3,
    background: C.greenLight, color: C.green,
    border: `1px solid ${C.greenBorder}`,
    fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 6,
  }}>
    {children}
  </span>
)

const RatingBar = ({ value, count, total }) => {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
      <span style={{ fontSize: 12, color: C.textMid, width: 12, textAlign: "right", flexShrink: 0 }}>{value}</span>
      <Star size={11} fill={C.star} color={C.star} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, height: 7, background: C.border, borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          width: `${pct}%`, height: "100%",
          background: `linear-gradient(90deg,${C.red},${C.redDark})`,
          borderRadius: 4, transition: "width 0.6s",
        }} />
      </div>
      <span style={{ fontSize: 11, color: C.textLight, width: 24, textAlign: "right", flexShrink: 0 }}>{count}</span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   ANA KOMPONENT
═══════════════════════════════════════════════════════════════ */
const ProductDetail = () => {
  const params   = useParams()
  const navigate = useNavigate()

  const { data, isLoading, error } = useGetProductDetailsQuery(params?.id, {
    refetchOnMountOrArgChange: true,
  })
  const product = data?.product

  const { data: reviewsData, isLoading: reviewsLoading, error: reviewsError } =
    useGetProductReviewsQuery(params?.id, { refetchOnMountOrArgChange: true })

  const [addToCart]            = useAddToCartMutation()
  const [addToFavorites]       = useAddToFavoritesMutation()
  const [createOrUpdateReview] = useCreateOrUpdateReviewMutation()
  const [getStoreSlug]         = useLazyGetStoreSlugBySellerQuery()

  const [currentImg,    setCurrentImg]    = useState(0)
  const [reviewRating,  setReviewRating]  = useState(0)
  const [reviewComment, setReviewComment] = useState("")
  const [quantity,      setQuantity]      = useState(1)
  const [descExpanded,  setDescExpanded]  = useState(false)
  const [isFaved,       setIsFaved]       = useState(false)
  const [addedToCart,   setAddedToCart]   = useState(false)

  /* Countdown */
  const [timeLeft, setTimeLeft] = useState(2 * 3600 + 30 * 60 + 45)
  useEffect(() => {
    if (timeLeft <= 0) return
    const iv = setInterval(() => setTimeLeft(p => p > 0 ? p - 1 : 0), 1000)
    return () => clearInterval(iv)
  }, [timeLeft])
  const fmt = s => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
  }

  const imgs   = product?.images || []
  const imgUrl = imgs.length > 0
    ? imgs[currentImg].url
    : "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg"

  const sellerName =
    (typeof product?.seller === "string" && product.seller) ||
    product?.seller?.storeName ||
    product?.seller?.name ||
    "Satıcı"

  const reviews    = reviewsData?.reviews || []
  const totalRev   = reviews.length
  const ratingDist = [5, 4, 3, 2, 1].map(v => ({
    v, count: reviews.filter(r => Math.round(r.rating) === v).length,
  }))

  const navImg = dir =>
    setCurrentImg(p =>
      dir === "prev"
        ? (p === 0 ? imgs.length - 1 : p - 1)
        : (p === imgs.length - 1 ? 0 : p + 1)
    )

  const handleAddToCart = async e => {
    e.preventDefault()
    try {
      await addToCart({ productId: product._id, quantity }).unwrap()
      setAddedToCart(true)
      toast.success("Məhsul səbətə əlavə edildi")
      setTimeout(() => setAddedToCart(false), 2500)
    } catch { toast.error("Xəta baş verdi") }
  }

  const handleFav = async e => {
    e.preventDefault()
    try {
      const r = await addToFavorites(product._id).unwrap()
      if (r.success) { setIsFaved(true); toast.success("Favorilərə əlavə edildi") }
    } catch (err) {
      const msg = err.data?.message || "Xəta baş verdi"
      if (msg.toLowerCase().includes("already")) {
        setIsFaved(true); toast("Artıq favorilərdədir", { icon: "ℹ️" })
      } else toast.error(msg)
    }
  }

  const getSpecs = () => {
    if (!product) return []
    const p   = product
    const map = {
      Phones:        [["Ekran","screenSize"],["Yaddaş","storage"],["RAM","ram"],["Ön Kamera","frontCamera"],["Arxa Kamera","backCamera"],["Batareya","battery"],["Prosessor","processor"],["OS","operatingSystem"]],
      Laptops:       [["Ekran","screenSize"],["Yaddaş","storage"],["RAM","ram"],["GPU","gpu"],["Kamera","camera"],["Prosessor","processor"],["Batareya Ömrü","batteryLife"],["OS","operatingSystem"]],
      Cameras:       [["Həlledicilik","resolution"],["Optik Zoom","opticalZoom"],["Sensor","sensorType"],["Sabitləşdirmə","imageStabilization"]],
      Headphones:    [["Bağlantı","connectivity"],["Batareya","batteryLife"],["Səs İzolyasiyası","noiseCancellation"]],
      Console:       [["CPU","cpu"],["GPU","gpu"],["Yaddaş","storage"],["RAM","memory"],["Həlledicilik","supportedResolution"],["Bağlantı","connectivity"]],
      iPad:          [["Ekran","screenSize"],["Yaddaş","storage"],["RAM","ram"],["Prosessor","processor"],["Batareya","battery"],["OS","operatingSystem"],["Kamera","camera"]],
      WomenClothing: [["Ölçü","size"],["Rəng","color"],["Material","material"],["Brend","brand"],["Mövsüm","season"]],
      MenClothing:   [["Ölçü","size"],["Rəng","color"],["Material","material"],["Brend","brand"],["Mövsüm","season"]],
      KidsClothing:  [["Ölçü","size"],["Rəng","color"],["Material","material"],["Brend","brand"],["Yaş","ageRange"],["Cins","gender"]],
      HomeAppliances:[["Brend","brand"],["Güc","powerConsumption"],["Zəmanət","warranty"],["Ölçülər","dimensions"],["Rəng","color"]],
      HomeAndGarden: [["Material","material"],["Ölçülər","dimensions"],["Rəng","color"],["Brend","brand"],["İstifadə","indoorOutdoor"]],
      Beauty:        [["Brend","brand"],["Dəri Tipi","skinType"],["Həcm","volume"],["Tərkib","ingredients"],["Son Tarix","expiryDate"]],
      Sports:        [["Brend","brand"],["Material","material"],["Çəki","weight"],["Uyğundur","suitableFor"],["Rəng","color"]],
      Automotive:    [["Brend","brand"],["Uyğun Modellər","compatibleModels"],["Material","material"],["Zəmanət","warranty"],["Rəng","color"]],
    }
    const rows  = map[p.category] || []
    const extra = []
    if (p.category === "Console" && p.controllerIncluded) extra.push(["Controller", "Daxildir"])
    if (p.category === "iPad"    && p.cellular)           extra.push(["Cellular", "Bəli"])
    return [...rows.map(([l, k]) => p[k] ? [l, p[k]] : null).filter(Boolean), ...extra]
  }

  const handleReviewSubmit = async e => {
    e.preventDefault()
    if (!reviewRating) { toast.error("Zəhmət olmasa ulduz seçin"); return }
    try {
      const res = await createOrUpdateReview({
        productId: product._id, rating: reviewRating, comment: reviewComment,
      }).unwrap()
      toast.success(res.message || "Rəy göndərildi")
      setReviewRating(0); setReviewComment("")
    } catch (err) { toast.error(err.data?.message || "Xəta baş verdi") }
  }

  /* ── Loading ── */
  if (isLoading)
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: C.bg }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          border: `4px solid ${C.redMid}`, borderTopColor: C.red,
          animation: "_spin 0.75s linear infinite",
        }} />
        <style>{`@keyframes _spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )

  if (error)
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: 12, color: C.red }}>
        <AlertCircle size={48} />
        <p style={{ fontSize: 18, fontWeight: 600 }}>Xəta: {error.message}</p>
      </div>
    )

  const origPrice = product?.originalPrice || Math.round((product?.price || 0) * 1.25)
  const discount  = product?.discount || 25
  const inStock   = product?.stock > 0
  const lowStock  = inStock && product.stock <= 10
  const specs     = getSpecs()

  /* ─────────────────────────────────────────── RENDER ── */
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: font }}>
      <Toaster position="top-center" toastOptions={{ style: { fontSize: 13, borderRadius: 10, fontFamily: font } }} />

      {/* ── TOP BAR ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: C.white,
        borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "center",
        padding: "12px 16px", gap: 8,
      }}>
        <button
          onClick={() => window.history.back()}
          style={{
            width: 38, height: 38, borderRadius: 10,
            background: C.bg, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: C.textDark, flexShrink: 0,
          }}
        >
          <ArrowLeft size={20} />
        </button>

        <span style={{ flex: 1, fontSize: 16, fontWeight: 700, color: C.textDark, textAlign: "center" }}>
          Məhsul Detalı
        </span>

        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={handleFav}
            style={{
              width: 38, height: 38, borderRadius: 10,
              background: isFaved ? C.redLight : C.bg,
              border: `1.5px solid ${isFaved ? C.red : C.border}`,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Heart size={18} fill={isFaved ? C.red : "none"} color={isFaved ? C.red : C.textMid} />
          </button>
          <button
            onClick={() => {
              const productUrl  = `${window.location.origin}/product/${params?.id}`
              const bloggerInfo = JSON.parse(localStorage.getItem("bloggerInfo") || "null")
              const shareUrl    = bloggerInfo?.promoCode ? `${productUrl}?promo=${bloggerInfo.promoCode}` : productUrl
              navigator.clipboard.writeText(shareUrl)
              toast.success("Link kopyalandı!")
            }}
            style={{
              width: 38, height: 38, borderRadius: 10,
              background: C.bg, border: `1.5px solid ${C.border}`,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Share2 size={17} color={C.textMid} />
          </button>
        </div>
      </div>

      {/* ── MAIN WRAPPER ── */}
      <div style={{ padding: "12px 12px 48px" }}>
        <div className="pd-main-grid">

          {/* ════ SOL / ÜST — Şəkil bölməsi ════ */}
          <div>
            {/* Əsas şəkil */}
            <div style={{
              position: "relative", borderRadius: 20, overflow: "hidden",
              background: C.white, aspectRatio: "4/3",
              boxShadow: C.shadow,
            }}>
              <img
                src={imgUrl}
                alt={product?.name}
                style={{ width: "100%", height: "100%", objectFit: "contain", padding: 16 }}
              />

              {/* Flash Sale overlay — sol yuxarı */}
              <div style={{
                position: "absolute", top: 12, left: 12,
                display: "flex", alignItems: "center", gap: 6,
                background: C.red, borderRadius: 8, padding: "6px 10px",
              }}>
                <Zap size={13} fill="white" color="white" />
                <span style={{ color: "#fff", fontSize: 11, fontWeight: 800, letterSpacing: 0.6 }}>
                  FLASH SALE
                </span>
                <div style={{
                  background: "rgba(0,0,0,0.22)",
                  borderRadius: 5, padding: "1px 7px",
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  <Clock size={10} color="white" />
                  <span style={{ color: "#fff", fontFamily: "monospace", fontSize: 12, fontWeight: 700 }}>
                    {fmt(timeLeft)}
                  </span>
                </div>
              </div>

              {/* Endirim badge — sağ yuxarı */}
              <div style={{
                position: "absolute", top: 12, right: 12,
                background: C.redDark, color: "#fff",
                fontSize: 12, fontWeight: 800, padding: "4px 9px",
                borderRadius: 8, letterSpacing: 0.3,
              }}>
                -{discount}%
              </div>

              {/* Naviqasiya oxları */}
              {imgs.length > 1 && ["prev", "next"].map(dir => (
                <button key={dir} onClick={() => navImg(dir)} style={{
                  position: "absolute", top: "50%",
                  [dir === "prev" ? "left" : "right"]: 10,
                  transform: "translateY(-50%)",
                  width: 34, height: 34, borderRadius: "50%",
                  background: "rgba(255,255,255,0.92)",
                  border: `1px solid ${C.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", boxShadow: C.shadow,
                }}>
                  {dir === "prev"
                    ? <ChevronLeft  size={16} color={C.textDark} />
                    : <ChevronRight size={16} color={C.textDark} />}
                </button>
              ))}

              {/* Dots indikatoru */}
              {imgs.length > 1 && (
                <div style={{
                  position: "absolute", bottom: 10, left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex", gap: 5,
                }}>
                  {imgs.map((_, i) => (
                    <button key={i} onClick={() => setCurrentImg(i)} style={{
                      width: i === currentImg ? 18 : 6,
                      height: 6, borderRadius: 3,
                      background: i === currentImg ? C.red : "rgba(255,255,255,0.7)",
                      border: "none", cursor: "pointer", padding: 0,
                      transition: "all 0.2s",
                    }} />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail-lər */}
            {imgs.length > 1 && (
              <div style={{ display: "flex", gap: 8, marginTop: 10, overflowX: "auto", paddingBottom: 4 }}>
                {imgs.map((img, i) => (
                  <button key={i} onClick={() => setCurrentImg(i)} style={{
                    width: 62, height: 62, borderRadius: 10, overflow: "hidden", flexShrink: 0,
                    border: `2px solid ${i === currentImg ? C.red : C.border}`,
                    cursor: "pointer", background: C.white, padding: 4,
                    boxShadow: i === currentImg ? `0 0 0 2px ${C.redBorder}` : "none",
                    transition: "all 0.15s",
                  }}>
                    <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ════ SAĞ / ALT — Məlumat bölməsi ════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

            {/* Qiymət + Ad + Rating */}
            <Section>
              {/* Qiymət sətri */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
                <span style={{ fontSize: 30, fontWeight: 800, color: C.priceRed, lineHeight: 1 }}>
                  ₼{product?.price}
                </span>
                <span style={{ fontSize: 15, color: C.textLight, textDecoration: "line-through" }}>
                  ₼{origPrice}
                </span>
                <span style={{
                  fontSize: 12, fontWeight: 700, color: C.white,
                  background: C.red, padding: "3px 8px", borderRadius: 6,
                }}>
                  ₼{(origPrice - (product?.price || 0)).toFixed(2)} qənaət
                </span>
              </div>

              {/* Məhsul adı */}
              <h1 style={{
                fontSize: 18, fontWeight: 700, color: C.textDark,
                lineHeight: 1.4, margin: "0 0 10px",
              }}>
                {product?.name}
              </h1>

              {/* Rating + Stok */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 2 }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} size={14}
                      fill={i <= Math.round(product?.ratings || 0) ? C.star : "#DDD"}
                      color={i <= Math.round(product?.ratings || 0) ? C.star : "#DDD"}
                    />
                  ))}
                </div>
                <span style={{ fontSize: 13, color: C.red, fontWeight: 700 }}>
                  {product?.ratings?.toFixed(1) || "0.0"}
                </span>
                <span style={{ fontSize: 12, color: C.textLight }}>({totalRev} rəy)</span>
                <span style={{ width: 1, height: 12, background: C.borderMid }} />
                {inStock ? (
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.green }}>
                    ✓ Stokda var{lowStock ? ` — ${product.stock} ədəd` : ""}
                  </span>
                ) : (
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.red }}>
                    Stokda yoxdur
                  </span>
                )}
              </div>
            </Section>

            {/* Satıcı */}
            <Section>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `linear-gradient(135deg,${C.red} 0%,${C.redDark} 100%)`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <Store size={20} color="white" />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: C.textLight }}>Satıcı</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.textDark }}>{sellerName}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 2, marginTop: 2 }}>
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={10} fill={C.star} color={C.star} />
                      ))}
                      <span style={{ fontSize: 11, color: C.textLight, marginLeft: 3 }}>4.8</span>
                      <GreenBadge><BadgeCheck size={9}/> Doğrulanmış</GreenBadge>
                    </div>
                  </div>
                </div>
                <button
                  style={{
                    fontSize: 12, fontWeight: 700, color: C.red,
                    border: `1.5px solid ${C.red}`, borderRadius: 10,
                    padding: "8px 14px", background: C.redLight,
                    cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.red; e.currentTarget.style.color = "#fff" }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.redLight; e.currentTarget.style.color = C.red }}
                  onClick={async () => {
                    if (!sellerName || sellerName === "Satıcı") return
                    try {
                      const result = await getStoreSlug(sellerName, false).unwrap()
                      if (result?.storeSlug) {
                        navigate(`/store/${result.storeSlug}`)
                      } else {
                        alert("Bu satıcının mağazası tapılmadı")
                      }
                    } catch (err) {
                      console.error("Store lookup error:", err)
                      alert("Mağaza tapılmadı: " + (err?.data?.message || "Xəta baş verdi"))
                    }
                  }}
                >
                  Mağazaya bax →
                </button>
              </div>
            </Section>

            {/* Miqdar + Düymələr */}
            <Section>
              {/* Miqdar seçici */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.textMid }}>Miqdar:</span>
                <div style={{
                  display: "flex", alignItems: "center",
                  border: `1.5px solid ${C.border}`, borderRadius: 10,
                  background: C.white, overflow: "hidden",
                }}>
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    style={{
                      width: 40, height: 40,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "none", border: "none", cursor: "pointer",
                      color: quantity <= 1 ? C.textLight : C.red,
                      borderRight: `1px solid ${C.border}`,
                    }}
                  >
                    <Minus size={15} />
                  </button>
                  <span style={{ width: 48, textAlign: "center", fontSize: 16, fontWeight: 700, color: C.textDark }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    style={{
                      width: 40, height: 40,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "none", border: "none", cursor: "pointer",
                      color: C.red, borderLeft: `1px solid ${C.border}`,
                    }}
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>

              {/* Səbətə əlavə et */}
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                style={{
                  width: "100%", height: 52,
                  background: !inStock
                    ? C.border
                    : addedToCart
                      ? `linear-gradient(135deg,${C.green},#028040)`
                      : `linear-gradient(135deg,${C.red} 0%,${C.redDark} 100%)`,
                  border: "none", borderRadius: 14, cursor: inStock ? "pointer" : "default",
                  fontSize: 15, fontWeight: 700, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: inStock ? `0 4px 14px rgba(232,25,44,0.30)` : "none",
                  transition: "all 0.25s", marginBottom: 10,
                }}
              >
                {addedToCart
                  ? <><CheckCircle size={18} /> Əlavə edildi</>
                  : <><ShoppingCart size={18} /> Səbətə əlavə et</>
                }
              </button>

              {/* İndi al */}
              <button
                onClick={async () => {
                  if (!inStock) return;
                  try {
                    await addToCart({ productId: product._id, quantity }).unwrap();
                    navigate("/payment");
                  } catch {
                    toast.error("Xəta baş verdi");
                  }
                }}
                disabled={!inStock}
                style={{
                  width: "100%", height: 48,
                  background: C.white,
                  border: `2px solid ${C.red}`,
                  borderRadius: 14, cursor: inStock ? "pointer" : "default",
                  fontSize: 15, fontWeight: 700, color: C.red,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "all 0.18s",
                  opacity: inStock ? 1 : 0.5,
                }}
                onMouseEnter={e => { if(inStock){ e.currentTarget.style.background = C.red; e.currentTarget.style.color = "#fff" } }}
                onMouseLeave={e => { if(inStock){ e.currentTarget.style.background = C.white; e.currentTarget.style.color = C.red } }}
              >
                İndi Al
              </button>
            </Section>

            {/* Güvən sətri */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
              {[
                { icon: <Truck size={18} />,     label: "Pulsuz Çatdırılma", sub: "24–48 saat" },
                { icon: <RotateCcw size={18} />, label: "30 Gün İadə",       sub: "Problemsiz" },
                { icon: <Shield size={18} />,    label: "Rəsmi Zəmanət",     sub: "Orijinal məhsul" },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  flex: 1, minWidth: 120,
                  padding: "10px 12px", background: C.white,
                  border: `1px solid ${C.border}`, borderRadius: 12,
                  boxShadow: C.shadowSm, flexShrink: 0,
                }}>
                  <div style={{ color: C.red }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.textDark }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: C.textLight }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Açıqlama */}
            <Section>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: C.textDark, margin: "0 0 10px" }}>
                Məhsul Haqqında
              </h3>
              <div style={{
                fontSize: 14, color: C.textMid, lineHeight: 1.75,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: descExpanded ? "unset" : 4,
                WebkitBoxOrient: "vertical",
              }}>
                {product?.description || "Məhsul haqqında məlumat yoxdur."}
              </div>
              <button
                onClick={() => setDescExpanded(v => !v)}
                style={{
                  display: "flex", alignItems: "center", gap: 4, marginTop: 8,
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: 700, color: C.red,
                }}
              >
                {descExpanded ? "Daha az" : "Daha çox oxu"}
                <ChevronDown size={14} style={{
                  transform: descExpanded ? "rotate(180deg)" : "rotate(0)",
                  transition: "0.2s",
                }} />
              </button>
            </Section>

            {/* Texniki göstəricilər */}
            {specs.length > 0 && (
              <Section>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: C.textDark, margin: "0 0 12px" }}>
                  Texniki Göstəricilər
                </h3>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, borderRadius: 10, overflow: "hidden" }}>
                  <tbody>
                    {specs.map(([label, val], i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? "#FFF5F5" : C.white }}>
                        <td style={{
                          padding: "9px 12px", color: C.textMid, fontWeight: 500,
                          width: "42%", borderBottom: `1px solid ${C.border}`,
                        }}>
                          {label}
                        </td>
                        <td style={{
                          padding: "9px 12px", color: C.textDark, fontWeight: 600,
                          borderBottom: `1px solid ${C.border}`,
                        }}>
                          {val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Section>
            )}
          </div>
        </div>

        {/* ════ Rəylər bölməsi (full-width) ════ */}
        <Section style={{ marginTop: 12, borderRadius: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: C.textDark, margin: "0 0 20px" }}>
            Müştəri Rəyləri
          </h2>

          {/* Statistika + Form */}
          <div className="pd-reviews-top">

            {/* Ümumi reytinq */}
            <div style={{ textAlign: "center", minWidth: 90 }}>
              <div style={{ fontSize: 52, fontWeight: 800, color: C.red, lineHeight: 1 }}>
                {product?.ratings?.toFixed(1) || "0.0"}
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 2, margin: "6px 0" }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={14}
                    fill={i <= Math.round(product?.ratings || 0) ? C.star : "#DDD"}
                    color={i <= Math.round(product?.ratings || 0) ? C.star : "#DDD"}
                  />
                ))}
              </div>
              <div style={{ fontSize: 12, color: C.textLight }}>{totalRev} rəy</div>
            </div>

            {/* Bar chart */}
            <div style={{ flex: 1, minWidth: 140, paddingTop: 4 }}>
              {ratingDist.map(({ v, count }) => (
                <RatingBar key={v} value={v} count={count} total={totalRev} />
              ))}
            </div>

            {/* Rəy formu */}
            <div style={{
              flex: 1, minWidth: 220,
              background: C.redLight, border: `1px solid ${C.redBorder}`,
              borderRadius: 12, padding: 16,
            }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: C.textDark, margin: "0 0 10px" }}>
                Rəy Bildirin
              </h4>
              <form onSubmit={handleReviewSubmit}>
                <div style={{ marginBottom: 10 }}>
                  <StarRatings
                    rating={reviewRating}
                    changeRating={setReviewRating}
                    numberOfStars={5}
                    starRatedColor={C.star}
                    starHoverColor={C.star}
                    starDimension="24px"
                    starSpacing="2px"
                  />
                </div>
                <textarea
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="Məhsul haqqında fikirləriniz..."
                  style={{
                    width: "100%", height: 84, padding: "8px 10px",
                    border: `1px solid ${C.redBorder}`, borderRadius: 10,
                    fontSize: 13, color: C.textDark, resize: "none",
                    outline: "none", background: C.white,
                    boxSizing: "border-box", fontFamily: font,
                    transition: "border-color 0.15s",
                  }}
                  onFocus={e => e.target.style.borderColor = C.red}
                  onBlur={e => e.target.style.borderColor = C.redBorder}
                />
                <button type="submit" style={{
                  marginTop: 8, width: "100%", padding: "10px 0",
                  background: `linear-gradient(135deg,${C.red} 0%,${C.redDark} 100%)`,
                  border: "none", borderRadius: 10,
                  fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer",
                  boxShadow: `0 2px 8px rgba(232,25,44,0.22)`,
                  transition: "filter 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.08)"}
                  onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
                >
                  Rəyi Göndər
                </button>
              </form>
            </div>
          </div>

          <Divider />

          {/* Rəy siyahısı */}
          {reviewsLoading ? (
            <div style={{ textAlign: "center", padding: "30px 0", color: C.textLight, fontSize: 14 }}>
              Yüklənir...
            </div>
          ) : reviewsError ? (
            <div style={{ color: C.red, fontSize: 14 }}>Rəyləri gətirmək mümkün olmadı.</div>
          ) : reviews.length > 0 ? (
            <div>
              {reviews.map((review, idx) => (
                <div key={idx} style={{
                  padding: "16px 0",
                  borderBottom: idx < reviews.length - 1 ? `1px solid ${C.border}` : "none",
                }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                      background: C.redMid,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <User size={18} color={C.red} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: C.textDark }}>
                          {review.name || "İstifadəçi"}
                        </span>
                        <GreenBadge><CheckCircle size={9} /> Doğrulanmış alış</GreenBadge>
                      </div>
                      <div style={{ display: "flex", gap: 2, marginBottom: 6 }}>
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star key={i} size={13}
                            fill={i <= review.rating ? C.star : "#DDD"}
                            color={i <= review.rating ? C.star : "#DDD"}
                          />
                        ))}
                      </div>
                      <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.65, margin: 0 }}>
                        {review.comment}
                      </p>
                      <button style={{
                        display: "flex", alignItems: "center", gap: 5, marginTop: 8,
                        background: "none", border: `1px solid ${C.border}`,
                        borderRadius: 7, padding: "4px 10px",
                        cursor: "pointer", fontSize: 12, color: C.textLight,
                        transition: "all 0.15s",
                      }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = C.borderMid}
                        onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
                      >
                        <ThumbsUp size={12} /> Faydalıdır
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: "center", padding: "36px 0",
              border: `1.5px dashed ${C.redBorder}`, borderRadius: 12,
              background: C.redLight,
            }}>
              <Package size={34} color={C.redBorder} style={{ marginBottom: 10 }} />
              <p style={{ fontSize: 14, color: C.textLight, margin: 0 }}>
                Bu məhsul üçün hələ heç kim rəy yazmayıb. İlk siz olun!
              </p>
            </div>
          )}
        </Section>
      </div>

      {/* ── Responsive styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; }

        .pd-main-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 12px;
        }

        .pd-reviews-top {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 20px;
        }

        @media (min-width: 768px) {
          .pd-main-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            align-items: start;
          }
          .pd-reviews-top {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 24px;
          }
        }

        @media (min-width: 1024px) {
          .pd-main-grid {
            max-width: 1200px;
            margin-left: auto;
            margin-right: auto;
            grid-template-columns: minmax(340px, 2fr) minmax(360px, 3fr);
            gap: 24px;
          }
        }

        @keyframes _spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

export default ProductDetail
