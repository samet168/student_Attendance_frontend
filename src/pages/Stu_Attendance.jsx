// import React, { useEffect, useState } from "react";
// import { Link, useSearchParams } from "react-router-dom";
// import "./Attendance.css";

// const API = "http://127.0.0.1:8000/api";

// const STATUSES = [
//   { key: "Present",    label: "វត្តមាន",  color: "present" },
//   { key: "Absent",     label: "អវត្តមាន", color: "absent"  },
//   { key: "Late",       label: "យឺត",      color: "late"    },
//   { key: "Permission", label: "មានច្បាប់", color: "perm"    },
// ];

// const STAT_CARDS = [
//   { key: "total",      label: "សរុបសិស្ស",  icon: "📊", color: "card-blue"   },
//   { key: "Present",    label: "វត្តមាន",    icon: "✅", color: "card-green"  },
//   { key: "Absent",     label: "អវត្តមាន",   icon: "❌", color: "card-red"    },
//   { key: "Late",       label: "យឺត",        icon: "⏰", color: "card-yellow" },
// ];

// const Stu_Attendance = () => {
//   const [searchParams]              = useSearchParams();
//   const classroomId                 = searchParams.get("classroom_id");
//   const subjectId                   = searchParams.get("subject_id");

//   const [students,    setStudents]  = useState([]);
//   const [statusMap,   setStatusMap] = useState({});
//   const [search,      setSearch]    = useState("");
//   const [loading,     setLoading]   = useState(false);
//   const [saving,      setSaving]    = useState(false);
//   const [toast,       setToast]     = useState(null);

//   // ✅ FIX: state សម្រាប់ subject name
//   const [subjectName, setSubjectName] = useState("—");

//   /* ── auth headers ── */
//   const getHeaders = () => {
//     const token = localStorage.getItem("token");
//     return {
//       Accept: "application/json",
//       ...(token && { Authorization: `Bearer ${token}` }),
//     };
//   };

//   /* ── load students ── */
//   const loadStudents = async () => {
//     setLoading(true);
//     try {
//       const res  = await fetch(`${API}/student?classroom_id=${classroomId}`, {
//         headers: getHeaders(),
//       });
//       const data = await res.json();
//       const list = data.data || [];

//       setStudents(list);

//       // ✅ Set default status "Present" សម្រាប់គ្រប់សិស្ស
//       const init = {};
//       list.forEach((s) => (init[s.id] = "Present"));
//       setStatusMap(init);
//     } catch (err) {
//       showToast("មិនអាចទាញទិន្នន័យបានទេ", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ FIX: load subject name ពី API
// // const loadSubjectName = async () => {
// //   if (!subjectId) return;
// //   try {
// //     const res  = await fetch(`${API}/subject/${subjectId}`, { headers: getHeaders() });
// //     const data = await res.json();
// //     console.log("📦 Subject response:", data); // debug មើល structure
// //     setSubjectName(data.data?.subject_name || data.data?.name || "—");
// //   } catch {
// //     setSubjectName("—");
// //   }
// // };

//   const loadSubjects = async () => {
//     try {
//       const res = await fetch(`${API}/subject`, {
//         headers: getHeaders(),
//       });

//       const data = await res.json();
//       setSubjects(data.data || []);
//     } catch {
//       showToast("Load subjects error", "error");
//     }
//   };

//   useEffect(() => {
//     if (classroomId) loadStudents();
//     loadSubjects();
//   }, [classroomId]);


//   // ✅ FIX: load subject name នៅពេល subjectId មាន
//   useEffect(() => {
//     if (subjectId) loadSubjectName();
//   }, [subjectId]);

//   /* ── toast helper ── */
//   const showToast = (msg, type = "success") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   /* ── change status ── */
//   const handleStatus = (studentId, value) =>
//     setStatusMap((prev) => ({ ...prev, [studentId]: value }));

//   /* ── stats ── */
//   const stats = {
//     total:      students.length,
//     Present:    Object.values(statusMap).filter((v) => v === "Present").length,
//     Absent:     Object.values(statusMap).filter((v) => v === "Absent").length,
//     Late:       Object.values(statusMap).filter((v) => v === "Late").length,
//     Permission: Object.values(statusMap).filter((v) => v === "Permission").length,
//   };

//   /* ── filtered list ── */
//   const filtered = students.filter((s) =>
//     s.name?.toLowerCase().includes(search.toLowerCase()) ||
//     (s.student_id_card || "").toLowerCase().includes(search.toLowerCase())
//   );

//   /* ── save attendance ── */
//   const handleSave = async () => {
//     if (students.length === 0) return;

//     if (!subjectId) {
//       showToast("សូមជ្រើសរើស Subject ជាមុនសិន", "error");
//       return;
//     }

//     setSaving(true);

