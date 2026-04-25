import { useState, useMemo } from "react";
import "../assets/style/Class.css";

// ── Helpers ───────────────────────────────────────────────
const today = new Date().toLocaleDateString("km-KH", {
  weekday: "long", year: "numeric", month: "long", day: "numeric",
});

const COLORS = [
  "#1a56c4","#8b5cf6","#f59e0b","#10b981",
  "#ef4444","#06b6d4","#ec4899","#0ea5e9",
  "#22c55e","#f97316","#6366f1","#14b8a6",
];

// ── Mock Data ─────────────────────────────────────────────
const CLASSES = [
  {
    id: 1,
    name: "ថ្នាក់ទី ១A",
    grade: "Grade 1",
    subject: "គណិតវិទ្យា & វិទ្យាសាស្ត្រ",
    teacher: "លោក ចន្ទ",
    teacherInitial: "ចន",
    teacherColor: "#1a56c4",
    room: "បន្ទប់ 101",
    time: "7:00 - 9:00",
    days: "ច-ព-ស",
    maxStudents: 35,
    stripe: "linear-gradient(90deg,#1a56c4,#3b82f6)",
    gradeColor: "#dbeafe", gradeText: "#1a56c4",
    bannerGradient: "linear-gradient(135deg,#1a56c4 0%,#3b82f6 100%)",
    students: [
      { id:"S001", name:"ស្រីនាត ចន្ទ" },
      { id:"S002", name:"ដារ៉ា សុខ" },
      { id:"S003", name:"លីណា ប៉ែន" },
      { id:"S004", name:"វិចិត្រ ហេង" },
      { id:"S005", name:"ចន្ទបូរណ៌ ម៉ៅ" },
      { id:"S006", name:"រស្មី គឹម" },
      { id:"S007", name:"ពិសាល នូ" },
      { id:"S008", name:"មករា ហោ" },
      { id:"S009", name:"ប៊ុនធឿន លី" },
      { id:"S010", name:"ហួត ស្រីនី" },
    ],
  },
  {
    id: 2,
    name: "ថ្នាក់ទី ២B",
    grade: "Grade 2",
    subject: "ភាសាខ្មែរ & សិល្បៈ",
    teacher: "លោកស្រី ស្រីពេជ្រ",
    teacherInitial: "ស្រ",
    teacherColor: "#8b5cf6",
    room: "បន្ទប់ 205",
    time: "9:00 - 11:00",
    days: "ច-ព-សៅ",
    maxStudents: 30,
    stripe: "linear-gradient(90deg,#8b5cf6,#a78bfa)",
    gradeColor: "#ede9fe", gradeText: "#8b5cf6",
    bannerGradient: "linear-gradient(135deg,#7c3aed 0%,#a78bfa 100%)",
    students: [
      { id:"S011", name:"ស្រឹង វិជ្ជា" },
      { id:"S012", name:"ណារិន ហ" },
      { id:"S013", name:"វណ្ណ ដួង" },
      { id:"S014", name:"សុភា ចន" },
      { id:"S015", name:"ឈីណា ស" },
      { id:"S016", name:"ហ្វូ ម" },
      { id:"S017", name:"ប៊ុនណា ខ" },
    ],
  },
  {
    id: 3,
    name: "ថ្នាក់ទី ៣C",
    grade: "Grade 3",
    subject: "ភាសាអង់គ្លេស",
    teacher: "លោក ប៊ូ ម៉េង",
    teacherInitial: "ម",
    teacherColor: "#f59e0b",
    room: "Language Lab",
    time: "13:00 - 15:00",
    days: "ច-ព",
    maxStudents: 30,
    stripe: "linear-gradient(90deg,#f59e0b,#fbbf24)",
    gradeColor: "#fef3c7", gradeText: "#d97706",
    bannerGradient: "linear-gradient(135deg,#d97706 0%,#fbbf24 100%)",
    students: [
      { id:"S018", name:"ចំណេះ ម" },
      { id:"S019", name:"ស្រីនាង ហ" },
      { id:"S020", name:"ទូច ចំរើន" },
      { id:"S021", name:"ស្រីល័ក្ខ ស" },
      { id:"S022", name:"ប៊ុនថន ក" },
      { id:"S023", name:"ម៉ែន ចន្ថា" },
    ],
  },
  {
    id: 4,
    name: "ថ្នាក់ទី ៤D",
    grade: "Grade 4",
    subject: "គណិតវិទ្យា",
    teacher: "លោក វុទ្ធ ញ",
    teacherInitial: "វ",
    teacherColor: "#10b981",
    room: "បន្ទប់ 310",
    time: "7:00 - 9:00",
    days: "ព-សៅ",
    maxStudents: 30,
    stripe: "linear-gradient(90deg,#10b981,#34d399)",
    gradeColor: "#d1fae5", gradeText: "#065f46",
    bannerGradient: "linear-gradient(135deg,#059669 0%,#34d399 100%)",
    students: [
      { id:"S024", name:"ហួត ចន្ថា" },
      { id:"S025", name:"ពេជ្រ រតនា" },
      { id:"S026", name:"សសៃ ប៊ុន" },
      { id:"S027", name:"ណារ៉ា លី" },
      { id:"S028", name:"ឆ្លាត ស" },
    ],
  },
  {
    id: 5,
    name: "ថ្នាក់ទី ៥E",
    grade: "Grade 5",
    subject: "IT & កុំព្យូទ័រ",
    teacher: "លោក សុវណ្ណ ស",
    teacherInitial: "ស",
    teacherColor: "#ef4444",
    room: "Computer Lab",
    time: "15:00 - 17:00",
    days: "ច-ស-អ",
    maxStudents: 25,
    stripe: "linear-gradient(90deg,#ef4444,#f87171)",
    gradeColor: "#fee2e2", gradeText: "#991b1b",
    bannerGradient: "linear-gradient(135deg,#dc2626 0%,#f87171 100%)",
    students: [
      { id:"S029", name:"ផ្លែ ថុន" },
      { id:"S030", name:"ស្រីម៉ៅ ខ" },
      { id:"S031", name:"ឌុច ម" },
      { id:"S032", name:"វ៉ាន់ ស" },
      { id:"S033", name:"ចន ហ" },
      { id:"S034", name:"ខេង បូ" },
      { id:"S035", name:"នុយ ដ" },
    ],
  },
  {
    id: 6,
    name: "ថ្នាក់ទី ៦F",
    grade: "Grade 6",
    subject: "ពលរដ្ឋ & ភូមិវិទ្យា",
    teacher: "លោកស្រី ម៉ារីណា",
    teacherInitial: "ម",
    teacherColor: "#06b6d4",
    room: "បន្ទប់ 102",
    time: "11:00 - 13:00",
    days: "ច-ព-ស-អ",
    maxStudents: 35,
    stripe: "linear-gradient(90deg,#06b6d4,#22d3ee)",
    gradeColor: "#cffafe", gradeText: "#0e7490",
    bannerGradient: "linear-gradient(135deg,#0891b2 0%,#22d3ee 100%)",
    students: [
      { id:"S036", name:"ណេត ស" },
      { id:"S037", name:"ប្រាក់ ម" },
      { id:"S038", name:"ហ្គាល់ ច" },
      { id:"S039", name:"ល័ក្ខ ន" },
      { id:"S040", name:"ចំណុះ ហ" },
      { id:"S041", name:"ស្រីស្នេហ៍ ល" },
    ],
  },
];

