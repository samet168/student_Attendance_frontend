const notifications = [
  { id: 1, title: "វត្តមានថ្ងៃនេះ", message: "សិស្ស សន្សា កន្តី មកដល់ម៉ោង ០៨:០០ AM", time: "10 នាទីមុន", type: "success", read: false },
  { id: 2, title: "អវត្តមាន", message: "សិស្ស សន្សា កន្តី អវត្តមាន ថ្ងៃ 18/06/2024", time: "2 ម៉ោងមុន", type: "error", read: false },
  { id: 3, title: "មកយឺត", message: "សិស្ស មកដល់ ម៉ោង ០៩:១៥ AM យឺតជាង ១៥ នាទី", time: "ម្សិលមិញ", type: "warning", read: true },
  { id: 4, title: "ប្រកាស", message: "ថ្ងៃឈប់សំរាក ២៩ មិថុនា ២០២៤", time: "2 ថ្ងៃមុន", type: "info", read: true },
  { id: 5, title: "ការប្រឡង", message: "ការប្រឡងត្រីមាស ២ នឹងប្រព្រឹត្ត ថ្ងៃទី ១ កក្កដា", time: "3 ថ្ងៃមុន", type: "info", read: true },
];

const typeStyle = {
  success: { bg: "#f0fdf4", border: "#a7f3d0", icon: "✅", color: "#10b981" },
  error:   { bg: "#fff5f5", border: "#fecaca", icon: "❌", color: "#ef4444" },
  warning: { bg: "#fffbeb", border: "#fde68a", icon: "⚠️", color: "#f59e0b" },
  info:    { bg: "#eff6ff", border: "#bfdbfe", icon: "ℹ️", color: "#3b82f6" },
};

const Notifications = () => (
  <div style={{ padding: "28px 24px", fontFamily: "'Noto Sans Khmer', sans-serif", backgroundColor: "#f4f7fb", minHeight: "calc(100vh - 64px)" }}>
    <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#1e293b", marginBottom: "20px" }}>
      សេចក្តីជូនដំណឹង
    </h2>
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "700px" }}>
      {notifications.map(n => {
        const s = typeStyle[n.type];
        return (
          <div key={n.id} style={{
            backgroundColor: n.read ? "#ffffff" : s.bg,
            border: `1.5px solid ${n.read ? "#e2e8f0" : s.border}`,
            borderRadius: "14px",
            padding: "16px 20px",
            display: "flex",
            gap: "14px",
            alignItems: "flex-start",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            position: "relative",
          }}>
            {!n.read && (
              <div style={{
                position: "absolute", top: "16px", right: "16px",
                width: "8px", height: "8px", borderRadius: "50%",
                backgroundColor: s.color,
              }} />
            )}
            <span style={{ fontSize: "22px" }}>{s.icon}</span>
            <div>
              <div style={{ fontWeight: "700", color: "#1e293b", fontSize: "15px", marginBottom: "4px" }}>{n.title}</div>
              <div style={{ color: "#475569", fontSize: "13px", marginBottom: "6px" }}>{n.message}</div>
              <div style={{ color: "#94a3b8", fontSize: "12px" }}>{n.time}</div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default Notifications;