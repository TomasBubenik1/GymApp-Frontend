import React from "react";
import ProfileBox from "../components/ProfileBox";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import Footer from "../components/Footer";

/* ── Section wrapper card ── */
function SettingsCard({ title, subtitle, icon, children }) {
  return (
    <div className="relative bg-[#0e0e0e] rounded-2xl border border-white/[0.07] overflow-hidden hover:border-white/[0.11] transition-all duration-300">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent" />
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.05]">
        <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-accent text-[17px]">{icon}</span>
        </div>
        <div>
          <h3 className="font-bebas text-[16px] text-text tracking-[2px] leading-none">{title}</h3>
          {subtitle && (
            <p className="text-[10px] text-white/25 tracking-[1.5px] uppercase mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

/* ── Field wrapper ── */
function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-semibold tracking-[2px] uppercase text-white/40">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-white/20 leading-relaxed">{hint}</p>}
    </div>
  );
}

/* ── Styled input ── */
function SettingsInput({ error, ...props }) {
  return (
    <input
      {...props}
      className={`w-full bg-white/[0.04] border rounded-xl px-4 py-3 text-text text-sm outline-none transition-all duration-200 placeholder:text-white/20
        ${error
          ? "border-red-500/40 focus:border-red-500/60 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.06)]"
          : "border-white/[0.08] focus:border-accent/50 focus:shadow-[0_0_0_3px_rgba(70,182,53,0.07)]"
        }`}
    />
  );
}

/* ── Styled textarea ── */
function SettingsTextarea(props) {
  return (
    <textarea
      {...props}
      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-text text-sm outline-none focus:border-accent/50 focus:shadow-[0_0_0_3px_rgba(70,182,53,0.07)] transition-all duration-200 placeholder:text-white/20 resize-none"
    />
  );
}

/* ── Avatar uploader ── */
function AvatarUploader({ currentSrc, selectedImage, onImageChange }) {
  const inputRef = useRef(null);
  const previewSrc = selectedImage ? URL.createObjectURL(selectedImage) : currentSrc;
  const hasImage = !!previewSrc;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Circle */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative group w-24 h-24 rounded-full overflow-hidden border-2 border-white/[0.1] hover:border-accent/50 transition-all duration-200 focus:outline-none"
      >
        {hasImage ? (
          <img src={previewSrc} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-white/[0.04] flex items-center justify-center">
            <span className="material-symbols-outlined text-[32px] text-white/20">person</span>
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="material-symbols-outlined text-[22px] text-white">photo_camera</span>
        </div>
      </button>
      <p className="text-[11px] text-white/25 tracking-[1px]">Click to change photo</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onImageChange}
      />
    </div>
  );
}

/* ── Save button ── */
function SaveButton({ onClick, saving, saved }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-black font-bold text-sm tracking-[1px] uppercase hover:bg-[#52cc3f] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(70,182,53,0.35)] active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
    >
      {saving ? (
        <>
          <span className="material-symbols-outlined text-[16px] animate-spin" style={{ animationDuration: "0.6s" }}>progress_activity</span>
          Saving…
        </>
      ) : saved ? (
        <>
          <span className="material-symbols-outlined text-[16px]">check</span>
          Saved!
        </>
      ) : (
        <>
          <span className="material-symbols-outlined text-[16px]">save</span>
          Save Changes
        </>
      )}
    </button>
  );
}

