import DoctorView from "../components/DoctorView";
import PatientView from "../components/PatientView";
import ShopView from "../components/ShopView";
import { useAuth } from "../auth/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) return <div>Loading...</div>;

  if (user.role === "doctor") return <DoctorView user={user} />;
  if (user.role === "shopkeeper") return <ShopView user={user} />;

  return <PatientView user={user} />;
};

export default ProfilePage;