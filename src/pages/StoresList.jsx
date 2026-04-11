import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useGetAllStoresQuery } from "../redux/api/authApi"
import { useTranslation } from "react-i18next"
import { ArrowUpDown, ChevronLeft, ChevronRight, Loader2, MapPin, Star, Store } from "lucide-react"

const RatingLabelComp = ({ avg, num, t }) => {
  if (num === 0) return <span style={{ fontSize: 12, color: "#94a3b8" }}>{t("storesList.noRating")}</span>
  const cfg =
    avg >= 4 ? { text: t("storesList.labelGood"), bg: "#f0fdf4", color: "#15803d" } :
    avg >= 3 ? { text: t("storesList.labelAvg"), bg: "#fffbeb", color: "#b45309" } :
      { text: t("storesList.labelWeak"), bg: "#fef2f2", color: "#dc2626" }
  return (
    <span style={{ background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 800, padding: "6px 10px", borderRadius: 999 }}>
      {cfg.text}
    </span>
  )
}

const Stars = ({ value, size = 13 }) => (
  <div style={{ display: "flex", gap: 1 }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={size}
        fill={s <= Math.round(value) ? "#FBBF24" : "none"}
        color={s <= Math.round(value) ? "#FBBF24" : "#ddd"}
      />
    ))}
  </div>
)

export default function StoresList() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [sort, setSort] = useState("rating")
  const [page, setPage] = useState(1)
  const LIMIT = 24

  const { data, isLoading, isFetching } = useGetAllStoresQuery({ sort, page, limit: LIMIT })

  const stores = data?.stores || []
  const total = data?.total || 0
  const pages = data?.pages || 1

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

        <div style={{ position: "relative", zIndex: 1, padding: "34px 30px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 22, alignItems: "center" }}>
            <div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,0.12)", fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Marketplace stores
              </span>
              <h1 style={{ margin: "14px 0 8px", fontSize: "clamp(2rem, 4vw, 4rem)", lineHeight: 0.96, fontWeight: 900, letterSpacing: "-0.05em" }}>
                {t("storesList.title")}
              </h1>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.78)", lineHeight: 1.7, maxWidth: 640 }}>
                {total} {t("storesList.foundCount")} və daha təmiz kart görünüşü ilə mağazaları müqayisə etmək daha rahat oldu.
              </p>
            </div>

            <div style={{ justifySelf: "end", display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", justifyContent: "flex-end" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.78)", fontWeight: 700, fontSize: 13 }}>
                <ArrowUpDown size={15} />
                {t("storesList.sortBy")}
              </span>
              {[
                { key: "rating", label: t("storesList.sortRating") },
                { key: "name", label: t("storesList.sortName") },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => { setSort(option.key); setPage(1) }}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 16,
                    border: sort === option.key ? "none" : "1px solid rgba(255,255,255,0.22)",
                    background: sort === option.key ? "#fff" : "rgba(255,255,255,0.08)",
                    color: sort === option.key ? "#be123c" : "#fff",
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: "pointer",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading" style={{ position: "relative", zIndex: 1 }}>
          <div>
            <span className="section-kicker">Stores</span>
            <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-0.04em", marginTop: 12 }}>Mağaza siyahısı</h2>
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          {isLoading || isFetching ? (
            <div style={{ textAlign: "center", padding: 80 }}>
              <Loader2 size={36} color="#e8192c" className="animate-spin" />
            </div>
          ) : stores.length === 0 ? (
            <div style={{ textAlign: "center", padding: 70, borderRadius: 24, background: "rgba(255,255,255,0.8)", border: "1px dashed rgba(148,163,184,0.28)" }}>
              <Store size={52} color="#cbd5e1" style={{ marginBottom: 12 }} />
              <p style={{ margin: 0, color: "#94a3b8", fontSize: 16 }}>{t("storesList.noStores")}</p>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
                {stores.map((store, idx) => (
                  <article
                    key={store._id}
                    onClick={() => navigate(`/store/${store.storeSlug}`)}
                    style={{
                      position: "relative",
                      cursor: "pointer",
                      borderRadius: 26,
                      padding: 20,
                      background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.92))",
                      border: "1px solid rgba(148,163,184,0.18)",
                      boxShadow: "0 18px 38px rgba(15,23,42,0.08)",
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
                      event.currentTarget.style.borderColor = "rgba(148,163,184,0.18)"
                    }}
                  >
                    {sort === "rating" && idx < 3 && store.numReviews > 0 && (
                      <div style={{ position: "absolute", top: 16, right: 16, padding: "6px 10px", borderRadius: 999, background: idx === 0 ? "#facc15" : idx === 1 ? "#d4d4d8" : "#fdba74", color: "#fff", fontSize: 11, fontWeight: 900 }}>
                        #{idx + 1}
                      </div>
                    )}

                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                      <div style={{ width: 56, height: 56, borderRadius: 18, background: "linear-gradient(135deg,#e8192c,#fb7185)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, boxShadow: "0 16px 24px rgba(232,25,44,0.22)" }}>
                        {(store.storeName?.[0] || "M").toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ margin: 0, fontWeight: 800, fontSize: 17, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {store.storeName}
                        </p>
                        <div style={{ marginTop: 6 }}>
                          <RatingLabelComp avg={store.avgRating} num={store.numReviews} t={t} />
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      {store.numReviews > 0 ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Stars value={store.avgRating} size={14} />
                          <span style={{ fontWeight: 800, color: "#111827" }}>{Number(store.avgRating).toFixed(1)}</span>
                          <span style={{ color: "#94a3b8", fontSize: 12 }}>({store.numReviews})</span>
                        </div>
                      ) : (
                        <span style={{ color: "#94a3b8", fontSize: 12 }}>{t("storesList.noRating")}</span>
                      )}
                    </div>

                    {store.storeAddress && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", fontSize: 13, minHeight: 22 }}>
                        <MapPin size={14} />
                        <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{store.storeAddress}</span>
                      </div>
                    )}

                    <div style={{ marginTop: 18, padding: "12px 14px", borderRadius: 16, background: "rgba(232,25,44,0.06)", color: "#be123c", fontWeight: 800, textAlign: "center" }}>
                      {t("storesList.viewStore")}
                    </div>
                  </article>
                ))}
              </div>

              {pages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 32, flexWrap: "wrap" }}>
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    style={{ width: 42, height: 42, borderRadius: 14, border: "1px solid rgba(148,163,184,0.18)", background: "#fff", opacity: page === 1 ? 0.45 : 1, cursor: page === 1 ? "not-allowed" : "pointer" }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      style={{
                        minWidth: 42,
                        height: 42,
                        padding: "0 12px",
                        borderRadius: 14,
                        border: page === p ? "none" : "1px solid rgba(148,163,184,0.18)",
                        background: page === p ? "linear-gradient(135deg,#e8192c,#be123c)" : "#fff",
                        color: page === p ? "#fff" : "#475569",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(pages, p + 1))}
                    disabled={page === pages}
                    style={{ width: 42, height: 42, borderRadius: 14, border: "1px solid rgba(148,163,184,0.18)", background: "#fff", opacity: page === pages ? 0.45 : 1, cursor: page === pages ? "not-allowed" : "pointer" }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
