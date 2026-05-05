import { useEffect, useState, useMemo } from "react";
import API_URL from "../Api/api";
import { Link } from "react-router-dom";
import "../assets/style/Class.css";

const ACCENT_COLORS = [
  "#378ADD", "#1D9E75", "#D85A30", "#D4537E",
  "#7F77DD", "#639922", "#E89C2C", "#2A9D8F"
];

// eslint-disable-next-line no-unused-vars


const Class = () => {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("មិនមាន Token។ សូមចូលគណនីម្តងទៀត។");
        setLoading(false);
        return;
      }

      const res = await API_URL.get("/classroom", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClasses(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("មិនអាចទាញយកទិន្នន័យថ្នាក់រៀនបានទេ។ សូមព្យាយាមម្តងទៀត។");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchClassrooms();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`តើអ្នកពិតជាចង់លុបថ្នាក់ "${name}" មែនទេ?`)) return;

    try {
      const token = localStorage.getItem("token");
      await API_URL.delete(`/classroom/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClasses((prev) => prev.filter((c) => c.id !== id));
      alert("លុបថ្នាក់រៀនបានជោគជ័យ!");
    } catch (err) {
      console.error(err);
      alert("មិនអាចលុបថ្នាក់រៀនបានទេ។");
    }
  };

  const filtered = useMemo(() => {
    return classes.filter((c) =>
      c.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, classes]);

  const Skeleton = () => (
    <div className="cl-card cl-skeleton">
      <div className="cl-card-accent" />
      <div className="sk-line sk-name" />
      <div className="sk-line sk-short" />
      <div className="sk-stats">
        <div className="sk-stat" />
        <div className="sk-stat" />
      </div>
      <div className="sk-line sk-teacher" />
      <div className="sk-actions">
        <div className="sk-btn" />
        <div className="sk-btn sk-btn-sm" />
      </div>
    </div>
  );

  return (
    <div className="cl-page">
      {/* Header */}
      <div className="cl-header">
        <div className="cl-title-block">
          <p className="cl-eyebrow">ឆ្នាំសិក្សា ២០២៥–២៦</p>
          <h2 className="cl-title">ថ្នាក់រៀន</h2>
        </div>
        <Link to="/classes/add" className="cl-add-btn">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          បន្ថែមថ្នាក់រៀនថ្មី
        </Link>
      </div>

      {/* Search */}
      <div className="cl-controls">
        <div className="cl-search-wrap">
          <svg className="cl-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 12l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            className="cl-search-input"
            placeholder="ស្វែងរកថ្នាក់រៀន..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="cl-count-row">
        <span className="cl-count-label">កំពុងបង្ហាញ</span>
        <span className="cl-count-pill">
          {loading ? "—" : `${filtered.length} ថ្នាក់រៀន`}
        </span>
      </div>

      {error && <div className="cl-error">{error}</div>}

      <div className="cl-grid">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)
        ) : filtered.length === 0 ? (
          <div className="cl-empty">
            <p>រកមិនឃើញថ្នាក់រៀនដែលត្រូវនឹងការស្វែងរកទេ។</p>
          </div>
        ) : (
          filtered.map((item, i) => (
            <div
              key={item.id}
              className="cl-card"
              style={{ "--accent": ACCENT_COLORS[i % ACCENT_COLORS.length] }}
            >
              <div className="cl-card-accent" />

              <div className="cl-card-top">
                <h3 className="cl-card-name">{item.name}</h3>
                <span className="cl-room-badge">បន្ទប់ {item.room_number || "—"}</span>
              </div>

              <div className="cl-card-stats">
                {/* បង្ហាញចំនួនសិស្សដោយប្រើ students_count ពី Backend */}
                <div className="cl-stat">
                  <span className="cl-stat-val">
                    {/* {item.students_count || 0} */}
                  </span>
                  <span className="cl-stat-key">សិស្ស</span>
                </div>

                <div className="cl-stat-divider" />

                <div className="cl-stat">
                  <span className="cl-stat-val">
                    {/* {item.teacher ? 1 : 0} */}
                  </span>
                  <span className="cl-stat-key">គ្រូ</span>
                </div>
              </div>

              <div className="cl-divider" />

              <div className="cl-teacher-row">
                <span className="cl-teacher-label">គ្រូបង្រៀន:</span>
              </div>

              <div className="cl-card-actions">
                <Link to={`/attendance?classroom_id=${item.id}`} className="cl-btn-attend">
                  វត្តមាន
                </Link>
                <Link to={`/classes/edit/${item.id}`} className="cl-btn-edit">
                  កែប្រែ
                </Link>
                <button
                  onClick={() => handleDelete(item.id, item.name)}
                  className="cl-btn-delete"
                >
                  លុប
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Class;