import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSidebar } from "../context/SidebarProvider";
import "../assets/style/Sidebar.css";

const menuItems = [
  {
    id: "dashboard",
    path: "/",
    labelKh: "ផ្ទាំងក្រប់ក្រម",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    id: "schedule",
    path: "/schedule",
    labelKh: "កាលវិភាគ",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
    {
    id: "class",
    path: "/classes",
    labelKh: "ថ្នាក់រៀន",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  //student
    {
    id: "students",
    path: "/students",
    labelKh: "សិស្ស",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M20 6L9 17l-5-5 1.4-1.4L9 14.2 18.6 4.6z"/>
      </svg>
    ),
    },

  {

    id: "notifications",
    path: "/notifications",
    labelKh: "សេចក្តីជូនដំណឹង",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    id: "settings",
    path: "/settings",
    labelKh: "និងការកំណត់",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

const Sidebar = () => {
  const { isOpen, close } = useSidebar();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Build sidebar class names
  const sidebarClasses = [
    "sidebar",
    isMobile ? "sidebar--mobile" : "sidebar--desktop",
    isMobile ? (isOpen ? "sidebar--open" : "sidebar--closed") : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {/* Dark overlay on mobile when sidebar is open */}
      {isMobile && isOpen && (
        <div className="sidebar__overlay" onClick={close} />
      )}

      <aside className={sidebarClasses}>
        <div>
          {/* Logo */}
          <div className="sidebar__logo">
            <div className="sidebar__logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" />
                <path d="M10 14l-2-2 1.4-1.4L10 11.2l4.6-4.6L16 8l-6 6z" fill="#fbbf24" />
              </svg>
            </div>
            <div>
              <div className="sidebar__logo-name">Attendance </div>
              <div className="sidebar__logo-sub">វត្តមាន</div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="sidebar__nav">
            {menuItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === "/"}
                onClick={close}
                className={({ isActive }) =>
                  ["sidebar__nav-link", isActive ? "sidebar__nav-link--active" : ""]
                    .filter(Boolean)
                    .join(" ")
                }
              >
                <span className="sidebar__nav-icon">{item.icon}</span>
                <span>{item.labelKh}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User profile at bottom */}
        <div className="sidebar__user">
          <div className="sidebar__user-avatar">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#60a5fa">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
          <div>
            <div className="sidebar__user-name">មឿន សាម៉េត</div>
            <div className="sidebar__user-id">ID: STU56789</div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;