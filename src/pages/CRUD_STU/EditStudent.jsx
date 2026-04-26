import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API_URL from "../../Api/api";
import "../../assets/style/StudentForm.css";

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    classroom_id: "",
    student_id_card: "",
    name: "",
    gender: "Male",
    phone: "",
  });

  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingClass, setLoadingClass] = useState(true);
  const [error, setError] = useState("");

  /* ── Load student data ── */
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await API_URL.get(`/admin/student/${id}`);
        setForm(res.data.data);
      } catch {
        alert("មិនអាចទាញទិន្នន័យសិស្សបាន");
      }
    };

    fetchStudent();
  }, [id]);

  /* ── Load classrooms ── */
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const res = await API_URL.get("/admin/classroom");
        setClassrooms(res.data.data || []);
      } catch {
        alert("មិនអាចទាញថ្នាក់បាន");
      } finally {
        setLoadingClass(false);
      }
    };

    fetchClassrooms();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.classroom_id || !form.student_id_card || !form.name || !form.phone) {
      setError("សូមបំពេញព័ត៌មានទាំងអស់");
      return;
    }

    setLoading(true);

    try {
      await API_URL.post(`/admin/student/${id}`, {
        ...form,
        classroom_id: Number(form.classroom_id),
      });

      alert("កែប្រែជោគជ័យ!");
      navigate("/students");
    } catch (err) {
      alert(err.response?.data?.message || "មានបញ្ហាកើតឡើង");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">

      <div className="form-card">

        <h2 className="form-title">✏️ កែប្រែសិស្ស</h2>

        <form onSubmit={handleSubmit}>

          {/* classroom */}
          <div className="form-group">
            <label>ថ្នាក់</label>
            <select
              name="classroom_id"
              value={form.classroom_id}
              onChange={handleChange}
            >
              <option value="">
                {loadingClass ? "កំពុងផ្ទុក..." : "-- ជ្រើសថ្នាក់ --"}
              </option>

              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name || c.class_name}
                </option>
              ))}
            </select>
          </div>

          {/* id */}
          <div className="form-group">
            <label>អត្តលេខសិស្ស</label>
            <input
              name="student_id_card"
              value={form.student_id_card}
              onChange={handleChange}
            />
          </div>

          {/* name */}
          <div className="form-group">
            <label>ឈ្មោះ</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          {/* gender */}
          <div className="form-group">
            <label>ភេទ</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="Male">ប្រុស</option>
              <option value="Female">ស្រី</option>
            </select>
          </div>

          {/* phone */}
          <div className="form-group">
            <label>លេខទូរស័ព្ទ</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          {/* error */}
          {error && <div className="error-box">⚠️ {error}</div>}

          {/* buttons */}
          <div className="form-actions">

            <Link to="/students" className="btn-back">
              🔙 ត្រលប់ក្រោយ
            </Link>

            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "កំពុងរក្សាទុក..." : "💾 រក្សាទុក"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default EditStudent;