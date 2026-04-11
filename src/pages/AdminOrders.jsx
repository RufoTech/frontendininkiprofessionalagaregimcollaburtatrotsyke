import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminOrders, updateOrderStatus } from "../slices/orderSlice";
import { useTranslation } from "react-i18next";
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  Loader2,
  PackageCheck,
  RefreshCw,
  ShoppingBag,
  Store,
  Truck,
} from "lucide-react";

const STATUS_CONFIG = {
  pending: { label: "Gözlənilir", color: "rgba(245,158,11,0.12)", text: "#b45309", Icon: Clock },
  processing: { label: "Hazırlanır", color: "rgba(217,119,6,0.12)", text: "#b45309", Icon: PackageCheck },
  shipped: { label: "Göndərildi", color: "rgba(6,182,212,0.12)", text: "#0e7490", Icon: Truck },
  delivered: { label: "Çatdırıldı", color: "rgba(34,197,94,0.12)", text: "#15803d", Icon: CheckCircle2 },
};

const StatusBadge = ({ status }) => {
  const { t } = useTranslation();
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const labels = {
    pending: t("adminOrders.pending"),
    processing: t("adminOrders.processing"),
    shipped: t("adminOrders.shipped"),
    delivered: t("adminOrders.delivered"),
  };

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 999, background: cfg.color, color: cfg.text, fontSize: 12, fontWeight: 800 }}>
      <cfg.Icon size={13} />
      {labels[status] || cfg.label}
    </span>
  );
};

const CompletedBanner = () => {
  const { t } = useTranslation();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "#f0fdf4", borderBottom: "1px solid #bbf7d0", color: "#15803d", fontSize: 12, fontWeight: 800 }}>
      <CheckCircle2 size={14} />
      {t("adminOrders.orderCompleted")}
    </div>
  );
};

