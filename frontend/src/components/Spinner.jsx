import React, { useState, useEffect } from 'react';

const Spinner = () => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("error");
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleGoHome = () => {
    window.location.href = "/";
  };
  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F0F6FF] font-sans px-4">
        <svg
          className="w-24 h-24 text-blue-400 mb-6 drop-shadow-sm"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>

        <h2 className="text-3xl font-extrabold text-gray-800 mb-3 text-center tracking-tight">
          Oops! Something went wrong.
        </h2>
        <p className="text-gray-500 mb-8 max-w-md text-center leading-relaxed">
          We couldn't connect to the server in time. Please try refreshing the
          page or head back to the homepage.
        </p>

        <button
          onClick={handleGoHome}
          className="px-8 py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition-all duration-200 shadow-md hover:shadow-lg focus:ring-4 focus:ring-blue-200"
        >
          Return to Homepage
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F0F6FF] font-sans px-4">
      <div className="relative flex items-center justify-center w-20 h-20 mb-8">
        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        <svg
          className="w-7 h-7 text-blue-500 animate-pulse mt-1"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      <h2 className="text-2xl font-extrabold text-gray-800 mb-2 tracking-tight">
        HealthPulse
        <span className="text-blue-500 text-3xl leading-none relative -top-1 ml-0.5">
          ⁺
        </span>
      </h2>
      <p className="text-blue-500 font-medium animate-pulse">
        Connecting to your dashboard...
      </p>
    </div>
  );
};

export default Spinner;
