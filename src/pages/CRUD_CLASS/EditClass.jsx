import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API_URL from "../../Api/api";
import "../../assets/style/ClassEdit.css";

const EditClass = ({ id: propId, onClose, onSuccess }) => {
  const { id: paramId } = useParams();
  const id = propId || paramId;

  const [name, setName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [teacherIds, setTeacherIds] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // =====================
  // LOAD DATA (FIXED)
  // =====================
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        // classroom
        const res = await API_URL.get(`/classroom/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data?.data;

        setName(data?.name || "");
        setRoomNumber(data?.room_number || "");

        // ✅ FIX: teacher ids from relation
        setTeacherIds(data?.teachers?.map(t => t.id) || []);

        // teachers list
        const resTeacher = await API_URL.get(`/teachers`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTeachers(resTeacher.data?.data || []);

      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("❌ មិនអាចទាញទិន្នន័យបាន");
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // =====================
  // TOGGLE TEACHER
  // =====================
  const toggleTeacher = (tid) => {
    if (teacherIds.includes(tid)) {
      setTeacherIds(teacherIds.filter(id => id !== tid));
    } else {
      setTeacherIds([...teacherIds, tid]);
    }
  };

  // =====================
  // UPDATE (FIXED)
  // =====================
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("⚠️ សូមបញ្ចូលឈ្មោះថ្នាក់!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      await API_URL.post(
        `/classroom/${id}`,
        {
          name,
          room_number: roomNumber,
          teacher_ids: teacherIds, 
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onSuccess?.("កែប្រែជោគជ័យ!");
      navigate("/classes");

    } catch (err) {
      setError(err.response?.data?.message || "មានបញ្ហា");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="classform-overlay" onClick={onClose}>
      <div className="classform-box" onClick={(e) => e.stopPropagation()}>

        {/* HEADER (UNCHANGED UI) */}
        <div className="classform-header">
          <div>
            <p className="classform-header__title">កែប្រែថ្នាក់</p>
            <p className="classform-header__sub">ID: {id}</p>
          </div>
          <Link to="/classes" className="classform-close">✕</Link>
        </div>

        {/* BODY */}
        <form onSubmit={handleUpdate}>
          <div className="classform-body">

            {error && <div className="classform-error">{error}</div>}

            {/* NAME */}
            <div className="classform-field">
              <label>ឈ្មោះថ្នាក់ *</label>
              {fetching ? (
                <div className="loading-text">កំពុងផ្ទុក...</div>
              ) : (
                <input
                  className="classform-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}
            </div>

            {/* ROOM */}
            <div className="classform-field">
              <label>លេខបន្ទប់</label>
              {fetching ? (
                <div className="loading-text">កំពុងផ្ទុក...</div>
              ) : (
                <input
                  className="classform-input"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                />
              )}
            </div>

            {/* TEACHERS (UNCHANGED UI) */}
            <div className="classform-field">
              <label>ជ្រើសគ្រូ</label>

              <div className="teacher-grid">
                {teachers.map((t) => (
                  <div
                    key={t.id}
                    className={`teacher-card ${teacherIds.includes(t.id) ? "active" : ""}`}
                    onClick={() => toggleTeacher(t.id)}
                  >
                    <div className="avatar">👨‍🏫</div>
                    <span>{t.name}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* FOOTER (UNCHANGED UI) */}
          <div className="classform-footer">

            <Link to="/classes" className="classform-btn-cancel">
               ← ត្រឡប់ក្រោយ
            </Link>

            <button
              type="submit"
              className="classform-btn-submit classform-btn-submit--edit"
              disabled={loading}
            >
              {loading ? "កំពុងរក្សាទុក..." : "Save"}
            </button>

          </div>
        </form>

      </div>
    </div>
  );
};

export default EditClass;