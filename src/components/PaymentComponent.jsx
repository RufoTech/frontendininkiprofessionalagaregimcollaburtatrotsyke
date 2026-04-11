import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPaymentSession, resetPaymentState } from "../slices/paymentSlice";
import { createOrder } from "../slices/orderSlice";
import { useGetCartQuery } from "../redux/api/productsApi";
import {
  CreditCard, ShieldCheck, Lock, AlertCircle,
  CheckCircle, Loader2, ShoppingBag, ArrowRight,
  Printer, Calendar, KeyRound, ChevronLeft,
} from "lucide-react";

const R  = "#E8192C";
const R2 = "#b8001e";

const formatCardNumber = (val) =>
  val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

const formatExpiry = (val) => {
  const d = val.replace(/\D/g, "").slice(0, 4);
  return d.length <= 2 ? d : d.slice(0, 2) + "/" + d.slice(2);
};

/* ── Uğurlu ödəniş kartı ──────────────────────────────────────────── */
const SuccessReceiptCard = ({ total, currency, cartItems, orderId, onComplete }) => {
  const [countdown, setCountdown] = useState(8);
  const stableComplete = useCallback(() => onComplete(), [onComplete]);
  const orderNum = orderId ? orderId.slice(-8).toUpperCase() : Math.random().toString(36).slice(2, 10).toUpperCase();
  const now = new Date();

  useEffect(() => {
    const t = setInterval(() => {
      setCountdown(p => {
        if (p <= 1) { clearInterval(t); setTimeout(stableComplete, 0); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [stableComplete]);

  const handlePrint = () => {
    const w = window.open("", "_blank");
    w.document.write(`
      <html><head><title>Brendex Çek #${orderNum}</title>
      <style>
        body{font-family:Arial,sans-serif;max-width:380px;margin:0 auto;padding:20px;color:#111}
        .logo{font-size:24px;font-weight:900;text-align:center;margin-bottom:4px}
        .logo span{color:#E8192C}.sub{text-align:center;font-size:12px;color:#888;margin-bottom:20px}
        .sep{border:none;border-top:1px dashed #ccc;margin:12px 0}
        .row{display:flex;justify-content:space-between;font-size:13px;margin:6px 0}
        .total{font-weight:900;font-size:17px}
        .item{display:flex;justify-content:space-between;font-size:12px;margin:4px 0}
        .footer{text-align:center;font-size:11px;color:#aaa;margin-top:20px}
      </style></head><body>
      <div class="logo">Brend<span>ex</span></div>
      <div class="sub">Onlayn Alış-veriş Platforması</div><hr class="sep"/>
      <div class="row"><span>Sifariş №:</span><strong>#${orderNum}</strong></div>
      <div class="row"><span>Tarix:</span><span>${now.toLocaleString("az-AZ")}</span></div><hr class="sep"/>
      ${cartItems.map(i => `<div class="item"><span>${i.product.name} x${i.quantity}</span><span>${(i.product.price * i.quantity).toFixed(2)} ₼</span></div>`).join("")}
      <hr class="sep"/>
      <div class="row total"><span>CƏMİ:</span><span>${total.toFixed(2)} ${currency.toUpperCase()}</span></div>
      <div class="row"><span>Çatdırılma:</span><span>Pulsuz</span></div><hr class="sep"/>
      <div class="footer">Brendex-ə təşəkkür edirik! | www.brendex.az</div>
      </body></html>
    `);
    w.document.close(); w.print();
  };

  return (
    <div style={{ borderRadius: 20, background: "#fff", boxShadow: "0 8px 40px rgba(0,0,0,0.10)", border: "2px solid #22c55e", overflow: "hidden" }}>
      <div style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)", padding: "32px 24px", textAlign: "center" }}>
        <div style={{ width: 70, height: 70, background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <CheckCircle size={38} color="#fff" />
        </div>
        <h3 style={{ color: "#fff", margin: "0 0 4px", fontSize: 22, fontWeight: 800 }}>Ödəniş Uğurlu!</h3>
        <p style={{ color: "rgba(255,255,255,0.85)", margin: 0, fontSize: 13 }}>Sifarişiniz qəbul edildi</p>
      </div>
      <div style={{ padding: 24 }}>
        <div style={{ background: "#f8f9fa", borderRadius: 12, padding: "14px 16px", marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
            <span style={{ color: "#888" }}>Sifariş №</span>
            <strong style={{ fontFamily: "monospace" }}>#{orderNum}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: "#888" }}>Tarix</span>
            <span>{now.toLocaleString("az-AZ")}</span>
          </div>
        </div>
        <h4 style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 700, color: "#111" }}>Məhsullar</h4>
        <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 16 }}>
          {cartItems.map(item => (
            <div key={item.product._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#f0f0f0" }}>
                  <img src={item.product.images?.[0]?.url || "/placeholder.svg"} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160 }}>{item.product.name}</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#888" }}>Say: {item.quantity}</p>
                </div>
              </div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{(item.product.price * item.quantity).toFixed(2)} ₼</p>
            </div>
          ))}
        </div>
        <div style={{ background: "#f0fdf4", borderRadius: 12, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>Cəmi</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: "#16a34a" }}>{total.toFixed(2)} {currency.toUpperCase()}</span>
        </div>
        <div style={{ textAlign: "center", padding: "10px 14px", background: "#f8f9fa", borderRadius: 10, marginBottom: 16, fontSize: 13, color: "#666" }}>
          Sifarişlərimə yönləndirilir... <strong style={{ color: R }}>{countdown} san</strong>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handlePrint} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: 12, border: "1.5px solid #e5e7eb", borderRadius: 12, background: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", color: "#555" }}>
            <Printer size={15} /> Çap et
          </button>
          <button onClick={stableComplete} style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: 12, background: `linear-gradient(135deg,${R},${R2})`, color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: "pointer", boxShadow: `0 4px 14px ${R}40` }}>
            Sifarişlərimə get <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Input wrapper ─────────────────────────────────────────────────── */
const InputField = ({ label, icon: Icon, children }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 6, letterSpacing: 0.3 }}>{label}</label>
    <div style={{ position: "relative" }}>
      {Icon && <Icon size={15} color="#ccc" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />}
      {children}
    </div>
  </div>
);

const inputStyle = (hasIcon = true) => ({
  width: "100%", padding: hasIcon ? "12px 14px 12px 38px" : "12px 14px",
  border: "1.5px solid #eee", borderRadius: 12,
  fontSize: "max(16px,14px)", outline: "none",
  background: "#fafafa", boxSizing: "border-box",
  fontFamily: "'Inter', sans-serif", transition: "border .15s",
});

/* ── Ana komponent ─────────────────────────────────────────────────── */
const PaymentComponent = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const { loading, paymentId, provider, redirectUrl, error } = useSelector(s => s.payment);
  const { currentOrder }  = useSelector(s => s.order);
  const { data: cartData, isLoading: cartLoading } = useGetCartQuery();

  const [currency,    setCurrency]    = useState("azn");
  const [promoCode,   setPromoCode]   = useState("");
  const [promoMethod, setPromoMethod] = useState("code");
  const [cardNumber,  setCardNumber]  = useState("");
  const [expiry,      setExpiry]      = useState("");
  const [cvv,         setCvv]         = useState("");
  const [showCard,    setShowCard]    = useState(false);

  const orderCreatedRef = useRef(false);
  const totalAmount = cartData?.cart?.reduce((t, i) => t + i.product.price * i.quantity, 0) ?? 0;

  useEffect(() => {
    const savedPromo  = sessionStorage.getItem("blogger_promo");
    const savedMethod = sessionStorage.getItem("blogger_method");
    if (savedPromo) { setPromoCode(savedPromo); if (savedMethod) setPromoMethod(savedMethod); }
  }, []);

  useEffect(() => {
    if (paymentId && !orderCreatedRef.current) {
      orderCreatedRef.current = true;
      setTimeout(() => dispatch(createOrder({ paymentId, currency, promoCode, promoMethod })), 0);
      sessionStorage.removeItem("blogger_promo");
      sessionStorage.removeItem("blogger_method");
    }
  }, [paymentId, currency, dispatch, promoCode, promoMethod]);

  useEffect(() => {
    if (provider === "pashapay" && redirectUrl) window.location.href = redirectUrl;
  }, [provider, redirectUrl]);

  const handleShowCard = (e) => { e.preventDefault(); if (totalAmount > 0) setShowCard(true); };
  const handleSubmit   = (e) => {
    e.preventDefault();
    if (totalAmount <= 0) return;
    dispatch(createPaymentSession({ amount: totalAmount, currency, cardNumber: cardNumber.replace(/\s+/g, ""), expiry, cvv }));
  };
  const handleReset    = () => {
    dispatch(resetPaymentState()); orderCreatedRef.current = false;
    setCurrency("azn"); setCardNumber(""); setExpiry(""); setCvv(""); setShowCard(false);
  };
  const handleComplete = useCallback(() => {
    dispatch(resetPaymentState()); orderCreatedRef.current = false; navigate("/my-orders");
  }, [dispatch, navigate]);

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        .pc-grid { display: grid; grid-template-columns: 1fr 400px; gap: 24px; align-items: start; }
        @media (max-width: 860px) { .pc-grid { grid-template-columns: 1fr; } }
        .inp:focus { border-color: ${R} !important; }
      `}</style>

      {/* ── HERO ── */}
      <div style={{ background: `linear-gradient(135deg,${R} 0%,${R2} 100%)`, padding: "40px 24px 52px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <Lock size={26} color="#fff" />
          </div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: "#fff", fontFamily: "'Syne',sans-serif" }}>Təhlükəsiz Ödəniş</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "rgba(255,255,255,0.75)" }}>Sifarişinizi tamamlayın</p>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "-24px auto 0", padding: "0 24px 48px", position: "relative", zIndex: 2 }}>
        <div className="pc-grid">

          {/* ── SOL: Ödəniş formu / Receipt ── */}
          <div>
            {paymentId ? (
              <SuccessReceiptCard
                total={totalAmount} currency={currency}
                cartItems={cartData?.cart || []}
                orderId={currentOrder?._id || paymentId}
                onComplete={handleComplete}
              />
            ) : (
              <div style={{ background: "#fff", borderRadius: 20, padding: "28px 26px", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1.5px solid #f0f0f0" }}>
                <h3 style={{ margin: "0 0 24px", fontSize: 17, fontWeight: 800, color: "#111", display: "flex", alignItems: "center", gap: 8 }}>
                  <CreditCard size={18} color={R} /> Ödəniş Məlumatları
                </h3>

                {!showCard ? (
                  /* ADDIM 1 */
                  <form onSubmit={handleShowCard}>
                    <InputField label="Valyuta seçin">
                      <select value={currency} onChange={e => setCurrency(e.target.value)}
                        className="inp"
                        style={{ ...inputStyle(false), appearance: "none", cursor: "pointer" }}>
                        <option value="azn">AZN — Azərbaycan Manatı (₼)</option>
                        <option value="usd">USD — ABŞ Dolları ($)</option>
                        <option value="eur">EUR — Avro (€)</option>
                        <option value="try">TRY — Türk Lirəsi (₺)</option>
                      </select>
                    </InputField>

                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "#fff5f5", border: `1px solid ${R}20`, borderRadius: 12, padding: "12px 14px", marginBottom: 24, borderLeft: `4px solid ${R}` }}>
                      <ShieldCheck size={16} color={R} style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 13, color: "#555" }}>Ödənişiniz <strong style={{ color: R }}>SSL şifrələməsi</strong> ilə tam qorunur</span>
                    </div>

                    <button type="submit" disabled={totalAmount <= 0}
                      style={{ width: "100%", padding: "15px", background: `linear-gradient(135deg,${R},${R2})`, color: "#fff", border: "none", borderRadius: 14, fontWeight: 800, fontSize: 16, cursor: totalAmount <= 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: totalAmount <= 0 ? 0.6 : 1, boxShadow: `0 6px 20px ${R}40` }}>
                      <CreditCard size={18} /> Kart ilə Ödə — {totalAmount.toFixed(2)} {currency.toUpperCase()}
                    </button>
                  </form>
                ) : (
                  /* ADDIM 2 */
                  <form onSubmit={handleSubmit}>
                    {/* Məbləğ xülasəsi */}
                    <div style={{ background: "#fff5f5", borderRadius: 12, padding: "12px 16px", marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${R}20` }}>
                      <span style={{ fontSize: 13, color: "#555", fontWeight: 600 }}>Ödəniləcək məbləğ</span>
                      <strong style={{ fontSize: 17, color: R }}>{totalAmount.toFixed(2)} {currency.toUpperCase()}</strong>
                    </div>

                    {/* Kart nömrəsi */}
                    <InputField label="Kart nömrəsi" icon={CreditCard}>
                      <input type="text" inputMode="numeric" placeholder="1234 5678 9012 3456"
                        value={cardNumber} onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                        required className="inp"
                        style={{ ...inputStyle(), letterSpacing: 2, fontFamily: "monospace" }} />
                    </InputField>

                    {/* Bitmə tarixi + CVV */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 4 }}>
                      <InputField label="Bitmə tarixi" icon={Calendar}>
                        <input type="text" inputMode="numeric" placeholder="MM/YY"
                          value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))}
                          required className="inp"
                          style={{ ...inputStyle(), fontFamily: "monospace", letterSpacing: 1 }} />
                      </InputField>
                      <InputField label="CVV" icon={KeyRound}>
                        <input type="password" inputMode="numeric" placeholder="•••"
                          value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          required className="inp" style={inputStyle()} />
                      </InputField>
                    </div>

                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "#fff5f5", border: `1px solid ${R}20`, borderRadius: 12, padding: "10px 14px", marginBottom: 20, borderLeft: `4px solid ${R}` }}>
                      <ShieldCheck size={15} color={R} style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 12, color: "#555" }}>Kart məlumatlarınız <strong style={{ color: R }}>SSL şifrələməsi</strong> ilə qorunur</span>
                    </div>

                    <div style={{ display: "flex", gap: 10 }}>
                      <button type="button" onClick={() => setShowCard(false)}
                        style={{ display: "flex", alignItems: "center", gap: 4, padding: "14px 18px", background: "#f5f5f5", border: "none", borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: "pointer", color: "#555" }}>
                        <ChevronLeft size={16} /> Geri
                      </button>
                      <button type="submit" disabled={loading}
                        style={{ flex: 1, padding: 14, background: `linear-gradient(135deg,${R},${R2})`, color: "#fff", border: "none", borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: loading ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.75 : 1, boxShadow: `0 4px 16px ${R}40` }}>
                        {loading ? <><Loader2 size={17} style={{ animation: "spin 1s linear infinite" }} /> Yoxlanılır...</> : "Ödənişi Təsdiqlə"}
                      </button>
                    </div>
                  </form>
                )}

                {error && (
                  <div style={{ marginTop: 16, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 13, color: "#dc2626" }}>{error}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── SAĞ: Sifariş xülasəsi ── */}
          <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.07)", overflow: "hidden", position: "sticky", top: 20, border: "1.5px solid #f0f0f0" }}>
            {/* Başlıq */}
            <div style={{ padding: "16px 20px", background: `linear-gradient(135deg,${R},${R2})`, display: "flex", alignItems: "center", gap: 8 }}>
              <ShoppingBag size={16} color="#fff" />
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#fff" }}>Sifariş Xülasəsi</h3>
            </div>

            <div style={{ padding: "18px 20px" }}>
              {cartLoading ? (
                <div style={{ textAlign: "center", padding: 30 }}>
                  <Loader2 size={24} color={R} style={{ animation: "spin 1s linear infinite" }} />
                </div>
              ) : cartData?.cart?.length > 0 ? (
                <>
                  <div style={{ maxHeight: 260, overflowY: "auto", marginBottom: 16 }}>
                    {cartData.cart.map(item => (
                      <div key={item.product._id} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                        <div style={{ width: 54, height: 54, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "#f5f5f5", border: "1px solid #eee" }}>
                          <img src={item.product.images?.[0]?.url || "/placeholder.svg"} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#111" }}>{item.product.name}</p>
                          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#aaa" }}>Say: {item.quantity}</p>
                          <p style={{ margin: "3px 0 0", fontWeight: 800, fontSize: 13, color: R }}>{(item.product.price * item.quantity).toFixed(2)} ₼</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 14 }}>
                    {/* Promo kod */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#555" }}>Promo Kod</span>
                        {promoCode && promoMethod === "link" && (
                          <span style={{ fontSize: 10, background: "#fff5f5", color: R, padding: "2px 8px", borderRadius: 4, fontWeight: 700, border: `1px solid ${R}30` }}>REF LİNK</span>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input type="text" placeholder="Məs: AYDAN10" value={promoCode}
                          onChange={e => { setPromoCode(e.target.value.toUpperCase()); setPromoMethod("code"); }}
                          disabled={promoMethod === "link"}
                          className="inp"
                          style={{ flex: 1, padding: "9px 12px", border: "1.5px solid #eee", borderRadius: 10, fontSize: 13, textTransform: "uppercase", outline: "none", fontFamily: "'Inter',sans-serif", background: promoMethod === "link" ? "#f5f5f5" : "#fff" }}
                        />
                        {promoCode && (
                          <button onClick={() => { setPromoCode(""); setPromoMethod("code"); sessionStorage.removeItem("blogger_promo"); }}
                            style={{ border: "none", background: "#f5f5f5", color: "#888", cursor: "pointer", fontSize: 11, fontWeight: 600, borderRadius: 8, padding: "0 10px" }}>
                            Sil
                          </button>
                        )}
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#888", marginBottom: 6 }}>
                      <span>Məhsullar</span><span>{totalAmount.toFixed(2)} ₼</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#888", marginBottom: 14 }}>
                      <span>Çatdırılma</span><span style={{ color: "#16a34a", fontWeight: 700 }}>Pulsuz</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 18, borderTop: "2px solid #f0f0f0", paddingTop: 12 }}>
                      <span style={{ color: "#111" }}>Cəmi</span>
                      <span style={{ color: R }}>{totalAmount.toFixed(2)} ₼</span>
                    </div>
                  </div>
                </>
              ) : (
                <p style={{ textAlign: "center", color: "#bbb", padding: "20px 0", fontSize: 14 }}>Səbət boşdur</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;