const StatusDropdown = ({ orderId, currentStatus, isCompleted, onUpdate, updating }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const statuses = [
    { value: "pending", label: t("adminOrders.pending"), Icon: Clock },
    { value: "processing", label: t("adminOrders.processing"), Icon: PackageCheck },
    { value: "shipped", label: t("adminOrders.shipped"), Icon: Truck },
    { value: "delivered", label: t("adminOrders.delivered"), Icon: CheckCircle2, note: t("adminOrders.deliveredNote") },
  ];

  useEffect(() => {
    if (!open) return undefined;
    const handler = () => setOpen(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [open]);

  if (isCompleted) {
    return (
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 16, background: "#f0fdf4", color: "#15803d", fontWeight: 800, fontSize: 13 }}>
        <CheckCircle2 size={15} />
        {t("adminOrders.completed")}
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }} onClick={(event) => event.stopPropagation()}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        disabled={updating}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 16px",
          borderRadius: 16,
          border: "none",
          background: "linear-gradient(135deg,#111827,#334155)",
          color: "#fff",
          fontSize: 13,
          fontWeight: 800,
          cursor: "pointer",
        }}
      >
        {updating ? <><Loader2 size={15} className="animate-spin" /> {t("adminOrders.updating")}</> : <>{t("adminOrders.changeStatus")} <ChevronDown size={15} /></>}
      </button>

      {open && (
        <div style={{ position: "absolute", right: 0, top: "calc(100% + 10px)", minWidth: 250, borderRadius: 18, background: "#fff", border: "1px solid rgba(148,163,184,0.18)", boxShadow: "0 22px 48px rgba(15,23,42,0.12)", overflow: "hidden", zIndex: 20 }}>
          {statuses.map(({ value, label, Icon, note }) => (
            <button
              key={value}
              onClick={() => {
                if (value !== currentStatus) onUpdate(orderId, value);
                setOpen(false);
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "start",
                gap: 10,
                padding: "14px 16px",
                border: "none",
                background: value === currentStatus ? "rgba(15,23,42,0.05)" : "#fff",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <Icon size={16} color={value === "delivered" ? "#15803d" : "#64748b"} style={{ marginTop: 2 }} />
              <span style={{ display: "grid", gap: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: value === "delivered" ? "#15803d" : "#0f172a" }}>{label}</span>
                {note && <span style={{ fontSize: 12, color: "#f97316" }}>{note}</span>}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminOrders = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { adminOrders, loading, error } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.userSlice);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    dispatch(getAdminOrders());
  }, [dispatch]);

  const handleStatusUpdate = async (orderId, status) => {
    setUpdatingId(orderId);
    await dispatch(updateOrderStatus({ orderId, status }));
    setUpdatingId(null);
    dispatch(getAdminOrders());
  };

  const filteredOrders = (() => {
    if (filterStatus === "all") return adminOrders;
    if (filterStatus === "completed") return adminOrders.filter((o) => o.isCompleted);
    return adminOrders.filter((o) => o.orderStatus === filterStatus);
  })();

  const stats = {
    all: adminOrders.length,
    pending: adminOrders.filter((o) => o.orderStatus === "pending").length,
    processing: adminOrders.filter((o) => o.orderStatus === "processing").length,
    shipped: adminOrders.filter((o) => o.orderStatus === "shipped").length,
    delivered: adminOrders.filter((o) => o.orderStatus === "delivered").length,
    completed: adminOrders.filter((o) => o.isCompleted).length,
  };

  const filterButtons = [
    { key: "all", label: t("common.seeAll"), bg: "linear-gradient(135deg,#111827,#334155)", color: "#fff" },
    { key: "pending", label: t("adminOrders.pending"), bg: "#fffbeb", color: "#b45309" },
    { key: "processing", label: t("adminOrders.processing"), bg: "#fff7ed", color: "#b45309" },
    { key: "shipped", label: t("adminOrders.shipped"), bg: "#ecfeff", color: "#0e7490" },
    { key: "delivered", label: t("adminOrders.delivered"), bg: "#f0fdf4", color: "#15803d" },
    { key: "completed", label: t("adminOrders.completed"), bg: "#ecfdf5", color: "#047857" },
  ];

  if (loading && adminOrders.length === 0) {
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

        <div style={{ position: "relative", zIndex: 1, padding: "34px 30px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, alignItems: "end" }}>
          <div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,0.12)", fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Seller dashboard
            </span>
            <h1 style={{ margin: "14px 0 8px", fontSize: "clamp(2rem, 4vw, 3.8rem)", lineHeight: 0.96, fontWeight: 900, letterSpacing: "-0.05em" }}>
              {t("adminOrders.title")}
            </h1>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
              {user?.sellerInfo?.storeName || "Mağazanız"} üçün sifariş axını daha rahat idarə olunur.
            </p>
          </div>

          <div style={{ justifySelf: "end", display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <div style={{ padding: "16px 18px", borderRadius: 20, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(14px)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 46, height: 46, borderRadius: 16, background: "#fff", color: "#e8192c", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Store size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.72)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Store</div>
                  <div style={{ fontWeight: 900 }}>{stats.all}</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => dispatch(getAdminOrders())}
              disabled={loading}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 18px",
                borderRadius: 16,
                background: "rgba(255,255,255,0.12)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.18)",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              {t("adminOrders.refresh")}
            </button>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading" style={{ position: "relative", zIndex: 1 }}>
          <div>
            <span className="section-kicker">Order states</span>
            <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-0.04em", marginTop: 12 }}>Mağaza sifarişləri</h2>
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12, marginBottom: 22 }}>
            {filterButtons.map(({ key, label, bg, color }) => (
              <button
                key={key}
                onClick={() => setFilterStatus(key)}
                style={{
                  border: filterStatus === key ? "2px solid rgba(15,23,42,0.12)" : "1px solid rgba(148,163,184,0.16)",
                  background: bg,
                  color,
                  borderRadius: 20,
                  padding: "16px 14px",
                  cursor: "pointer",
                  boxShadow: filterStatus === key ? "0 14px 28px rgba(15,23,42,0.08)" : "none",
                }}
              >
                <div style={{ fontSize: 24, fontWeight: 900 }}>{stats[key]}</div>
                <div style={{ fontSize: 12, fontWeight: 800, marginTop: 4 }}>{label}</div>
              </button>
            ))}
          </div>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: 16, padding: "14px 18px", marginBottom: 18 }}>
              {error}
            </div>
          )}

          {filteredOrders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "70px 24px", borderRadius: 24, background: "rgba(255,255,255,0.82)", border: "1px dashed rgba(148,163,184,0.28)" }}>
              <ShoppingBag size={48} color="#cbd5e1" style={{ marginBottom: 14 }} />
              <p style={{ margin: 0, color: "#64748b", fontSize: 18, fontWeight: 700 }}>{t("adminOrders.noOrders")}</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 18 }}>
              {filteredOrders.map((order) => {
                const orderId = order.id || order._id;
                return (
                  <article
                    key={orderId}
                    style={{
                      borderRadius: 26,
                      overflow: "hidden",
                      background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.92))",
                      border: "1px solid rgba(148,163,184,0.16)",
                      boxShadow: "0 18px 38px rgba(15,23,42,0.08)",
                    }}
                  >
                    {order.isCompleted && <CompletedBanner />}

                    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", padding: "18px 20px", background: "rgba(248,250,252,0.88)", borderBottom: "1px solid rgba(148,163,184,0.12)" }}>
                      <div style={{ display: "flex", gap: 22, flexWrap: "wrap", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>Sifariş tarixi</div>
                          <div style={{ marginTop: 4, fontSize: 15, fontWeight: 800, color: "#0f172a" }}>
                            {new Date(order.createdAt).toLocaleDateString("az-AZ", { day: "2-digit", month: "long", year: "numeric" })}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>Ümumi məbləğ</div>
                          <div style={{ marginTop: 4, fontSize: 24, fontWeight: 900, color: "#e8192c", letterSpacing: "-0.04em" }}>
                            {order.totalAmount?.toFixed(2)} ₼
                          </div>
                        </div>
                        <StatusBadge status={order.orderStatus} />
                      </div>

                      <StatusDropdown
                        orderId={orderId}
                        currentStatus={order.orderStatus}
                        isCompleted={order.isCompleted}
                        onUpdate={handleStatusUpdate}
                        updating={updatingId === orderId}
                      />
                    </div>

                    <div style={{ padding: "18px 20px", display: "grid", gap: 12 }}>
                      {order.orderItems?.map((item, index) => (
                        <div key={index} style={{ display: "grid", gridTemplateColumns: "64px minmax(0,1fr) auto", gap: 14, alignItems: "center", padding: "10px 0", borderBottom: index === order.orderItems.length - 1 ? "none" : "1px solid rgba(148,163,184,0.1)" }}>
                          <div style={{ width: 64, height: 64, borderRadius: 18, overflow: "hidden", background: "#f1f5f9", border: "1px solid rgba(148,163,184,0.14)" }}>
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              onError={(e) => { e.target.src = "/placeholder.svg"; }}
                            />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</p>
                            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b" }}>Say: {item.quantity}</p>
                          </div>
                          <p style={{ margin: 0, fontWeight: 900, fontSize: 15, color: "#0f172a", whiteSpace: "nowrap" }}>
                            {(item.price * item.quantity).toFixed(2)} ₼
                          </p>
                        </div>
                      ))}
                    </div>

                    <div style={{ padding: "14px 20px", background: "rgba(248,250,252,0.88)", borderTop: "1px solid rgba(148,163,184,0.12)" }}>
                      <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>
                        Sifariş № <span style={{ fontFamily: "monospace" }}>{orderId}</span>
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminOrders;
