


// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import API_URL from "../Api/api";
import "../assets/style/Attendance.css";

const API = "http://127.0.0.1:8000/api";

const STATUSES = [
  { key: "Present",    label: "វត្តមាន",  color: "present" },
  { key: "Absent",     label: "អវត្តមាន", color: "absent"  },
  { key: "Late",       label: "យឺត",      color: "late"    },
  { key: "Permission", label: "មានច្បាប់", color: "perm"    },
];

// eslint-disable-next-line no-unused-vars
const STAT_CARDS = [
  { key: "total",      label: "សរុបសិស្ស",  icon: "📊", color: "card-blue"   },
  { key: "Present",    label: "វត្តមាន",    icon: "✅", color: "card-green"  },
  { key: "Absent",     label: "អវត្តមាន",   icon: "❌", color: "card-red"    },
  { key: "Late",       label: "យឺត",        icon: "⏰", color: "card-yellow" },
];

const Stu_Attendance = () => {
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const classroomId = searchParams.get("classroom_id");
  
  // ✅ បង្កើត State សម្រាប់គ្រប់គ្រង subjectId ជំនួសឱ្យការប្រើ searchParams ផ្ទាល់
  const [subjectId, setSubjectId] = useState(searchParams.get("subject_id") || "");

  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [subjectName, setSubjectName] = useState("—");

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  /* ── ទាញទិន្នន័យសិស្ស ── */
  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/student?classroom_id=${classroomId}`, {
        headers: getHeaders(),
      });
      const data = await res.json();
      const list = data.data || [];
      setStudents(list);

      const init = {};
      list.forEach((s) => (init[s.id] = "Present"));
      setStatusMap(init);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      // eslint-disable-next-line react-hooks/immutability
      showToast("មិនអាចទាញទិន្នន័យបានទេ", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ── ទាញបញ្ជីមុខវិជ្ជាទាំងអស់ ── */
  const loadSubjectsList = async () => {
    try {
      const res = await fetch(`${API}/subject`, { headers: getHeaders() });
      const data = await res.json();
      setSubjects(data.data || []);
    } catch {
      showToast("Load subjects error", "error");
    }
  };

  /* ── ទាញឈ្មោះមុខវិជ្ជាដែលកំពុងរើស ── */
  const updateSubjectName = () => {
    const selected = subjects.find(s => String(s.id) === String(subjectId));
    setSubjectName(selected ? selected.subject_name : "—");
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (classroomId) loadStudents();
    loadSubjectsList();
  }, [classroomId]);

  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    updateSubjectName();
  }, [subjectId, subjects]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatus = (studentId, value) =>
    setStatusMap((prev) => ({ ...prev, [studentId]: value }));

  

  const filtered = students.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    (s.student_id_card || "").toLowerCase().includes(search.toLowerCase())
  );

const handleSave = async () => {
  if (!classroomId || !subjectId) {
    showToast("សូមជ្រើស classroom និង subject", "error");
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  try {
    for (const stu of students) {
      const form = {
        student_id: stu.id,
        classroom_id: classroomId,  
        subject_id: subjectId,     
        attendance_date: today,
        status: (statusMap[stu.id] || "Present").toLowerCase(),
        remarks: "",
      };

      console.log("SEND:", form);

      await API_URL.post("/attendance", form);
    }

    showToast("បានរក្សាទុកជោគជ័យ", "success");
  } catch (err) {
    console.log(err.response?.data);
    showToast("មានបញ្ហា", "error");
  }
};

  return (
    <div className="att-page">
      {toast && (
        <div className={`att-toast ${toast.type}`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}

      <div className="att-page-title">
        {/* <span className="att-page-icon">📋</span> */}
        <div>
          <h1 className="kh">វត្តមានតាមថ្នាក់</h1>
          <p className="kh">គ្រប់គ្រងវត្តមានសិស្ស</p>
        </div>
      </div>

      {/* Stats Cards... (រក្សាទុកដដែល) */}

      <div className="att-card">
        <div className="att-card-head">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
             <h2 className="kh">បញ្ជីវត្តមាន</h2>
            
             <div className="att-subject-select-wrap">
                <label className="kh">មុខវិជ្ជា៖ </label>
                <select
                  className="att-select kh"
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                >
                  <option value="">-- ជ្រើសរើសមុខវិជ្ជា --</option>
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.subject_name}
                    </option>
                  ))}
                </select>
             </div>
          </div>

          <div className="att-card-controls">
            <div className="att-search-wrap">
              <input
                className="att-search"
                type="text"
                placeholder="ស្វែងរកសិស្ស..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              className="att-btn-save"
              onClick={handleSave}
              disabled={saving || students.length === 0}
            >
              {saving ? "⏳ កំពុងរក្សាទុក..." : "+ បន្ថែមវត្តមាន"}
            </button>
          </div>
        </div>

        <div className="att-table-wrap">
          <table className="att-table">
            <thead>
              <tr>
                <th>#</th>
                <th>លេខសិស្ស</th>
                <th>ឈ្មោះ</th>
                <th>ថ្នាក់</th>
                <th>មុខវិជ្ជា</th>
                <th>ស្ថានភាព</th>
                <th>ជ្រើសរើសស្ថានភាព</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="att-state-cell">កំពុងផ្ទុក...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="att-state-cell">មិនមានទិន្នន័យ</td></tr>
              ) : (
                filtered.map((s, i) => (
                  <tr key={s.id}>
                    <td className="att-td-num">{i + 1}</td>
                    <td><span className="att-id-badge">{s.student_id_card || s.id}</span></td>
                    <td className="kh">{s.name}</td>
                    <td className="kh">{s.classroom?.name || "—"}</td>
                    <td className="kh" style={{ color: '#007bff', fontWeight: 'bold' }}>{subjectName}</td>
                    <td>
                      <span className={`att-status-badge ${(statusMap[s.id] || "present").toLowerCase()}`}>
                        {STATUSES.find((st) => st.key === statusMap[s.id])?.label || "វត្តមាន"}
                      </span>
                    </td>
                    <td>
                      <div className="att-radios">
                        {STATUSES.map((st) => (
                          <label key={st.key} className={`att-radio-label ${st.color} ${statusMap[s.id] === st.key ? "active" : ""}`}>
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
              {saving ? "⏳ កំពុងរក្សាទុក..." : "រក្សាទុកវត្តមាន"}
            </button>

            <Link
              to={`/attendance/view?classroom_id=${classroomId}`}
              className="att-btn-view"
              style={{textDecoration: "none"}}
            >
              មើលវត្តមាន
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stu_Attendance;