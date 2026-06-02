import { useEffect, useRef, useState } from "react";
import { API_BASE_URL, WS_BASE_URL } from "../config";

const s = {
  launcher: {
    position: "fixed",
    right: 22,
    bottom: 22,
    zIndex: 300,
    width: 58,
    height: 58,
    borderRadius: "50%",
    border: "none",
    background: "#5f4a28",
    color: "#fff7ea",
    fontSize: 14,
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(56, 42, 20, 0.28)",
  },
  panel: {
    position: "fixed",
    right: 22,
    bottom: 92,
    zIndex: 300,
    width: 340,
    maxWidth: "calc(100vw - 44px)",
    height: 440,
    background: "#fffaf2",
    border: "1px solid #e1d1b8",
    borderRadius: 8,
    boxShadow: "0 18px 38px rgba(56, 42, 20, 0.24)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    fontFamily: "'Libre Bodoni', serif",
  },
  header: {
    padding: "14px 16px",
    background: "#5f4a28",
    color: "#fff7ea",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: 700,
  },
  close: {
    border: "none",
    background: "transparent",
    color: "#fff7ea",
    cursor: "pointer",
    fontSize: 20,
    lineHeight: 1,
  },
  messages: {
    flex: 1,
    padding: 14,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  bubble: (own) => ({
    alignSelf: own ? "flex-end" : "flex-start",
    maxWidth: "82%",
    padding: "9px 11px",
    borderRadius: 8,
    background: own ? "#ecdcc2" : "#ffffff",
    border: "1px solid #e4d5bf",
    color: "#4d3b20",
    wordBreak: "break-word",
  }),
  meta: {
    fontSize: 11,
    opacity: 0.7,
    marginBottom: 4,
  },
  inputRow: {
    borderTop: "1px solid #e1d1b8",
    display: "flex",
    gap: 8,
    padding: 10,
    background: "#faf3e8",
  },
  input: {
    flex: 1,
    minWidth: 0,
    border: "1px solid #d5c0a0",
    borderRadius: 8,
    padding: "10px 12px",
    outline: "none",
    color: "#4d3b20",
    background: "#fffaf2",
  },
  send: {
    border: "none",
    borderRadius: 8,
    padding: "0 14px",
    background: "#5f4a28",
    color: "#fff7ea",
    cursor: "pointer",
    fontWeight: 700,
  },
};

export default function ChatWidget({ user }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/chat/messages`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setMessages)
      .catch(() => setMessages([]));

    const socket = new WebSocket(WS_BASE_URL);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "CHAT_MESSAGE") {
        setMessages((prev) => [...prev, data.payload].slice(-100));
      }
    };

    return () => socket.close();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = () => {
    const cleanText = text.trim();
    if (!cleanText || socketRef.current?.readyState !== WebSocket.OPEN) return;

    socketRef.current.send(JSON.stringify({
      type: "CHAT_SEND",
      payload: {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        role: user.roleName || user.role,
        text: cleanText,
      },
    }));
    setText("");
  };

  const canChat = !user.permissions || user.permissions.includes("chat:use") || user.role === "admin";
  if (!canChat) return null;

  return (
    <>
      {open && (
        <section style={s.panel} className="chat-panel" aria-label="Real-time chat">
          <div style={s.header}>
            <span>Glow Chat</span>
            <button style={s.close} onClick={() => setOpen(false)} aria-label="Close chat">x</button>
          </div>
          <div style={s.messages}>
            {messages.map((message) => {
              const own = message.userEmail === user.email;
              return (
                <div key={message.id} style={s.bubble(own)}>
                  <div style={s.meta}>{message.userName} - {message.role}</div>
                  <div>{message.text}</div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
          <div style={s.inputRow}>
            <input
              style={s.input}
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => { if (event.key === "Enter") sendMessage(); }}
              placeholder="Write a message..."
              maxLength={500}
            />
            <button style={s.send} onClick={sendMessage}>Send</button>
          </div>
        </section>
      )}
      <button style={s.launcher} className="chat-launcher" onClick={() => setOpen((value) => !value)} aria-label="Open chat">Chat</button>
    </>
  );
}
