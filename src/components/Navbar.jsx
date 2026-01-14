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
    <nav
      className={`
        relative flex flex-col h-screen sticky top-0 z-40
        bg-[#080808]
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-[68px]" : "w-[240px]"}
      `}
    >
      {/* Right border with gradient */}
      <div className="absolute right-0 top-0 bottom-0 w-px">
        <div className="h-full bg-gradient-to-b from-transparent via-white/[0.07] to-transparent" />
      </div>

      {/* Subtle background radial glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-accent/[0.04] blur-3xl" />
      </div>

      {/* ── Brand ── */}
      <div className={`
        relative flex items-center h-16 shrink-0
        border-b border-white/[0.05]
        ${collapsed ? "justify-center px-0" : "px-5 justify-between"}
      `}>
        {!collapsed && (
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 group"
          >
            {/* Logo mark */}
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(70,182,53,0.4)] group-hover:shadow-[0_0_18px_rgba(70,182,53,0.55)] transition-shadow duration-300">
              <span className="material-symbols-outlined text-black text-[16px] font-bold">bolt</span>
            </div>
            <span className="font-bebas text-[16px] tracking-[3px] text-white/80 group-hover:text-white transition-colors duration-200">
              MUSCLE TRACKER
            </span>
          </Link>
        )}

        {collapsed && (
          <Link to="/dashboard" className="group">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-[0_0_12px_rgba(70,182,53,0.35)] group-hover:shadow-[0_0_20px_rgba(70,182,53,0.55)] transition-all duration-300">
              <span className="material-symbols-outlined text-black text-[18px]">bolt</span>
            </div>
          </Link>
        )}

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/20 hover:text-white/50 hover:bg-white/[0.05] transition-all duration-150"
            title="Collapse sidebar"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
        )}
      </div>

      {/* Collapsed expand button */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="absolute -right-3 top-[26px] w-6 h-6 rounded-full bg-[#111] border border-white/[0.1] flex items-center justify-center text-white/30 hover:text-white/60 hover:border-white/[0.2] transition-all duration-150 shadow-lg z-50"
          title="Expand sidebar"
        >
          <span className="material-symbols-outlined text-[13px]">chevron_right</span>
        </button>
      )}

      {/* ── Section label ── */}
      {!collapsed && (
        <div className="px-5 pt-5 pb-2">
          <p className="text-[9px] font-semibold tracking-[2.5px] uppercase text-white/15">Navigation</p>
        </div>
      )}

      {collapsed && <div className="pt-4" />}

      {/* ── Nav links ── */}
      <div className={`flex flex-col gap-0.5 flex-1 ${collapsed ? "px-2" : "px-3"}`}>
        {NAV_LINKS.map((link) => {
          const href = link.site === "profile" ? `/${username}` : link.href;
          const active = currentSite === link.site;

          return (
            <Link
              key={link.site}
              to={href}
              title={collapsed ? link.label : undefined}
              className={`
                relative flex items-center rounded-xl
                transition-all duration-150 group
                ${collapsed ? "justify-center h-10 w-10 mx-auto" : "gap-3 px-3 py-2.5"}
                ${active
                  ? "bg-accent/[0.12] text-accent"
                  : "text-white/35 hover:text-white/75 hover:bg-white/[0.04]"
                }
              `}
            >
              {/* Active glow blob */}
              {active && (
                <div className="absolute inset-0 rounded-xl bg-accent/[0.06] blur-sm pointer-events-none" />
              )}

              {/* Active left stripe */}
              {active && !collapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] bg-accent rounded-r-full shadow-[0_0_6px_rgba(70,182,53,0.8)]" />
              )}

              {/* Icon + badge */}
              <div className="relative shrink-0">
                <span
                  className={`
                    material-symbols-outlined transition-all duration-150
                    ${collapsed ? "text-[20px]" : "text-[19px]"}
                    ${active
                      ? "text-accent"
                      : "text-white/30 group-hover:text-white/65"
                    }
                  `}
                >
                  {link.icon}
                </span>

                {link.site === "notifications" && notificationCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 bg-accent text-black text-[9px] font-bold rounded-full flex items-center justify-center leading-none shadow-[0_0_8px_rgba(70,182,53,0.6)]">
                    {notificationCount > 99 ? "99+" : notificationCount}
                  </span>
                )}
              </div>

              {/* Label */}
              {!collapsed && (
                <span className={`
                  text-[13px] font-medium tracking-wide truncate transition-colors duration-150
                  ${active ? "text-accent" : "text-white/35 group-hover:text-white/75"}
                `}>
                  {link.label}
                </span>
              )}

              {/* Active dot in collapsed mode */}
              {active && collapsed && (
                <div className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-accent rounded-full shadow-[0_0_6px_rgba(70,182,53,0.8)]" />
              )}
            </Link>
          );
        })}
      </div>

      {/* ── Bottom section ── */}
      <div className={`shrink-0 border-t border-white/[0.04] ${collapsed ? "py-4 flex justify-center" : "px-4 py-4"}`}>
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Status dot */}
              <div className="relative">
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                <div className="absolute inset-0 rounded-full bg-accent animate-ping opacity-60" />
              </div>
              <span className="text-[10px] text-white/15 tracking-[2px] uppercase">Online</span>
            </div>
            <span className="text-[10px] text-white/10 tracking-[1.5px]">v1.0.0</span>
          </div>
        ) : (
          <div className="relative">
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            <div className="absolute inset-0 rounded-full bg-accent animate-ping opacity-60" />
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;