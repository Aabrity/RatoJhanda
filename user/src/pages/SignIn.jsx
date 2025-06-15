import { Alert, Button, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import comunity from "../assets/comunity.png";
import { toast } from "react-hot-toast"; // 🆕

export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotStep, setForgotStep] = useState(0);
  const [forgotLoading, setForgotLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill all the fields");
      return dispatch(signInFailure("Please fill all the fields"));
    }
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error(data.message || "Sign-in failed");
        return dispatch(signInFailure(data.message));
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
      dispatch(signInFailure(error.message));
    }
  };

  const handleForgotRequest = async () => {
    setForgotLoading(true);
    if (!forgotEmail) {
      toast.error("Please enter your email");
      setForgotLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        toast.error(data.message || "Failed to send OTP");
      } else {
        setForgotStep(1);
        toast.success("OTP sent to your email");
      }
    } catch (error) {
      toast.error("Something went wrong, try again later");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setForgotLoading(true);

    if (!otp || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      setForgotLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      setForgotLoading(false);
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      setForgotLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotEmail,
          otp,
          newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        toast.error(data.message || "Failed to reset password");
      } else {
        toast.success("Password reset successful");
        setForgotStep(2);
      }
    } catch (error) {
      toast.error("Something went wrong, try again later");
    } finally {
      setForgotLoading(false);
    }
  };

  const customInputTheme = {
    field: {
      input: {
        base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50",
        colors: {
          gray: "bg-gray-50 border-gray-300 text-gray-900 focus:border-red-500 focus:ring-red-500",
        },
      },
    },
  };

  return (
    <div className="min-h-screen mt-10 px-4">
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto gap-8 items-start">
        <div className="w-full md:w-5/7 relative">
          <div className="bg-white rounded-lg p-2 z-0 relative">
            <img
              src={comunity || "/placeholder.svg"}
              alt="Community illustration"
              className="w-full h-auto object-cover rounded-lg mb-0"
            />
            <div className="bg-offwhite rounded-lg shadow-md p-4 -mt-10 relative z-10 ">
              <p className="text-xsm text-gray-600 space-y-3">
                Welcome back to Ratoflag! Sign in to report alerts, help your community,
                or catch up on important local posts. Stay informed and connected with just a few clicks!
              </p>
            </div>
          </div>
        </div>

        <div className="w-full mt-12 md:w-1/2">
          {forgotStep === 0 && (
            <>
              <h1 className="text-center text-2xl font-bold mb-7">SIGN IN</h1>
              <div className="border rounded-lg p-2 bg-white-500">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  <TextInput
                    type="email"
                    placeholder="name@company.com"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    theme={customInputTheme}
                    color="gray"
                    required
                    autoComplete="email"
                  />
                  <TextInput
                    type="password"
                    placeholder="**********"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    theme={customInputTheme}
                    color="gray"
                    required
                    autoComplete="current-password"
                  />
                  <Button className="h-10" color="failure" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner size="sm" />
                        <span className="pl-3">Loading...</span>
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                  <OAuth />
                </form>
                <div className="flex justify-between mt-2">
                  <Link to="/sign-up" className="text-blue-500 text-sm">
                    Don’t have an account? Sign Up
                  </Link>
                  <button
                    className="text-blue-500 text-sm underline hover:no-underline"
                    onClick={() => {
                      setForgotStep(1);
                      setForgotEmail("");
                      setOtp("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
            </>
          )}

          {forgotStep === 1 && (
            <>
              <h1 className="text-center text-2xl font-bold mb-7">Reset Password</h1>
              <div className="border rounded-lg p-4 bg-white-500 space-y-4">
                {!otp && (
                  <>
                    <TextInput
                      type="email"
                      placeholder="Enter your email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value.trim())}
                      theme={customInputTheme}
                      color="gray"
                      required
                    />
                    <Button
                      onClick={handleForgotRequest}
                      color="failure"
                      disabled={forgotLoading}
                      className="w-full"
                    >
                      {forgotLoading ? <Spinner size="sm" /> : "Send OTP"}
                    </Button>
                  </>
                )}

                {otp !== "" || forgotLoading === false ? (
                  <>
                    <TextInput
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.trim())}
                      theme={customInputTheme}
                      color="gray"
                      required
                    />
                    <TextInput
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      theme={customInputTheme}
                      color="gray"
                      required
                    />
                    <TextInput
                      type="password"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      theme={customInputTheme}
                      color="gray"
                      required
                    />
                    <Button
                      onClick={handleResetPassword}
                      color="failure"
                      disabled={forgotLoading}
                      className="w-full"
                    >
                      {forgotLoading ? <Spinner size="sm" /> : "Reset Password"}
                    </Button>
                  </>
                ) : null}
              </div>
            </>
          )}

          {forgotStep === 2 && (
            <div className="border rounded-lg p-4 bg-white-500 text-center">
              <h2 className="text-green-600 font-bold text-lg mb-4">Password Reset Successful!</h2>
              <Button onClick={() => setForgotStep(0)} color="failure" className="w-full">
                Back to Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
