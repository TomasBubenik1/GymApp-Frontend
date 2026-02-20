import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const MENU_ITEMS = [
  { label: "View Profile", icon: "person", action: "profile" },
  { label: "Settings", icon: "settings", action: "settings" },
  { divider: true },
  { label: "Log Out", icon: "logout", action: "logout", danger: true },
];

function ProfileBox({ nickname, profilepic, username }) {
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleAction(action) {
    setOpen(false);
    if (action === "profile") return navigate(`/${username}`);
    if (action === "settings") return navigate("/settings");
    if (action === "logout") {
      const cookies = new Cookies();
      cookies.remove("token", { path: "/" });
      navigate("/login");
    }
  }

  // Avatar fallback: initials from nickname or username
  const initials = (nickname || username || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const hasAvatar = profilepic && !imgError;

  return (
    <div className="relative font-dm" ref={ref}>

      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full border transition-all duration-200 group
          ${open
            ? "bg-white/[0.06] border-white/[0.15]"
            : "bg-transparent border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]"
          }`}
      >
        {/* Avatar */}
        <Avatar
          src={profilepic}
          initials={initials}
          hasAvatar={hasAvatar}
          onError={() => setImgError(true)}
          size={30}
        />

        {/* Name */}
        <div className="flex flex-col items-start leading-none">
          <span className="text-[13px] font-semibold text-text max-w-[100px] truncate">
            {nickname || username}
          </span>
          {nickname && nickname !== username && (
            <span className="text-[10px] text-white/30 mt-0.5 max-w-[100px] truncate">
              @{username}
            </span>
          )}
        </div>

        {/* Chevron */}
        <span
          className={`material-symbols-outlined text-[16px] text-white/25 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          expand_more
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-52 bg-[#111] border border-white/[0.09] rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden z-50 animate-step-in">

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
            <Avatar
              src={profilepic}
              initials={initials}
              hasAvatar={hasAvatar}
              onError={() => setImgError(true)}
              size={36}
            />
            <div className="flex flex-col leading-none min-w-0">
              <span className="text-[13px] font-semibold text-text truncate">
                {nickname || username}
              </span>
              <span className="text-[11px] text-white/30 mt-1 truncate">@{username}</span>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1.5">
            {MENU_ITEMS.map((item, i) => {
              if (item.divider) {
                return <div key={i} className="my-1.5 h-px bg-white/[0.06] mx-3" />;
              }
              return (
                <button
                  key={item.action}
                  onClick={() => handleAction(item.action)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150
                    ${item.danger
                      ? "text-red-400 hover:bg-red-500/[0.08] hover:text-red-300"
                      : "text-white/55 hover:bg-white/[0.04] hover:text-text"
                    }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  <span className="text-[13px] font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileBox;

/* ── Avatar sub-component ── */
function Avatar({ src, initials, hasAvatar, onError, size }) {
  return (
    <div
      className="rounded-full overflow-hidden shrink-0 bg-accent/15 border border-accent/20 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {hasAvatar ? (
        <img
          src={src}
          alt="avatar"
          className="w-full h-full object-cover"
          onError={onError}
        />
      ) : (
        <span
          className="font-bebas text-accent leading-none"
          style={{ fontSize: size * 0.4 }}
        >
          {initials}
        </span>
      )}
    </div>
  );
}