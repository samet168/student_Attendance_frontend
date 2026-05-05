import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API_URL from "../../Api/api";
import "../../assets/style/SubjectForm.css"; 

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    subject_name: "",
    subject_code: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchSubject();
  }, []);

  const fetchSubject = async () => {
    try {
      const res = await API_URL.get(`/subject/${id}`);
      const data = res.data.data;

      setForm({
        subject_name: data.subject_name,
        subject_code: data.subject_code,
      });
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("មិនអាចទាញទិន្នន័យបាន");
    } finally {
      setLoading(false);
    }
  };

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

    setSaving(true);

    try {
      await API_URL.put(`/subject/${id}`, form);

      alert("កែប្រែជោគជ័យ");
      navigate("/subjects");
    } catch (err) {
      setError(err.response?.data?.message || "មានបញ្ហាកើតឡើង");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">កំពុងផ្ទុក...</div>;
  }

  return (
    <div className="form-container">
      <div className="form-card">

        <h2 className="title">កែប្រែមុខវិជ្ជា</h2>
        <p className="subtitle">Update subject information</p>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>ឈ្មោះមុខវិជ្ជា</label>
            <input
              type="text"
              name="subject_name"
              value={form.subject_name}
              onChange={handleChange}
              placeholder="Enter subject name"
            />
          </div>

          <div className="input-group">
            <label>Code</label>
            <input
              type="text"
              name="subject_code"
              value={form.subject_code}
              onChange={handleChange}
              placeholder="Enter subject code"
            />
          </div>

          {error && <div className="error-box">{error}</div>}

          <button className="btn-update" type="submit" disabled={saving}>
            {saving ? "⏳ កំពុងរក្សាទុក..." : "Update Subject"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Edit;