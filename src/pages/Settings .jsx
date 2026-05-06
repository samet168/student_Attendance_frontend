import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api/api";
import "./Settings.css";

const Settings = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchProfile();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUser(res.data);
      setEditedUser({ ...res.data });
    } catch (err) {
      console.error(err);
      setError("មិនអាចទាញយកព័ត៌មានប្រវត្តិរូបបានទេ។");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("តើអ្នកពិតជាចង់ចាកចេញពីគណនីមែនទេ?")) {
      localStorage.removeItem("token");
      showToast("បានចាកចេញដោយជោគជ័យ", "success");
      setTimeout(() => navigate("/login"), 800);
    }
  };

  const handleEdit = () => {
    setEditedUser({ ...user });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser({ ...user });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put("/profile", {
        name: editedUser.name,
        email: editedUser.email,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const updated = res.data.user || res.data;
      setUser(updated);
      setEditedUser({ ...updated });
      setIsEditing(false);
      showToast("បានរក្សាទុកព័ត៌មានប្រវត្តិរូបហើយ។");
    } catch (err) {
      const errors = err.response?.data?.errors;
      showToast(
        errors ? Object.values(errors).flat().join(" ") : err.response?.data?.message || "មានបញ្ហាមួយអ្វីមួយកើតឡើង។",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      showToast("ពាក្យសម្ងាត់ថ្មីមិនដូចគ្នា។", "error");
      return;
    }
    setPasswordSaving(true);
    try {
      await api.put("/profile", {
        current_password: passwordData.current_password,
        password: passwordData.new_password,
        password_confirmation: passwordData.new_password_confirmation,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      showToast("បានប្តូរពាក្យសម្ងាត់ដោយជោគជ័យ។");
      setPasswordData({ current_password: "", new_password: "", new_password_confirmation: "" });
      setShowPasswordSection(false);
    } catch (err) {
      showToast(err.response?.data?.message || "ពាក្យសម្ងាត់បច្ចុប្បន្នមិនត្រឹមត្រូវ។", "error");
    } finally {
      setPasswordSaving(false);
    }
  };

  const getInitials = (name = "") =>
    name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  if (loading) return (
    <div className="s-loading">
      <span className="s-spinner" /> កំពុងផ្ទុក...
    </div>
  );

  if (error || !user) return (
    <div className="s-error">{error || "រកមិនឃើញព័ត៌មានអ្នកប្រើទេ។"}</div>
  );

  return (
    <div className="s-root">
      {toast && (
        <div className={`s-toast s-toast--${toast.type}`}>
          <span className="s-toast-icon">
            {toast.type === "success" ? "✅" : "⚠️"}
          </span>
          {toast.message}
        </div>
      )}

      <div className="s-page">
        <div className="s-header">
          <h1 className="s-title">ការកំណត់</h1>
          <p className="s-subtitle">គ្រប់គ្រងប្រវត្តិរូប និងសុវត្ថិភាពគណនី</p>
        </div>

        {/* Profile Card */}
        <div className="s-card">
          <div className="s-avatar-section">
            <div className="s-avatar">{getInitials(user.name)}</div>
            <div className="s-avatar-info">
              <h2 className="s-name">{user.name}</h2>
              <p className="s-email">{user.email}</p>
              <span className="s-role-badge">{user.role}</span>
            </div>
          </div>

          <div className="s-divider" />

          <div className="s-section">
            <div className="s-section-header">
              <span className="s-section-label">ព័ត៌មានប្រវត្តិរូប</span>
              {!isEditing ? (
                <button className="s-btn-ghost" onClick={handleEdit}>កែប្រែ</button>
              ) : (
                <div className="s-action-group">
                  <button className="s-btn-ghost" onClick={handleCancel}>បោះបង់</button>
                  <button className="s-btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? "កំពុងរក្សាទុក..." : "រក្សាទុក"}
                  </button>
                </div>
              )}
            </div>

            <div className="s-fields">
              <div className="s-field">
                <label className="s-field-label">ឈ្មោះពេញ</label>
                {isEditing ? (
                  <input className="s-input" type="text" name="name" value={editedUser.name || ""} onChange={handleChange} autoFocus />
                ) : (
                  <p className="s-field-value">{user.name}</p>
                )}
              </div>

              <div className="s-field">
                <label className="s-field-label">អាសយដ្ឋានអ៊ីមែល</label>
                {isEditing ? (
                  <input className="s-input" type="email" name="email" value={editedUser.email || ""} onChange={handleChange} />
                ) : (
                  <p className="s-field-value">{user.email}</p>
                )}
              </div>

              <div className="s-field">
                <label className="s-field-label">លេខសម្គាល់អ្នកប្រើ</label>
                <p className="s-field-value s-mono">{user.id}</p>
              </div>

              <div className="s-field">
                <label className="s-field-label">តួនាទី</label>
                <p className="s-field-value">{user.role}</p>
              </div>

              <div className="s-field s-field--full">
                <label className="s-field-label">សមាជិកតាំងពី</label>
                <p className="s-field-value">
                  {new Date(user.created_at).toLocaleDateString("km-KH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Password Card */}
        <div className="s-card">
          <button
            className="s-pwd-toggle"
            onClick={() => setShowPasswordSection((v) => !v)}
          >
            <div className="s-pwd-toggle-left">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2.75" y="7.25" width="10.5" height="7.5" rx="1.25" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <div>
                <span className="s-pwd-title">ប្តូរពាក្យសម្ងាត់</span>
                <span className="s-pwd-hint">ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់គណនី</span>
              </div>
            </div>
            <svg className={`s-chevron ${showPasswordSection ? "s-chevron--open" : ""}`} width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {showPasswordSection && (
            <div className="s-pwd-body">
              <div className="s-divider" />
              <div className="s-pwd-fields">
                {[
                  { key: "current_password", label: "ពាក្យសម្ងាត់បច្ចុប្បន្ន", placeholder: "បញ្ចូលពាក្យសម្ងាត់បច្ចុប្បន្ន" },
                  { key: "new_password", label: "ពាក្យសម្ងាត់ថ្មី", placeholder: "យ៉ាងតិច ៨ តួអក្សរ" },
                  { key: "new_password_confirmation", label: "បញ្ជាក់ពាក្យសម្ងាត់ថ្មី", placeholder: "វាយពាក្យសម្ងាត់ថ្មីម្តងទៀត" },
                ].map(({ key, label, placeholder }) => (
                  <div className="s-field" key={key}>
                    <label className="s-field-label">{label}</label>
                    <div className="s-input-wrapper">
                      <input
                        className="s-input s-input--pwd"
                        type={showPasswords[key === "current_password" ? "current" : key === "new_password" ? "new" : "confirm"] ? "text" : "password"}
                        placeholder={placeholder}
                        value={passwordData[key]}
                        onChange={(e) => setPasswordData((prev) => ({ ...prev, [key]: e.target.value }))}
                      />
                      <button
                        type="button"
                        className="s-eye-btn"
                        onClick={() => {
                          const mapKey = key === "current_password" ? "current" : key === "new_password" ? "new" : "confirm";
                          setShowPasswords((p) => ({ ...p, [mapKey]: !p[mapKey] }));
                        }}
                      >
                        👁
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="s-pwd-actions">
                <button className="s-btn-ghost" onClick={() => {
                  setShowPasswordSection(false);
                  setPasswordData({ current_password: "", new_password: "", new_password_confirmation: "" });
                }}>
                  បោះបង់
                </button>
                <button className="s-btn-primary" onClick={handlePasswordUpdate} disabled={passwordSaving}>
                  {passwordSaving ? "កំពុងធ្វើបច្ចុប្បន្នភាព..." : "ប្តូរពាក្យសម្ងាត់"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Logout Card */}
        <div className="s-card s-logout-card">
          <div className="s-section">
            <div className="s-section-header">
              <span className="s-section-label danger">ចាកចេញពីគណនី</span>
            </div>

            <div className="s-logout-content">
              <div className="s-logout-icon">🚪</div>
              <div>
                <p className="s-logout-title">ចង់ចាកចេញពីគណនីឥឡូវនេះ?</p>
                <p className="s-logout-desc">អ្នកនឹងត្រូវចូលគណនីឡើងវិញបើចង់ប្រើប្រាស់បន្ត។</p>
              </div>
            </div>

            <button onClick={handleLogout} className="s-btn-logout">
              ចាកចេញពីគណនី
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;