// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BalanceWidget.jsx
// Satıcının maliyyə balansını 4 kart şəklində göstərən komponent.
// Admin panelinin yuxarı hissəsində istifadə olunur.
//
// PashaPay modeli ilə köhnədən FƏRQ:
//   Köhnə: "Gözləyən Komisya" → şirkətin ay sonu alacağı pay (satıcıya aid deyil)
//   Yeni:  "Gözləyən Qazanc"  → satıcının öz payı, PashaPay settle etməyi gözləyir
//
// Göstərilən məlumatlar:
//   💳 Mövcud Balans    → PashaPay settle etdi, çəkilə bilər
//   ⏳ Gözləyən Qazanc → PashaPay-dan hələ settle bildirişi gəlməyib
//   📈 Ümumi Qazanc     → bütün vaxt ərzində settle olmuş ümumi qazanc
//   🏦 Çəkilən          → indiyə qədər çəkilmiş ümumi məbləğ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSellerBalance } from "../slices/commissionSlice";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BalanceWidget — ANA KOMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PROPS:
//   sellerId → satıcının mağaza adı (storeName). Backend ilə eyni tip.
//
// RENDER MƏNTİQİ:
//   loading === true  VƏ YA  balance === null → skeleton
//   balance mövcuddur → 4 balans kartı
const BalanceWidget = ({ sellerId }) => {
  const dispatch = useDispatch();

  // balance → { availableBalance, pendingEarning, totalEarned,
  //             totalWithdrawn, totalOrderAmount }
  // loading → sorğu göndərilib, cavab gözlənilir
  const { balance, loading } = useSelector((state) => state.commission);

  // sellerId dəyişdikdə (admin başqa satıcıya keçdikdə) yenidən çəkilir
  useEffect(() => {
    if (sellerId) dispatch(getSellerBalance(sellerId));
  }, [sellerId]);

  // ── SKELETON ─────────────────────────────────────────────────────────
  if (loading || !balance) {
    return (
      <>
        <style>{css}</style>
        <div className="bw-wrapper">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bw-skeleton">
              <div className="bw-skeleton-line bw-skeleton-short" />
              <div className="bw-skeleton-line bw-skeleton-long" />
              <div className="bw-skeleton-line bw-skeleton-medium" />
            </div>
          ))}
        </div>
      </>
    );
  }

  // ── KART MƏLUMATLARİ ─────────────────────────────────────────────────
  // PashaPay modelinə uyğun sahə adları:
  //   availableBalance → settle olmuş, çəkilə bilər
  //   pendingEarning   → PashaPay-dan hələ settle bildirişi gəlməyib
  //   totalEarned      → bütün zamanlarda settle olmuş ümumi qazanc
  //   totalWithdrawn   → ümumi çəkiş
  const cards = [
    {
      label:  "Mövcud Balans",
      amount: balance.availableBalance?.toFixed(2),
      sub:    "Çəkə bilərsən",
      icon:   "💳",
      cls:    "bw-card-main",
    },
    {
      label:  "Gözləyən Qazanc",
      amount: balance.pendingEarning?.toFixed(2),
      // Köhnə: "Ay sonu köçürüləcək" (şirkətin payı)
      // Yeni:  "Settle gözlənilir" (satıcının öz payı, PashaPay işləyir)
      sub:    "PashaPay settle edir",
      icon:   "⏳",
      cls:    "bw-card-pending",
    },
    {
      label:  "Ümumi Qazanc",
      amount: balance.totalEarned?.toFixed(2),
      sub:    "Bütün vaxt ərzində",
      icon:   "📈",
      cls:    "bw-card-earned",
    },
    {
      label:  "Çəkilən",
      amount: balance.totalWithdrawn?.toFixed(2),
      sub:    "Ümumi çəkiş",
      icon:   "🏦",
      cls:    "bw-card-withdrawn",
    },
  ];

  // ── RENDER ────────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div className="bw-wrapper">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`bw-card ${card.cls}`}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="bw-card-top">
              <span className="bw-icon">{card.icon}</span>
              <span className="bw-label">{card.label}</span>
            </div>
            <p className="bw-amount">
              {card.amount}
              <span className="bw-currency"> AZN</span>
            </p>
            <div className="bw-footer">
              <span className="bw-dot" />
              <p className="bw-sub">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CSS — dəyişmədi, orijinal stil qorunur
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const css = `
  *, *::before, *::after { box-sizing: border-box; }

  .bw-wrapper {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 28px;
    width: 100%;
    font-family: 'Nunito', sans-serif;
  }

  .bw-card {
    position: relative;
    border-radius: 20px;
    padding: 20px 18px 16px;
    overflow: hidden;
    cursor: default;
    animation: bwFadeUp 0.45s cubic-bezier(.22,1,.36,1) both;
    transition: transform 0.25s cubic-bezier(.34,1.56,.64,1),
                box-shadow 0.25s ease;
  }

  .bw-card::before {
    content: '';
    position: absolute;
    top: -30px; right: -30px;
    width: 110px; height: 110px;
    border-radius: 50%;
    opacity: 0.12;
    background: #fff;
    pointer-events: none;
  }

  .bw-card:hover {
    transform: translateY(-5px) scale(1.015);
  }

  .bw-card-main {
    background: linear-gradient(145deg, #E8192C 0%, #ff5a68 100%);
    box-shadow: 0 6px 24px rgba(232,25,44,0.28);
    color: #fff;
  }
  .bw-card-main:hover { box-shadow: 0 14px 34px rgba(232,25,44,0.38); }

  .bw-card-pending {
    background: linear-gradient(145deg, #b91c2c 0%, #e03347 100%);
    box-shadow: 0 6px 24px rgba(185,28,44,0.22);
    color: #fff;
  }
  .bw-card-pending:hover { box-shadow: 0 14px 34px rgba(185,28,44,0.32); }

  .bw-card-earned {
    background: linear-gradient(145deg, #ff6b6b 0%, #ffa07a 100%);
    box-shadow: 0 6px 24px rgba(255,107,107,0.22);
    color: #fff;
  }
  .bw-card-earned:hover { box-shadow: 0 14px 34px rgba(255,107,107,0.32); }

  .bw-card-withdrawn {
    background: #fff;
    border: 1.5px solid #ffe0e3;
    box-shadow: 0 4px 18px rgba(232,25,44,0.08);
    color: #c0392b;
  }
  .bw-card-withdrawn:hover { box-shadow: 0 10px 30px rgba(232,25,44,0.14); }
  .bw-card-withdrawn .bw-sub { color: #e8a09a !important; }
  .bw-card-withdrawn .bw-dot { background: #E8192C !important; }
  .bw-card-withdrawn .bw-icon { filter: none; }

  .bw-card-top {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 12px;
  }

  .bw-icon {
    font-size: 16px;
    line-height: 1;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.15));
  }

  .bw-label {
    font-size: 12.5px;
    font-weight: 700;
    opacity: 0.92;
    letter-spacing: 0.2px;
    white-space: nowrap;
  }

  .bw-amount {
    font-size: 26px;
    font-weight: 900;
    margin: 0 0 10px;
    letter-spacing: -1px;
    line-height: 1.1;
  }

  .bw-currency {
    font-size: 13px;
    font-weight: 700;
    opacity: 0.8;
    letter-spacing: 0.5px;
  }

  .bw-footer {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .bw-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: rgba(255,255,255,0.7);
    flex-shrink: 0;
  }

  .bw-sub {
    font-size: 11.5px;
    font-weight: 600;
    opacity: 0.78;
    margin: 0;
    white-space: nowrap;
  }

  .bw-skeleton {
    border-radius: 20px;
    padding: 20px 18px;
    background: #fff5f5;
    border: 1.5px solid #ffe0e3;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .bw-skeleton-line {
    border-radius: 8px;
    background: linear-gradient(
      90deg,
      #fddde0 25%,
      #ffe9eb 50%,
      #fddde0 75%
    );
    background-size: 200% 100%;
    animation: bwShimmer 1.4s infinite;
    height: 12px;
  }

  .bw-skeleton-short  { width: 55%;  height: 11px; }
  .bw-skeleton-long   { width: 100%; height: 28px; border-radius: 10px; }
  .bw-skeleton-medium { width: 65%;  height: 10px; }

  @keyframes bwFadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes bwShimmer {
    0%   { background-position:  200% 0; }
    100% { background-position: -200% 0; }
  }

  @media (max-width: 1024px) {
    .bw-wrapper { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 768px) {
    .bw-wrapper { grid-template-columns: repeat(2, 1fr); gap: 11px; margin-bottom: 20px; }
    .bw-card    { padding: 16px 14px 13px; border-radius: 16px; }
    .bw-amount  { font-size: 21px; }
    .bw-label   { font-size: 11.5px; }
  }

  @media (max-width: 480px) {
    .bw-wrapper { grid-template-columns: 1fr 1fr; gap: 9px; }
    .bw-card    { padding: 14px 12px 11px; border-radius: 14px; }
    .bw-amount  { font-size: 18px; letter-spacing: -0.5px; }
    .bw-label   { font-size: 10.5px; }
    .bw-sub     { font-size: 10px; }
  }

  @media (max-width: 360px) {
    .bw-wrapper { grid-template-columns: 1fr; }
  }
`;

export default BalanceWidget;