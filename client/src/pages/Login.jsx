import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login, reset } from "../store/authSlice";
import { Mail, Lock, Eye, EyeOff, Loader } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { email, password } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      // Check if the error is about email verification
      if (message && message.includes("verify your email")) {
        // Redirect to verify email page after a short delay
        setTimeout(() => {
          navigate("/verify-email");
          dispatch(reset());
        }, 2000);
      } else {
        setTimeout(() => {
          dispatch(reset());
        }, 3000);
      }
    }

    if (isSuccess && user) {
      navigate("/");
    }

    return () => {
      dispatch(reset());
    };
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white shadow-2xl rounded-2xl p-10 border border-gray-100 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="mb-4">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight">
              Welcome Back
            </h2>
            <p className="mt-3 text-gray-600 text-lg">
              Sign in to your account
            </p>
          </div>

          {/* Alert */}
          {isError && (
            <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                <div className="ml-3">
                  <p className="text-red-700 text-sm font-medium">{message}</p>
                  {message && message.includes("verify your email") && (
                    <p className="text-red-600 text-xs mt-1">
                      Redirecting to verification page...
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-8">
            {/* Email */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-800 mb-3 tracking-wide">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                  className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-800 mb-3 tracking-wide">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                  className="block w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-100 rounded-r-xl transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-3">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-5 w-5 text-black focus:ring-2 focus:ring-black border-2 border-gray-300 rounded-md transition-colors"
                />
                <label
                  htmlFor="remember-me"
                  className="block text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Remember me
                </label>
              </div>

              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-black hover:text-gray-700 transition-colors underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-white bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-offset-2 font-bold uppercase tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    <span className="text-base">Signing in...</span>
                  </>
                ) : (
                  <span className="text-base">Sign In</span>
                )}
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  Or
                </span>
              </div>
            </div>
            <p className="mt-6 text-base text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-bold text-black hover:text-gray-700 transition-colors underline-offset-4 hover:underline"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
