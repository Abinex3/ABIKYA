import { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminLoginImage from "../../assets/admin/admin-login.png";
import studioLogo from "../../assets/logo.png";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const navigate = useNavigate();

const handleSubmit = async (
  event: React.FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  setError("");
  setLoading(true);

  try {
    const response = await fetch(
      "http://localhost:5000/api/admin/auth/login",
      {
        method: "POST",
        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(
        data.message || "Unable to sign in."
      );
      return;
    }

    // Store CSRF token for authenticated write requests.
    // Do NOT store the session token here.
    if (data.csrfToken) {
      sessionStorage.setItem(
        "admin_csrf_token",
        data.csrfToken
      );
    }

    // Login successful → dashboard
    navigate("/admin", {
      replace: true,
    });
  } catch {
    setError(
      "Unable to connect to the server."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="admin-font h-screen w-full overflow-hidden bg-[linear-gradient(135deg,#f6f0ff_0%,#eef7ff_35%,#fff7e8_70%,#f7efff_100%)] p-4 lg:p-5">
      <section className="mx-auto h-full w-full max-w-[1320px] overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-[0_25px_80px_rgba(86,62,140,0.14)] backdrop-blur-xl">
        <div className="grid h-full grid-cols-1 lg:grid-cols-[52%_48%]">
          {/* LEFT IMAGE */}
          <div className="relative hidden h-full p-4 lg:block">
            <div className="relative h-full overflow-hidden rounded-[22px] bg-[#6d57ff]">
              <img
                src={adminLoginImage}
                alt="ABIKYA admin portal visual"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#21144a]/60" />

              {/* Bottom Content */}
              <div className="absolute inset-x-0 bottom-0 p-7 text-white lg:p-8">
                <div className="mb-4 inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 backdrop-blur-md">
                  <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-white/90">
                    ABIKYA Admin Portal
                  </p>
                </div>

                <h2 className="text-[clamp(2.4rem,3.6vw,4rem)] font-semibold leading-[0.88] tracking-[-0.045em]">
                  Manage.
                  <br />
                  Create.
                  <br />
                  Grow.
                </h2>

                <p className="mt-4 max-w-[360px] text-xs leading-5 text-white/75">
                  Products, collections, stock and customer orders — all from
                  one secure workspace.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT LOGIN */}
          <div className="relative flex h-full items-center justify-center overflow-hidden px-7 py-6 sm:px-12 lg:px-14 xl:px-20">
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#7557ff]/10 blur-3xl" />

            <div className="relative z-10 w-full max-w-[400px]">
              {/* LOGO */}
              <div className="mb-7">
                <img
                  src={studioLogo}
                  alt="ABIKYA Studio"
                  className="h-12 w-auto object-contain"
                />

                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#f3efff] px-3 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#765cff]" />

                  <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#6f59d9]">
                    Administration
                  </span>
                </div>
              </div>

              {/* HEADING */}
              <div className="mb-7">
                <h1 className="text-[clamp(2.5rem,3.5vw,3.7rem)] font-semibold leading-[0.9] tracking-[-0.05em] text-[#181621]">
                  Welcome
                  <br />
                  Back!
                </h1>

                <p className="mt-4 max-w-[330px] text-[13px] leading-5 text-[#746f80]">
                  Sign in to manage your ABIKYA store, products and orders.
                </p>
              </div>

              {/* FORM */}
              <form
  onSubmit={handleSubmit}
  className="space-y-5"
>
                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[9px] font-medium uppercase tracking-[0.18em] text-[#817a8c]"
                  >
                    Email Address
                  </label>

                  <div className="rounded-xl border border-[#e6e0ef] bg-[#faf8ff] px-4 transition-all focus-within:border-[#7b61ff] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(123,97,255,0.08)]">
                    <input
  id="email"
  type="email"
  autoComplete="email"
  placeholder="admin@abikya.com"
  value={email}
  onChange={(event) =>
    setEmail(event.target.value)
  }
  required
  className="w-full border-0 bg-transparent py-3.5 text-sm text-[#1d1a25] outline-none placeholder:text-[#aaa4b2] focus:ring-0"
/>
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-[9px] font-medium uppercase tracking-[0.18em] text-[#817a8c]"
                  >
                    Password
                  </label>

                  <div className="relative rounded-xl border border-[#e6e0ef] bg-[#faf8ff] px-4 transition-all focus-within:border-[#7b61ff] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(123,97,255,0.08)]">
                    <input
  id="password"
  type={showPassword ? "text" : "password"}
  autoComplete="current-password"
  placeholder="Enter your password"
  value={password}
  onChange={(event) =>
    setPassword(event.target.value)
  }
  required
  className="w-full border-0 bg-transparent py-3.5 pr-10 text-sm text-[#1d1a25] outline-none placeholder:text-[#aaa4b2] focus:ring-0"
/>

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((current) => !current)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#8b8495] transition-colors hover:bg-[#f0ecff] hover:text-[#6f58df]"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          className="h-[17px] w-[17px]"
                        >
                          <path d="M3 3l18 18" />
                          <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                          <path d="M9.9 4.2A9.8 9.8 0 0112 4c5.5 0 9 5 9 8a8.7 8.7 0 01-2.1 3.9" />
                          <path d="M6.2 6.2C4.2 7.6 3 10 3 12c0 3 3.5 8 9 8a9 9 0 004-.9" />
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          className="h-[17px] w-[17px]"
                        >
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* ERROR PLACEHOLDER */}
                {error && (
  <div className="rounded-xl border border-[#ffd3dc] bg-[#fff4f6] px-4 py-3 text-xs text-[#d84c6f]">
    {error}
  </div>
)}

                {/* SIGN IN */}
                <button
  type="submit"
  disabled={loading}
  className="flex w-full items-center justify-center rounded-xl bg-[linear-gradient(135deg,#6f57ff_0%,#8767ff_45%,#b065f5_100%)] px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_10px_25px_rgba(111,87,255,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(111,87,255,0.32)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
>
  {loading ? "Signing In..." : "Sign In"}
</button>
              </form>

              {/* SECURITY */}
              <div className="mt-5 flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.14em] text-[#9a94a3]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-3.5 w-3.5 text-[#7159db]"
                >
                  <rect
                    x="5"
                    y="10"
                    width="14"
                    height="10"
                    rx="2"
                  />
                  <path d="M8 10V7a4 4 0 018 0v3" />
                </svg>

                Secure administrator access
              </div>

              {/* FOOTER */}
              <div className="mt-6 border-t border-[#ece7f2] pt-4">
                <p className="text-center text-[9px] leading-4 text-[#aaa4b1]">
                  ABIKYA internal administration portal.
                  <br />
                  Authorized users only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminLogin;