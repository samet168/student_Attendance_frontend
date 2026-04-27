import { useState, useEffect } from "react";
import API_URL from "../Api/api";
import { Link } from "react-router-dom";
import "../assets/style/Dashboard.css";

// ── Stat Card ─────────────────────────────────────────────
const StatCard = ({ title, value, icon, variant }) => (
  <div className={`stat-card stat-card--${variant}`}>
    <div>
      <div className="stat-card__label">{title}</div>
      <div className="stat-card__value">{value}</div>
    </div>
    {icon && <div className="stat-card__icon">{icon}</div>}
  </div>
);

// ── Dashboard ─────────────────────────────────────────────
const Dashboard = () => {
  const [users, setUsers]       = useState([]);
  const [search, setSearch]     = useState("");
  const [loading, setLoading]   = useState(true);
  const [loadingId, setLoadingId] = useState(null);   // ✅ ដាក់នៅខាងក្រៅ useEffect
  const [deleteId, setDeleteId] = useState(null);     // ✅ id ដែលកំពុងបង្ហាញ modal

  // ── Fetch users ──────────────────────────────────────
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API_URL.get("/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const list = res.data?.data?.data ?? res.data?.data ?? [];
        setUsers(list);
      } catch (err) {
        console.error("Fetch users error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();   // ✅ call នៅខាងក្នុង useEffect
  }, []);

  // ── Delete user ───────────────────────────────────────
  const deleteUser = async () => {
    if (!deleteId) return;
    setLoadingId(deleteId);
    try {
      const token = localStorage.getItem("token");
      await API_URL.delete(`/user/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // ✅ remove user from list without re-fetch
      setUsers((prev) => prev.filter((u) => u.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error("Delete error:", err);
      alert("មានបញ្ហាក្នុងការលុបអ្នកប្រើប្រាស់!");
    } finally {
      setLoadingId(null);
    }
  };

  // ── Derived stats ──
  const total    = users.length;
  const admins   = users.filter((u) => u.role === "admin").length;
  const teachers = users.filter((u) => u.role === "teacher").length;
  const students = users.filter((u) => u.role === "student").length;

  // ── Search filter ──
  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  const roleBadgeClass = (role) => {
    if (role === "admin")   return "role-badge role-badge--admin";
    if (role === "teacher") return "role-badge role-badge--teacher";
    return "role-badge role-badge--student";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "–";
    return new Date(dateStr).toLocaleDateString("km-KH", {
      year: "numeric", month: "short", day: "numeric",
    });
  };

  return (
    <div className="dashboard">

      <h2 className="dashboard__title">សង្ខេបអ្នកប្រើប្រាស់ ( ២០២៥)</h2>

      {/* ── Stat Cards ── */}
      <div className="dashboard__stats">
        <StatCard
          title="អ្នកប្រើប្រាស់សរុប"
          value={loading ? "..." : total}
          variant="blue"
          icon={
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          }
        />
        <StatCard
          title="Admin"
          value={loading ? "..." : admins}
          variant="red"
          icon={
            <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"/>
            </svg>
          }
        />
        <StatCard
          title="Teacher"
          value={loading ? "..." : teachers}
          variant="yellow"
          icon={
            <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
              <path d="M12 14l9-5-9-5-9 5 9 5z"/>
              <path d="M12 14l6.16-3.42a12 12 0 0 1 .34 2.76A12 12 0 0 1 12 21a12 12 0 0 1-6.5-6.66 12 12 0 0 1 .34-2.76L12 14z"/>
            </svg>
          }
        />
        <StatCard
          title="Student"
          value={loading ? "..." : students}
          variant="green"
          icon={
            <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
              <path d="M20 6L9 17l-5-5 1.4-1.4L9 14.2 18.6 4.6z"/>
            </svg>
          }
        />
      </div>

      {/* ── Table Card ── */}
      <div className="dashboard__table-card">
        <div className="dashboard__table-header">
          <h3 className="dashboard__table-title">បញ្ជីអ្នកប្រើប្រាស់</h3>
          <div className="dashboard__controls">
            <input
              type="text"
              className="dashboard__search"
              placeholder="ស្វែងរកឈ្មោះ, Email, Role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Link to="/users/create" className="dashboard__add-btn">
              + បន្ថែមអ្នកប្រើប្រាស់
            </Link>
          </div>
        </div>

        <div className="dashboard__table-wrap">
          <table className="dashboard__table">
            <thead>
              <tr>
                {["#", "ឈ្មោះ", "Email", "Role", "បង្កើតនៅ", "Actions"].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <tr key={user.id}>
                  <td className="td--num">{i + 1}</td>
                  <td className="td--name">{user.name}</td>
                  <td className="td--email">{user.email}</td>
                  <td>
                    <span className={roleBadgeClass(user.role)}>
                      {user.role}
                    </span>
                  </td>
                  <td className="td--date">{formatDate(user.created_at)}</td>
                  <td>
                    <div className="dashboard__actions">
                      <Link
                        to={`/users/edit/${user.id}`}
                        className="dashboard__edit-btn"
                      >
                        ✏️ កែប្រែ
                      </Link>
                      {/* ✅ onClick បើក modal ជំនួស window.confirm */}
                      <button
                        className="dashboard__delete-btn"
                        onClick={() => setDeleteId(user.id)}
                        disabled={loadingId === user.id}
                      >
                        {loadingId === user.id ? "កំពុងលុប..." : "🗑 លុប"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="dashboard__empty">⏳ កំពុងទាញទិន្នន័យ...</div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="dashboard__empty">រកមិនឃើញអ្នកប្រើប្រាស់</div>
        )}
      </div>

      {/* ── Delete Confirm Modal ── */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-box__icon">🗑</div>
            <h3 className="modal-box__title">បញ្ជាក់ការលុប</h3>
            <p className="modal-box__desc">
              តើអ្នកពិតជាចង់លុបអ្នកប្រើប្រាស់នេះ?<br />
              ការលុបនេះមិនអាចដំណើរការក្រោយបានទេ!
            </p>
            <div className="modal-box__actions">
              <button
                className="btn-cancel"
                onClick={() => setDeleteId(null)}
              >
                បោះបង់
              </button>
              <button
                className="btn-delete"
                onClick={deleteUser}
                disabled={!!loadingId}
              >
                {loadingId ? "កំពុងលុប..." : "លុបចោល"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;