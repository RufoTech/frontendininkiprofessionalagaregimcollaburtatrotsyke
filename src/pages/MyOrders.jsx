import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyOrders } from "../slices/orderSlice";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Clock, Download, Loader2, Package, PackageCheck, ShoppingBag, Truck } from "lucide-react";

const STATUS_CONFIG = {
  pending: { color: "#b45309", bg: "#fffbeb", Icon: Clock },
  processing: { color: "#b45309", bg: "#fff7ed", Icon: PackageCheck },
  shipped: { color: "#0891b2", bg: "#ecfeff", Icon: Truck },
  delivered: { color: "#15803d", bg: "#f0fdf4", Icon: CheckCircle2 },
};

const StatusBadge = ({ status }) => {
  const { t } = useTranslation();
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const labels = {
    pending: t("myOrders.pending"),
    processing: t("myOrders.processing"),
    shipped: t("myOrders.shipped"),
    delivered: t("myOrders.delivered"),
  };

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 999, background: cfg.bg, color: cfg.color, fontSize: 12, fontWeight: 800 }}>
      <cfg.Icon size={13} />
      {labels[status] || status}
    </span>
  );
};

const MyOrders = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { myOrders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  if (loading) {
    return (
      <section className="page-section" style={{ minHeight: 320, display: "grid", placeItems: "center" }}>
        <Loader2 size={38} color="#e8192c" className="animate-spin" />
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

        <div style={{ position: "relative", zIndex: 1, padding: "34px 30px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, alignItems: "center" }}>
          <div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,0.12)", fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Orders dashboard
            </span>
            <h1 style={{ margin: "14px 0 8px", fontSize: "clamp(2rem, 4vw, 3.8rem)", lineHeight: 0.96, fontWeight: 900, letterSpacing: "-0.05em" }}>
              {t("myOrders.title")}
            </h1>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
              {myOrders.length > 0 ? `${myOrders.length} ${t("myOrders.ordersFound")}` : t("myOrders.ordersWillAppear")}
            </p>
          </div>

          <div style={{ justifySelf: "end", width: "min(100%, 360px)", padding: 18, borderRadius: 24, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(14px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 52, height: 52, borderRadius: 18, background: "#fff", color: "#e8192c", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ShoppingBag size={22} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.72)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Summary</div>
                <div style={{ fontSize: 24, fontWeight: 900 }}>{myOrders.length}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading" style={{ position: "relative", zIndex: 1 }}>
          <div>
            <span className="section-kicker">Order list</span>
            <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-0.04em", marginTop: 12 }}>Sifariş tarixçən</h2>
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 16, padding: "14px 18px", marginBottom: 18, color: "#dc2626", fontSize: 14 }}>
              {error}
            </div>
          )}

          {!error && myOrders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "70px 24px", borderRadius: 24, background: "rgba(255,255,255,0.82)", border: "1px dashed rgba(148,163,184,0.28)" }}>
              <div style={{ width: 88, height: 88, borderRadius: 28, background: "rgba(232,25,44,0.08)", display: "grid", placeItems: "center", margin: "0 auto 16px", color: "#e8192c" }}>
                <Package size={40} />
              </div>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>{t("myOrders.noOrders")}</p>
              <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>{t("myOrders.noOrdersDesc")}</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 18 }}>
              {myOrders.map((order) => (
                <article
                  key={order._id || order.id}
                  style={{
                    borderRadius: 26,
                    overflow: "hidden",
                    background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.92))",
                    border: "1px solid rgba(148,163,184,0.16)",
                    boxShadow: "0 18px 38px rgba(15,23,42,0.08)",
                  }}
                >
                  {order.isCompleted && (
                    <div style={{ background: "#f0fdf4", borderBottom: "1px solid #bbf7d0", padding: "10px 18px", display: "flex", alignItems: "center", gap: 8, color: "#15803d", fontWeight: 800, fontSize: 12 }}>
                      <CheckCircle2 size={14} />
                      {t("myOrders.completed")}
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", padding: "18px 20px", background: "rgba(248,250,252,0.88)", borderBottom: "1px solid rgba(148,163,184,0.12)" }}>
                    <div>
                      <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>Sifariş tarixi</div>
                      <div style={{ marginTop: 4, fontSize: 15, fontWeight: 800, color: "#0f172a" }}>
                        {new Date(order.createdAt).toLocaleDateString("az-AZ", { day: "2-digit", month: "long", year: "numeric" })}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>Ümumi məbləğ</div>
                      <div style={{ marginTop: 4, fontSize: 26, fontWeight: 900, color: "#e8192c", letterSpacing: "-0.04em" }}>{order.totalAmount?.toFixed(2)} ₼</div>
                    </div>
                    <StatusBadge status={order.orderStatus} />
                  </div>

                  <div style={{ padding: "18px 20px", display: "grid", gap: 12 }}>
                    {order.orderItems?.map((item, idx) => (
                      <div key={idx} style={{ display: "grid", gridTemplateColumns: "64px minmax(0,1fr) auto", gap: 14, alignItems: "center", padding: "10px 0", borderBottom: idx === order.orderItems.length - 1 ? "none" : "1px solid rgba(148,163,184,0.1)" }}>
                        <div style={{ width: 64, height: 64, borderRadius: 18, overflow: "hidden", background: "#f1f5f9", border: "1px solid rgba(148,163,184,0.14)" }}>
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => { e.target.src = "/placeholder.svg" }}
                          />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</p>
                          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b" }}>Say: {item.quantity}</p>
                          {item.seller && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#94a3b8" }}>Satıcı: {item.seller}</p>}
                        </div>
                        <p style={{ margin: 0, fontWeight: 900, fontSize: 15, color: "#0f172a" }}>
                          {(item.price * item.quantity).toFixed(2)} ₼
                        </p>
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: "14px 20px", background: "rgba(248,250,252,0.88)", borderTop: "1px solid rgba(148,163,184,0.12)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <p style={{ margin: 0, fontSize: 11, color: "#94a3b8", fontFamily: "monospace" }}>
                      #{(order._id || order.id)?.slice(-12).toUpperCase()}
                    </p>
                    {order.receiptUrl && (
                      <a
                        href={order.receiptUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 800, color: "#be123c", textDecoration: "none", background: "rgba(232,25,44,0.06)", padding: "8px 14px", borderRadius: 999, border: "1px solid rgba(232,25,44,0.14)" }}
                      >
                        <Download size={12} />
                        {t("myOrders.downloadReceipt")}
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MyOrders;
