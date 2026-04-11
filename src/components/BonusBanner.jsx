import React from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowRight, Coins, Gift, MessageSquare, ShoppingCart, Sparkles } from "lucide-react";

export default function BonusBanner() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.userSlice?.isAuthenticated);

  const bonuses = [
    {
      id: 1,
      title: "Yeni hesab bonusu",
      desc: "Qeydiyyat və ilk alışdan sonra bonus coin qazanaraq növbəti sifarişdə üstünlük əldə edin.",
      icon: Gift,
      color: "#e8192c",
      surface: "linear-gradient(135deg, rgba(232,25,44,0.1), rgba(255,255,255,0.92))",
    },
    {
      id: 2,
      title: "Səbət artımı mükafatı",
      desc: "Daha böyük səbət dəyəri daha çox coin deməkdir. Kampaniya vaxtı bu blok conversion üçün daha görünən edildi.",
      icon: ShoppingCart,
      color: "#2563eb",
      surface: "linear-gradient(135deg, rgba(37,99,235,0.1), rgba(255,255,255,0.92))",
    },
    {
      id: 3,
      title: "Rəy yaz, bonus qazan",
      desc: "Platforma üçün rəy bildirən istifadəçilər daha aktiv loyallıq dövrünə daxil olur və coin toplayır.",
      icon: MessageSquare,
      color: "#0f9d58",
      surface: "linear-gradient(135deg, rgba(15,157,88,0.1), rgba(255,255,255,0.92))",
    }
  ];

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 28,
        padding: "28px 24px",
        marginBottom: 32,
        background: "linear-gradient(135deg, #fffdf7 0%, #fff7f2 52%, #ffffff 100%)",
        border: "1px solid rgba(250,204,21,0.24)",
        boxShadow: "0 22px 50px rgba(15,23,42,0.08)"
      }}
    >
      <div style={{ position: "absolute", top: -34, right: -24, opacity: 0.12, pointerEvents: "none" }}>
        <Coins size={150} color="#ca8a04" />
      </div>
      <div style={{ position: "absolute", bottom: -32, left: -16, opacity: 0.1, pointerEvents: "none" }}>
        <Sparkles size={130} color="#f59e0b" />
      </div>

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 16, marginBottom: 22 }}>
        <div>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              borderRadius: 999,
              background: "rgba(250,204,21,0.12)",
              color: "#a16207",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Loyalty system
          </span>
          <h2 style={{ fontSize: 30, fontWeight: 900, color: "#111827", margin: "12px 0 8px", letterSpacing: "-0.04em" }}>
            Bonus sistemi artıq daha aydın və daha dəyərli görünür
          </h2>
          <p style={{ margin: 0, maxWidth: 700, color: "#6b7280", lineHeight: 1.7 }}>
            İstifadəçi bonus qaydalarını oxuyarkən yorulmaması üçün kartlar ritmik şəkildə yenidən quruldu və çağırış düyməsi daha görünən edildi.
          </p>
        </div>

        {isAuthenticated && (
          <button
            onClick={() => navigate("/my-bonus")}
            style={{
              alignSelf: "flex-start",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 18px",
              borderRadius: 18,
              border: "none",
              background: "linear-gradient(135deg, #f59e0b, #f97316)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 18px 30px rgba(249,115,22,0.24)"
            }}
          >
            Bonuslarım <ArrowRight size={16} />
          </button>
        )}
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16
        }}
      >
        {bonuses.map((bonus) => {
          const Icon = bonus.icon;

          return (
            <article
              key={bonus.id}
              style={{
                borderRadius: 24,
                padding: 20,
                background: bonus.surface,
                border: "1px solid rgba(255,255,255,0.9)",
                boxShadow: "0 16px 32px rgba(15,23,42,0.08)",
                display: "flex",
                flexDirection: "column",
                gap: 14
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#fff",
                  color: bonus.color,
                  boxShadow: "0 10px 18px rgba(15,23,42,0.08)"
                }}
              >
                <Icon size={22} />
              </div>

              <div>
                <h3 style={{ margin: "0 0 8px", fontSize: 18, color: "#111827", fontWeight: 800 }}>{bonus.title}</h3>
                <p style={{ margin: 0, color: "#667085", lineHeight: 1.7, fontSize: 14 }}>{bonus.desc}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
