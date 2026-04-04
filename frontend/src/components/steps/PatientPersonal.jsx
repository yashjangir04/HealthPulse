import React from "react";

const PatientPersonal = ({ formData, setFormData }) => {

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
        type="date"
        name="dob"
        value={formData.dob}
        onChange={handleChange}
        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1B80FD] outline-none"
      />

      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        className="border border-gray-300 p-3 rounded-lg"
      >
        <option value="">Select Gender</option>
        <option value="Female">Female</option>
        <option value="Male">Male</option>
        <option value="Other">Other</option>
      </select>

      <input
        type="text"
        name="phoneNumber"
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChange={handleChange}
        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1B80FD]"
      />

      <select
        name="bloodGroup"
        value={formData.bloodGroup}
        onChange={handleChange}
        className="border border-gray-300 p-3 rounded-lg"
      >
        <option value="">Select Blood Group</option>
        <option value="A+">A+</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B-">B-</option>
        <option value="O+">O+</option>
        <option value="O-">O-</option>
        <option value="AB+">AB+</option>
        <option value="AB-">AB-</option>
      </select>

    </div>
  );
};

export default PatientPersonal;