/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API_URL from "../../Api/api";
import "../../assets/style/UserForm.css";

const Edit = () => {
  const { id }    = useParams();       // /users/:id/edit
  const navigate  = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "student",
  });
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [fetching, setFetching]   = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting]   = useState(false);

  // ── Fetch existing user ──
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API_URL.get(`admin/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const u = res.data?.data ?? res.data;
        setForm({
          name:                  u.name  ?? "",
          email:                 u.email ?? "",
          password:              "",
          password_confirmation: "",
          role:                  u.role  ?? "student",
        });
      } catch (err) {
        setError("មិនអាចទាញព័ត៌មានអ្នកប្រើ!");
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchUser();
  }, [id]);

  // ── Handle input ──
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // ── Submit update ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password && form.password !== form.password_confirmation) {
      setError("Password និង Confirm Password មិនដូចគ្នា!");
      return;
    }
    if (form.password && form.password.length < 8) {
      setError("Password ត្រូវការយ៉ាងតិច ៨ តួអក្សរ!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Only send password if user typed something
      const payload = {
        name:  form.name,
        email: form.email,
        role:  form.role,
        ...(form.password ? {
          password:              form.password,
          password_confirmation: form.password_confirmation,
        } : {}),
      };

      await API_URL.post(`/admin/user/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("កែប្រែបានជោគជ័យ! ✅");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      const msg = err.response?.data?.message
        ?? Object.values(err.response?.data?.errors ?? {})[0]?.[0]
        ?? "មានបញ្ហាក្នុងការកែប្រែ!";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Delete user ──
  const handleDelete = async () => {
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await API_URL.delete(`/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/");
    } catch (err) {
      setError("មិនអាចលុបអ្នកប្រើប្រាស់នេះ!");
      setShowDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="user-form-page">

      {/* Top bar */}
      <div className="user-form-page__topbar">
        <Link to="/" className="user-form-page__back">
          ← ត្រឡប់
        </Link>
        <h2 className="user-form-page__title">កែប្រែអ្នកប្រើប្រាស់</h2>
      </div>

      <div className="user-form-card">
        {/* Card header */}
        <div className="user-form-card__header">
          <div className="user-form-card__header-icon" style={{ backgroundColor: "#7c3aed" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </div>
          <div>
            <div className="user-form-card__header-title">កែប្រែព័ត៌មានអ្នកប្រើប្រាស់</div>
            <div className="user-form-card__header-sub">ID: {id}</div>
          </div>
        </div>

        {/* Loading skeleton */}
        {fetching ? (
          <div className="user-form-card__body">
            {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton" />)}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="user-form-card__body">

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
                <label className="form-field__label">Role</label>
                <select
                  className="form-field__select"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Password row — optional on edit */}
              <div className="form-row">
                <div className="form-field">
                  <label className="form-field__label">Password ថ្មី</label>
                  <input
                    className="form-field__input"
                    type="password"
                    name="password"
                    placeholder="ទុកទទេ = មិនផ្លាស់ប្ដូរ"
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-field">
                  <label className="form-field__label">Confirm Password</label>
                  <input
                    className="form-field__input"
                    type="password"
                    name="password_confirmation"
                    placeholder="បញ្ចូលម្ដងទៀត"
                    value={form.password_confirmation}
                    onChange={handleChange}
                  />
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="user-form-card__footer">
              {/* Delete button (left side) */}
              <button
                type="button"
                className="btn-submit btn-submit--danger"
                style={{ marginRight: "auto" }}
                onClick={() => setShowDelete(true)}
              >
                🗑 លុប
              </button>

              <Link to="/" className="btn-cancel">បោះបង់</Link>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "កំពុងរក្សាទុក..." : "💾 រក្សាទុក"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ── Delete Confirm Modal ── */}
      {showDelete && (
        <div style={{
          position: "fixed", inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 999, padding: "16px",
        }}>
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "18px",
            padding: "32px 28px",
            maxWidth: "420px",
            width: "100%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            fontFamily: "inherit",
            textAlign: "center",
          }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "50%",
              backgroundColor: "#fff5f5",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px", fontSize: "26px",
            }}>🗑</div>
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#1e293b", marginBottom: "8px" }}>
              បញ្ជាក់ការលុប
            </h3>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px", lineHeight: 1.6 }}>
              តើអ្នកពិតជាចង់លុបអ្នកប្រើប្រាស់នេះ?<br/>
              ការលុបនេះមិនអាចដំណើរការបានក្រោយ!
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setShowDelete(false)}
                className="btn-cancel"
                style={{ flex: 1, justifyContent: "center" }}
              >
                បោះបង់
              </button>
              <button
                onClick={handleDelete}
                className="btn-submit btn-submit--danger"
                disabled={deleting}
                style={{ flex: 1 }}
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

export default Edit;