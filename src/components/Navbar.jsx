import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarProvider";
import api from "../Api/api";
import "../assets/style/Navbar.css";

const Navbar = () => {
  const { toggle } = useSidebar();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // បង្កើត Function សម្រាប់ Fetch ទិន្នន័យ User
  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/profile");
      setUser(res.data);
    } catch (err) {
      console.error("Navbar fetch error:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // ហៅដំបូងពេល Component លោតឡើង
    fetchUser();

    // ✅ ស្តាប់ការផ្លាស់ប្តូរពី Login ឬ Logout
    window.addEventListener("authChange", fetchUser);

    return () => {
      window.removeEventListener("authChange", fetchUser);
    };
  }, [fetchUser]);



  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__left">
          <button onClick={toggle} className="navbar__hamburger">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <h1 className="navbar__title">Dashboard</h1>
        </div>

        <div className="navbar__right">
          {user && (
            <div className="navbar__actions">
              <div className="navbar__search">
                <input type="text" placeholder="ស្វែងរក..." className="navbar__search-input" />
              </div>
            </div>
          )}

          <div className="navbar__user-section">
            {loading ? (
              <span className="loading-text">⏳</span>
            ) : user ? (
              <div className="navbar__profile-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link to="/settings" className="navbar__user" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="navbar__avatar">👤</div>
                  <span className="navbar__user-name">{user.name}</span>
                </Link>
                {/* <button onClick={handleLogout} className="navbar__logout-btn">ចាកចេញ</button> */}
              </div>
            ) : (
              <Link to="/login" className="navbar__login-link">
                <button className="navbar__login-button">ចូលប្រើប្រាស់</button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;