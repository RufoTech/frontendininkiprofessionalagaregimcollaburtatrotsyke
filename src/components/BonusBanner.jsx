import React from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Coins, ShoppingBag, ShoppingCart, MessageSquare, ArrowRight, CornerDownRight } from "lucide-react";

export default function BonusBanner() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.userSlice?.isAuthenticated);

  const bonuses = [
    {
      id: 1,
      title: "Aktiv Alıcı Bonusu",
      desc: "Yeni alıcı qeydiyyatı və ilk alış-verişindən sonra +1 Bonus Coin qazanın.",
      icon: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Coins size={28} color="#eab308" style={{ fill: "#fef08a" }} />
          <ArrowRight size={18} color="#9ca3af" />
          <ShoppingBag size={28} color="#f97316" style={{ fill: "#ffedd5" }} />
        </div>
      ),
      bg: "#f8fafc"
    },
    {
      id: 2,
      title: "Səbət Artırma Bonusu",
      desc: "Minimum 25 AZN-lik səbət üçün +1 Bonus Coin. Əlavə hər 5 AZN üçün daha +1 Bonus Coin.",
      icon: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Coins size={28} color="#eab308" style={{ fill: "#fef08a" }} />
          <CornerDownRight size={18} color="#9ca3af" />
          <ShoppingCart size={28} color="#3b82f6" style={{ fill: "#dbeafe" }} />
        </div>
      ),
      bg: "#f8fafc"
    },
    {
      id: 3,
      title: "Yorum Yazma Bonusu",
      desc: "Platformada və ya Play Market/iOS-da yorum yazın və +1 Bonus Coin əldə edin.",
      icon: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <MessageSquare size={28} color="#10b981" style={{ fill: "#d1fae5" }} />
          <Coins size={24} color="#eab308" style={{ fill: "#fef08a", position: 'relative', left: -10, top: 10 }} />
        </div>
      ),
      bg: "#f8fafc"
    }
  ];

  return (
    <div style={{
      background: "#fff",
      borderRadius: 20,
      padding: "24px 20px",
      marginBottom: 32,
      boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
      position: "relative",
      overflow: "hidden",
      border: "1px solid #f1f5f9"
    }}>
      {/* Background Decorative Coins */}
      <div style={{ position: "absolute", top: -20, right: -20, opacity: 0.15, transform: "rotate(15deg)", pointerEvents: "none" }}>
        <Coins size={120} color="#eab308" />
      </div>
      <div style={{ position: "absolute", bottom: -30, left: -20, opacity: 0.1, transform: "rotate(-15deg)", pointerEvents: "none" }}>
        <Coins size={100} color="#eab308" />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ 
          fontSize: 22, 
          fontWeight: 900, 
          color: "#1e293b", 
          margin: 0,
          display: "flex",
          alignItems: "center",
          gap: 10
        }}>
          Bonus Sistemi
        </h2>
        {isAuthenticated && (
          <button
            onClick={() => navigate("/my-bonus")}
            style={{
              background: "#eff6ff",
              color: "#3b82f6",
              border: "none",
              borderRadius: 10,
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#dbeafe"}
            onMouseLeave={e => e.currentTarget.style.background = "#eff6ff"}
          >
            Bonuslarım
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {bonuses.map((b) => (
          <div
            key={b.id}
            style={{
              background: b.bg,
              border: "1px solid #e2e8f0",
              borderRadius: 16,
              padding: "16px",
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.04)";
              e.currentTarget.style.borderColor = "#cbd5e1";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
          >
            <div style={{ 
              background: "#fff", 
              padding: "10px", 
              borderRadius: 12, 
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              flexShrink: 0
            }}>
              {b.icon}
            </div>

            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
                {b.title}
              </div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, fontWeight: 500 }}>
                {b.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
