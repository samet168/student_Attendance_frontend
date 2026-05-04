import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../Api/api";
import "../../assets/style/SubjectForm.css";

const Add = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    subject_name: "",
    subject_code: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.subject_name || !form.subject_code) {
      setError("សូមបំពេញព័ត៌មានទាំងអស់");
      return;
    }

    setLoading(true);

    try {
      await API_URL.post("/subject", form);

      alert("✅ បន្ថែមជោគជ័យ");

      navigate("/subjects");
    } catch (err) {
      setError(err.response?.data?.message || "មានបញ្ហាកើតឡើង");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">

      <div className="form-card">

        <h2 className="form-title">➕ បន្ថែមមុខវិជ្ជា</h2>
        <p className="form-sub">សូមបញ្ចូលព័ត៌មានមុខវិជ្ជា</p>

        <form onSubmit={handleSubmit}>

          {/* subject name */}
          <div className="form-group">
            <label>ឈ្មោះមុខវិជ្ជា</label>
            <input
              type="text"
              name="subject_name"
              placeholder="ឧ. Mathematics"
              value={form.subject_name}
              onChange={handleChange}
            />
          </div>

          {/* subject code */}
          <div className="form-group">
            <label>Code</label>
            <input
              type="text"
              name="subject_code"
              placeholder="ឧ. MATH101"
              value={form.subject_code}
              onChange={handleChange}
            />
          </div>

          {/* error */}
          {error && <div className="error-box">❌ {error}</div>}

          {/* buttons */}
          <div className="form-actions">

            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/subjects")}
            >
              🔙 ត្រលប់
            </button>

            <button
              type="submit"
              className="btn-save"
              disabled={loading}
            >
              {loading ? "⏳ កំពុងរក្សាទុក..." : "💾 Save"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default Add;