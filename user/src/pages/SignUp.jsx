import { Button, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import comunity from "../assets/comunity.png";
import toast from "react-hot-toast";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("signup"); // 'signup' or 'verifyOtp'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === "signup") {
      const { username, email, password, confirmPassword } = formData;

      if (!username || !email || !password || !confirmPassword) {
        return toast.error("Please fill out all fields.");
      }

      if (password !== confirmPassword) {
        return toast.error("Passwords do not match.");
      }

      if (password.length < 8) {
        return toast.error("Password must be at least 8 characters long.");
      }

      try {
        setLoading(true);
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Content-Type-Options": "nosniff",
          },
          body: JSON.stringify({ username, email, password }),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok || data.success === false) {
          return toast.error(data.message || "Registration failed.");
        }

        toast.success("Signup successful! Please verify your email.");
        setStep("verifyOtp");
      } catch (error) {
        setLoading(false);
        toast.error("Something went wrong. Please try again later.");
      }
    } else if (step === "verifyOtp") {
      try {
        setLoading(true);
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, otp }),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok || data.success === false) {
          return toast.error(data.message || "OTP verification failed.");
        }

        toast.success("Email verified! You can now sign in.");
        navigate("/sign-in");
      } catch (error) {
        setLoading(false);
        toast.error("Something went wrong during OTP verification.");
      }
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
        {/* Left Side */}
        <div className="w-full md:w-5/7 relative">
          <div className="bg-white rounded-lg p-2 z-0 relative">
            <img
              src={comunity || "/placeholder.svg"}
              alt="Community illustration"
              className="w-full h-auto object-cover rounded-lg mb-0"
            />
            <div className="bg-offwhite rounded-lg shadow-md p-4 -mt-10 relative z-10">
              <p className="text-xsm text-gray-600 space-y-3">
                Ratoflag is like a big neighborhood notice board with a map...
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full mt-12 md:w-1/2">
          <h1 className="text-center text-2xl font-bold mb-7">
            {step === "signup" ? "SIGN UP" : "VERIFY YOUR EMAIL"}
          </h1>
          <div className="border rounded-lg p-2 bg-white-500">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {step === "signup" ? (
                <>
                  <TextInput
                    type="text"
                    placeholder="Username"
                    id="username"
                    onChange={handleChange}
                    value={formData.username}
                    theme={customInputTheme}
                    color="gray"
                    required
                  />
                  <TextInput
                    type="email"
                    placeholder="name@company.com"
                    id="email"
                    onChange={handleChange}
                    value={formData.email}
                    theme={customInputTheme}
                    color="gray"
                    required
                  />
                  <TextInput
                    type="password"
                    placeholder="Password"
                    id="password"
                    onChange={handleChange}
                    value={formData.password}
                    theme={customInputTheme}
                    color="gray"
                    required
                  />
                  <TextInput
                    type="password"
                    placeholder="Confirm Password"
                    id="confirmPassword"
                    onChange={handleChange}
                    value={formData.confirmPassword}
                    theme={customInputTheme}
                    color="gray"
                    required
                  />
                </>
              ) : (
                <>
                  <p className="text-center mb-4 text-gray-700">
                    We sent an OTP to your email:{" "}
                    <strong>{formData.email}</strong>. Please enter it below to
                    verify your account.
                  </p>
                  <TextInput
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={handleOtpChange}
                    theme={customInputTheme}
                    color="gray"
                    required
                  />
                </>
              )}

              <Button className="h-10" color="failure" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">
                      {step === "signup" ? "Signing up..." : "Verifying..."}
                    </span>
                  </>
                ) : step === "signup" ? (
                  "Sign Up"
                ) : (
                  "Verify OTP"
                )}
              </Button>
              {step === "signup" && <OAuth />}
            </form>
            {step === "signup" && (
              <div className="flex gap-2 text-sm mt-3">
                <span>Have an account?</span>
                <Link to="/sign-in" className="text-blue-500">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
