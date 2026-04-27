import { useState, useEffect } from "react";
import API_URL from "../../Api/api";
import "../../assets/style/AttendanceForm.css";

const STATUSES = [
  { value: "Present",     label: "✅ មានវត្តមាន" },
  { value: "Absent",      label: "❌ អវត្តមាន" },
  { value: "Late",        label: "⏰ មកយឺត" },
  { value: "Permission",  label: "📄 សុំច្បាប់" },
];

const AddAttendance = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    student_id:   "",
    classroom_id: "",
    attendance_date: new Date().toISOString().split("T")[0],
    time_in:      "",
    time_out:     "",
    status:       "Present",
    remarks:      "",        // ប្តូរពី note → remarks ដើម្បីត្រូវ backend
  });

  const [students,   setStudents]   = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [fetching,   setFetching]   = useState(true);
  const [error,      setError]      = useState("");

  // Load students + classrooms
  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      API_URL.get("/student", { headers }).catch(() => ({ data: { data: [] } })),
      API_URL.get("/classroom", { headers }).catch(() => ({ data: { data: [] } })),
    ]).then(([sRes, cRes]) => {
      setStudents(sRes.data?.data ?? []);
      setClassrooms(cRes.data?.data ?? []);
    }).finally(() => setFetching(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.student_id || !form.classroom_id || !form.attendance_date) {
      setError("សូមបំពេញព័ត៌មានចាំបាច់ទាំងអស់!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await API_URL.post("/attendance", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status) {
        onSuccess?.("បន្ថែមកំណត់វត្តមានបានជោគជ័យ! 🎉");
        onClose?.();
      }
    } catch (err) {
      setError(err.response?.data?.message || "មានបញ្ហាកើតឡើង សូមព្យាយាមម្តងទៀត!");
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
            <div className="attform-header__icon attform-header__icon--add">📋</div>
            <div>
              <p className="attform-header__title">បន្ថែមកំណត់វត្តមាន</p>
              <p className="attform-header__sub">បំពេញព័ត៌មានខាងក្រោម</p>
            </div>
          </div>
          <button className="attform-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="attform-body">

            {error && <div className="attform-error">⚠️ {error}</div>}

            {/* Student */}
            <div className="attform-field">
              <label className="attform-label">
                សិស្ស <span className="attform-required">*</span>
              </label>
              {fetching ? (
                <div className="attform-loading">កំពុងទាញទិន្នន័យសិស្ស...</div>
              ) : (
                <select
                  className="attform-select"
                  name="student_id"
                  value={form.student_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- ជ្រើសរើសសិស្ស --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Classroom */}
            <div className="attform-field">
              <label className="attform-label">
                ថ្នាក់ <span className="attform-required">*</span>
              </label>
              {fetching ? (
                <div className="attform-loading">កំពុងទាញទិន្នន័យថ្នាក់...</div>
              ) : (
                <select
                  className="attform-select"
                  name="classroom_id"
                  value={form.classroom_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- ជ្រើសរើសថ្នាក់ --</option>
                  {classrooms.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
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
                  name="attendance_date"
                  value={form.attendance_date}
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
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Time in + Time out */}
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

            {/* Remarks */}
            <div className="attform-field">
              <label className="attform-label">កំណត់សម្គាល់</label>
              <input
                className="attform-input"
                type="text"
                name="remarks"
                placeholder="បញ្ចូលកំណត់សម្គាល់បន្ថែម (ស្រេចចិត្ត)"
                value={form.remarks}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* Footer */}
          <div className="attform-footer">
            <button
              type="button"
              className="attform-btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              បោះបង់
            </button>
            <button
              type="submit"
              className="attform-btn-submit attform-btn-submit--add"
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

export default AddAttendance;