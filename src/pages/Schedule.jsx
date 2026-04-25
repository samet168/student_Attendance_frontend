const scheduleData = [
  { day: "ច័ន្ទ", subject: "គណិតវិទ្យា", time: "07:00 – 09:00", room: "11A", teacher: "លោក សុខ ដារា" },
  { day: "ច័ន្ទ", subject: "រូបវិទ្យា", time: "09:15 – 11:15", room: "11A", teacher: "លោក ចាន់ ណារ" },
  { day: "អង្គារ", subject: "ភាសាអង់គ្លេស", time: "07:00 – 09:00", room: "11A", teacher: "លោកស្រី សុផា" },
  { day: "អង្គារ", subject: "គីមីវិទ្យា", time: "09:15 – 11:15", room: "11A", teacher: "លោក វិជ្ជា" },
  { day: "ពុធ", subject: "ជីវវិទ្យា", time: "07:00 – 09:00", room: "11A", teacher: "លោកស្រី ម៉ារ៉ា" },
  { day: "ព្រហស្បតិ៍", subject: "ប្រវត្តិវិទ្យា", time: "07:00 – 09:00", room: "11A", teacher: "លោក ដានី" },
  { day: "សុក្រ", subject: "ភូគោលវិទ្យា", time: "07:00 – 09:00", room: "11A", teacher: "លោក ម៉េង" },
];

const dayColors = {
  "ច័ន្ទ": { bg: "#eff6ff", color: "#1d4ed8" },
  "អង្គារ": { bg: "#f0fdf4", color: "#15803d" },
  "ពុធ": { bg: "#fff7ed", color: "#c2410c" },
  "ព្រហស្បតិ៍": { bg: "#fdf4ff", color: "#7e22ce" },
  "សុក្រ": { bg: "#fff1f2", color: "#be123c" },
};

const Schedule = () => (
  <div style={{ padding: "28px 24px", fontFamily: "'Noto Sans Khmer', sans-serif", backgroundColor: "#f4f7fb", minHeight: "calc(100vh - 64px)" }}>
    <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#1e293b", marginBottom: "20px" }}>
      កាលវិភាគ
    </h2>
    <div style={{ backgroundColor: "#fff", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8fafc" }}>
              {["ថ្ងៃ", "មុខវិជ្ជា", "ម៉ោង", "ថ្នាក់", "គ្រូបង្រៀន"].map(h => (
                <th key={h} style={{ padding: "13px 16px", textAlign: "left", fontSize: "13px", fontWeight: "700", color: "#64748b", borderBottom: "1.5px solid #e8edf3" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scheduleData.map((row, i) => {
              const dc = dayColors[row.day] || { bg: "#f8fafc", color: "#475569" };
              return (
                <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                  <td style={{ padding: "13px 16px" }}>
                    <span style={{ backgroundColor: dc.bg, color: dc.color, borderRadius: "8px", padding: "3px 10px", fontSize: "12px", fontWeight: "700" }}>{row.day}</span>
                  </td>
                  <td style={{ padding: "13px 16px", fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>{row.subject}</td>
                  <td style={{ padding: "13px 16px", fontSize: "13px", color: "#64748b" }}>{row.time}</td>
                  <td style={{ padding: "13px 16px", fontSize: "14px", color: "#475569" }}>{row.room}</td>
                  <td style={{ padding: "13px 16px", fontSize: "14px", color: "#475569" }}>{row.teacher}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default Schedule;