import React from "react";

const ShopAccount = ({ formData, setFormData }) => {

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
        name="ownerName"
        placeholder="Owner Name"
        value={formData.ownerName}
        onChange={handleChange}
        className="border border-gray-300 p-3 rounded-lg"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="border border-gray-300 p-3 rounded-lg"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="border border-gray-300 p-3 rounded-lg"
      />

    </div>
  );
};

export default ShopAccount;
