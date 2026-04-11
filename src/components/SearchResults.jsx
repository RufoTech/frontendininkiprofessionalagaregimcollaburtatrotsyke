import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useSearchProductsQuery } from "../redux/api/productsApi";
import { useTranslation } from "react-i18next";
import StarRatings from "react-star-ratings";
import { ArrowRight, Home, Search, SearchX, ShoppingBag } from "lucide-react";

const ProductSkeleton = () => (
  <div style={{ borderRadius: 24, background: "rgba(255,255,255,0.9)", border: "1px solid rgba(148,163,184,0.14)", padding: 18, display: "grid", gridTemplateColumns: "120px minmax(0,1fr) 160px", gap: 16, alignItems: "center" }}>
    <div style={{ height: 120, borderRadius: 18, background: "#e5e7eb" }} />
    <div style={{ display: "grid", gap: 10 }}>
      <div style={{ height: 22, borderRadius: 8, background: "#e5e7eb", width: "70%" }} />
      <div style={{ height: 16, borderRadius: 8, background: "#e5e7eb", width: "40%" }} />
      <div style={{ height: 16, borderRadius: 8, background: "#e5e7eb", width: "85%" }} />
    </div>
    <div style={{ display: "grid", gap: 10 }}>
      <div style={{ height: 28, borderRadius: 10, background: "#e5e7eb" }} />
      <div style={{ height: 42, borderRadius: 12, background: "#e5e7eb" }} />
    </div>
  </div>
);

