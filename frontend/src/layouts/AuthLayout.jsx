const AuthLayout = ({ title, subtitle, children }) => {
    return (
      <div className="flex items-center justify-center min-h-screen py-10 px-4">
        <div className="w-full bg-white rounded-lg shadow-xl shadow-primary/50 max-w-lg border border-gray-100">
          <div className="p-6 space-y-6 md:space-y-7 sm:p-8">
  
            <h1 className="text-xl font-bold text-center">
              {title}
              <p className="text-sm font-normal text-gray-500 mt-1">
                {subtitle}
              </p>
            </h1>
  
            {children}
  
          </div>
        </div>
      </div>
    );
  };
  
  export default AuthLayout;