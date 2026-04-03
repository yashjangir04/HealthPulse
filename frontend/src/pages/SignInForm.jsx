import React, { useState } from "react";
import { login, getMe } from "../api/auth";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";

const buttonClasses = `w-full text-white bg-gradient-to-r from-blue-600 to-indigo-600 font-bold rounded-2xl text-[15px] px-5 py-4 text-center transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-[0_12px_25px_-8px_rgba(79,70,229,0.5)] active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed`;

const buttonForGFT = `flex justify-center items-center w-full rounded-2xl border border-gray-200 bg-white py-3.5 px-4 text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)]`;

const SignInForm = () => {
  const { Login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      await login(formData);
      const res = await getMe();
      Login(res.data.user);
      navigate("/profile");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
    >
      {errorMessage && (
        <div className="p-4 mb-6 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-2xl text-center flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errorMessage}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
            </svg>
          </div>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="block w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 text-gray-900 text-[15px] rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 outline-none placeholder:text-gray-400"
            placeholder="Email address"
            required
          />
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
            </svg>
          </div>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="block w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 text-gray-900 text-[15px] rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 outline-none placeholder:text-gray-400"
            placeholder="Password"
            required
          />
        </div>

        <div className="flex items-center justify-between pt-1 pb-2">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center cursor-pointer">
              <input
                id="remember"
                type="checkbox"
                className="peer appearance-none w-5 h-5 border border-gray-300 rounded-md checked:bg-blue-600 checked:border-blue-600 transition-all duration-200 cursor-pointer"
              />
              <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <label htmlFor="remember" className="text-[14px] font-medium text-gray-600 cursor-pointer select-none">
              Remember me
            </label>
          </div>
          <a href="#" className="text-[14px] font-bold text-blue-600 hover:text-indigo-600 transition-colors">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={buttonClasses}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-400 font-medium">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <button type="button" className={buttonForGFT}>
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
          </svg>
        </button>
        <button type="button" className={buttonForGFT}>
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
          </svg>
        </button>
        <button type="button" className={buttonForGFT}>
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
          </svg>
        </button>
      </div>

      <p className="text-[15px] text-center text-gray-500 mt-8">
        Don't have an account?{" "}
        <a href="/account/register" className="font-bold text-blue-600 hover:text-indigo-600 transition-colors">
          Sign Up
        </a>
      </p>
    </AuthLayout>
  );
};

export default SignInForm;