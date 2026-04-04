import React, { useState, useEffect } from "react";
import axios from "axios";
import { createPortal } from "react-dom";
import { 
  Phone, Trash2, Plus, X, User, ShieldAlert, Heart
} from "lucide-react";
import { useToast } from "../components/ToastContext";
import { useAuth } from "../auth/AuthContext";
import { CalculateAge } from "../utils/CalculateAge";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ContactPage = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [primaryContacts, setPrimaryContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", relation: "" });
  const { showToast } = useToast();
  const [settings, setSettings] = useState({
    sms: true,
    calls: true,
    gps: true,
  });

  const fetchPrimaryContacts = async () => {
    try {
      const { data } = await axios.get("/api/patient/primary-contacts", {
        withCredentials: true,
      });
      setPrimaryContacts(data.primaryContacts || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchContacts = async () => {
    try {
      const { data } = await axios.get("/api/patient/contacts", {
        withCredentials: true,
      });
      setContacts(data.secondaryContacts || []);
    } catch (error) {
      console.log(error);
    }
  };

  const addContact = async (contactData) => {
    try {
      const { data } = await axios.post(
        "/api/patient/add-contact",
        contactData,
        { withCredentials: true }
      );
      setContacts((prev) => [...prev, data.contact]);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteContact = async (id) => {
    try {
      await axios.delete("/api/patient/delete-contact", {
        data: { id },
        withCredentials: true
      });
      setContacts((prev) => prev.filter((c) => c._id !== id));
      showToast("Contact deleted");
    } catch (error) {
      showToast("Failed to delete contact", "error");
    }
  };

  useEffect(() => {
    if (user) {
      fetchContacts();
      fetchPrimaryContacts();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-100 border-t-[#007AFF] rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!form.name || !form.phone) {
      showToast("Fill required fields");
      return;
    }
    if (!/^\+[1-9]\d{7,14}$/.test(form.phone)) {
      showToast("Invalid phone format");
      return;
    }
    try {
      await addContact({
        name: form.name,
        phoneNumber: form.phone,
        relation: form.relation,
      });
      showToast("Contact added");
      setIsModalOpen(false);
      setForm({ name: "", phone: "", relation: "" });
    } catch {
      showToast("Error adding contact");
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden text-gray-900 font-sans">
      <main className="flex-1 overflow-y-auto bg-white relative">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-12 pb-24 flex flex-col lg:flex-row gap-12">
          
          {/* -------Left Column: Contacts------- */}
          <div className="flex-1 flex flex-col">
            
            {/* Header Section */}
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#007AFF] border border-blue-100 rounded-lg text-xs font-bold tracking-wider mb-4">
                <div className="w-2 h-2 rounded-full bg-[#007AFF]"></div>
                CONTACT DASHBOARD
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-2">
                My <span className="text-[#007AFF]">Contacts.</span>
              </h1>
              <p className="text-gray-500 text-sm md:text-base max-w-lg mt-3">
                Manage your emergency network, primary caregivers, and automated alert preferences.
              </p>
            </div>

            <div className="space-y-12">
              
              {/* PRIMARY SECTION */}
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <ShieldAlert size={20} className="text-[#007AFF]" />
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-gray-400">Primary Caregivers</h3>
                </div>
                
                <div className={`grid gap-4 ${primaryContacts.length === 0 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
                  {primaryContacts.length > 0 ? (
                    primaryContacts.map((c) => (
                      <ContactCard 
                        key={c._id} 
                        contact={{ ...c, phone: c.phoneNumber }}
                        primary={true}
                      />
                    ))
                  ) : (
                    <div className="p-6 border-2 border-dashed border-gray-200 rounded-[24px] text-center text-gray-400 font-bold bg-gray-50">
                      No primary caregivers assigned.
                    </div>
                  )}
                </div>
              </section>

              {/* SECONDARY SECTION */}
              <section>
                <div className="flex justify-between items-end mb-5 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <Heart size={20} className="text-gray-400" />
                    <h3 className="text-sm font-extrabold uppercase tracking-widest text-gray-400">
                      Secondary Network
                    </h3>
                  </div>
                  <button 
                    onClick={() => { 
                      setEditMode(false); 
                      setForm({name:"", phone:"", relation:""}); 
                      setIsModalOpen(true); 
                    }}
                    className="text-sm font-bold text-[#007AFF] hover:text-blue-700 flex items-center gap-1.5 transition-colors bg-blue-50 px-3 py-1.5 rounded-lg"
                  >
                    <Plus size={16} strokeWidth={3} /> Add New
                  </button>
                </div>

                {contacts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {contacts.map((c) => (
                      <ContactCard
                        key={c._id}
                        contact={{ ...c, phone: c.phoneNumber }}
                        onDelete={() => deleteContact(c._id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center border border-gray-100 rounded-[24px] bg-white shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User size={32} className="text-gray-300" />
                    </div>
                    <p className="text-lg font-bold text-gray-800">No Secondary Contacts</p>
                    <p className="text-gray-400 text-sm mt-1">Add friends or family to your network.</p>
                  </div>
                )}
              </section>
            </div>
          </div>

          {/* -------Right Column: Profile Details------- */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="bg-white rounded-[32px] border border-gray-200 p-8 shadow-sm relative h-full flex flex-col">
              
              <h2 className="text-xl font-extrabold tracking-tight text-gray-900 mb-6 pb-6 border-b border-gray-100 flex items-center gap-2">
                Profile & Settings
              </h2>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="relative w-16 h-16 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden shrink-0">
                  <img 
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=f3f4f6&color=111827`} 
                    alt="user"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#00D289] border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-lg font-extrabold text-gray-900 leading-tight">{user?.name || "User"}</h4>
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-wider mt-1">
                    {user?.dob ? CalculateAge(user.dob) : "--"} Years • {user?.gender || "Not Specified"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                
                {/* Phone Section */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Registered Phone</p>
                  {user?.phoneNumber ? (
                    <p className="text-lg font-extrabold text-gray-800 flex items-center gap-2">
                      <Phone size={18} className="text-[#007AFF]" />
                      +91 {user.phoneNumber.slice(0,5)} {user.phoneNumber.slice(5)}
                    </p>
                  ) : (
                    <p className="text-sm font-semibold text-gray-500">Not provided</p>
                  )}
                </div>
                
                {/* Permissions Section */}
                <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-3">Automated Permissions</p>
                  <div className="space-y-5">
                    <Toggle 
                      label="SMS Alerts" 
                      active={settings.sms} 
                      onToggle={() => setSettings(prev => ({ ...prev, sms: !prev.sms }))}
                    />
                    <Toggle 
                      label="Automated Calls" 
                      active={settings.calls} 
                      onToggle={() => setSettings(prev => ({ ...prev, calls: !prev.calls }))}
                    />
                    <Toggle 
                      label="Share GPS Location" 
                      active={settings.gps}
                      onToggle={() => setSettings(prev => ({ ...prev, gps: !prev.gps }))}
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* REFINED MODAL (MATCHING MEDILIST THEME) */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex justify-center items-end sm:items-center z-50 p-0 sm:p-4">
          <div 
            className="bg-white rounded-t-[24px] sm:rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="px-8 py-6 flex justify-between items-center border-b border-gray-100 bg-white">
              <h2 className="text-xl font-extrabold text-gray-900">
                {editMode ? "Edit Contact" : "New Contact"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full p-2 transition-colors">
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex flex-col gap-6 bg-white">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Full Name</label>
                <input
                  placeholder="e.g. John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-base font-semibold text-gray-900 outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 transition-all placeholder-gray-300"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Phone Number</label>
                <input
                  placeholder="+91 9876543210"
                  value={form.phone}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^\d+]/g, "");
                    if (value.includes("+")) {
                      value = "+" + value.replace(/\+/g, "");
                    }
                    setForm({ ...form, phone: value });
                  }}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-base font-semibold text-gray-900 outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 transition-all placeholder-gray-300"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Relationship</label>
                <input
                  placeholder="e.g. Brother, Friend"
                  value={form.relation}
                  onChange={(e) => setForm({ ...form, relation: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-base font-semibold text-gray-900 outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 transition-all placeholder-gray-300"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={!form.name.trim() || !form.phone.trim()}
                className={`w-full py-4 rounded-xl font-bold text-base mt-2 transition-all
                  ${form.name.trim() && form.phone.trim() ? "bg-[#007AFF] hover:bg-blue-600 text-white shadow-lg shadow-[#007AFF]/20" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
              >
                Save Contact
              </button>
            </div>
          </div>
        </div>,
        document.body 
      )}
    </div>
  );
};

// COMPONENT: REFINED CONTACT CARD
const ContactCard = ({ contact, primary, onDelete }) => (
  <div className={`relative bg-white border rounded-[24px] overflow-hidden flex flex-col transition-all hover:shadow-md ${
    primary ? "border-blue-200 shadow-sm bg-blue-50/10" : "border-gray-200"
  }`}>
    
    {/* Card Header matching Medication tags */}
    <div className={`px-5 py-3 border-b flex justify-between items-center ${primary ? "border-blue-100 bg-blue-50/50" : "border-gray-50 bg-gray-50/30"}`}>
      <div className="flex gap-2">
        {primary ? (
          <span className="px-2.5 py-1 bg-blue-100 text-[#007AFF] text-[10px] font-extrabold rounded flex items-center gap-1.5 tracking-wider">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="animate-pulse"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            EMERGENCY 1ST
          </span>
        ) : (
          <span className="px-2.5 py-1 border border-gray-200 text-gray-500 bg-white text-[10px] font-extrabold rounded tracking-wider">
            STANDARD
          </span>
        )}
      </div>
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
        {contact.relation || "Contact"}
      </div>
    </div>

    {/* Card Body */}
    <div className="p-5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${
          primary ? "bg-[#007AFF] text-white shadow-md shadow-[#007AFF]/20" : "bg-gray-100 text-gray-500 border border-gray-200"
        }`}>
          {contact.initials || contact.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
        </div>
        <div>
          <h4 className="font-extrabold text-gray-900 text-lg leading-tight">
            {contact.name}
          </h4>
          <p className="text-sm font-semibold text-gray-500 mt-0.5">
            {contact.phone}
          </p>
        </div>
      </div>

      {!primary && (
        <button 
          onClick={onDelete} 
          className="w-10 h-10 rounded-full flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors shrink-0"
          title="Remove Contact"
        >
          <Trash2 size={18} strokeWidth={2.5} />
        </button>
      )}
    </div>
  </div>
);

// COMPONENT: IOS STYLE TOGGLE
const Toggle = ({ label, active, onToggle }) => (
  <div className="flex justify-between items-center group">
    <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">{label}</span>
    <div 
      onClick={onToggle}
      className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${
        active ? "bg-[#00D289]" : "bg-gray-200"
      }`}
    >
      <div
        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${
          active ? "right-1" : "left-1"
        }`}
      />
    </div>
  </div>
);

export default ContactPage;