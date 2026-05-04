import { useEffect, useState } from "react";
import API_URL from "../Api/api";
import { Link } from "react-router-dom";
import "../assets/style/Subjects.css";

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await API_URL.get("/subject");
      setSubjects(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("តើអ្នកចង់លុបមែនទេ?")) return;

    try {
      await API_URL.delete(`/subject/${id}`);
      fetchSubjects();
    } catch (err) {
      alert("លុបមិនបាន");
    }
  };

  return (
    <div className="sub-page">

      {/* HEADER */}
      <div className="sub-header">
        <div>
          <h2>📘 មុខវិជ្ជា</h2>
          <p>គ្រប់គ្រងមុខវិជ្ជាទាំងអស់</p>
        </div>

        <div className="sub-actions">
          <button className="btn-refresh" onClick={fetchSubjects}>
            🔄 Refresh
          </button>

          <Link to="/subjects/add">
            <button className="btn-add">➕ បន្ថែម</button>
          </Link>
        </div>
      </div>

      {/* CONTENT */}
      <div className="sub-card">

        {loading ? (
          <div className="sub-loading">⏳ កំពុងផ្ទុក...</div>
        ) : subjects.length === 0 ? (
          <div className="sub-empty">❌ មិនមានមុខវិជ្ជា</div>
        ) : (
          <table className="sub-table">
            <thead>
              <tr>
                <th>#</th>
                <th>មុខវិជ្ជា</th>
                <th>Code</th>
                <th>សកម្មភាព</th>
              </tr>
            </thead>

            <tbody>
              {subjects.map((sub, i) => (
                <tr key={sub.id}>
                  <td>{i + 1}</td>

                  <td>
                    <span className="badge-name">
                      {sub.subject_name}
                    </span>
                  </td>

                  <td>
                    <span className="badge-code">
                      {sub.subject_code}
                    </span>
                  </td>

                  <td className="actions">
                    <Link to={`/subjects/edit/${sub.id}`}>
                      <button className="btn-edit">✏️ Edit</button>
                    </Link>

                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(sub.id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
};

export default Subjects;