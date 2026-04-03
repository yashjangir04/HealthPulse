import { useNavigate } from "react-router-dom";
import { Stethoscope, User, Store } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();

  const roles = [
    { name: "Doctor", path: "/stepform", icon: <Stethoscope size={28} /> },
    { name: "Patient", path: "/stepformPatient", icon: <User size={28} /> },
    { name: "Shopkeeper", path: "/stepformShopkeeper", icon: <Store size={28} /> }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 
     ">

      {/* Card */}
      <div className="backdrop-blur-lg bg-white/80 shadow-2xl rounded-3xl p-10 w-full max-w-2xl">

        <h1 className="text-3xl font-bold text-center mb-3 text-gray-800">
          Create your <span className="text-primary">account</span>
        </h1>

        <p className="text-center text-gray-500 mb-10">
          Choose your role to continue
        </p>

     
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

          {roles.map((role) => (
            <div
              key={role.name}
              onClick={() => navigate(role.path)}
              className="group cursor-pointer border border-gray-200 rounded-2xl p-6 
              flex flex-col items-center justify-center gap-3
              bg-white hover:bg-primary/5
              transition-all duration-300 
              hover:shadow-xl hover:-translate-y-2"
            >
             
              <div className="text-primary group-hover:scale-110 transition">
                {role.icon}
              </div>

              
              <h2 className="text-lg font-semibold text-gray-700 group-hover:text-primary">
                {role.name}
              </h2>

             
              <p className="text-xs text-gray-400">
                Continue as {role.name}
              </p>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}