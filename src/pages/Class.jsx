import { useEffect, useState, useMemo } from "react";
import API_URL from "../Api/api";
import { Link } from "react-router-dom";
import "../assets/style/Class.css";

const Class = () => {
  const [classes, setClasses]   = useState([]);
  const [search, setSearch]     = useState("");
  const [loading, setLoading]   = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch Classrooms ──
  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API_URL.get("/classroom", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data?.data ?? res.data ?? []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchClassrooms();
  }, []);

  // ── Delete ──
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await API_URL.delete(`/classroom/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses((prev) => prev.filter((c) => c.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error("Delete error:", err);
      alert("មានបញ្ហាក្នុងការលុបថ្នាក់!");
    } finally {
      setDeleting(false);
    }
  };

  // ── Filter ──
  const filtered = useMemo(() => {
    return classes.filter((c) =>
      c.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, classes]);

  const stripColors = [
    "linear-gradient(90deg,#1a56c4,#3b82f6)",
    "linear-gradient(90deg,#7c3aed,#a78bfa)",
    "linear-gradient(90deg,#059669,#34d399)",
    "linear-gradient(90deg,#d97706,#fbbf24)",
    "linear-gradient(90deg,#dc2626,#f87171)",
  ];

  const deleteName = classes.find((c) => c.id === deleteId)?.name ?? "";

  return (
    <div className="class-page">

      {/* Header */}
      <div className="class-header">
        <div>
          <h2 className="title">📚 ថ្នាក់រៀន</h2>
          <p className="sub-title">បញ្ជីថ្នាក់ទាំងអស់ក្នុងប្រព័ន្ធ</p>
        </div>
      </div>

      {/* Controls */}
      <div className="class-controls">
        <input
          type="text"
          className="search-box"
          placeholder="🔍 ស្វែងរកថ្នាក់..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link to="/classes/add" className="class-add-btn">
          + បន្ថែមថ្នាក់
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="class-grid">
          {[1,2,3,4,5,6].map((i) => <div key={i} className="class-skeleton" />)}
        </div>
      ) : (
        <div className="class-grid">
          {filtered.length === 0 ? (
            <div className="class-empty">
              <div className="class-empty__icon">🏫</div>
              <div className="class-empty__text">រកមិនឃើញថ្នាក់</div>
              <div className="class-empty__sub">
                {search ? `មិនមានថ្នាក់ "${search}"` : "មិនទាន់មានថ្នាក់ណាមួយ"}
              </div>
            </div>
          ) : (
            filtered.map((item, index) => (
              <div key={item.id} className="class-card">
                <style>{`
                  .class-card:nth-child(${index + 1})::before {
                    background: ${stripColors[index % stripColors.length]};
                  }
                `}</style>

                {/* Top Strip */}
                <div className="class-top">
                  <span className="badge">ថ្នាក់</span>
                  <span className="class-index">{index + 1}</span>
                </div>

                {/* Class Name */}
                <h3 className="class-name">{item.name}</h3>

                {/* Info */}
                <div className="class-info">
                  <p className="class-sub">
                    <span>🏠</span> បន្ទប់: {item.room_number || "N/A"}
                  </p>
                  <p className="class-sub">
                    <span>👥</span> សិស្ស: {item.students_count ?? 0} នាក់
                  </p>
                </div>

                <div className="class-divider" />

                {/* Footer */}
                <div className="class-footer">
                  <div className="teacher-tag">
                    👨‍🏫 {item.teacher?.name ?? "គ្រូបង្រៀន"}
                  </div>

                  <div className="class-actions">
                    {/* ហៅឈ្មោះតាមថ្នាក់ */}
                    <Link 
                      to={`/attendance?classroom_id=${item.id}`} 
                      className="btn-view"
                    >
                      📋 ហៅឈ្មោះ
                    </Link>

                    <Link 
                      to={`/classes/edit/${item.id}`} 
                      className="btn-edit"
                    >
                      ✏️ កែ
                    </Link>

                    <button
                      className="btn-delete"
                      onClick={() => setDeleteId(item.id)}
                    >
                      🗑 លុប
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => !deleting && setDeleteId(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>

            <div className="modal-box__icon-wrap">
              <span className="modal-box__icon">🗑️</span>
            </div>

            <h3 className="modal-box__title">បញ្ជាក់ការលុប</h3>

            <p className="modal-box__desc">
              តើអ្នកពិតជាចង់លុបថ្នាក់ <strong>"{deleteName}"</strong> មែនទេ?<br />
              ការលុបនេះមិនអាចត្រឡប់វិញបានទេ!
            </p>

            <div className="modal-box__actions">
              <button
                className="modal-btn modal-btn--cancel"
                onClick={() => setDeleteId(null)}
                disabled={deleting}
              >
                បោះបង់
              </button>
              <button
                className="modal-btn modal-btn--delete"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "កំពុងលុប..." : "លុបចោល"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Class;