// Status config
const STATUS_CONFIG = {
  present: { label: "មានមុខ",  emoji: "✓", badgeClass: "badge--present" },
  absent:  { label: "អវត្តមាន", emoji: "✗", badgeClass: "badge--absent"  },
  late:    { label: "យឺត",     emoji: "⏱", badgeClass: "badge--late"    },
  none:    { label: "—",       emoji: "—", badgeClass: "badge--none"    },
};

// ── AttendancePanel Component ─────────────────────────────
const AttendancePanel = ({ cls, onClose, onSave }) => {
  // attendance: { [studentId]: "present"|"absent"|"late"|"none" }
  const [attendance, setAttendance] = useState(() =>
    Object.fromEntries(cls.students.map((s) => [s.id, "none"]))
  );

  const mark = (id, status) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: prev[id] === status ? "none" : status,
    }));
  };

  const markAll = (status) => {
    setAttendance(Object.fromEntries(cls.students.map((s) => [s.id, status])));
  };

  const counts = useMemo(() => {
    const vals = Object.values(attendance);
    return {
      total:   cls.students.length,
      present: vals.filter((v) => v === "present").length,
      absent:  vals.filter((v) => v === "absent").length,
      late:    vals.filter((v) => v === "late").length,
    };
  }, [attendance, cls.students.length]);

  const handleSave = () => {
    onSave(cls.id, attendance);
    onClose();
  };

  return (
    <>
      <div className="panel-overlay" onClick={onClose} />
      <div className="attendance-panel">

        {/* Banner */}
        <div className="panel-banner" style={{ background: cls.bannerGradient }}>
          <button className="panel-close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <h3>ហៅឈ្មោះ — {cls.name}</h3>
          <p>{cls.subject} · {cls.room} · {cls.time}</p>
        </div>

        {/* Summary */}
        <div className="attend-summary">
          <div className="summary-cell">
            <div className="summary-val val-total">{counts.total}</div>
            <div className="summary-lbl">សិស្សទាំងអស់</div>
          </div>
          <div className="summary-cell">
            <div className="summary-val val-present">{counts.present}</div>
            <div className="summary-lbl">មានមុខ</div>
          </div>
          <div className="summary-cell">
            <div className="summary-val val-absent">{counts.absent}</div>
            <div className="summary-lbl">អវត្តមាន</div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="panel-toolbar">
          <span className="toolbar-date">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {today}
          </span>
          <div className="quick-btns">
            <button className="quick-btn quick-btn--present" onClick={() => markAll("present")}>
              ✓ ទាំងអស់
            </button>
            <button className="quick-btn quick-btn--absent" onClick={() => markAll("absent")}>
              ✗ ទាំងអស់
            </button>
          </div>
        </div>

        {/* Student List */}
        <ul className="student-list">
          {cls.students.map((s, i) => {
            const status = attendance[s.id];
            const rowClass = status !== "none" ? `student-row student-row--${status}` : "student-row";
            const avatarColor = COLORS[i % COLORS.length];

            return (
              <li key={s.id} className={rowClass}>
                <span className="s-num">{i + 1}</span>

                <div className="s-avatar" style={{ background: avatarColor }}>
                  {s.name.charAt(0)}
                </div>

                <div className="s-info">
                  <p className="s-name">{s.name}</p>
                  <span className="s-id">{s.id}</span>
                </div>

                {/* Status badge */}
                {status !== "none" && (
                  <span className={`s-status-badge ${STATUS_CONFIG[status].badgeClass}`}>
                    {STATUS_CONFIG[status].label}
                  </span>
                )}

                {/* Toggle buttons: Present / Late / Absent */}
                <div className="attend-toggle">
                  <button
                    className={`toggle-btn toggle-btn--present${status === "present" ? " t-active" : ""}`}
                    title="មានមុខ"
                    onClick={() => mark(s.id, "present")}
                  >✓</button>
                  <button
                    className={`toggle-btn toggle-btn--late${status === "late" ? " t-active" : ""}`}
                    title="យឺត"
                    onClick={() => mark(s.id, "late")}
                  >⏱</button>
                  <button
                    className={`toggle-btn toggle-btn--absent${status === "absent" ? " t-active" : ""}`}
                    title="អវត្តមាន"
                    onClick={() => mark(s.id, "absent")}
                  >✗</button>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <div className="panel-footer">
          <button className="btn btn--outline" onClick={onClose}>បោះបង់</button>
          <button className="btn btn--primary" onClick={handleSave}>
            💾 រក្សាទុក ({counts.present + counts.absent + counts.late}/{counts.total})
          </button>
        </div>
      </div>
    </>
  );
};

// ── ClassCard Component ───────────────────────────────────
const ClassCard = ({ cls, savedCount, onOpen }) => {
  const pct = Math.round((cls.students.length / cls.maxStudents) * 100);

  return (
    <div
      className="class-card"
      style={{ animationDelay: `${(cls.id - 1) * 0.07}s` }}
      onClick={() => onOpen(cls)}
    >
      <div className="class-card__stripe" style={{ background: cls.stripe }} />
      <div className="class-card__body">
        <div className="class-card__top">
          <span className="grade-badge"
            style={{ background: cls.gradeColor, color: cls.gradeText }}>
            {cls.grade}
          </span>
          {savedCount > 0 && (
            <span style={{
              fontSize: 11, fontWeight: 700, padding: "3px 10px",
              borderRadius: 20, background: "#d1fae5", color: "#065f46",
              fontFamily: "var(--font-en)",
            }}>
              ✓ ហៅហើយ
            </span>
          )}
        </div>

        <h3 className="class-card__name">{cls.name}</h3>
        <p className="class-card__subject">{cls.subject}</p>

        <div className="class-card__meta">
          <span className="meta-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {cls.time}
          </span>
          <span className="meta-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {cls.room}
          </span>
          <span className="meta-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            {cls.students.length} នាក់
          </span>
        </div>

        <div className="class-card__progress">
          <div className="progress-labels">
            <span>ចំណុះ</span><span>{pct}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill"
              style={{ width: `${pct}%`, background: cls.stripe }} />
          </div>
        </div>
      </div>

      <div className="class-card__footer" onClick={(e) => e.stopPropagation()}>
        <div className="teacher-row">
          <div className="teacher-avatar" style={{ background: cls.teacherColor }}>
            {cls.teacherInitial}
          </div>
          <span className="teacher-name">{cls.teacher}</span>
        </div>
        <button className="attend-btn" onClick={() => onOpen(cls)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <polyline points="16 11 18 13 22 9"/>
          </svg>
          ហៅឈ្មោះ
        </button>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────
const Class = () => {
  const [search, setSearch]         = useState("");
  const [openClass, setOpenClass]   = useState(null);
  const [savedData, setSavedData]   = useState({});   // { classId: attendance }
  const [toast, setToast]           = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = (classId, attendance) => {
    setSavedData((prev) => ({ ...prev, [classId]: attendance }));
    const cls = CLASSES.find((c) => c.id === classId);
    const vals = Object.values(attendance);
    const present = vals.filter((v) => v === "present").length;
    const absent  = vals.filter((v) => v === "absent").length;
    showToast(`✓ "${cls.name}" — មានមុខ ${present} | អវត្តមាន ${absent}`);
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return CLASSES;
    const q = search.toLowerCase();
    return CLASSES.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.subject.toLowerCase().includes(q) ||
      c.teacher.toLowerCase().includes(q) ||
      c.grade.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="class-page">
      {/* Header */}
      <div className="class-page__header">
        <div>
          <h2>ថ្នាក់រៀន</h2>
          <p>ចុចលើថ្នាក់ដើម្បីហៅឈ្មោះ / អវត្តមានសិស្ស</p>
        </div>
        <div className="class-page__search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="ស្វែងរកថ្នាក់..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="class-grid">
        {filtered.map((cls) => (
          <ClassCard
            key={cls.id}
            cls={cls}
            savedCount={savedData[cls.id] ? Object.keys(savedData[cls.id]).length : 0}
            onOpen={setOpenClass}
          />
        ))}
      </div>

      {/* Attendance Panel */}
      {openClass && (
        <AttendancePanel
          cls={openClass}
          onClose={() => setOpenClass(null)}
          onSave={handleSave}
        />
      )}

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
};

export default Class;