//     const today = new Date().toISOString().split("T")[0];
//     const token = localStorage.getItem("token");

//     try {
//       for (const stu of students) {
//         const res = await fetch(`${API}/attendance`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//             ...(token && { Authorization: `Bearer ${token}` }),
//           },
//           body: JSON.stringify({
//             student_id:      stu.id,
//             classroom_id:    Number(classroomId),
//             subject_id:      Number(subjectId),
//             attendance_date: today,
//             status:          statusMap[stu.id] || "Present",
//             remarks:         "",
//           }),
//         });

//         const data = await res.json();

//         if (!res.ok) {
//           console.log("❌ API ERROR:", data);
//           throw new Error(data.message || "Save failed");
//         }
//       }

//       showToast("បានរក្សាទុកវត្តមានជោគជ័យ!", "success");
//     } catch (err) {
//       console.error(err);
//       showToast(err.message, "error");
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ════════════════ RENDER ════════════════ */
//   return (
//     <div className="att-page">

//       {/* ── Toast ── */}
//       {toast && (
//         <div className={`att-toast ${toast.type}`}>
//           {toast.type === "success" ? "✅" : "❌"} {toast.msg}
//         </div>
//       )}

//       {/* ── Page title ── */}
//       <div className="att-page-title">
//         <span className="att-page-icon">📋</span>
//         <div>
//           <h1 className="kh">វត្តមានតាមថ្នាក់</h1>
//           <p className="kh">គ្រប់គ្រងវត្តមានសិស្ស</p>
//         </div>
//       </div>

//       {/* ── Stat cards ── */}
//       <div className="att-stats">
//         {STAT_CARDS.map((c) => (
//           <div key={c.key} className={`att-stat-card ${c.color}`}>
//             <div className="att-stat-info">
//               <span className="att-stat-label">{c.label}</span>
//               <span className="att-stat-num">
//                 {c.key === "total" ? stats.total : (stats[c.key] ?? 0)}
//               </span>
//             </div>
//             <div className="att-stat-icon">{c.icon}</div>
//           </div>
//         ))}
//       </div>

//       {/* ── Main card ── */}
//       <div className="att-card">

//         {/* card header */}
//         <div className="att-card-head">
//           <h2>បញ្ជីវត្តមាន</h2>

//           <div className="att-card-controls">
//             {/* search */}
//             <div className="att-search-wrap">
//               <svg
//                 className="att-search-ico"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//               >
//                 <circle cx="11" cy="11" r="8" />
//                 <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
//               </svg>
//               <input
//                 className="att-search"
//                 type="text"
//                 placeholder="ស្វែងរកសិស្ស..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </div>

//             {/* save */}
//             <button
//               className="att-btn-save"
//               onClick={handleSave}
//               disabled={saving || students.length === 0}
//             >
//               {saving ? "⏳ កំពុងរក្សាទុក..." : "+ បន្ថែមវត្តមាន"}
//             </button>
//           </div>
//         </div>

//         {/* table */}
//               {/* 🔥 SUBJECT DROPDOWN (FIX) */}
//       <div style={{ marginBottom: 15 }}>
//         <label>Subject: </label>
//         <select
//           value={subjectId}
//           onChange={(e) => setSubjectId(e.target.value)}
//         >
//           <option value="">-- ជ្រើស Subject --</option>
//           {subjects.map((sub) => (
//             <option key={sub.id} value={sub.id}>
//               {sub.subject_name}
//             </option>
//           ))}
//         </select>
//       </div>
//         <div className="att-table-wrap">
//           <table className="att-table">
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>លេខសិស្ស</th>
//                 <th>ឈ្មោះ</th>
//                 <th>ថ្នាក់</th>
//                 <th>មុខវិជ្ជា</th>
//                 <th>ស្ថានភាព</th>
//                 <th>ជ្រើសរើសស្ថានភាព</th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={7} className="att-state-cell">
//                     <div className="att-spinner" />
//                     <p>កំពុងផ្ទុក...</p>
//                   </td>
//                 </tr>
//               ) : filtered.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="att-state-cell">
//                     <div className="att-empty-img">📭</div>
//                     <p>មិនមានទិន្នន័យ</p>
//                   </td>
//                 </tr>
//               ) : (
//                 filtered.map((s, i) => (
//                   <tr key={s.id}>
//                     {/* # */}
//                     <td className="att-td-num">{i + 1}</td>

//                     {/* Student ID */}
//                     <td>
//                       <span className="att-id-badge">
//                         {s.student_id_card || `STU${String(s.id).padStart(3, "0")}`}
//                       </span>
//                     </td>

//                     {/* Name */}
//                     <td className="kh">{s.name || "—"}</td>

//                     {/* ✅ FIX: Classroom — ពី relationship (បន្ទាប់ from with('classroom') in Laravel) */}
//                     <td className="kh">{s.classroom?.name || "—"}</td>

