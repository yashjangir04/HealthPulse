import React from "react";

const ShopDetails = ({ formData, setFormData }) => {

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
        name="shopName"
        placeholder="Shop Name"
        value={formData.shopName}
        onChange={handleChange}
        className="border border-gray-300 p-3 rounded-lg"
      />

      <input
        type="text"
        name="phoneNumber"
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChange={handleChange}
        className="border border-gray-300 p-3 rounded-lg"
      />

    </div>
  );
};

export default ShopDetails;