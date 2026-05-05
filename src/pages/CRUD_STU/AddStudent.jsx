import { useState, useEffect } from "react";
import API_URL from "../../Api/api";
import "../../assets/style/StudentForm.css";
import { Link } from "react-router-dom";

const AddStudent = () => {
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

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const res = await API_URL.get("/classroom");
        setClassrooms(res.data.data || []);
      } catch (err) {
        console.log(err);
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

  if (!form.classroom_id || !form.student_id_card || !form.name) {
    setError("សូមបំពេញព័ត៌មានទាំងអស់");
    return;
  }

  setLoading(true);

  try {
    const payload = {
      classroom_id: form.classroom_id, // ✅ FIX HERE
      student_id_card: form.student_id_card.trim(),
      name: form.name.trim(),
      gender: form.gender,
      phone: form.phone,
    };

    console.log("📦 SEND:", payload);

    // eslint-disable-next-line no-unused-vars
    const res = await API_URL.post("/student", payload);

    alert("បានបន្ថែមសិស្សជោគជ័យ!");

    setForm({
      classroom_id: "",
      student_id_card: "",
      name: "",
      gender: "Male",
      phone: "",
    });

  } catch (err) {
    console.log("❌ ERROR:", err.response?.data);

    setError(
      err.response?.data?.message ||
      "មានបញ្ហាកើតឡើង"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="form-page">
      <div className="form-card">

        <h2 className="form-title">➕ បន្ថែមសិស្ស</h2>

        <form onSubmit={handleSubmit}>

          {/* classroom */}
          <div className="form-group">
            <label>ថ្នាក់</label>
            <select
              name="classroom_id"
              onChange={handleChange}
              value={form.classroom_id}
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

          {/* id card */}
          <div className="form-group">
            <label>អត្តលេខសិស្ស</label>
            <input
              name="student_id_card"
              onChange={handleChange}
              value={form.student_id_card}
            />
          </div>

          {/* name */}
          <div className="form-group">
            <label>ឈ្មោះ</label>
            <input
              name="name"
              onChange={handleChange}
              value={form.name}
            />
          </div>

          {/* gender */}
          <div className="form-group">
            <label>ភេទ</label>
            <select
              name="gender"
              onChange={handleChange}
              value={form.gender}
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
              onChange={handleChange}
              value={form.phone}
            />
          </div>

          {/* error */}
          {error && <div className="error-box">⚠️ {error}</div>}

          {/* actions */}
          <div className="form-actions">

            <Link to={`/students`} className="btn-cancel" style={{textDecoration: "none"}}>
              🔙 ត្រលប់ក្រោយ
            </Link>

            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "កំពុងរក្សាទុក..." : "រក្សាទុក"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default AddStudent;