const SearchResults = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query") || "";
  const { data: results, isLoading, isError, error } = useSearchProductsQuery(
    { query },
    { skip: !query.trim() }
  );
  const [searchInput, setSearchInput] = useState(query);
  const products = results?.products || [];
  const defaultImageUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'%3ESekil yoxdur%3C/text%3E%3C/svg%3E";

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search-results?query=${encodeURIComponent(searchInput)}`);
  };

  if (isLoading) {
    return (
      <div style={{ display: "grid", gap: 14 }}>
        {[...Array(4)].map((_, i) => <ProductSkeleton key={i} />)}
      </div>
    );
  }

  if (isError && error?.status !== 304) {
    return (
      <section className="page-section" style={{ textAlign: "center" }}>
        <SearchX size={56} color="#e8192c" style={{ marginBottom: 14 }} />
        <h2 style={{ fontSize: 28, fontWeight: 900, margin: 0 }}>{t("searchResults.errorTitle")}</h2>
        <p style={{ color: "#64748b", marginTop: 10 }}>{t("searchResults.errorDesc")}</p>
      </section>
    );
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

        <div style={{ position: "relative", zIndex: 1, padding: "34px 30px" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "rgba(255,255,255,0.74)", flexWrap: "wrap", marginBottom: 20 }}>
            <Link to="/" style={{ color: "#fff", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Home size={14} /> {t("searchResults.breadcrumbHome")}
            </Link>
            <span>/</span>
            <Link to="/shop" style={{ color: "#fff", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <ShoppingBag size={14} /> {t("searchResults.breadcrumbShop")}
            </Link>
            <span>/</span>
            <span>{t("searchResults.breadcrumbSearch")}</span>
          </nav>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 22, alignItems: "end" }}>
            <div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,0.12)", fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Search results
              </span>
              <h1 style={{ margin: "14px 0 8px", fontSize: "clamp(2rem, 4vw, 3.8rem)", lineHeight: 0.96, fontWeight: 900, letterSpacing: "-0.05em" }}>
                "{query}" {t("searchResults.title")}
              </h1>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
                {results ? `${results.total || results.totalProducts || 0} ${t("searchResults.totalFound")}` : ""}
              </p>
            </div>

            <form onSubmit={handleSearchSubmit} style={{ position: "relative" }}>
              <div style={{ position: "absolute", inset: "0 auto 0 16px", display: "flex", alignItems: "center", color: "#94a3b8" }}>
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder={t("searchResults.placeholder")}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{
                  width: "100%",
                  height: 56,
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.16)",
                  background: "rgba(255,255,255,0.96)",
                  padding: "0 130px 0 48px",
                  outline: "none",
                  color: "#0f172a",
                }}
              />
              <button
                type="submit"
                style={{
                  position: "absolute",
                  right: 6,
                  top: 6,
                  bottom: 6,
                  padding: "0 18px",
                  borderRadius: 14,
                  border: "none",
                  background: "linear-gradient(135deg,#e8192c,#be123c)",
                  color: "#fff",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {t("searchResults.searchBtn")}
              </button>
            </form>
          </div>
        </div>
      </section>

      {(!results || products.length === 0) ? (
        <section className="page-section" style={{ textAlign: "center" }}>
          <div style={{ width: 94, height: 94, borderRadius: 28, background: "rgba(232,25,44,0.08)", color: "#e8192c", display: "grid", placeItems: "center", margin: "0 auto 20px" }}>
            <SearchX size={42} />
          </div>
          <h2 style={{ fontSize: 30, fontWeight: 900, margin: 0 }}>{t("searchResults.noResults")}</h2>
          <p style={{ color: "#64748b", maxWidth: 540, margin: "12px auto 0", lineHeight: 1.75 }}>{t("searchResults.noResultsDesc")}</p>
          <Link
            to="/shop"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginTop: 22,
              padding: "14px 18px",
              borderRadius: 16,
              background: "linear-gradient(135deg,#e8192c,#be123c)",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 800,
            }}
          >
            {t("searchResults.viewAll")} <ArrowRight size={16} />
          </Link>
        </section>
      ) : (
        <section className="page-section">
          <div className="section-heading" style={{ position: "relative", zIndex: 1 }}>
            <div>
              <span className="section-kicker">Matched products</span>
              <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-0.04em", marginTop: 12 }}>Tapılan məhsullar</h2>
            </div>
          </div>

          <div style={{ position: "relative", zIndex: 1, display: "grid", gap: 14 }}>
            {products.map((product) => {
              const imageUrl = product?.images?.[0]?.url || defaultImageUrl;
              const inStock = product.stock > 0;

              return (
                <article
                  key={product._id}
                  style={{
                    borderRadius: 24,
                    background: "rgba(255,255,255,0.9)",
                    border: "1px solid rgba(148,163,184,0.14)",
                    boxShadow: "0 18px 38px rgba(15,23,42,0.06)",
                    padding: 18,
                    display: "grid",
                    gridTemplateColumns: "minmax(140px, 180px) minmax(0, 1fr) minmax(160px, 190px)",
                    gap: 18,
                    alignItems: "center",
                  }}
                >
                  <div style={{ borderRadius: 18, overflow: "hidden", background: "#f1f5f9", minHeight: 140 }}>
                    <img src={imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>

                  <div>
                    <Link to={`/product/${product._id}`} style={{ textDecoration: "none", color: "#0f172a", fontSize: 22, fontWeight: 900, lineHeight: 1.3 }}>
                      {product.name}
                    </Link>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                      <StarRatings rating={product.ratings || 0} starRatedColor="#FBBF24" numberOfStars={5} starDimension="16px" starSpacing="1px" />
                      <span style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>{product.numOfReviews} {t("searchResults.reviews")}</span>
                    </div>
                    <p style={{ color: "#64748b", lineHeight: 1.7, marginTop: 12 }}>
                      {product.description || t("searchResults.noDescription")}
                    </p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-end" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: "#e8192c", fontSize: 28, fontWeight: 900 }}>{product.price} ₼</div>
                      <div style={{ color: inStock ? "#15803d" : "#dc2626", fontSize: 12, fontWeight: 800 }}>
                        {inStock ? t("searchResults.inStock") : t("searchResults.outOfStock")}
                      </div>
                    </div>
                    <Link
                      to={`/product/${product._id}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        width: "100%",
                        minHeight: 48,
                        borderRadius: 16,
                        background: inStock ? "linear-gradient(135deg,#e8192c,#be123c)" : "#cbd5e1",
                        color: "#fff",
                        textDecoration: "none",
                        fontWeight: 800,
                      }}
                    >
                      {inStock ? t("searchResults.addToCart") : t("searchResults.unavailable")}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default SearchResults;
