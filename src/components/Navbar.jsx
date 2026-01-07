import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";

const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard", site: "dashboard", icon: "space_dashboard" },
  { label: "Social", href: "/social", site: "social", icon: "groups" },
  { label: "Workout Plans", href: "/workoutplanselection", site: "workoutplans", icon: "list_alt" },
  { label: "Exercises", href: "/exercises", site: "exercises", icon: "fitness_center" },
  { label: "Notifications", href: "/notifications", site: "notifications", icon: "notifications" },
  { label: "Profile", href: null, site: "profile", icon: "person" },
];

function Navbar({ currentSite, username }) {
  const [notificationCount, setNotificationCount] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/getloggedinuser",
          { withCredentials: true }
        );
        const unread = response.data.UserData.receivedNotifications.filter(
          (n) => !n.read
        ).length;
        setNotificationCount(unread);
      } catch (e) {
        console.error("Error fetching notifications:", e);
      }
    }
    fetchNotifications();
  }, []);

  return (
    <>
      {/* ── Sidebar ── */}
      <nav className={`relative flex flex-col bg-[#080808] border-r border-white/[0.06] h-screen sticky top-0 transition-all duration-300 ease-in-out ${collapsed ? "w-[72px]" : "w-[260px]"}`}>

        {/* Top accent line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

        {/* Brand */}
        <div className={`flex items-center h-16 border-b border-white/[0.06] px-5 ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && (
            <Link to="/dashboard" className="font-bebas text-[18px] tracking-[3px] text-accent hover:opacity-80 transition-opacity">
              MUSCLE TRACKER
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white/25 hover:text-white/60 transition-colors flex items-center"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span className="material-symbols-outlined text-[20px]">
              {collapsed ? "menu_open" : "menu"}
            </span>
          </button>
        </div>

        {/* Nav links */}
        <div className="flex flex-col gap-1 px-3 pt-4 flex-1">
          {NAV_LINKS.map((link) => {
            const href = link.site === "profile" ? `/${username}` : link.href;
            const active = currentSite === link.site;

            return (
              <Link
                key={link.site}
                to={href}
                title={collapsed ? link.label : undefined}
                className={`relative flex items-center gap-3 rounded-lg px-3 py-[10px] transition-all duration-150 group
                  ${active
                    ? "bg-accent/10 text-accent"
                    : "text-white/40 hover:text-text hover:bg-white/[0.04]"
                  }`}
              >
                {/* Active left bar */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-accent rounded-full" />
                )}

                {/* Icon + badge wrapper */}
                <div className="relative shrink-0">
                  <span className={`material-symbols-outlined transition-colors duration-150 ${active ? "text-accent" : "text-white/40 group-hover:text-text"}`}
                    style={{ fontSize: "22px" }}
                  >
                    {link.icon}
                  </span>

                  {/* Notification badge */}
                  {link.site === "notifications" && notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-accent text-black text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                      {notificationCount > 99 ? "99+" : notificationCount}
                    </span>
                  )}
                </div>

                {/* Label */}
                {!collapsed && (
                  <span className={`text-sm font-medium tracking-wide truncate transition-colors duration-150 ${active ? "text-accent" : "text-white/40 group-hover:text-text"}`}>
                    {link.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom: version tag */}
        {!collapsed && (
          <div className="px-5 pb-5 pt-3 border-t border-white/[0.05]">
            <p className="text-[10px] text-white/15 tracking-[2px] uppercase">v1.0.0</p>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;