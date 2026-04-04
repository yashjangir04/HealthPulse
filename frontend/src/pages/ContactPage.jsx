import React, { useState, useEffect } from "react";
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

import { Phone } from "lucide-react";
import { useToast } from "../components/ToastContext";
import { useAuth } from "../auth/AuthContext";

const ContactPage = () => {
  const { user } = useAuth();

  const [contacts, setContacts] = useState([]);
  const [primaryContacts, setPrimaryContacts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    relation: "",
  });

  const { showToast } = useToast();

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

  const fetchPrimaryContacts = async () => {
    try {
      const { data } = await axios.get(
        "/api/patient/primary-contacts",
        { withCredentials: true }
      );

      setPrimaryContacts(data.primaryContacts || []);
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
        withCredentials: true,
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

  if (!user) return <div>Loading...</div>;

  const handleSave = async () => {
    if (!form.name || !form.phone) {
      showToast("Fill required fields");
      return;
    }

    if (!/^\+?\d{10,15}$/.test(form.phone)) {
      showToast("Invalid phone number");
      return;
    }

    try {
      await addContact({
        name: form.name,
        phoneNumber: form.phone,
        relation: form.relation,
      });

      showToast("Contact added");

      setForm({ name: "", phone: "", relation: "" });
    } catch {
      showToast("Error adding contact");
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 p-8">

      <div className="max-w-6xl mx-auto">

 
        <div className="flex items-center gap-3 mb-8">
          <Phone className="text-blue-600" />
          <h1 className="text-3xl font-bold text-blue-600">
            Emergency Contacts
          </h1>
        </div>

      
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4 text-gray-500">
            Primary Contacts
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {primaryContacts.map((c) => (
              <div
                key={c._id}
                className="p-4 bg-white rounded-xl shadow"
              >
                <h3 className="font-bold">{c.name}</h3>
                <p>{c.phoneNumber}</p>
                <p className="text-sm text-gray-500">{c.relation}</p>
              </div>
            ))}
          </div>
        </div>

    
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4 text-gray-500">
            Other Contacts
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {contacts.map((c) => (
              <div
                key={c._id}
                className="p-4 bg-white rounded-xl shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold">{c.name}</h3>
                  <p>{c.phoneNumber}</p>
                  <p className="text-sm text-gray-500">{c.relation}</p>
                </div>

                <button
                  onClick={() => deleteContact(c._id)}
                  className="text-red-500 font-bold"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow max-w-md">
          <h2 className="text-lg font-semibold mb-4">Add Contact</h2>

          <input
            type="text"
            placeholder="Name"
            className="w-full border p-2 mb-3 rounded"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Phone"
            className="w-full border p-2 mb-3 rounded"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Relation"
            className="w-full border p-2 mb-3 rounded"
            value={form.relation}
            onChange={(e) =>
              setForm({ ...form, relation: e.target.value })
            }
          />

          <button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Add Contact
          </button>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;