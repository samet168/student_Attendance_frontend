import { useEffect, useState, useMemo } from "react";
import API_URL from "../Api/api";
import "../assets/style/Class.css";
import { Link } from "react-router-dom";

const Class = () => {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ── Fetch Classrooms ──
  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      const res = await API_URL.get("/admin/classroom");
      setClasses(res.data.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  // ── Filter Search ──
  const filtered = useMemo(() => {
    return classes.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, classes]);

  return (
    <div className="class-page">

      {/* HEADER */}
      <div className="class-header">
        <div>
          <h2 className="title">📚 ថ្នាក់រៀន</h2>
          <p className="sub-title">បញ្ជីថ្នាក់ទាំងអស់ក្នុងប្រព័ន្ធ</p>
        </div>

        <input
          type="text"
          className="search-box"
          placeholder="🔍 ស្វែងរកថ្នាក់..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
            <Link
        to={`/classes/add`}
        className="dashboard__edit-btn"
      >
        ➕ បន្ថែមថ្នាក់
      </Link>

      {/* CONTENT */}
      {loading ? (
        <p className="loading">កំពុងផ្ទុក...</p>
      ) : (
        <div className="class-grid">

          {filtered.map((item, index) => (
            <div key={item.id} className="class-card">

              <div className="class-top">
                <span className="badge">Grade</span>
              </div>

              <h3 className="class-name">{item.name}</h3>

              <p className="class-sub">
                បន្ទប់រៀន: {item.room || "N/A"}
              </p>

              <p className="class-sub">
                ចំនួនសិស្ស: {item.students_count || 0}
              </p>

              {/* FOOTER */}
              <div className="class-footer">

                <div className="teacher">
                  👨‍🏫 គ្រូបង្រៀន
                </div>

                <button className="btn-view">
                  ហៅឈ្មោះ
                </button>
                            <Link
                  to={`/classes/edit/${item.id}`}
                  className="dashboard__edit-btn"
                >
                  ✏️ កែប្រែ
                </Link>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default Class;