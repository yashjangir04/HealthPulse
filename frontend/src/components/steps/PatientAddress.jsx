import React from "react";

const PatientAddress = ({ formData, setFormData }) => {

  const handleAddressChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [name]: value
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 min-h-[260px]">

      <input
        name="fullAddress"
        placeholder="Full Address"
        value={formData.address.fullAddress}
        onChange={handleAddressChange}
        className="border border-gray-300 p-3 rounded-lg"
      />

      <input
        name="city"
        placeholder="City"
        value={formData.address.city}
        onChange={handleAddressChange}
        className="border border-gray-300 p-3 rounded-lg"
      />

      <input
        name="state"
        placeholder="State"
        value={formData.address.state}
        onChange={handleAddressChange}
        className="border border-gray-300 p-3 rounded-lg"
      />

      <input
        name="pincode"
        placeholder="Pincode"
        value={formData.address.pincode}
        onChange={handleAddressChange}
        className="border border-gray-300 p-3 rounded-lg"
      />

    </div>
  );
};

export default PatientAddress;