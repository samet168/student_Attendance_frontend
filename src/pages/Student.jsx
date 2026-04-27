import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../Api/api";
import "../assets/style/Student.css";

const Student = () => {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");
  const [loadingDel, setLoadingDel] = useState(false);

  /* ── Fetch ── */
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await API_URL.get("/student");
      setStudents(res.data.data || []);
      setFiltered(res.data.data || []);
    } catch {
      alert("មិនអាចទាញទិន្នន័យបានទេ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStudents();
  }, []);

  /* ── Search ── */
  useEffect(() => {
    const q = search.toLowerCase();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFiltered(
      students.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.student_id_card.toLowerCase().includes(q) ||
          (s.phone || "").includes(q),
      ),
    );
  }, [search, students]);

  /* ── Open delete modal ── */
  const openDelete = (s) => {
    setDeleteId(s.id);
    setDeleteName(s.name);
  };

  /* ── Confirm delete ── */
  const handleDelete = async () => {
    setLoadingDel(true);
    try {
      await API_URL.delete(`/student/${deleteId}`);
      setDeleteId(null);
      fetchStudents();
    } catch {
      alert("លុបមិនបាន!");
    } finally {
      setLoadingDel(false);
    }
  };

  return (
    <div className="stu-page">
      {/* ── HEADER ── */}
      <div className="stu-header">
        <div>
          <h1 className="stu-title">ការគ្រប់គ្រងសិស្ស</h1>
          <p className="stu-subtitle">ព័ត៌មានសិស្សទាំងអស់នៅក្នុងប្រព័ន្ធ</p>
        </div>

        <Link to="/students/add" className="stu-btn-add">
          + បន្ថែមសិស្ស
        </Link>
      </div>

      {/* ── CARD ── */}
      <div className="stu-card">
        {/* search */}
        <div className="stu-card-head">
          <span className="stu-count">
            សរុប <strong>{filtered.length}</strong> នាក់
          </span>
          <div className="stu-search-wrap">
            <svg
              className="stu-search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
            </svg>
            <input
              className="stu-search"
              type="text"
              placeholder="ស្វែងរក..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* table */}
        <div className="stu-table-wrap">
          <table className="stu-table">
            <thead>
              <tr>
                <th>#</th>
                <th>អត្តលេខ</th>
                <th>ឈ្មោះ</th>
                <th>ភេទ</th>
                <th>ទូរស័ព្ទ</th>
                <th>សកម្មភាព</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="stu-state-cell">
                    <div className="stu-spinner" />
                    <span>កំពុងផ្ទុក...</span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="stu-state-cell">
                    រកមិនឃើញសិស្ស
                  </td>
                </tr>
              ) : (
                filtered.map((s, i) => (
                  <tr key={s.id}>
                    <td className="stu-td-num">{i + 1}</td>
                    <td>
                      <span className="stu-id-badge">{s.student_id_card}</span>
                    </td>
                    <td className="stu-td-name">{s.name}</td>
                    <td>
                      <span
                        className={`stu-gender ${s.gender === "Female" ? "female" : "male"}`}
                      >
                        {s.gender === "Female" ? "♀ ស្រី" : "♂ ប្រុស"}
                      </span>
                    </td>
                    <td>{s.phone}</td>
                    <td>
                      <div className="stu-actions">
                        <Link
                          to={`/students/edit/${s.id}`}
                          className="stu-btn-edit"
                        >
                          ✏️ កែ
                        </Link>
                        <button
                          className="stu-btn-delete"
                          onClick={() => openDelete(s)}
                        >
                          🗑️ លុប
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── DELETE MODAL ── */}
      {deleteId && (
        <div className="stu-overlay" onClick={() => setDeleteId(null)}>
          <div className="stu-modal" onClick={(e) => e.stopPropagation()}>
            <div className="stu-modal-icon">🗑️</div>
            <h3>បញ្ជាក់ការលុប</h3>
            <p>
              តើអ្នកចង់លុប <strong>{deleteName}</strong> មែនទេ?
              <br />
              ទិន្នន័យនឹងបាត់ជាអចិន្ត្រៃយ៍។
            </p>

            <div className="stu-modal-actions">
              <button
                className="stu-btn-cancel"
                onClick={() => setDeleteId(null)}
              >
                បោះបង់
              </button>
              <button
                className="stu-btn-confirm"
                onClick={handleDelete}
                disabled={loadingDel}
              >
                {loadingDel ? "កំពុងលុប..." : "លុប"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Student;
