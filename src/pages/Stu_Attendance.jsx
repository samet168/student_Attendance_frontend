
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./Attendance.css";

/* ── API config ── */
const API = "http://127.0.0.1:8000/api";

/* ── Status config ── */
const STATUSES = [
  { key: "Present",    label: "វត្តមាន",  color: "present" },
  { key: "Absent",     label: "អវត្តមាន", color: "absent"  },
  { key: "Late",       label: "យឺត",      color: "late"    },
  { key: "Permission", label: "មានច្បាប់", color: "perm"    },
];

/* ── Stat cards config ── */
const STAT_CARDS = [
  { key: "total",      label: "សរុបសិស្ស",  icon: "📊", color: "card-blue"   },
  { key: "Present",    label: "វត្តមាន",    icon: "✅", color: "card-green"  },
  { key: "Absent",     label: "អវត្តមាន",   icon: "❌", color: "card-red"    },
  { key: "Late",       label: "យឺត",        icon: "⏰", color: "card-yellow" },
];

/* ═══════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════ */
const Stu_Attendance = () => {
  const [searchParams]            = useSearchParams();
  const classroomId               = searchParams.get("classroom_id");
  const subjectId                 = searchParams.get("subject_id");

  const [students,  setStudents]  = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [search,    setSearch]    = useState("");
  const [loading,   setLoading]   = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [toast,     setToast]     = useState(null); // { msg, type }

  /* ── auth headers ── */
  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  /* ── load students ── */
  const loadStudents = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/student?classroom_id=${classroomId}`, {
        headers: getHeaders(),
      });
      const data = await res.json();
      const list = data.data || [];
      setStudents(list);
      // default everyone to Present
      const init = {};
      list.forEach((s) => { init[s.id] = "Present"; });
      setStatusMap(init);
    } catch {
      showToast("មិនអាចទាញទិន្នន័យបានទេ", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classroomId) loadStudents();
  }, [classroomId]);

  /* ── toast helper ── */
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── change status ── */
  const handleStatus = (studentId, value) =>
    setStatusMap((prev) => ({ ...prev, [studentId]: value }));

  /* ── stats ── */
  const stats = {
    total:      students.length,
    Present:    Object.values(statusMap).filter((v) => v === "Present").length,
    Absent:     Object.values(statusMap).filter((v) => v === "Absent").length,
    Late:       Object.values(statusMap).filter((v) => v === "Late").length,
    Permission: Object.values(statusMap).filter((v) => v === "Permission").length,
  };

  /* ── filtered list ── */
  const filtered = students.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    (s.student_id_card || "").toLowerCase().includes(search.toLowerCase())
  );


const handleSave = async () => {
  if (students.length === 0) return;

  setSaving(true);

  const today = new Date().toISOString().split("T")[0];
  const token = localStorage.getItem("token");

  try {
    for (const stu of students) {
      const res = await fetch(`${API}/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          student_id: stu.id,
          classroom_id: classroomId,   // 🔥 MUST
          subject_id: subjectId || 1,  // fallback safe
          attendance_date: today,
          status: statusMap[stu.id] || "Present",
          remarks: "",
        }),
      });

      // 🔥 IMPORTANT DEBUG (fix HTML error)
      const contentType = res.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        const html = await res.text();
        console.log("❌ HTML RESPONSE:", html);
        throw new Error("Server error (not JSON)");
      }

      const data = await res.json();

      if (!res.ok) {
        console.log("❌ API ERROR:", data);
        throw new Error(data.message || "Save failed");
      }
    }

    showToast("បានរក្សាទុកវត្តមាន!", "success");

  } catch (err) {
    console.error(err);
    showToast(err.message, "error");
  } finally {
    setSaving(false);
  }
};
  /* ════════════════ RENDER ════════════════ */
  return (
    <div className="att-page">

      {/* ── Toast ── */}
      {toast && (
        <div className={`att-toast ${toast.type}`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}

      {/* ── Page title ── */}
      <div className="att-page-title">
        <span className="att-page-icon">📋</span>
        <div>
          <h1 className="kh">វត្តមានតាមថ្នាក់</h1>
          <p className="kh">គ្រប់គ្រងវត្តមានសិស្ស</p>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="att-stats">
        {STAT_CARDS.map((c) => (
          <div key={c.key} className={`att-stat-card ${c.color}`}>
            <div className="att-stat-info">
              <span className="att-stat-label">{c.label}</span>
              <span className="att-stat-num">
                {c.key === "total" ? stats.total : (stats[c.key] ?? 0)}
              </span>
            </div>
            <div className="att-stat-icon">{c.icon}</div>
          </div>
        ))}
      </div>

      {/* ── Main card ── */}
      <div className="att-card">

        {/* card header */}
        <div className="att-card-head">
          <h2>បញ្ជីវត្តមាន</h2>

          <div className="att-card-controls">
            {/* search */}
            <div className="att-search-wrap">
              <svg
                className="att-search-ico"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
              <input
                className="att-search"
                type="text"
                placeholder="ស្វែងរកសិស្ស..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* save */}
            <button
              className="att-btn-save"
              onClick={handleSave}
              disabled={saving || students.length === 0}
            >
              {saving ? "⏳ កំពុងរក្សាទុក..." : "+ បន្ថែមវត្តមាន"}
            </button>
          </div>
        </div>

        {/* table */}
        <div className="att-table-wrap">
          <table className="att-table">
            <thead>
              <tr>
                <th>#</th>
                <th>លេខសិស្ស</th>
                <th>ឈ្មោះ</th>
                <th>ថ្នាក់</th>
                <th>ស្ថានភាព</th>
                <th>ជ្រើសរើសស្ថានភាព</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="att-state-cell">
                    <div className="att-spinner" />
                    <p>កំពុងផ្ទុក...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="att-state-cell">
                    <div className="att-empty-img">📭</div>
                    <p>មិនមានទិន្នន័យ</p>
                  </td>
                </tr>
              ) : (
                filtered.map((s, i) => (
                  <tr key={s.id}>
                    {/* # */}
                    <td className="att-td-num">{i + 1}</td>

                    {/* Student ID */}
                    <td>
                      <span className="att-id-badge">
                        {s.student_id_card || `STU${String(s.id).padStart(3, "0")}`}
                      </span>
                    </td>

                    {/* Name */}
                    <td className="kh">{s.name || "—"}</td>

                    {/* Classroom */}
                    <td className="kh">{s.classroom?.name || "—"}</td>

                    {/* Status badge */}
                    <td>
                      <span className={`att-status-badge ${statusMap[s.id]?.toLowerCase()}`}>
                        {STATUSES.find((st) => st.key === statusMap[s.id])?.label || "វត្តមាន"}
                      </span>
                    </td>

                    {/* Radio actions */}
                    <td>
                      <div className="att-radios">
                        {STATUSES.map((st) => (
                          <label
                            key={st.key}
                            className={`att-radio-label ${st.color} ${
                              statusMap[s.id] === st.key ? "active" : ""
                            }`}
                          >
                            <input
                              type="radio"
                              name={`status-${s.id}`}
                              value={st.key}
                              checked={statusMap[s.id] === st.key}
                              onChange={() => handleStatus(s.id, st.key)}
                            />
                            {st.label}
                          </label>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* footer */}
          {students.length > 0 && (
            <div className="att-card-foot">
              <span className="kh">
                សរុបសិស្ស <strong>{filtered.length}</strong> នាក់
              </span>

              <button
                className="att-btn-save"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "⏳ កំពុងរក្សាទុក..." : "💾 រក្សាទុកវត្តមាន"}
              </button>

              <Link
                to={`/attendance/count?classroom_id=${classroomId}`}
                className="att-btn-view"
              >
                📊 មើលវត្តមាន
              </Link>
            </div>
          )}
      </div>
    </div>
  );
};

export default Stu_Attendance;