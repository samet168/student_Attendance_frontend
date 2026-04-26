import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../../Api/api";
import "../../assets/style/UserForm.css";

const Add = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "student",
  });
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Handle input change ──
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Client-side validation
    if (form.password !== form.password_confirmation) {
      setError("Password និង Confirm Password មិនដូចគ្នា!");
      return;
    }
    if (form.password.length < 8) {
      setError("Password ត្រូវការយ៉ាងតិច ៨ តួអក្សរ!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await API_URL.post("/admin/user", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("បន្ថែមអ្នកប្រើប្រាស់បានជោគជ័យ! 🎉");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      const msg = err.response?.data?.message
        ?? Object.values(err.response?.data?.errors ?? {})[0]?.[0]
        ?? "មានបញ្ហាក្នុងការបន្ថែម!";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-form-page">

      {/* Top bar */}
      <div className="user-form-page__topbar">
        <Link to="/" className="user-form-page__back">
          ← ត្រឡប់
        </Link>
        <h2 className="user-form-page__title">បន្ថែមអ្នកប្រើប្រាស់</h2>
      </div>

      <div className="user-form-card">
        {/* Card header */}
        <div className="user-form-card__header">
          <div className="user-form-card__header-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
              <line x1="12" y1="11" x2="12" y2="17"/>
              <line x1="9" y1="14" x2="15" y2="14"/>
            </svg>
          </div>
          <div>
            <div className="user-form-card__header-title">បន្ថែមអ្នកប្រើប្រាស់ថ្មី</div>
            <div className="user-form-card__header-sub">បំពេញព័ត៌មានខាងក្រោម</div>
          </div>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit}>
          <div className="user-form-card__body">

            {/* Error / Success */}
            {error   && <div className="form-error-box">⚠️ {error}</div>}
            {success && <div className="form-success-box">✅ {success}</div>}

            {/* Name */}
            <div className="form-field">
              <label className="form-field__label">
                ឈ្មោះ <span className="form-field__required">*</span>
              </label>
              <input
                className="form-field__input"
                type="text"
                name="name"
                placeholder="បញ្ចូលឈ្មោះ"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="form-field">
              <label className="form-field__label">
                Email <span className="form-field__required">*</span>
              </label>
              <input
                className="form-field__input"
                type="email"
                name="email"
                placeholder="example@school.edu.kh"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Role */}
            <div className="form-field">
              <label className="form-field__label">
                Role <span className="form-field__required">*</span>
              </label>
              <select
                className="form-field__select"
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Password row */}
            <div className="form-row">
              <div className="form-field">
                <label className="form-field__label">
                  Password <span className="form-field__required">*</span>
                </label>
                <input
                  className="form-field__input"
                  type="password"
                  name="password"
                  placeholder="យ៉ាងតិច ៨ តួ"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label className="form-field__label">
                  Confirm Password <span className="form-field__required">*</span>
                </label>
                <input
                  className="form-field__input"
                  type="password"
                  name="password_confirmation"
                  placeholder="បញ្ចូលម្ដងទៀត"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="user-form-card__footer">
            <Link to="/" className="btn-cancel">បោះបង់</Link>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "កំពុងរក្សាទុក..." : "💾 រក្សាទុក"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;