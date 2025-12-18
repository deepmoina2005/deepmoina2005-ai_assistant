import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowRight, BrainCircuit, Lock, Mail, Eye, EyeOff } from "lucide-react";
import Button from "../../components/common/Button";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // toggle state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { token, user } = await authService.login(email, password);
      login(user, token);
      toast.success("Logged in successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.message || "Failed to login. Please check your credentials."
      );
      toast.error(err.message || "Failed to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-100 flex flex-col items-center justify-center relative px-4">
      {/* Pattern BG */}
      <div className="absolute inset-0 bg-[radial-gradient(#d1fae5_1px,transparent_1px)] bg-size-[16px_16px] opacity-40" />

      {/* Back Button */}
      <Button className="absolute top-6 left-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
      </Button>

      {/* Card */}
      <div className="relative w-full max-w-md px-6">
        <div className="bg-white/80 backdrop-blur-xl border border-emerald-200/60 rounded-3xl shadow-xl shadow-emerald-200/40 p-10">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30 mb-4">
              <BrainCircuit className="text-white w-7 h-7" strokeWidth={2} />
            </div>

            <h1 className="text-3xl font-semibold text-emerald-700">
              Welcome back
            </h1>
            <p className="text-slate-500 mt-1">
              Sign in to continue your journey
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 flex flex-col gap-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="text-sm text-emerald-700 font-medium">
                Email
              </label>
              <div className="relative mt-1">
                <Mail
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                    focusedField === "email"
                      ? "text-emerald-500"
                      : "text-slate-400"
                  }`}
                />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-10 pr-10 py-2.5 border border-emerald-200 rounded-lg bg-white
                  focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none
                  shadow-sm transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-emerald-700 font-medium">
                Password
              </label>
              <div className="relative mt-1">
                <Lock
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                    focusedField === "password"
                      ? "text-emerald-500"
                      : "text-slate-400"
                  }`}
                />
                <input
                  type={showPassword ? "text" : "password"} // toggle
                  placeholder="abc123@@XYZ"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-10 pr-10 py-2.5 border border-emerald-200 rounded-lg bg-white
                  focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none
                  shadow-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2 text-center">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg
              font-medium flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg 
              disabled:bg-emerald-400"
            >
              {loading ? (
                <span className="animate-pulse">Signing in...</span>
              ) : (
                <>
                  Sign in
                  <ArrowRight strokeWidth={2.5} className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-emerald-600 font-semibold hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-4">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
