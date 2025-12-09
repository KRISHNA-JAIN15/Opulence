import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verifyEmail, resendVerification, reset } from "../store/authSlice";
import { useToast } from "../components/Toast";
import { Mail, CheckCircle, Loader, RefreshCw } from "lucide-react";

const VerifyEmail = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { verificationEmail, isLoading, isError, isSuccess, message } =
    useSelector((state) => state.auth);

  useEffect(() => {
    if (!verificationEmail) {
      navigate("/signup");
    }

    if (isError) {
      toast.error(message || "Verification failed. Please try again.");
    }

    if (isSuccess && message.includes("verified")) {
      toast.success("Email verified successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }

    return () => {
      dispatch(reset());
    };
  }, [
    verificationEmail,
    isSuccess,
    isError,
    message,
    navigate,
    dispatch,
    toast,
  ]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (verificationCode.length === 6) {
      dispatch(
        verifyEmail({
          email: verificationEmail,
          verificationCode,
        })
      );
    } else {
      toast.error("Please enter a 6-digit verification code");
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    await dispatch(resendVerification(verificationEmail));
    toast.success("Verification code resent! Check your email.");
    setResendLoading(false);
    setTimeout(() => {
      dispatch(reset());
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-2xl rounded-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-black rounded-full flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-black text-black uppercase">
              Verify Email
            </h2>
            <p className="mt-2 text-gray-600">We've sent a 6-digit code to</p>
            <p className="font-bold text-black">{verificationEmail}</p>
          </div>

          {/* Alert */}
          {isError && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-700 text-sm">{message}</p>
            </div>
          )}

          {isSuccess && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-green-700 text-sm">{message}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Verification Code */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 text-center">
                Enter Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 6) {
                    setVerificationCode(value);
                  }
                }}
                maxLength="6"
                className="block w-full text-center text-3xl font-bold py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent tracking-widest"
                placeholder="000000"
                required
              />
              <p className="mt-2 text-sm text-gray-500 text-center">
                Please enter the 6-digit code
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || verificationCode.length !== 6}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black font-bold uppercase transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </button>
          </form>

          {/* Resend Code */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-3">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="inline-flex items-center text-black font-bold hover:text-gray-700 transition disabled:opacity-50"
            >
              {resendLoading ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw className="-ml-1 mr-2 h-4 w-4" />
                  Resend Code
                </>
              )}
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              <strong>Note:</strong> The verification code will expire in 10
              minutes. Please check your spam folder if you don't see the email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
