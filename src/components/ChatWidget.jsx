// =====================================================================
// CHAT WIDGET — Alıcı ↔ Brendex Dəstək Söhbəti
// Sağ-aşağı küncdə üzən düymə, klikləndikdə chat pəncərəsi açılır.
// Yalnız authenticated user görür.
// =====================================================================
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const SOCKET_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3011/commerce/mehsullar")
    .replace("/commerce/mehsullar", "");

let socket = null;

export default function ChatWidget() {
    const { user, isAuthenticated } = useSelector((s) => s.userSlice);
    const userId   = user?.user?._id;
    const userName = user?.user?.name || "İstifadəçi";
    const roomId   = userId ? `user_${userId}` : null;

    const [open,     setOpen]     = useState(false);
    const [messages, setMessages] = useState([]);
    const [text,     setText]     = useState("");
    const [loading,  setLoading]  = useState(false);
    const bottomRef = useRef(null);

    // ── SOCKET BAĞLANTISI ─────────────────────────────────────────────
    useEffect(() => {
        if (!isAuthenticated || !roomId) return;

        socket = io(SOCKET_URL, { withCredentials: true, transports: ["websocket", "polling"] });

        socket.emit("chat:join", { roomId });

        socket.emit("chat:history", { roomId }, (res) => {
            if (res?.success) setMessages(res.messages || []);
        });

        socket.on("chat:message", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket?.disconnect();
            socket = null;
        };
    }, [isAuthenticated, roomId]);

    // ── AVTOMATIK AŞAĞI QAYDIRMA ──────────────────────────────────────
    useEffect(() => {
        if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open]);

    // ── MESAJ GÖNDƏR ─────────────────────────────────────────────────
    const sendMessage = () => {
        if (!text.trim() || !socket) return;
        socket.emit("chat:send", { roomId, sender: "user", userName, text: text.trim() });
        setText("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    // Authenticated deyilsə göstərmə
    if (!isAuthenticated || !userId) return null;

    return (
        <>
            <style>{`
                .cw-btn {
                    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
                    width: 56px; height: 56px; border-radius: 50%;
                    background: #E8192C; color: #fff; border: none;
                    font-size: 22px; cursor: pointer;
                    box-shadow: 0 4px 16px rgba(232,25,44,.4);
                    display: flex; align-items: center; justify-content: center;
                    transition: transform .15s, background .15s;
                }
                .cw-btn:hover { transform: scale(1.08); background: #c8111e; }

                .cw-window {
                    position: fixed; bottom: 90px; right: 24px; z-index: 9998;
                    width: 360px; height: 500px;
                    background: #fff; border-radius: 16px;
                    box-shadow: 0 8px 32px rgba(0,0,0,.18);
                    display: flex; flex-direction: column; overflow: hidden;
                    animation: cwSlide .2s ease;
                }
                @keyframes cwSlide { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: none; } }

                .cw-header {
                    background: #E8192C; color: #fff;
                    padding: 14px 18px; font-weight: 700; font-size: 15px;
                    display: flex; align-items: center; gap: 10px;
                }
                .cw-header-dot {
                    width: 9px; height: 9px; border-radius: 50%;
                    background: #4ade80; flex-shrink: 0;
                    box-shadow: 0 0 0 2px rgba(255,255,255,.4);
                }
                .cw-msgs {
                    flex: 1; overflow-y: auto; padding: 14px;
                    display: flex; flex-direction: column; gap: 8px;
                    background: #f9f9fb;
                }
                .cw-msgs::-webkit-scrollbar { width: 4px; }
                .cw-msgs::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }

                .cw-bubble {
                    max-width: 80%; padding: 9px 13px; border-radius: 12px;
                    font-size: 13.5px; line-height: 1.4; word-break: break-word;
                }
                .cw-bubble.user {
                    align-self: flex-end;
                    background: #E8192C; color: #fff;
                    border-bottom-right-radius: 4px;
                }
                .cw-bubble.support {
                    align-self: flex-start;
                    background: #fff; color: #1a1a1a;
                    border: 1px solid #eee;
                    border-bottom-left-radius: 4px;
                }
                .cw-bubble-name {
                    font-size: 11px; opacity: .65; margin-bottom: 3px; font-weight: 600;
                }
                .cw-bubble-time {
                    font-size: 10px; opacity: .5; margin-top: 4px; text-align: right;
                }

                .cw-empty {
                    flex: 1; display: flex; flex-direction: column;
                    align-items: center; justify-content: center;
                    color: #aaa; font-size: 13px; gap: 8px;
                }

                .cw-input-row {
                    display: flex; gap: 8px; padding: 10px 12px;
                    border-top: 1px solid #eee; background: #fff;
                }
                .cw-input {
                    flex: 1; border: 1.5px solid #e8e8e8; border-radius: 10px;
                    padding: 9px 12px; font-size: 13.5px; outline: none;
                    resize: none; line-height: 1.4; max-height: 80px;
                    font-family: inherit;
                    transition: border-color .15s;
                }
                .cw-input:focus { border-color: #E8192C; }
                .cw-send {
                    background: #E8192C; color: #fff; border: none;
                    border-radius: 10px; padding: 0 14px; cursor: pointer;
                    font-size: 16px; transition: background .15s;
                }
                .cw-send:hover { background: #c8111e; }
                .cw-send:disabled { background: #ddd; cursor: not-allowed; }

                @media (max-width: 420px) {
                    .cw-window { width: calc(100vw - 20px); right: 10px; }
                }
            `}</style>

            {/* Üzən düymə */}
            <button className="cw-btn" onClick={() => setOpen((p) => !p)} title="Dəstəklə əlaqə">
                {open ? "✕" : "💬"}
            </button>

            {/* Chat pəncərəsi */}
            {open && (
                <div className="cw-window">
                    <div className="cw-header">
                        <span className="cw-header-dot" />
                        <span>Brendex Dəstək</span>
                    </div>

                    <div className="cw-msgs">
                        {messages.length === 0 ? (
                            <div className="cw-empty">
                                <span style={{ fontSize: 32 }}>💬</span>
                                <span>Dəstəklə söhbət başladın</span>
                            </div>
                        ) : (
                            messages.map((m) => (
                                <div key={m._id || m.createdAt} className={`cw-bubble ${m.sender}`}>
                                    <div className="cw-bubble-name">
                                        {m.sender === "support" ? "Brendex Dəstək" : m.userName}
                                    </div>
                                    {m.text}
                                    <div className="cw-bubble-time">
                                        {new Date(m.createdAt).toLocaleTimeString("az-AZ", { hour: "2-digit", minute: "2-digit" })}
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={bottomRef} />
                    </div>

                    <div className="cw-input-row">
                        <textarea
                            className="cw-input"
                            rows={1}
                            placeholder="Mesaj yazın..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button className="cw-send" onClick={sendMessage} disabled={!text.trim()}>
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