//                     {/* ✅ FIX: Subject — ពី subjectName state */}
//                     <td className="kh">{subjectName}</td>

//                     {/* Status badge */}
//                     <td>
//                       <span className={`att-status-badge ${(statusMap[s.id] || "present").toLowerCase()}`}>
//                         {STATUSES.find((st) => st.key === statusMap[s.id])?.label || "វត្តមាន"}
//                       </span>
//                     </td>

//                     {/* Radio actions */}
//                     <td>
//                       <div className="att-radios">
//                         {STATUSES.map((st) => (
//                           <label
//                             key={st.key}
//                             className={`att-radio-label ${st.color} ${
//                               statusMap[s.id] === st.key ? "active" : ""
//                             }`}
//                           >
//                             <input
//                               type="radio"
//                               name={`status-${s.id}`}
//                               value={st.key}
//                               checked={statusMap[s.id] === st.key}
//                               onChange={() => handleStatus(s.id, st.key)}
//                             />
//                             {st.label}
//                           </label>
//                         ))}
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* footer */}
//         {students.length > 0 && (
//           <div className="att-card-foot">
//             <span className="kh">
//               សរុបសិស្ស <strong>{filtered.length}</strong> នាក់
//             </span>

//             <button
//               className="att-btn-save"
//               onClick={handleSave}
//               disabled={saving}
//             >
//               {saving ? "⏳ កំពុងរក្សាទុក..." : "💾 រក្សាទុកវត្តមាន"}
//             </button>

//             <Link
//               to={`/attendance/view?classroom_id=${classroomId}`}
//               className="att-btn-view"
//             >
//               📊 មើលវត្តមាន
//             </Link>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Stu_Attendance;


import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./Attendance.css";

const API = "http://127.0.0.1:8000/api";

const STATUSES = [
  { key: "Present",    label: "វត្តមាន",  color: "present" },
  { key: "Absent",     label: "អវត្តមាន", color: "absent"  },
  { key: "Late",       label: "យឺត",      color: "late"    },
  { key: "Permission", label: "មានច្បាប់", color: "perm"    },
];

const STAT_CARDS = [
  { key: "total",      label: "សរុបសិស្ស",  icon: "📊", color: "card-blue"   },
  { key: "Present",    label: "វត្តមាន",    icon: "✅", color: "card-green"  },
  { key: "Absent",     label: "អវត្តមាន",   icon: "❌", color: "card-red"    },
  { key: "Late",       label: "យឺត",        icon: "⏰", color: "card-yellow" },
];

const Stu_Attendance = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const classroomId = searchParams.get("classroom_id");
  
  // ✅ បង្កើត State សម្រាប់គ្រប់គ្រង subjectId ជំនួសឱ្យការប្រើ searchParams ផ្ទាល់
  const [subjectId, setSubjectId] = useState(searchParams.get("subject_id") || "");

  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]); // ✅ បន្ថែម state សម្រាប់បញ្ជីមុខវិជ្ជា
  const [statusMap, setStatusMap] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
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
    } catch (err) {
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
    if (classroomId) loadStudents();
    loadSubjectsList();
  }, [classroomId]);

  // នៅពេល subjectId ឬ បញ្ជីមុខវិជ្ជាផ្លាស់ប្តូរ ឱ្យវា update ឈ្មោះបង្ហាញក្នុងតារាង
  useEffect(() => {
    updateSubjectName();
  }, [subjectId, subjects]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatus = (studentId, value) =>
    setStatusMap((prev) => ({ ...prev, [studentId]: value }));

  const stats = {
    total: students.length,
    Present: Object.values(statusMap).filter((v) => v === "Present").length,
    Absent: Object.values(statusMap).filter((v) => v === "Absent").length,
    Late: Object.values(statusMap).filter((v) => v === "Late").length,
    Permission: Object.values(statusMap).filter((v) => v === "Permission").length,
  };

  const filtered = students.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    (s.student_id_card || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (students.length === 0) return;
    if (!subjectId) {
      showToast("សូមជ្រើសរើសមុខវិជ្ជាជាមុនសិន", "error");
      return;
    }

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
            classroom_id: Number(classroomId),
            subject_id: Number(subjectId),
            attendance_date: today,
            status: statusMap[stu.id] || "Present",
            remarks: "",
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Save failed");
        }
      }
      showToast("បានរក្សាទុកវត្តមានជោគជ័យ!", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
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
        <span className="att-page-icon">📋</span>
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
             {/* 🔥 Subject Dropdown Design */}
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
              {saving ? "⏳ កំពុងរក្សាទុក..." : "💾 រក្សាទុកវត្តមាន"}
            </button>

            <Link
              to={`/attendance/view?classroom_id=${classroomId}`}
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