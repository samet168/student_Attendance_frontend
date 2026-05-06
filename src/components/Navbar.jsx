import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSidebar } from "../context/SidebarProvider";
import api from "../Api/api";
import "../assets/style/Navbar.css";

const Navbar = () => {
  const { toggle } = useSidebar();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // បើគ្មាន token កុំ fetch
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Navbar fetch error:", err);
        // បើ token ខុស លុបចោល
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);   

  return (
    <nav className="navbar">
      <div className="navbar__container">
        {/* Left Side */}
        <div className="navbar__left">
          <button onClick={toggle} className="navbar__hamburger">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <h1 className="navbar__title">Dashboard</h1>
        </div>

        {/* Right Side */}
        <div className="navbar__right">
          {/* Search */}
          <div className="navbar__search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="ស្វែងរក..."
              className="navbar__search-input"
            />
          </div>

          {/* Notification */}
          <div className="navbar__bell">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="navbar__bell-badge">3</span>
          </div>

          {/* User Profile */}
          <Link to="/settings" className="navbar__user">
            <div className="navbar__avatar">
              {loading ? "⏳" : "👤"}
            </div>
            <div className="navbar__user-info">
              <span className="navbar__user-name">
                {loading ? "កំពុងផ្ទុក..." : user?.name || "អ្នកប្រើប្រាស់"}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;