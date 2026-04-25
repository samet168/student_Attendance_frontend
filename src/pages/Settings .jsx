import { useState } from "react";

const Settings = () => {
  const [name, setName] = useState("មឿន សាម៉េត");
  // eslint-disable-next-line no-unused-vars
  const [id, setId] = useState("STU56789");
  const [email, setEmail] = useState("samet@school.edu.kh");
  const [notify, setNotify] = useState(true);
  const [lang, setLang] = useState("km");

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "10px",
    border: "1.5px solid #e2e8f0", outline: "none",
    fontSize: "14px", color: "#334155", background: "#f8fafc",
    fontFamily: "'Noto Sans Khmer', sans-serif", boxSizing: "border-box",
  };

  const labelStyle = { fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "6px", display: "block" };

  return (
    <div style={{ padding: "28px 24px", fontFamily: "'Noto Sans Khmer', sans-serif", backgroundColor: "#f4f7fb", minHeight: "calc(100vh - 64px)" }}>
      <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#1e293b", marginBottom: "20px" }}>
        និងការកំណត់
      </h2>

      <div style={{ maxWidth: "600px", display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Profile card */}
        <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#1e293b", marginBottom: "20px", borderBottom: "1.5px solid #f1f5f9", paddingBottom: "10px" }}>
            ព័ត៌មានផ្ទាល់ខ្លួន
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={labelStyle}>ឈ្មោះ</label>
              <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>លេខសំគាល់</label>
              <input style={{ ...inputStyle, backgroundColor: "#f1f5f9", color: "#94a3b8" }} value={id} readOnly />
            </div>
            <div>
              <label style={labelStyle}>អ៊ីមែល</label>
              <input style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Preferences card */}
        <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#1e293b", marginBottom: "20px", borderBottom: "1.5px solid #f1f5f9", paddingBottom: "10px" }}>
            ការកំណត់ទូទៅ
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>ការជូនដំណឹង</div>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>ទទួលការជូនដំណឹងលើវត្តមាន</div>
              </div>
              <div
                onClick={() => setNotify(!notify)}
                style={{
                  width: "44px", height: "24px", borderRadius: "12px",
                  backgroundColor: notify ? "#1a56c4" : "#e2e8f0",
                  position: "relative", cursor: "pointer", transition: "background 0.2s",
                }}
              >
                <div style={{
                  width: "18px", height: "18px", borderRadius: "50%", backgroundColor: "#fff",
                  position: "absolute", top: "3px",
                  left: notify ? "23px" : "3px", transition: "left 0.2s",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                }} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>ភាសា</label>
              <select value={lang} onChange={e => setLang(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="km">ខ្មែរ</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save button */}
        <button
          style={{
            backgroundColor: "#1a56c4", color: "#fff", border: "none",
            borderRadius: "12px", padding: "13px 0", fontSize: "15px",
            fontWeight: "700", cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 4px 12px rgba(26,86,196,0.3)", transition: "background 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#1546a8"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#1a56c4"}
        >
          រក្សាទុកការផ្លាស់ប្ដូរ
        </button>
      </div>
    </div>
  );
};

export default Settings;