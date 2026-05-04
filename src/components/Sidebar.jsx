import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSidebar } from "../context/SidebarProvider";
import "../assets/style/Sidebar.css";

const menuItems = [
  {
    id: "dashboard",
    labelKh: "ផ្ទាំងក្រប់ក្រម",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
    children: [
      { id: "home", path: "/", labelKh: "ទំព័រដើម" },
      { id: "subjects", path: "/subjects", labelKh: "មុខវិជ្ជា" },
    ],
  },

  {
    id: "schedule",
    path: "/schedule",
    labelKh: "កាលវិភាគ",
    icon: <span>📅</span>,
  },
  {
    id: "class",
    path: "/classes",
    labelKh: "ថ្នាក់រៀន",
    icon: <span>🏫</span>,
  },
  {
    id: "students",
    path: "/students",
    labelKh: "សិស្ស",
    icon: <span>👨‍🎓</span>,
  },
  {
    id: "notifications",
    path: "/notifications",
    labelKh: "សេចក្តីជូនដំណឹង",
    icon: <span>🔔</span>,
  },
  {
    id: "settings",
    path: "/settings",
    labelKh: "ការកំណត់",
    icon: <span>⚙️</span>,
  },
];

const Sidebar = () => {
  const { isOpen, close } = useSidebar();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarClasses = [
    "sidebar",
    isMobile ? "sidebar--mobile" : "sidebar--desktop",
    isMobile ? (isOpen ? "sidebar--open" : "sidebar--closed") : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {/* Overlay */}
      {isMobile && isOpen && (
        <div className="sidebar__overlay" onClick={close} />
      )}

      <aside className={sidebarClasses}>
        <div>

          {/* LOGO */}
          <div className="sidebar__logo">
            <div className="sidebar__logo-icon">A</div>
            <div>
              <div className="sidebar__logo-name">Attendance</div>
              <div className="sidebar__logo-sub">វត្តមាន</div>
            </div>
          </div>

          {/* MENU */}
          <nav className="sidebar__nav">
            {menuItems.map((item) => (
              <div key={item.id}>

                {/* WITH DROPDOWN */}
                {item.children ? (
                  <>
                    <div
                      className="sidebar__nav-link"
                      onClick={() =>
                        setOpenMenu(openMenu === item.id ? null : item.id)
                      }
                    >
                      <span className="sidebar__nav-icon">{item.icon}</span>
                      <span>{item.labelKh}</span>
                      <span style={{ marginLeft: "auto" }}>
                        {openMenu === item.id ? "▲" : "▼"}
                      </span>
                    </div>

                    {openMenu === item.id && (
                      <div className="sidebar__submenu">
                        {item.children.map((sub) => (
                          <NavLink
                            key={sub.id}
                            to={sub.path}
                            end={sub.path === "/"}
                            onClick={close}
                            className={({ isActive }) =>
                              [
                                "sidebar__submenu-link",
                                isActive ? "sidebar__nav-link--active" : "",
                              ]
                                .filter(Boolean)
                                .join(" ")
                            }
                          >
                            {sub.labelKh}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  /* NORMAL LINK */
                  <NavLink
                    to={item.path}
                    onClick={close}
                    className={({ isActive }) =>
                      [
                        "sidebar__nav-link",
                        isActive ? "sidebar__nav-link--active" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")
                    }
                  >
                    <span className="sidebar__nav-icon">{item.icon}</span>
                    <span>{item.labelKh}</span>
                  </NavLink>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* USER */}
        <div className="sidebar__user">
          <div className="sidebar__user-avatar">👤</div>
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