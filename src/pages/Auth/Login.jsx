import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  async function handleLoginSubmit(e) {
    e?.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      navigate("../dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials. Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const isValid = email.includes("@") && password.length > 0;

  return (
    <div className="font-dm flex w-screen h-screen bg-black overflow-hidden">

      {/* LEFT PANEL */}
      <div className="left-panel relative hidden md:flex w-[48%] flex-col justify-between p-12 bg-[#0a0a0a] overflow-hidden">
        <div className="noise-layer" />

        <span className={`font-bebas text-accent text-[22px] tracking-[3px] z-10 transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}>
          MUSCLE TRACKER
        </span>

        <div className={`z-10 transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
          <div className="flex items-center gap-2 mb-5">
            <span className="inline-block w-7 h-px bg-accent" />
            <p className="text-accent text-[11px] font-semibold tracking-[3px] uppercase">Performance Tracking</p>
          </div>
          <h1 className="font-bebas text-text tracking-[2px] leading-[0.92]" style={{ fontSize: "clamp(64px,7vw,96px)" }}>
            PUSH<br />YOUR<span className="text-accent block">LIMITS.</span>
          </h1>
          <p className="mt-7 text-sm font-light text-white/40 leading-relaxed max-w-xs">
            Track workouts, monitor progress, and connect with athletes who share your drive.
          </p>
        </div>

        <div className={`z-10 flex gap-10 transition-all duration-700 delay-[400ms] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
          {[["880+", "Exercises"], ["∞", "Plans"], ["100%", "Free"]].map(([num, label]) => (
            <div key={label} className="flex flex-col">
              <span className="font-bebas text-[32px] text-text leading-none tracking-wide">{num}</span>
              <span className="text-[11px] font-medium tracking-[2px] uppercase text-white/35 mt-1">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 md:px-12 bg-black">
        <div className={`w-full max-w-sm transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-5"}`}>

          <div className="mb-10">
            <h2 className="font-bebas text-[42px] text-text tracking-[2px] leading-none mb-2">SIGN IN</h2>
            <p className="text-sm font-light text-white/40">
              New here?{" "}
              <Link to="../register" className="text-accent font-medium hover:opacity-75 transition-opacity">
                Create an account
              </Link>
            </p>
          </div>

          {error && (
            <div className="animate-shake flex items-center gap-2 px-4 py-3 mb-5 bg-red-600/[0.08] border border-red-600/20 rounded-lg text-red-400 text-[13px]">
              <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">

            <InputField label="Email Address">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className={inputClass()}
              />
            </InputField>

            <InputField label="Password">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className={`${inputClass()} pr-12`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[14px] top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors flex items-center"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </InputField>

            <SubmitButton disabled={!isValid || isLoading}>
              {isLoading
                ? <><Spinner /> Signing in…</>
                : "Sign In"
              }
            </SubmitButton>

          </form>
        </div>
      </div>
    </div>
  );
}

/* ── Shared helpers ── */

const inputClass = (hasError = false) =>
  `w-full bg-[#0d0d0d] border rounded-lg px-[18px] py-[14px] text-text text-[15px] outline-none transition-all duration-200 placeholder:text-white/20 focus:bg-[#111] ${hasError
    ? "border-red-600/40 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.06)]"
    : "border-white/[0.08] focus:border-accent/50 focus:shadow-[0_0_0_3px_rgba(70,182,53,0.07)]"
  }`;

function InputField({ label, children }) {
  return (
    <div className="flex flex-col gap-[10px]">
      <label className="text-[11px] font-semibold tracking-[2px] uppercase text-white/45">{label}</label>
      {children}
    </div>
  );
}

function SubmitButton({ disabled, children }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="mt-2 w-full py-[15px] px-5 bg-accent text-black font-bold text-sm tracking-[1.5px] uppercase rounded-lg transition-all duration-200 hover:bg-[#52cc3f] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(70,182,53,0.35)] active:translate-y-0 disabled:opacity-35 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
    >
      <span className="flex items-center justify-center gap-2">{children}</span>
    </button>
  );
}

function Spinner() {
  return (
    <span className="material-symbols-outlined text-[18px] animate-spin-custom">
      progress_activity
    </span>
  );
}