/* ── Main Component ── */
export function ProfileSettings() {
  const [userData, setUserData] = useState([]);
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [settingsData, setSettingsData] = useState({
    username: "",
    nickname: "",
    realname: "",
    bio: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  function handleImageChange(e) {
    setSelectedImage(e.target.files[0]);
    setSaved(false);
  }

  async function handleSubmitChanges() {
    setSaving(true);
    try {
      const formData = new FormData();
      if (selectedImage) formData.append("file", selectedImage);
      Object.keys(settingsData).forEach((key) => {
        formData.append(key, settingsData[key]);
      });
      await axios.post("http://localhost:5000/api/handleuserinfochange", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      console.error("There was error changing user data:", error);
    } finally {
      setSaving(false);
    }
  }

  function handleDataChange(param, value) {
    setSaved(false);
    setSettingsData((prev) => ({ ...prev, [param]: value }));
  }

  async function handleUsernameChange(e) {
    const val = e.target.value;
    handleDataChange("username", val);
    if (!val) { setUsernameTaken(false); return; }
    try {
      const res = await axios.post("http://localhost:5000/api/checkuniqueusername", { username: val });
      setUsernameTaken(res.data.result);
    } catch { setUsernameTaken(false); }
  }

  async function fetchLoggedInData() {
    try {
      const response = await axios.get("http://localhost:5000/api/getloggedinuser", { withCredentials: true });
      const u = response.data.UserData;
      setUserData(u);
      setSettingsData({
        username: u.username || "",
        nickname: u.nickname || "",
        realname: u.nickname || "",
        bio: u.bio || "",
      });
    } catch (error) {
      console.error("Error fetching logged in user data:", error);
    }
  }

  useEffect(() => {
    fetchLoggedInData();
    setTimeout(() => setMounted(true), 50);
  }, []);

  const bioLength = settingsData.bio?.length || 0;

  return (
    <div className="font-dm flex flex-col min-h-screen bg-backgroundcolor">
      <div className="flex flex-1 w-full">
        <Navbar currentSite="settings" username={userData?.username} />

        <main className="flex-1 flex flex-col bg-backgroundcolor">

          {/* ── Top bar ── */}
          <nav className="sticky top-0 z-30 w-full h-16 flex items-center justify-between px-8 bg-black/70 backdrop-blur-xl border-b border-white/[0.05]">
            <span className="font-bebas text-[22px] tracking-[3px] text-text">SETTINGS</span>
            <ProfileBox
              nickname={userData.nickname}
              profilepic={userData.profilepicture}
              username={userData.username}
            />
          </nav>

          <div className="flex-1 px-8 pb-16 overflow-auto max-w-3xl mx-auto w-full">

            {/* ── Heading ── */}
            <div className={`mt-8 mb-8 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
              <p className="text-white/25 text-[11px] font-semibold tracking-[3px] uppercase mb-2">Account</p>
              <h2 className="font-bebas text-[52px] text-text tracking-[2px] leading-none">
                YOUR <span className="text-accent">PROFILE</span>
              </h2>
              <p className="text-white/30 text-sm mt-2 tracking-wide">
                Manage how others see you across the platform.
              </p>
            </div>

            <div className="flex flex-col gap-5">

              {/* ── Profile picture + identity ── */}
              <div className={`transition-all duration-700 delay-[100ms] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
                <SettingsCard title="Identity" subtitle="How you appear to others" icon="badge">
                  <div className="flex items-start gap-8">

                    {/* Avatar column */}
                    <AvatarUploader
                      currentSrc={userData.profilepicture}
                      selectedImage={selectedImage}
                      onImageChange={handleImageChange}
                    />

                    {/* Fields column */}
                    <div className="flex-1 flex flex-col gap-5">
                      <Field
                        label="Username"
                        hint="Must be unique. Used in your profile URL and to find you on the platform."
                      >
                        <div className="relative">
                          <SettingsInput
                            type="text"
                            placeholder="yourhandle"
                            value={settingsData.username}
                            onChange={handleUsernameChange}
                            error={usernameTaken}
                          />
                          {usernameTaken && (
                            <div className="flex items-center gap-1.5 mt-2 text-red-400 text-[12px]">
                              <span className="material-symbols-outlined text-[14px]">error</span>
                              This username is already taken
                            </div>
                          )}
                        </div>
                      </Field>

                      <Field label="Display Name">
                        <SettingsInput
                          type="text"
                          placeholder="Your display name"
                          value={settingsData.nickname}
                          onChange={(e) => handleDataChange("nickname", e.target.value)}
                        />
                      </Field>

                      <Field label="Real Name">
                        <SettingsInput
                          type="text"
                          placeholder="Your full name"
                          value={settingsData.realname}
                          onChange={(e) => handleDataChange("realname", e.target.value)}
                        />
                      </Field>
                    </div>
                  </div>
                </SettingsCard>
              </div>

              {/* ── Bio ── */}
              <div className={`transition-all duration-700 delay-[180ms] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
                <SettingsCard title="About You" subtitle="Shown on your public profile" icon="person_edit">
                  <Field label="Bio">
                    <div className="relative">
                      <SettingsTextarea
                        placeholder="Tell the community a bit about yourself…"
                        value={settingsData.bio}
                        rows={4}
                        maxLength={200}
                        onChange={(e) => handleDataChange("bio", e.target.value)}
                      />
                      <span className={`absolute bottom-3 right-3 text-[11px] font-medium ${bioLength > 180 ? "text-amber-400/70" : "text-white/20"}`}>
                        {bioLength}/200
                      </span>
                    </div>
                  </Field>
                </SettingsCard>
              </div>

              {/* ── Danger zone ── */}
              <div className={`transition-all duration-700 delay-[260ms] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
                <div className="relative bg-[#0e0e0e] rounded-2xl border border-red-500/15 overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/25 to-transparent" />
                  <div className="flex items-center gap-3 px-6 py-5 border-b border-red-500/10">
                    <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-red-400 text-[17px]">warning</span>
                    </div>
                    <div>
                      <h3 className="font-bebas text-[16px] text-red-400 tracking-[2px] leading-none">Danger Zone</h3>
                      <p className="text-[10px] text-white/20 tracking-[1.5px] uppercase mt-0.5">Irreversible actions</p>
                    </div>
                  </div>
                  <div className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-text text-sm font-medium">Delete Account</p>
                      <p className="text-white/30 text-[12px] mt-0.5">Permanently delete your account and all data. This cannot be undone.</p>
                    </div>
                    <button className="shrink-0 ml-6 flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-500/25 text-red-400 text-sm font-semibold hover:bg-red-500/[0.08] hover:border-red-500/40 transition-all duration-200">
                      <span className="material-symbols-outlined text-[16px]">delete_forever</span>
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Actions ── */}
              <div className={`flex justify-end pt-2 transition-all duration-700 delay-[300ms] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
                <SaveButton
                  onClick={handleSubmitChanges}
                  saving={saving}
                  saved={saved}
                />
              </div>

            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}