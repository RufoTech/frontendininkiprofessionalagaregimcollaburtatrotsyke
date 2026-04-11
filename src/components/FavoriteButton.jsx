import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useGetFavoritesQuery, useRemoveFromFavoritesMutation, productApi } from "../redux/api/productsApi"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"
import { ArrowLeft, ArrowRight, Heart, ShoppingBag, Trash2 } from "lucide-react"

const FavoriteButton = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const { data: favoriteData, isLoading, refetch } = useGetFavoritesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  const [removeFromFavorites] = useRemoveFromFavoritesMutation()
  const [localFavorites, setLocalFavorites] = useState([])

  useEffect(() => {
    setLocalFavorites(favoriteData?.favorites || [])
  }, [favoriteData])

  const handleRemoveFromFavorites = async (event, productId) => {
    event.preventDefault()
    try {
      await removeFromFavorites(productId).unwrap()
      setLocalFavorites((prev) => prev.filter((item) => item._id !== productId))
      toast.success(t("favorites.removedSuccess"))
      dispatch(productApi.util.invalidateTags(["Favorites"]))
      await refetch()
    } catch {
      toast.error(t("favorites.removeError"))
    }
  }

  if (isLoading) {
    return (
      <section className="page-section" style={{ minHeight: 320, display: "grid", placeItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 52, height: 52, borderRadius: 18, border: "3px solid rgba(232,25,44,0.14)", borderTopColor: "#e8192c", margin: "0 auto 14px", animation: "spin 1s linear infinite" }} />
          <p style={{ color: "#64748b", fontWeight: 700 }}>{t("favorites.loading")}</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </section>
    )
  }

  if (!localFavorites.length) {
    return (
      <section className="page-section" style={{ textAlign: "center", padding: "64px 24px" }}>
        <div style={{ width: 96, height: 96, borderRadius: 30, background: "rgba(232,25,44,0.08)", color: "#e8192c", display: "grid", placeItems: "center", margin: "0 auto 20px" }}>
          <Heart size={44} fill="#e8192c" />
        </div>
        <h2 style={{ fontSize: 34, fontWeight: 900, letterSpacing: "-0.05em", margin: 0, color: "#0f172a" }}>{t("favorites.empty")}</h2>
        <p style={{ maxWidth: 560, margin: "12px auto 0", color: "#64748b", lineHeight: 1.8 }}>{t("favorites.emptyDesc")}</p>
        <Link
          to="/shop"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginTop: 24,
            padding: "14px 18px",
            borderRadius: 16,
            background: "linear-gradient(135deg,#e8192c,#be123c)",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 800,
            boxShadow: "0 18px 30px rgba(232,25,44,0.2)",
          }}
        >
          <ShoppingBag size={18} />
          {t("favorites.goToShop")}
        </Link>
      </section>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <section
        className="page-section"
        style={{
          padding: 0,
          overflow: "hidden",
          background: "linear-gradient(135deg, #22080c 0%, #7f1520 46%, #ef4444 100%)",
          color: "#fff",
        }}
      >
        <div className="floating-orb floating-orb--rose" style={{ width: 240, height: 240, top: -70, right: -30 }} />
        <div className="floating-orb floating-orb--mint" style={{ width: 220, height: 220, bottom: -80, left: -30 }} />

        <div style={{ position: "relative", zIndex: 1, padding: "34px 30px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, alignItems: "end" }}>
          <div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,0.12)", fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Favorites list
            </span>
            <h1 style={{ margin: "14px 0 8px", fontSize: "clamp(2rem, 4vw, 3.8rem)", lineHeight: 0.96, fontWeight: 900, letterSpacing: "-0.05em" }}>
              {t("favorites.title")}
            </h1>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
              <strong>{localFavorites.length}</strong> {t("favorites.itemCount")}
            </p>
          </div>

          <div style={{ justifySelf: "end" }}>
            <Link
              to="/shop"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 18px",
                borderRadius: 16,
                background: "rgba(255,255,255,0.12)",
                color: "#fff",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.16)",
                fontWeight: 800,
                backdropFilter: "blur(12px)",
              }}
            >
              <ArrowLeft size={16} />
              {t("favorites.continueShopping")}
            </Link>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading" style={{ position: "relative", zIndex: 1 }}>
          <div>
            <span className="section-kicker">Wishlist</span>
            <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-0.04em", marginTop: 12 }}>Seçilmiş məhsullar</h2>
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 18 }}>
          {localFavorites.map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              style={{
                textDecoration: "none",
                borderRadius: 26,
                overflow: "hidden",
                background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.92))",
                border: "1px solid rgba(148,163,184,0.16)",
                boxShadow: "0 18px 38px rgba(15,23,42,0.08)",
                display: "flex",
                flexDirection: "column",
                transition: "transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.transform = "translateY(-6px)"
                event.currentTarget.style.boxShadow = "0 26px 54px rgba(15,23,42,0.12)"
                event.currentTarget.style.borderColor = "rgba(232,25,44,0.24)"
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.transform = "translateY(0)"
                event.currentTarget.style.boxShadow = "0 18px 38px rgba(15,23,42,0.08)"
                event.currentTarget.style.borderColor = "rgba(148,163,184,0.16)"
              }}
            >
              <div style={{ position: "relative", aspectRatio: "4 / 3", overflow: "hidden", background: "#f1f5f9" }}>
                <img
                  src={product.images?.[0]?.url || "/default-product.jpg"}
                  alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <button
                  onClick={(event) => handleRemoveFromFavorites(event, product._id)}
                  title={t("favorites.removeTitle")}
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    width: 40,
                    height: 40,
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.4)",
                    background: "rgba(255,255,255,0.92)",
                    color: "#e8192c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 12px 18px rgba(15,23,42,0.08)",
                  }}
                >
                  <Trash2 size={18} />
                </button>
                {product.stock === 0 && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.7)", display: "grid", placeItems: "center" }}>
                    <span style={{ padding: "8px 14px", borderRadius: 999, background: "#111827", color: "#fff", fontWeight: 800, fontSize: 12 }}>
                      {t("favorites.outOfStock")}
                    </span>
                  </div>
                )}
              </div>

              <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: 18, lineHeight: 1.4, color: "#0f172a", fontWeight: 800, minHeight: 50 }}>
                  {product.name}
                </h3>

                <div style={{ marginTop: "auto", display: "flex", alignItems: "end", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>Qiymət</div>
                    <div style={{ fontSize: 24, color: "#e8192c", fontWeight: 900, letterSpacing: "-0.04em" }}>
                      {product.price.toFixed(2)} ₼
                    </div>
                  </div>

                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 14px", borderRadius: 16, background: "rgba(232,25,44,0.06)", color: "#be123c", fontWeight: 800 }}>
                    {t("favorites.viewProduct")}
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default FavoriteButton
