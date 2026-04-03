import React from "react";

const PatientAccount = ({ formData, setFormData }) => {

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="flex flex-col gap-4 min-h-[260px]">

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1B80FD] outline-none"
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1B80FD] outline-none"
      />

      <input
        type="password"
        name="password"
        placeholder="Create Password"
        value={formData.password}
        onChange={handleChange}
        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1B80FD] outline-none"
      />

    </div>
  );
};

export default PatientAccount;