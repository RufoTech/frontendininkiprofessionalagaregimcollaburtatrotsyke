// =====================================================================
// ADMIN CHAT PAGE — Brendex Dəstək Paneli
// Sol: bütün user söhbətləri (rooms), Sağ: seçilmiş söhbətin mesajları
// =====================================================================
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const SOCKET_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3011/commerce/mehsullar")
    .replace("/commerce/mehsullar", "");

let socket = null;

export default function AdminChatPage() {
    const { user } = useSelector((s) => s.auth);
    const adminName = user?.user?.name || "Brendex Dəstək";

    const [rooms,       setRooms]       = useState([]);
    const [activeRoom,  setActiveRoom]  = useState(null);
    const [messages,    setMessages]    = useState([]);
    const [text,        setText]        = useState("");
    const [connected,   setConnected]   = useState(false);
    const bottomRef = useRef(null);

    // ── SOCKET BAĞLANTISI ─────────────────────────────────────────────
    useEffect(() => {
        socket = io(SOCKET_URL, { withCredentials: true, transports: ["websocket", "polling"] });

        socket.on("connect",    () => setConnected(true));
        socket.on("disconnect", () => setConnected(false));

        // Admin paneli üçün bütün rooms-u çək
        socket.emit("chat:all-rooms", {}, (res) => {
            if (res?.success) setRooms(res.rooms || []);
        });

        return () => {
            socket?.disconnect();
            socket = null;
        };
    }, []);

    // ── REAL-TIME MESAJ ───────────────────────────────────────────────
    useEffect(() => {
        if (!socket) return;

        const handler = (msg) => {
            // Room siyahısını yenilə
            setRooms((prev) => {
                const idx = prev.findIndex((r) => r._id === msg.roomId);
                if (idx === -1) {
                    return [{ _id: msg.roomId, lastMsg: msg }, ...prev];
                }
                const updated = [...prev];
                updated[idx] = { ...updated[idx], lastMsg: msg };
                return [updated[idx], ...updated.filter((_, i) => i !== idx)];
            });
            // Aktiv room-a düşürsə mesajları əlavə et
            if (msg.roomId === activeRoom) {
                setMessages((prev) => [...prev, msg]);
            }
        };

        socket.on("chat:message", handler);
        return () => socket.off("chat:message", handler);
    }, [activeRoom]);

    // ── ROOM SEÇİLDİ ─────────────────────────────────────────────────
    const selectRoom = (roomId) => {
        setActiveRoom(roomId);
        setMessages([]);

        // Köhnə room-dan çıx, yenisine qoşul
        socket.emit("chat:join", { roomId });
        socket.emit("chat:history", { roomId }, (res) => {
            if (res?.success) setMessages(res.messages || []);
        });
    };

    // ── AVTOMATIK AŞAĞI QAYDIRMA ──────────────────────────────────────
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ── MESAJ GÖNDƏR ─────────────────────────────────────────────────
    const sendMessage = () => {
        if (!text.trim() || !activeRoom || !socket) return;
        socket.emit("chat:send", {
            roomId: activeRoom,
            sender: "support",
            userName: adminName,
            text: text.trim(),
        });
        setText("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    // ── USERNAME ROOM-DAN ÇIXAR ───────────────────────────────────────
    const getRoomLabel = (roomId) => {
        const lastMsg = rooms.find((r) => r._id === roomId)?.lastMsg;
        if (lastMsg?.sender === "user" && lastMsg?.userName) return lastMsg.userName;
        return roomId?.replace("user_", "İstifadəçi #") || roomId;
    };

    return (
        <>
            <style>{`
                .acp-wrap {
                    display: flex; height: calc(100vh - 80px);
                    background: #f4f4f7; font-family: inherit;
                }

                /* ── SOL PANEL ── */
                .acp-sidebar {
                    width: 280px; flex-shrink: 0;
                    background: #fff; border-right: 1px solid #eee;
                    display: flex; flex-direction: column;
                    overflow: hidden;
                }
                .acp-sidebar-header {
                    padding: 18px 16px 14px;
                    border-bottom: 1px solid #eee;
                    font-weight: 700; font-size: 16px; color: #1a1a1a;
                    display: flex; align-items: center; gap: 8px;
                }
                .acp-status-dot {
                    width: 8px; height: 8px; border-radius: 50%;
                    background: ${connected ? "#4ade80" : "#f87171"};
                }
                .acp-rooms {
                    flex: 1; overflow-y: auto; padding: 8px 0;
                }
                .acp-rooms::-webkit-scrollbar { width: 4px; }
                .acp-rooms::-webkit-scrollbar-thumb { background: #ddd; }

                .acp-room-item {
                    padding: 12px 16px; cursor: pointer;
                    border-left: 3px solid transparent;
                    transition: background .12s, border-color .12s;
                }
                .acp-room-item:hover { background: #f9f0f1; }
                .acp-room-item.active {
                    background: #fff5f5;
                    border-left-color: #E8192C;
                }
                .acp-room-name {
                    font-weight: 600; font-size: 13.5px; color: #1a1a1a;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                }
                .acp-room-preview {
                    font-size: 12px; color: #888; margin-top: 2px;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                }
                .acp-empty-rooms {
                    padding: 32px 16px; text-align: center; color: #bbb; font-size: 13px;
                }

                /* ── SAĞ PANEL ── */
                .acp-main {
                    flex: 1; display: flex; flex-direction: column; overflow: hidden;
                }
                .acp-main-header {
                    background: #fff; padding: 14px 20px;
                    border-bottom: 1px solid #eee;
                    font-weight: 700; font-size: 15px; color: #1a1a1a;
                }
                .acp-msgs {
                    flex: 1; overflow-y: auto; padding: 16px 20px;
                    display: flex; flex-direction: column; gap: 8px;
                }
                .acp-msgs::-webkit-scrollbar { width: 5px; }
                .acp-msgs::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }

                .acp-bubble {
                    max-width: 70%; padding: 10px 14px; border-radius: 12px;
                    font-size: 13.5px; line-height: 1.5; word-break: break-word;
                }
                .acp-bubble.user {
                    align-self: flex-start;
                    background: #fff; border: 1px solid #eee;
                    border-bottom-left-radius: 4px; color: #1a1a1a;
                }
                .acp-bubble.support {
                    align-self: flex-end;
                    background: #E8192C; color: #fff;
                    border-bottom-right-radius: 4px;
                }
                .acp-bubble-meta {
                    font-size: 10.5px; opacity: .55; margin-bottom: 3px; font-weight: 600;
                }
                .acp-bubble-time {
                    font-size: 10px; opacity: .5; margin-top: 4px; text-align: right;
                }

                .acp-no-room {
                    flex: 1; display: flex; align-items: center; justify-content: center;
                    flex-direction: column; gap: 12px; color: #bbb;
                }

                .acp-input-row {
                    display: flex; gap: 10px; padding: 12px 16px;
                    border-top: 1px solid #eee; background: #fff;
                }
                .acp-input {
                    flex: 1; border: 1.5px solid #e8e8e8; border-radius: 10px;
                    padding: 10px 14px; font-size: 13.5px; outline: none;
                    resize: none; line-height: 1.4; max-height: 100px;
                    font-family: inherit;
                    transition: border-color .15s;
                }
                .acp-input:focus { border-color: #E8192C; }
                .acp-send {
                    background: #E8192C; color: #fff; border: none;
                    border-radius: 10px; padding: 0 18px; cursor: pointer;
                    font-size: 16px; font-weight: 700;
                    transition: background .15s;
                }
                .acp-send:hover  { background: #c8111e; }
                .acp-send:disabled { background: #ddd; cursor: not-allowed; }

                @media (max-width: 640px) {
                    .acp-sidebar { width: 200px; }
                }
            `}</style>

            <div className="acp-wrap">
                {/* ── SOL: Room siyahısı ── */}
                <div className="acp-sidebar">
                    <div className="acp-sidebar-header">
                        <span className="acp-status-dot" />
                        Söhbətlər
                        {rooms.length > 0 && (
                            <span style={{ marginLeft: "auto", fontSize: 12, color: "#888", fontWeight: 400 }}>
                                {rooms.length}
                            </span>
                        )}
                    </div>
                    <div className="acp-rooms">
                        {rooms.length === 0 ? (
                            <div className="acp-empty-rooms">Hələ heç bir söhbət yoxdur</div>
                        ) : (
                            rooms.map((r) => (
                                <div
                                    key={r._id}
                                    className={`acp-room-item${activeRoom === r._id ? " active" : ""}`}
                                    onClick={() => selectRoom(r._id)}
                                >
                                    <div className="acp-room-name">{getRoomLabel(r._id)}</div>
                                    {r.lastMsg && (
                                        <div className="acp-room-preview">{r.lastMsg.text}</div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* ── SAĞ: Mesajlar ── */}
                <div className="acp-main">
                    {!activeRoom ? (
                        <div className="acp-no-room">
                            <span style={{ fontSize: 48 }}>💬</span>
                            <span style={{ fontSize: 14 }}>Sol paneldən söhbət seçin</span>
                        </div>
                    ) : (
                        <>
                            <div className="acp-main-header">
                                {getRoomLabel(activeRoom)}
                            </div>

                            <div className="acp-msgs">
                                {messages.length === 0 && (
                                    <div style={{ textAlign: "center", color: "#bbb", fontSize: 13, marginTop: 32 }}>
                                        Mesaj yoxdur
                                    </div>
                                )}
                                {messages.map((m) => (
                                    <div key={m._id || m.createdAt} className={`acp-bubble ${m.sender}`}>
                                        <div className="acp-bubble-meta">
                                            {m.sender === "support" ? "Brendex Dəstək" : m.userName}
                                        </div>
                                        {m.text}
                                        <div className="acp-bubble-time">
                                            {new Date(m.createdAt).toLocaleTimeString("az-AZ", { hour: "2-digit", minute: "2-digit" })}
                                        </div>
                                    </div>
                                ))}
                                <div ref={bottomRef} />
                            </div>

                            <div className="acp-input-row">
                                <textarea
                                    className="acp-input"
                                    rows={1}
                                    placeholder="Cavab yazın..."
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <button className="acp-send" onClick={sendMessage} disabled={!text.trim()}>
                                    ➤
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
