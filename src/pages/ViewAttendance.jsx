
import { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import "./Attendance.css";

const API = "http://127.0.0.1:8000/api";

const STATUSES = [
  { key: "", label: "ទាំងអស់" },
  { key: "Present", label: "វត្តមាន" },
  { key: "Absent", label: "អវត្តមាន" },
  { key: "Late", label: "យឺត" },
  { key: "Permission", label: "មានច្បាប់" },
];

const cardColor = (s) => ({
  Present: "card-green", 
  Absent: "card-red",
  Late: "card-yellow", 
  Permission: "card-blue",
}[s] || "card-blue");

const ViewAttendance = () => {
  const [searchParams] = useSearchParams();
  const classroomId = searchParams.get("classroom_id");

  const [records, setRecords] = useState([]);
  const [countMap, setCountMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [subjects, setSubjects] = useState([]);
  const [sortSubject, setSortSubject] = useState("");

  const token = localStorage.getItem("token");

  // =====================
  // FETCH ATTENDANCE DATA
  // =====================
  const fetchData = async (p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        classroom_id: classroomId,
        page: p,
      });

     if (date) params.append("date", date);
      if (status) params.append("status", status);
      if (search) params.append("search", search);
      if (sortSubject) params.append("subject_id", sortSubject);

      const res = await fetch(`${API}/attendance/list?${params}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      setRecords(json.data?.data || []);
      setCountMap(json.count_map || {});
      setMeta(json.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // FETCH SUBJECTS
  // =====================
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch(`${API}/subject`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        setSubjects(json.data || []);
      } catch (err) {
        console.error("Subject Fetch Error:", err);
      }
    };
    fetchSubjects();
  }, [token]);

  // =====================
  // AUTO FETCH ON CHANGE
  // =====================
  useEffect(() => {
    if (classroomId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchData(page);
    }
  }, [classroomId, date, status, page, sortSubject]);

  

  const subjectOptions = [
    { id: "", subject_name: "គ្រប់មុខវិជ្ជា" },
    ...subjects,
  ];

  // ✅ Stat cards គណនាពី countMap (UI ទី ២)
  const stats = useMemo(() => {
    const totals = { Present: 0, Absent: 0, Late: 0, Permission: 0 };
    Object.values(countMap).forEach((c) => {
      totals.Present     += Number(c.present     ?? 0);
      totals.Absent      += Number(c.absent      ?? 0);
      totals.Late        += Number(c.late        ?? 0);
      totals.Permission  += Number(c.permission  ?? 0);
    });
    return STATUSES.slice(1).map((st) => ({ ...st, count: totals[st.key] ?? 0 }));
  }, [countMap]);

  return (
    <div className="att-page">
      {/* 1. TITLE SECTION (UI ទី ២) */}
      <div className="att-page-title">
        {/* <span className="att-page-icon">📊</span> */}
        <div>
          <h1 className="kh">វត្តមានតាមថ្នាក់</h1>
          <p className="kh">របាយការណ៍សរុប និងបញ្ជីវត្តមានលម្អិត</p>
        </div>
      </div>

      {/* 2. STAT CARDS SECTION (UI ទី ២) */}
      <div className="att-stats">
        <div className="att-stat-card card-blue">
          <div className="att-stat-info">
            <span className="att-stat-label kh">សរុបសិស្ស</span>
            <span className="att-stat-num">{meta?.total ?? 0}</span>
          </div>
          {/* <div className="att-stat-icon">📋</div> */}
        </div>
        {stats.map((st) => (
          <div key={st.key} className={`att-stat-card ${cardColor(st.key)}`}>
            <div className="att-stat-info">
              <span className="att-stat-label kh">{st.label}</span>
              <span className="att-stat-num">{st.count}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. MAIN TABLE CARD (UI ទី ២) */}
      <div className="att-card">
        <div className="att-card-head">
          <h2 className="kh">បញ្ជីវត្តមាន</h2>
          <div className="att-card-controls">
            
            {/* Search Form */}
  

            {/* Date Picker */}
            {/* <input
              type="date"
              className="att-search"
              value={date}
              onChange={(e) => { setDate(e.target.value); setPage(1); }}
            /> */}

        <select
          className="att-select"
          value={sortSubject}
          onChange={(e) => {
            setSortSubject(e.target.value);
            setPage(1);
          }}
        >
          {subjectOptions.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.subject_name || sub.name}
            </option>
          ))}
        </select>

            <Link to={`/attendance?classroom_id=${classroomId}`} className="att-btn-view" style={{textDecoration: "none",color: "#c70d0d"}}>
              ← ត្រឡប់ក្រោយ
            </Link>
          </div>
        </div>

        {/* 4. DATA TABLE (UI ទី ២) */}
        <div className="att-table-wrap">
          <table className="att-table">
            <thead>
              <tr>
                <th>#</th>
                <th>អត្តលេខ</th>
                <th>ឈ្មោះសិស្ស</th>
                <th>ថ្នាក់រៀន</th>
                <th style={{ color: "#16a34a", textAlign: "center" }}>វត្តមាន</th>
                <th style={{ color: "#dc2626", textAlign: "center" }}>អវត្តមាន</th>
                <th style={{ color: "#d97706", textAlign: "center" }}>យឺត</th>
                <th style={{ color: "#2563eb", textAlign: "center" }}>មានច្បាប់</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="att-state-cell">
                    <div className="att-spinner" />
                    <p className="kh">កំពុងផ្ទុកទិន្នន័យ...</p>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={8} className="att-state-cell">
                    {/* <div className="att-empty-img">📭</div> */}
                    <p className="kh">មិនមានទិន្នន័យសម្រាប់ស្វែងរកទេ</p>
                  </td>
                </tr>
              ) : (
                records.map((student, i) => {
                  const c = countMap[student.id] || {};
                  return (
                    <tr key={student.id}>
                      <td className="att-td-num">
                        {(meta?.current_page - 1) * meta?.per_page + i + 1}
                      </td>
                      <td>
                        <span className="att-id-badge">
                          {student.student_id_card || `STU${String(student.id).padStart(3, "0")}`}
                        </span>
                      </td>
                      <td className="kh">{student.name}</td>
                      <td className="kh">{student.classroom?.name || "—"}</td>
                      <td style={{ textAlign: "center" }}>
                        <span className="att-status-badge present">{Number(c.present ?? 0)} ដង</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span className="att-status-badge absent">{Number(c.absent ?? 0)} ដង</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span className="att-status-badge late">{Number(c.late ?? 0)} ដង</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span className="att-status-badge perm">{Number(c.permission ?? 0)} ដង</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 5. PAGINATION (UI ទី ២) */}
        {meta && meta.last_page > 1 && (
          <div className="att-card-foot">
            <span className="kh">
              ទំព័រ <strong>{meta.current_page}</strong> នៃ {meta.last_page} 
              (សរុប <strong>{meta.total}</strong> សិស្ស)
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className="att-btn-view"
                disabled={meta.current_page <= 1}
                onClick={() => { setPage(page - 1); }}
              >
                ← មុន
              </button>
              <button
                className="att-btn-save"
                disabled={meta.current_page >= meta.last_page}
                onClick={() => { setPage(page + 1); }}
              >
                បន្ទាប់ →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAttendance;