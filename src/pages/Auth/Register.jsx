import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const STEPS = [{ label: "Account" }, { label: "Body" }];

export default function Register() {
  const [step, setStep] = useState(1);
  const [emailTaken, setEmailTaken] = useState(false);
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { setMounted(true); }, []);

  const [userData, setUserData] = useState({
    email: "", password: "", username: "",
    currentWeight: "", goalWeight: "", height: "",
  });

  function handleDataChange(param, value) {
    setUserData((prev) => ({ ...prev, [param]: value }));
  }

  async function handleEmailChange(e) {
    const val = e.target.value;
    handleDataChange("email", val);
    if (!val) { setEmailTaken(false); return; }
    try {
      const res = await axios.post("http://localhost:5000/api/checkuniqueemail", { email: val });
      setEmailTaken(res.data.result);
    } catch { setEmailTaken(false); }
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

  async function handleRegisterSubmit() {
    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/api/register", {
        email: userData.email, username: userData.username,
        password: userData.password, nickname: userData.username,
        currentWeight: parseFloat(userData.currentWeight),
        goalWeight: parseFloat(userData.goalWeight),
        height: parseFloat(userData.height),
      });
      navigate("../login");
    } catch (err) {
      console.error("Error creating user:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const step1Valid =
    userData.email.includes("@") && userData.password.length >= 6 &&
    userData.username.length > 5 && !emailTaken && !usernameTaken;

  const step2Valid = userData.currentWeight && userData.goalWeight && userData.height;

  const pwLen = userData.password.length;
  const pwStrength = pwLen >= 10 ? "strong" : pwLen >= 6 ? "medium" : pwLen > 0 ? "weak" : "";
  const pwBarColors = [1, 2, 3].map((n) => {
    if (pwStrength === "strong") return "bg-accent";
    if (pwStrength === "medium") return n <= 2 ? "bg-yellow-400" : "bg-white/10";
    if (pwStrength === "weak") return n === 1 ? "bg-red-500" : "bg-white/10";
    return "bg-white/10";
  });

  return (
    <div className="font-dm flex w-screen min-h-screen bg-black overflow-hidden">

      {/* LEFT PANEL */}
      <div className="left-panel relative hidden md:flex w-[48%] flex-col justify-between p-12 bg-[#0a0a0a] overflow-hidden">
        <div className="noise-layer" />

        <span className={`font-bebas text-accent text-[22px] tracking-[3px] z-10 transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}>
          MUSCLE TRACKER
        </span>

        <div className={`z-10 transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
          <div className="flex items-center gap-2 mb-5">
            <span className="inline-block w-7 h-px bg-accent" />
            <p className="text-accent text-[11px] font-semibold tracking-[3px] uppercase">Join the Community</p>
          </div>
          <h1 className="font-bebas text-text tracking-[2px] leading-[0.92]" style={{ fontSize: "clamp(64px,7vw,88px)" }}>
            BUILD<br />YOUR<span className="text-accent block">LEGACY.</span>
          </h1>
          <p className="mt-7 text-sm font-light text-white/40 leading-relaxed max-w-xs">
            Set your goals, track every rep, and watch your progress compound over time.
          </p>
        </div>

        {/* Step tracker */}
        <div className={`z-10 transition-all duration-700 delay-[400ms] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
          <p className="text-[11px] font-semibold tracking-[2px] uppercase text-white/25 mb-4">
            Registration Progress
          </p>
          <div className="flex items-start">
            {STEPS.map((s, i) => {
              const num = i + 1;
              const isActive = step === num;
              const isDone = step > num;
              return (
                <div key={i} className="flex items-start">
                  <div className="flex flex-col items-center gap-[6px]">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bebas text-base border transition-all duration-300
                      ${isActive ? "bg-accent border-accent text-black shadow-[0_0_0_4px_rgba(70,182,53,0.15)]"
                        : isDone ? "bg-accent/15 border-accent/40 text-accent"
                          : "bg-transparent border-white/[0.12] text-white/30"}`}
                    >
                      {isDone
                        ? <span className="material-symbols-outlined text-[16px]">check</span>
                        : num
                      }
                    </div>
                    <span className={`text-[10px] font-medium tracking-[1.5px] uppercase transition-colors duration-300
                      ${isActive ? "text-accent" : isDone ? "text-accent/60" : "text-white/25"}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`h-px w-12 mt-4 mx-1 transition-colors duration-300 ${isDone ? "bg-accent/30" : "bg-white/[0.08]"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 md:px-12 bg-black py-12">
        <div className={`w-full max-w-sm transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-5"}`}>

          {/* Progress bar */}
          <div className="mb-10 w-full h-px bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(70,182,53,0.5)]"
              style={{ width: `${(step / STEPS.length) * 100}%` }}
            />
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="animate-step-in">
              <div className="mb-9">
                <h2 className="font-bebas text-[42px] text-text tracking-[2px] leading-none mb-2">CREATE ACCOUNT</h2>
                <p className="text-sm font-light text-white/40">
                  Already a member?{" "}
                  <Link to="../login" className="text-accent font-medium hover:opacity-75 transition-opacity">
                    Sign in
                  </Link>
                </p>
              </div>

              <div className="flex flex-col gap-5">
                <InputField label="Email Address">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    onChange={handleEmailChange}
                    autoComplete="email"
                    className={inputClass(emailTaken)}
                  />
                  {emailTaken && <FieldError>This email is already registered</FieldError>}
                </InputField>

                <InputField label="Username">
                  <input
                    type="text"
                    placeholder="yourhandle"
                    onChange={handleUsernameChange}
                    autoComplete="username"
                    className={inputClass(usernameTaken)}
                  />
                  {usernameTaken && <FieldError>This username is taken</FieldError>}
                  {!usernameTaken && userData.username && userData.username.length <= 5 && (
                    <FieldError warn>Must be at least 6 characters</FieldError>
                  )}
                </InputField>

                <InputField label="Password">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      onChange={(e) => handleDataChange("password", e.target.value)}
                      autoComplete="new-password"
                      className={`${inputClass(false)} pr-12`}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-[14px] top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                  {userData.password && (
                    <div className="flex items-center gap-1 mt-1">
                      {pwBarColors.map((cls, i) => (
                        <div key={i} className={`flex-1 h-[2px] rounded-full transition-all duration-300 ${cls}`} />
                      ))}
                      <span className="text-[11px] text-white/30 ml-2 min-w-[44px] capitalize">{pwStrength}</span>
                    </div>
                  )}
                </InputField>

                <PrimaryButton disabled={!step1Valid} onClick={() => setStep(2)}>
                  Continue
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </PrimaryButton>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="animate-step-in">
              <div className="mb-9">
                <h2 className="font-bebas text-[42px] text-text tracking-[2px] leading-none mb-2">BODY METRICS</h2>
                <p className="text-sm font-light text-white/40">Used to personalise your experience</p>
              </div>

              <p className="mb-6 px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[12px] text-white/30 leading-relaxed">
                These help us track your progress accurately. Update them anytime from your dashboard.
              </p>

              <div className="flex flex-col gap-5">
                <InputField label="Height">
                  <UnitInput
                    unit="cm"
                    placeholder="175"
                    value={userData.height}
                    onChange={(e) => handleDataChange("height", e.target.value)}
                  />
                </InputField>

                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Current Weight">
                    <UnitInput
                      unit="kg"
                      placeholder="80"
                      value={userData.currentWeight}
                      onChange={(e) => handleDataChange("currentWeight", e.target.value)}
                    />
                  </InputField>
                  <InputField label="Goal Weight">
                    <UnitInput
                      unit="kg"
                      placeholder="75"
                      value={userData.goalWeight}
                      onChange={(e) => handleDataChange("goalWeight", e.target.value)}
                    />
                  </InputField>
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-none flex items-center gap-1 px-5 py-[15px] bg-white/[0.05] text-white/50 text-sm font-semibold border border-white/[0.08] rounded-lg transition-all duration-200 hover:bg-white/[0.08] hover:text-white/70"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Back
                  </button>
                  <PrimaryButton
                    disabled={!step2Valid || isLoading}
                    onClick={handleRegisterSubmit}
                    className="flex-1"
                  >
                    {isLoading
                      ? <><Spinner /> Creating…</>
                      : "Create Account"
                    }
                  </PrimaryButton>
                </div>
              </div>
            </div>
          )}

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

function UnitInput({ unit, ...props }) {
  return (
    <div className="relative">
      <input type="number" className={`${inputClass(false)} pr-12`} {...props} />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-semibold tracking-wide text-white/25 pointer-events-none">
        {unit}
      </span>
    </div>
  );
}

function FieldError({ children, warn }) {
  return (
    <p className={`flex items-center gap-1 text-[12px] ${warn ? "text-yellow-400/80" : "text-red-400"}`}>
      <span className="material-symbols-outlined text-[14px]">
        {warn ? "warning" : "error"}
      </span>
      {children}
    </p>
  );
}

function PrimaryButton({ disabled, onClick, children, className = "" }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`py-[15px] px-5 bg-accent text-black font-bold text-sm tracking-[1.5px] uppercase rounded-lg transition-all duration-200 hover:bg-[#52cc3f] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(70,182,53,0.35)] active:translate-y-0 disabled:opacity-35 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none ${className}`}
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