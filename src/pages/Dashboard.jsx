import { useState } from "react";

const attendanceData = [
  {
    date: "18/06/2024",
    subject: "មឿន សាម៉េត",
    class: "11A",
    timeIn: "08:00 AM",
    timeOut: "–",
    status: "មកយឺត",
    statusColor: "#f59e0b",
    statusBg: "#fef3c7",
  },
  {
    date: "18/06/2024",
    subject: "មឿន សាម៉េត",
    class: "11A",
    timeIn: "09:15 AM",
    timeOut: "M:10 AM",
    status: "អវត្តមាន",
    statusColor: "#ef4444",
    statusBg: "#fee2e2",
  },
  {
    date: "29/06/2024",
    subject: "មឿន សាម៉េត",
    class: "11A",
    timeIn: "10:30 AM",
    timeOut: "10:30 PM",
    status: "មកយឺត",
    statusColor: "#f59e0b",
    statusBg: "#fef3c7",
  },
  {
    date: "29/06/2024",
    subject: "មឿន សាម៉េត",
    class: "11A",
    timeIn: "10:15 AM",
    timeOut: "–",
    status: "មកផ្ទះ",
    statusColor: "#10b981",
    statusBg: "#d1fae5",
  },
  {
    date: "05/07/2024",
    subject: "មឿន សាម៉េត",
    class: "11A",
    timeIn: "07:45 AM",
    timeOut: "04:00 PM",
    status: "មានវត្តមាន",
    statusColor: "#10b981",
    statusBg: "#d1fae5",
  },
  {
    date: "05/07/2024",
    subject: "មឿន សាម៉េត",
    class: "11A",
    timeIn: "08:00 AM",
    timeOut: "03:30 PM",
    status: "មានវត្តមាន",
    statusColor: "#10b981",
    statusBg: "#d1fae5",
  },
];

const StatCard = ({ title, value, icon, color, bg, border }) => (
  <div
    style={{
      backgroundColor: bg,
      border: `1.5px solid ${border}`,
      borderRadius: "14px",
      padding: "20px 22px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flex: "1 1 180px",
      minWidth: "150px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    }}
  >
    <div>
      <div
        style={{
          fontSize: "13px",
          color: "#64748b",
          fontWeight: "600",
          marginBottom: "6px",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: "32px",
          fontWeight: "800",
          color: color,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
    <div
      style={{
        width: "52px",
        height: "52px",
        borderRadius: "50%",
        backgroundColor: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
  </div>
);

const Dashboard = () => {
  const [search, setSearch] = useState("");

  const filtered = attendanceData.filter(
    (r) =>
      r.subject.includes(search) ||
      r.date.includes(search) ||
      r.status.includes(search),
  );

  return (
    <div
      style={{
        padding: "28px 24px",
        fontFamily: "'Noto Sans Khmer', 'Khmer OS Battambang', sans-serif",
        backgroundColor: "#f4f7fb",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      {/* Section title */}
      <h2
        style={{
          fontSize: "22px",
          fontWeight: "800",
          color: "#1e293b",
          marginBottom: "20px",
          letterSpacing: "0.2px",
        }}
      >
        សង្ខេបវត្តមាន ( ២០២៥)
      </h2>

      {/* Stat Cards */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "28px",
        }}
      >
        <StatCard
          title="វត្តមានសរុប"
          value="20"
          color="#10b981"
          bg="#f0fdf4"
          border="#a7f3d0"
          icon={
            <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
              <path d="M20 6L9 17l-5-5 1.4-1.4L9 14.2 18.6 4.6z" />
            </svg>
          }
        />
        <StatCard
          title="អវត្តមាន"
          value="2"
          color="#ef4444"
          bg="#fff5f5"
          border="#fecaca"
          icon={
            <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          }
        />
        <StatCard
          title="មកយឺត"
          value="1"
          color="#f59e0b"
          bg="#fffbeb"
          border="#fde68a"
          icon={
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 15 15" />
            </svg>
          }
        />
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1.5px solid #e2e8f0",
            borderRadius: "14px",
            padding: "20px 22px",
            flex: "1 1 180px",
            minWidth: "150px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#64748b",
              fontWeight: "600",
              marginBottom: "6px",
            }}
          >
            average
          </div>
          <div
            style={{
              fontSize: "30px",
              fontWeight: "800",
              color: "#1e293b",
              lineHeight: 1,
            }}
          >
            7h 30m
          </div>
        </div>
      </div>

      {/* Table section */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "20px 24px 14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <h3
            style={{
              fontSize: "17px",
              fontWeight: "800",
              color: "#1e293b",
              margin: 0,
            }}
          >
            កាលវត្តមានបច្ចុប្បន្ន
          </h3>
          <input
            type="text"
            placeholder="ស្វែងរក..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "7px 14px",
              borderRadius: "8px",
              border: "1.5px solid #e2e8f0",
              outline: "none",
              fontSize: "13px",
              color: "#334155",
              background: "#f8fafc",
              fontFamily: "inherit",
              width: "180px",
            }}
          />
        </div>

        {/* Responsive table wrapper */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "560px",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#f8fafc",
                  borderTop: "1px solid #f0f4f8",
                }}
              >
                {[
                  "កាលបរិច្ឆេទ",
                  "ឈ្មោះសិស្ស",
                  "ថ្នាក់",
                  "ម៉ោងចូល",
                  "ម៉ោងចេញ",
                  "ស្ថានភាព",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#64748b",
                      borderBottom: "1.5px solid #e8edf3",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: "1px solid #f1f5f9",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f8fafc")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <td
                    style={{
                      padding: "13px 16px",
                      fontSize: "14px",
                      color: "#475569",
                    }}
                  >
                    {row.date}
                  </td>
                  <td
                    style={{
                      padding: "13px 16px",
                      fontSize: "14px",
                      color: "#1e293b",
                      fontWeight: "600",
                    }}
                  >
                    {row.subject}
                  </td>
                  <td
                    style={{
                      padding: "13px 16px",
                      fontSize: "14px",
                      color: "#475569",
                    }}
                  >
                    {row.class}
                  </td>
                  <td
                    style={{
                      padding: "13px 16px",
                      fontSize: "14px",
                      color: "#475569",
                    }}
                  >
                    {row.timeIn}
                  </td>
                  <td
                    style={{
                      padding: "13px 16px",
                      fontSize: "14px",
                      color: "#475569",
                    }}
                  >
                    {row.timeOut}
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <span
                      style={{
                        backgroundColor: row.statusBg,
                        color: row.statusColor,
                        borderRadius: "20px",
                        padding: "4px 12px",
                        fontSize: "12px",
                        fontWeight: "700",
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div
            style={{
              padding: "30px",
              textAlign: "center",
              color: "#94a3b8",
              fontSize: "14px",
            }}
          >
            រកមិនឃើញទិន្នន័យ
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
