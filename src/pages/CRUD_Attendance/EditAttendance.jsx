import { useState, useEffect } from "react";
import API_URL from "../../Api/api";
import "../../assets/style/AttendanceForm.css";

const STATUSES = [
  { value: "present", label: "✅ មានវត្តមាន" },
  { value: "absent",  label: "❌ អវត្តមាន"   },
  { value: "late",    label: "⏰ មកយឺត"     },
  { value: "leave",   label: "📄 សុំច្បាប់"  },
];

const EditAttendance = ({ id, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    student_id:   "",
    classroom_id: "",
    date:         "",
    time_in:      "",
    time_out:     "",
    status:       "present",
    note:         "",
  });

  const [students,   setStudents]   = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [fetching,   setFetching]   = useState(true);
  const [error,      setError]      = useState("");

  // Load dropdowns + existing record
  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      API_URL.get("/student",        { headers }).catch(() => ({ data: { data: [] } })),
      API_URL.get("/classroom",      { headers }).catch(() => ({ data: { data: [] } })),
      API_URL.get(`/attendance/${id}`, { headers }),
    ]).then(([sRes, cRes, attRes]) => {
      setStudents(  sRes.data?.data   ?? sRes.data   ?? []);
      setClassrooms(cRes.data?.data   ?? cRes.data   ?? []);

      const att = attRes.data?.data ?? attRes.data ?? {};
      setForm({
        student_id:   att.student_id   ?? att.student?.id  ?? "",
        classroom_id: att.classroom_id ?? att.classroom?.id ?? "",
        date:         att.date         ?? "",
        time_in:      att.time_in      ?? "",
        time_out:     att.time_out     ?? "",
        status:       att.status       ?? "present",
        note:         att.note         ?? "",
      });
    }).catch((err) => {
      setError("មិនអាចទាញព័ត៌មាន!");
      console.error(err);
    }).finally(() => setFetching(false));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.student_id || !form.classroom_id || !form.date) {
      setError("សូមបំពេញព័ត៌មានចាំបាច់!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await API_URL.post(`/attendance/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status !== false) {
        onSuccess?.("កែប្រែវត្តមានបានជោគជ័យ! ✅");
        onClose?.();
      }
    } catch (err) {
      setError(err.response?.data?.message || "មានបញ្ហាកើតឡើង!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attform-overlay" onClick={onClose}>
      <div className="attform-box" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="attform-header">
          <div className="attform-header__left">
            <div className="attform-header__icon attform-header__icon--edit">✏️</div>
            <div>
              <p className="attform-header__title">កែប្រែវត្តមាន</p>
              <p className="attform-header__sub">ID: {id}</p>
            </div>
          </div>
          <button className="attform-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="attform-body">

            {error && <div className="attform-error">⚠️ {error}</div>}

            {fetching ? (
              // Skeleton
              <>
                {[1,2,3,4].map((i) => <div key={i} className="attform-skeleton" />)}
              </>
            ) : (
              <>
                {/* Student */}
                <div className="attform-field">
                  <label className="attform-label">
                    សិស្ស <span className="attform-required">*</span>
                  </label>
                  <select
                    className="attform-select"
                    name="student_id"
                    value={form.student_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- ជ្រើសសិស្ស --</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                {/* Classroom */}
                <div className="attform-field">
                  <label className="attform-label">
                    ថ្នាក់ <span className="attform-required">*</span>
                  </label>
                  <select
                    className="attform-select"
                    name="classroom_id"
                    value={form.classroom_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- ជ្រើសថ្នាក់ --</option>
                    {classrooms.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Date + Status */}
                <div className="attform-row">
                  <div className="attform-field">
                    <label className="attform-label">
                      កាលបរិច្ឆេទ <span className="attform-required">*</span>
                    </label>
                    <input
                      className="attform-input"
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="attform-field">
                    <label className="attform-label">ស្ថានភាព</label>
                    <select
                      className="attform-select"
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                    >
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Time */}
                <div className="attform-row">
                  <div className="attform-field">
                    <label className="attform-label">ម៉ោងចូល</label>
                    <input
                      className="attform-input"
                      type="time"
                      name="time_in"
                      value={form.time_in}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="attform-field">
                    <label className="attform-label">ម៉ោងចេញ</label>
                    <input
                      className="attform-input"
                      type="time"
                      name="time_out"
                      value={form.time_out}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Note */}
                <div className="attform-field">
                  <label className="attform-label">កំណត់សម្គាល់</label>
                  <input
                    className="attform-input"
                    type="text"
                    name="note"
                    placeholder="ចំណាំបន្ថែម (ស្រេចចិត្ត)"
                    value={form.note}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

          </div>

          {/* Footer */}
          <div className="attform-footer">
            <button type="button" className="attform-btn-cancel" onClick={onClose}>
              បោះបង់
            </button>
            <button
              type="submit"
              className="attform-btn-submit attform-btn-submit--edit"
              disabled={loading || fetching}
            >
              {loading ? "កំពុងរក្សាទុក..." : "💾 រក្សាទុក"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default EditAttendance;