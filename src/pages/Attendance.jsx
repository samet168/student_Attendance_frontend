import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import API_URL from "../Api/api";
import "../assets/style/Attendance.css";
import AddAttendance from "./CRUD_Attendance/AddAttendance";
import EditAttendance from "./CRUD_Attendance/EditAttendance";

// ── Status helpers (ត្រូវនឹង backend) ────────────────────────────────────
const STATUS_MAP = {
  Present:    { label: "✅ មានវត្តមាន", cls: "att-badge--present" },
  Absent:     { label: "❌ អវត្តមាន",   cls: "att-badge--absent"  },
  Late:       { label: "⏰ មកយឺត",     cls: "att-badge--late"    },
  Permission: { label: "📄 សុំច្បាប់",  cls: "att-badge--leave"   },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_MAP[status] ?? { label: status || "–", cls: "" };
  return <span className={`att-badge ${s.cls}`}>{s.label}</span>;
};

const formatDate = (d) => {
  if (!d) return "–";
  return new Date(d).toLocaleDateString("km-KH", {
    year: "numeric", month: "short", day: "numeric",
  });
};

// ── Main Component ────────────────────────────────────
const Attendance = () => {
  const [searchParams] = useSearchParams();
  const classroomIdFromUrl = searchParams.get("classroom_id");

  const [records, setRecords]   = useState([]);
  const [classrooms, setClassrooms] = useState([]); // ដើម្បីបង្ហាញឈ្មោះថ្នាក់
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showAdd, setShowAdd]   = useState(false);
  const [editId, setEditId]     = useState(null);

  // ── Fetch Attendance + Classrooms ──
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [attRes, classRes] = await Promise.all([
        API_URL.get("/attendance", { headers }),
        API_URL.get("/classroom", { headers })
      ]);

      setRecords(attRes.data?.data ?? []);
      setClassrooms(classRes.data?.data ?? []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter by classroom_id from URL (if exists)
  const filteredByClass = useMemo(() => {
    if (!classroomIdFromUrl) return records;
    return records.filter(r => String(r.classroom_id || r.classroom?.id) === classroomIdFromUrl);
  }, [records, classroomIdFromUrl]);

  // ── Delete ──
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await API_URL.delete(`/attendance/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords((prev) => prev.filter((r) => r.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      alert("មានបញ្ហាក្នុងការលុប!");
    } finally {
      setDeleting(false);
    }
  };

  // ── Stats (use filtered data) ──
  const present = filteredByClass.filter((r) => r.status === "Present").length;
  const absent  = filteredByClass.filter((r) => r.status === "Absent").length;
  const late    = filteredByClass.filter((r) => r.status === "Late").length;
  const total   = filteredByClass.length;

  // ── Final Filter with search ──
  const filtered = useMemo(() =>
    filteredByClass.filter((r) =>
      (r.student?.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (r.classroom?.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (r.status ?? "").toLowerCase().includes(search.toLowerCase())
    ),
    [filteredByClass, search]
  );

  const currentClassName = classrooms.find(c => String(c.id) === classroomIdFromUrl)?.name || "";

  const deleteName = records.find((r) => r.id === deleteId)?.student?.name ?? "";

  return (
    <div className="att-page">
      {/* Header */}
      <div className="att-header">
        <div>
          <h2 className="att-header__title">
            📋 វត្តមាន {classroomIdFromUrl && currentClassName && <span>- {currentClassName}</span>}
          </h2>
          <p className="att-header__sub">
            {classroomIdFromUrl ? "វត្តមានតាមថ្នាក់" : "ត្រួតពិនិត្យវត្តមានសិស្សទាំងអស់"}
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="att-stats">
        <div className="att-stat att-stat--blue">
          <div>
            <div className="att-stat__label">សរុប</div>
            <div className="att-stat__value">{loading ? "..." : total}</div>
          </div>
          <div className="att-stat__icon">📊</div>
        </div>
        <div className="att-stat att-stat--green">
          <div>
            <div className="att-stat__label">វត្តមាន</div>
            <div className="att-stat__value">{loading ? "..." : present}</div>
          </div>
          <div className="att-stat__icon">✅</div>
        </div>
        <div className="att-stat att-stat--red">
          <div>
            <div className="att-stat__label">អវត្តមាន</div>
            <div className="att-stat__value">{loading ? "..." : absent}</div>
          </div>
          <div className="att-stat__icon">❌</div>
        </div>
        <div className="att-stat att-stat--yellow">
          <div>
            <div className="att-stat__label">មកយឺត</div>
            <div className="att-stat__value">{loading ? "..." : late}</div>
          </div>
          <div className="att-stat__icon">⏰</div>
        </div>
      </div>

      {/* Table Card */}
      <div className="att-card">
        <div className="att-card__header">
          <h3 className="att-card__title">បញ្ជីវត្តមាន</h3>
          <div className="att-controls">
            <input
              type="text"
              className="att-search"
              placeholder="🔍 ស្វែងរកសិស្ស..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button 
              className="att-add-btn" 
              onClick={() => setShowAdd(true)}
            >
              + បន្ថែមវត្តមាន
            </button>
          </div>
        </div>

        <div className="att-table-wrap">
          <table className="att-table">
            <thead>
              <tr>
                {["#", "ឈ្មោះសិស្ស", "ថ្នាក់", "កាលបរិច្ឆេទ", "ម៉ោងចូល", "ម៉ោងចេញ", "ស្ថានភាព", "Actions"].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={row.id}>
                  <td className="td-num">{i + 1}</td>
                  <td className="td-name">{row.student?.name ?? "–"}</td>
                  <td className="td-class">{row.classroom?.name ?? "–"}</td>
                  <td className="td-date">{formatDate(row.attendance_date || row.date)}</td>
                  <td className="td-time">{row.time_in ?? "–"}</td>
                  <td className="td-time">{row.time_out ?? "–"}</td>
                  <td><StatusBadge status={row.status} /></td>
                  <td>
                    <div className="att-actions">
                      <button className="att-btn-edit" onClick={() => setEditId(row.id)}>
                        ✏️ កែ
                      </button>
                      <button 
                        className="att-btn-delete" 
                        onClick={() => setDeleteId(row.id)}
                        disabled={deleting}
                      >
                        🗑 លុប
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length === 0 && (
          <div className="att-empty">
            <div className="att-empty__icon">📭</div>
            <div className="att-empty__text">រកមិនឃើញទិន្នន័យ</div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAdd && (
        <AddAttendance
          onClose={() => setShowAdd(false)}
          onSuccess={(msg) => {
            alert(msg);
            fetchData();
          }}
        />
      )}

      {editId && (
        <EditAttendance
          id={editId}
          onClose={() => setEditId(null)}
          onSuccess={(msg) => {
            alert(msg);
            fetchData();
            setEditId(null);
          }}
        />
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="att-modal-overlay" onClick={() => !deleting && setDeleteId(null)}>
          <div className="att-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="att-modal-icon">🗑</div>
            <h3 className="att-modal-title">បញ្ជាក់ការលុប</h3>
            <p className="att-modal-desc">
              តើអ្នកពិតជាចង់លុបវត្តមានរបស់ <strong>{deleteName}</strong> មែនទេ?<br />
              ការលុបនេះមិនអាចត្រឡប់វិញបានទេ!
            </p>
            <div className="att-modal-actions">
              <button className="att-modal-cancel" onClick={() => setDeleteId(null)} disabled={deleting}>
                បោះបង់
              </button>
              <button className="att-modal-confirm" onClick={handleDelete} disabled={deleting}>
                {deleting ? "កំពុងលុប..." : "លុបចោល"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;