import { useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("admin@erp.com");
  const [password, setPassword] = useState("Password@123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate("/");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Desktop branding panel */}
        <div className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-950" />
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Mini ERP</p>
                <p className="text-xs text-blue-100">CRM Operations</p>
              </div>
            </div>

            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-blue-100 backdrop-blur">
                <Sparkles className="h-4 w-4" />
                Operations Management Portal
              </div>

              <h1 className="text-5xl font-bold leading-tight text-white xl:text-6xl">
                Manage your
                <span className="block text-blue-200">
                  business operations
                </span>
                in one place.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-slate-300">
                Manage customers, products, inventory, stock movements and
                sales challans through one centralized ERP platform.
              </p>

              <div className="mt-10 grid grid-cols-3 gap-4">
                {[
                  ["CRM", "Customer Management"],
                  ["ERP", "Business Operations"],
                  ["Live", "Inventory Tracking"],
                ].map(([title, description]) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur"
                  >
                    <p className="text-2xl font-bold text-white">{title}</p>
                    <p className="mt-1 text-xs text-slate-300">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm text-slate-400">
              © 2026 Mini ERP · Secure Operations Platform
            </p>
          </div>
        </div>

        {/* Login panel */}
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">Mini ERP</p>
                <p className="text-xs text-slate-500">CRM Operations</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-9">
              <div className="mb-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                  <ShieldCheck className="h-6 w-6 text-blue-600" />
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                  Welcome back
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Sign in to access your operations dashboard.
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Password
                    </label>
                    <span className="text-xs font-medium text-slate-400">
                      Secure login
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-blue-600/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-7 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  Demo credentials
                </p>

                <div className="mt-3 space-y-1.5 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500">Email</span>
                    <span className="font-semibold text-slate-700">
                      admin@erp.com
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500">Password</span>
                    <span className="font-semibold text-slate-700">
                      Password@123
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-slate-400">
              Authorized access only · Mini ERP & CRM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
