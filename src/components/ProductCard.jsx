import React from "react";
import { Link, useNavigate } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { ArrowUpRight, Store } from "lucide-react";
import { useLazyGetStoreSlugBySellerQuery } from "../redux/api/authApi";

const ProductCard = ({ mehsul }) => {
  const navigate = useNavigate();
  const [getStoreSlug] = useLazyGetStoreSlugBySellerQuery();
  const defaultImageUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='360' height='360' viewBox='0 0 360 360'%3E%3Crect width='360' height='360' fill='%23f4f6fb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Inter,sans-serif' font-size='18' fill='%2394a3b8'%3ESekil yoxdur%3C/text%3E%3C/svg%3E";

  if (!mehsul) return null;

  const imageUrl = mehsul.images?.[0]?.url || defaultImageUrl;
  const sellerName = typeof mehsul.seller === "string" ? mehsul.seller : mehsul.seller?.storeName || null;
  const hasStock = Number(mehsul.stock) > 0;
  const displayPrice = Number(mehsul.price || 0).toFixed(2);

  const handleSellerClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!sellerName) return;

    try {
      const res = await getStoreSlug(sellerName).unwrap();
      if (res?.storeSlug) navigate(`/store/${res.storeSlug}`);
    } catch {
      // Seller store lookup is optional.
    }
  };

  return (
    <Link to={`/product/${mehsul._id}`} style={{ textDecoration: "none", height: "100%", display: "block" }}>
      <article
        style={{
          position: "relative",
          height: "100%",
          overflow: "hidden",
          borderRadius: 28,
          background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.94))",
          border: "1px solid rgba(148,163,184,0.2)",
          boxShadow: "0 18px 38px rgba(15,23,42,0.08)",
          display: "flex",
          flexDirection: "column",
          transition: "transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease",
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.transform = "translateY(-6px)";
          event.currentTarget.style.boxShadow = "0 28px 60px rgba(15,23,42,0.14)";
          event.currentTarget.style.borderColor = "rgba(232,25,44,0.24)";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.transform = "translateY(0)";
          event.currentTarget.style.boxShadow = "0 18px 38px rgba(15,23,42,0.08)";
          event.currentTarget.style.borderColor = "rgba(148,163,184,0.2)";
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "auto -70px -70px auto",
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(232,25,44,0.16), transparent 68%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            padding: 18,
            minHeight: 260,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "radial-gradient(circle at top, rgba(255,255,255,0.92), rgba(244,246,251,0.86) 58%, rgba(226,232,240,0.8) 100%)",
            borderBottom: "1px solid rgba(148,163,184,0.18)",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              padding: "7px 12px",
              borderRadius: 999,
              background: hasStock ? "rgba(15,157,88,0.1)" : "rgba(232,25,44,0.1)",
              color: hasStock ? "#157347" : "#c81e1e",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {hasStock ? "Mövcuddur" : "Stok bitib"}
          </span>

          <span
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              width: 38,
              height: 38,
              borderRadius: 14,
              background: "rgba(255,255,255,0.84)",
              border: "1px solid rgba(148,163,184,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 14px 24px rgba(15,23,42,0.08)",
              color: "#e8192c",
            }}
          >
            <ArrowUpRight size={18} />
          </span>

          <img
            src={imageUrl}
            alt={mehsul.name || "product image"}
            style={{
              maxHeight: 210,
              width: "100%",
              objectFit: "contain",
              filter: "drop-shadow(0 22px 26px rgba(15,23,42,0.16))",
              transition: "transform 250ms ease",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.transform = "scale(1)";
            }}
          />
        </div>

        <div style={{ padding: "20px 20px 18px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                alignSelf: "flex-start",
                padding: "6px 10px",
                borderRadius: 999,
                background: "rgba(15,23,42,0.05)",
                color: "#475569",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              Reytinq {Number(mehsul.ratings || 0).toFixed(1)}
            </span>
            <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>
              {mehsul.numOfReviews || 0} rəy
            </span>
          </div>

          <h3
            style={{
              margin: 0,
              color: "#0f172a",
              fontSize: 17,
              lineHeight: 1.45,
              fontWeight: 800,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: 50,
            }}
          >
            {mehsul.name}
          </h3>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <StarRatings
              rating={mehsul.ratings || 0}
              starRatedColor="#fbbf24"
              numberOfStars={5}
              starDimension="14px"
              starSpacing="2px"
            />
          </div>

          <div style={{ marginTop: "auto", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 4 }}>Qiymət</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#e8192c", letterSpacing: "-0.04em" }}>
                {displayPrice} <span style={{ fontSize: 15 }}>₼</span>
              </div>
            </div>

            {sellerName && (
              <button
                onClick={handleSellerClick}
                title={`${sellerName} mağazasına bax`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 14px",
                  borderRadius: 16,
                  border: "1px solid rgba(232,25,44,0.16)",
                  background: "rgba(232,25,44,0.06)",
                  color: "#c81e1e",
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: "pointer",
                  maxWidth: 160,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.background = "#e8192c";
                  event.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.background = "rgba(232,25,44,0.06)";
                  event.currentTarget.style.color = "#c81e1e";
                }}
              >
                <Store size={14} />
                {sellerName}
              </button>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;
