import React from "react";

const Address = ({ formData, setFormData }) => {

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

    <div className="flex flex-col gap-4  h-[320px] overflow-y-auto">

      <input
        type="text"
        name="fullAddress"
        placeholder="Full Address"
        value={formData.address.fullAddress}
        onChange={handleAddressChange}
        className="border p-3 rounded-lg"
      />

      <input
        type="text"
        name="city"
        placeholder="City"
        value={formData.address.city}
        onChange={handleAddressChange}
        className="border p-3 rounded-lg"
      />

      <input
        type="text"
        name="state"
        placeholder="State"
        value={formData.address.state}
        onChange={handleAddressChange}
        className="border p-3 rounded-lg"
      />

      <input
        type="text"
        name="pincode"
        placeholder="Pincode"
        value={formData.address.pincode}
        onChange={handleAddressChange}
        className="border p-3 rounded-lg"
      />

    </div>

  );
};

export default Address;