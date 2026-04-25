import { useState } from "react";
import { useSidebar } from "../context/SidebarProvider";
import "../assets/style/Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [searchValue, setSearchValue] = useState("");
  const { toggle } = useSidebar();

  return (
    <nav className="navbar">
      {/* Left: Hamburger + Title */}
      <div className="navbar__left">
        <button
          onClick={toggle}
          className="navbar__hamburger"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <h1 className="navbar__title">Dashboard</h1>
      </div>

      {/* Right */}
      <div className="navbar__right">
        {/* Search */}
        <div className="navbar__search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="navbar__search-input"
          />
        </div>

        {/* Bell */}
        <div className="navbar__bell">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="navbar__bell-badge">3</span>
        </div>

{/* Avatar */}
        <Link to="/login" className="navbar__avatar">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#60a5fa">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;