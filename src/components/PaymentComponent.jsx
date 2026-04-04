import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPaymentIntent, resetPaymentState } from "../slices/paymentSlice";
import { createOrder } from "../slices/orderSlice";
import { useGetCartQuery } from "../redux/api/productsApi";
import {
  CreditCard, ShieldCheck, Lock, AlertCircle,
  CheckCircle, Loader2, ShoppingBag, ArrowRight,
  Printer, Download,
} from "lucide-react";

/* ── Printable receipt ──────────────────────────────────────────────── */
const SuccessReceiptCard = ({ total, currency, cartItems, orderId, onComplete }) => {
  const [countdown, setCountdown] = useState(8);
  const stableComplete = useCallback(() => onComplete(), [onComplete]);
  const orderNum = orderId
    ? orderId.slice(-8).toUpperCase()
    : Math.random().toString(36).slice(2, 10).toUpperCase();
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
        body { font-family: Arial, sans-serif; max-width: 380px; margin: 0 auto; padding: 20px; color: #111; }
        .logo { font-size: 24px; font-weight: 900; text-align: center; margin-bottom: 4px; }
        .logo span { color: #E8192C; }
        .sub   { text-align: center; font-size: 12px; color: #888; margin-bottom: 20px; }
        .sep   { border: none; border-top: 1px dashed #ccc; margin: 12px 0; }
        .row   { display: flex; justify-content: space-between; font-size: 13px; margin: 6px 0; }
        .total { font-weight: 900; font-size: 17px; }
        .item  { display: flex; justify-content: space-between; font-size: 12px; margin: 4px 0; }
        .footer{ text-align: center; font-size: 11px; color: #aaa; margin-top: 20px; }
      </style></head><body>
      <div class="logo">Brend<span>ex</span></div>
      <div class="sub">Onlayn Alış-veriş Platforması</div>
      <hr class="sep"/>
      <div class="row"><span>Sifariş №:</span><strong>#${orderNum}</strong></div>
      <div class="row"><span>Tarix:</span><span>${now.toLocaleString("az-AZ")}</span></div>
      <hr class="sep"/>
      ${cartItems.map(i => `<div class="item"><span>${i.product.name} x${i.quantity}</span><span>${(i.product.price * i.quantity).toFixed(2)} ₼</span></div>`).join("")}
      <hr class="sep"/>
      <div class="row total"><span>CƏMİ:</span><span>${total.toFixed(2)} ${currency.toUpperCase()}</span></div>
      <div class="row"><span>Çatdırılma:</span><span>Pulsuz</span></div>
      <hr class="sep"/>
      <div class="footer">Brendex-ə təşəkkür edirik! | www.brendex.az</div>
      </body></html>
    `);
    w.document.close();
    w.print();
  };

  return (
    <div style={{ borderRadius: 20, background: "#fff", boxShadow: "0 8px 40px rgba(0,0,0,0.12)", border: "2px solid #22c55e", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)", padding: "28px 24px", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
          <CheckCircle size={36} color="#fff" />
        </div>
        <h3 style={{ color: "#fff", margin: "0 0 4px", fontSize: 22, fontWeight: 800 }}>Ödəniş Uğurlu!</h3>
        <p style={{ color: "rgba(255,255,255,0.85)", margin: 0, fontSize: 13 }}>Sifarişiniz qəbul edildi</p>
      </div>

      <div style={{ padding: "24px" }}>
        {/* Order info */}
        <div style={{ background: "#f8f9fa", borderRadius: 12, padding: "14px 16px", marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
            <span style={{ color: "#888" }}>Sifariş №</span>
            <strong style={{ color: "#111", fontFamily: "monospace" }}>#{orderNum}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: "#888" }}>Tarix</span>
            <span style={{ color: "#111" }}>{now.toLocaleString("az-AZ")}</span>
          </div>
        </div>

        {/* Items */}
        <h4 style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 700, color: "#111" }}>Məhsullar</h4>
        <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 16 }}>
          {cartItems.map(item => (
            <div key={item.product._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#f0f0f0" }}>
                  <img src={item.product.images?.[0]?.url || "/placeholder.svg"} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 12, color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160 }}>{item.product.name}</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#888" }}>Say: {item.quantity}</p>
                </div>
              </div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{(item.product.price * item.quantity).toFixed(2)} ₼</p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div style={{ background: "#f0fdf4", borderRadius: 12, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>Cəmi</span>
          <span style={{ fontSize: 22, fontWeight: 800, color: "#16a34a" }}>{total.toFixed(2)} {currency.toUpperCase()}</span>
        </div>

        {/* Countdown */}
        <div style={{ textAlign: "center", padding: "10px", background: "#eff6ff", borderRadius: 10, marginBottom: 16, fontSize: 13, color: "#555" }}>
          Sifarişlərimə yönləndirilir... <strong>{countdown} san</strong>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handlePrint} style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "12px", border: "1.5px solid #e5e7eb", borderRadius: 10, background: "#fff",
            fontWeight: 600, fontSize: 13, cursor: "pointer", color: "#374151",
          }}>
            <Printer size={15} /> Çap et
          </button>
          <button onClick={stableComplete} style={{
            flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "12px", background: "#111", color: "#fff", border: "none",
            borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer",
          }}>
            Sifarişlərimə get <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main component ─────────────────────────────────────────────────── */
const PaymentComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, clientSecret, error } = useSelector(s => s.payment);
  const { currentOrder }                 = useSelector(s => s.order);
  const { data: cartData, isLoading: cartLoading } = useGetCartQuery();

  const [currency, setCurrency] = useState("azn");
  const orderCreatedRef = useRef(false);

  const totalAmount = cartData?.cart?.reduce((t, i) => t + i.product.price * i.quantity, 0) ?? 0;

  useEffect(() => {
    if (clientSecret && !orderCreatedRef.current) {
      orderCreatedRef.current = true;
      const piId = clientSecret.split("_secret_")[0];
      setTimeout(() => dispatch(createOrder({ stripePaymentIntentId: piId, currency })), 0);
    }
  }, [clientSecret, currency, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (totalAmount <= 0) return;
    dispatch(createPaymentIntent({ amount: totalAmount, currency }));
  };

  const handleReset = () => { dispatch(resetPaymentState()); orderCreatedRef.current = false; setCurrency("azn"); };

  const handleComplete = useCallback(() => { dispatch(resetPaymentState()); orderCreatedRef.current = false; navigate("/my-orders"); }, [dispatch, navigate]);

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", padding: "32px 16px", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');`}</style>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, margin: 0 }}>
            <Lock size={24} /> Təhlükəsiz Ödəniş
          </h1>
          <p style={{ marginTop: 6, color: "#888", fontSize: 14 }}>Sifarişinizi tamamlayın</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 24, alignItems: "start" }}>

          {/* LEFT: form or receipt */}
          <div>
            {clientSecret ? (
              <SuccessReceiptCard
                total={totalAmount} currency={currency}
                cartItems={cartData?.cart || []}
                orderId={currentOrder?._id || clientSecret.split("_secret_")[0]}
                onComplete={handleComplete}
              />
            ) : (
              <div style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
                <h3 style={{ margin: "0 0 22px", fontSize: 16, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
                  <CreditCard size={18} /> Ödəniş Məlumatları
                </h3>

                <form onSubmit={handleSubmit}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>Valyuta</label>
                  <select value={currency} onChange={e => setCurrency(e.target.value)}
                    style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #eee", borderRadius: 10, fontSize: "max(16px,14px)", outline: "none", marginBottom: 20, background: "#fafafa" }}>
                    <option value="azn">AZN — Azərbaycan Manatı (₼)</option>
                    <option value="usd">USD — ABŞ Dolları ($)</option>
                    <option value="eur">EUR — Avro (€)</option>
                    <option value="try">TRY — Türk Lirəsi (₺)</option>
                  </select>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "#eff6ff", borderRadius: 10, padding: "12px 14px", marginBottom: 22 }}>
                    <ShieldCheck size={16} color="#2563eb" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 13, color: "#1d4ed8" }}>Ödənişiniz SSL şifrələməsi ilə qorunur</span>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button type="submit" disabled={loading || totalAmount <= 0}
                      style={{ flex: 1, padding: "14px", background: "#111", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: loading ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading || totalAmount <= 0 ? 0.6 : 1 }}>
                      {loading ? <><Loader2 size={17} className="animate-spin" /> Emal edilir...</> : `Ödə — ${totalAmount.toFixed(2)} ${currency.toUpperCase()}`}
                    </button>
                    <button type="button" onClick={handleReset}
                      style={{ padding: "14px 18px", background: "#f3f4f6", border: "none", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer", color: "#555" }}>
                      Sıfırla
                    </button>
                  </div>
                </form>

                {error && (
                  <div style={{ marginTop: 16, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 14px", display: "flex", gap: 10 }}>
                    <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "#dc2626" }}>{error}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: order summary */}
          <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", overflow: "hidden", position: "sticky", top: 20 }}>
            <div style={{ padding: "16px 20px", background: "#f8f9fa", borderBottom: "1px solid #f0f0f0" }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
                <ShoppingBag size={16} /> Sifariş Xülasəsi
              </h3>
            </div>
            <div style={{ padding: "16px 20px" }}>
              {cartLoading ? (
                <div style={{ textAlign: "center", padding: 30 }}><Loader2 size={24} className="animate-spin" /></div>
              ) : cartData?.cart?.length > 0 ? (
                <>
                  <div style={{ maxHeight: 260, overflowY: "auto", marginBottom: 16 }}>
                    {cartData.cart.map(item => (
                      <div key={item.product._id} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                        <div style={{ width: 52, height: 52, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#f0f0f0" }}>
                          <img src={item.product.images?.[0]?.url || "/placeholder.svg"} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.product.name}</p>
                          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#888" }}>Say: {item.quantity}</p>
                          <p style={{ margin: "2px 0 0", fontWeight: 700, fontSize: 13 }}>{(item.product.price * item.quantity).toFixed(2)} ₼</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#888", marginBottom: 6 }}>
                      <span>Məhsullar</span><span>{totalAmount.toFixed(2)} ₼</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#888", marginBottom: 12 }}>
                      <span>Çatdırılma</span><span style={{ color: "#16a34a", fontWeight: 600 }}>Pulsuz</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 17 }}>
                      <span>Cəmi</span><span>{totalAmount.toFixed(2)} ₼</span>
                    </div>
                  </div>
                </>
              ) : (
                <p style={{ textAlign: "center", color: "#bbb", padding: "20px 0" }}>Səbət boşdur</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;
