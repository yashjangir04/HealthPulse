import React from "react";

const ShopFinal = ({ formData }) => {

  return (
    <div className="space-y-6">

      <h2 className="text-xl font-semibold text-center">
        Review Shop Information
      </h2>

      <div className="bg-gray-50 border rounded-lg p-5 space-y-4">

        <div>
          <p className="text-gray-500 text-sm">Owner Name</p>
          <p className="font-medium">{formData.ownerName}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Email</p>
          <p className="font-medium">{formData.email}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Phone Number</p>
          <p className="font-medium">{formData.phoneNumber}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Shop Name</p>
          <p className="font-medium">{formData.shopName}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Address</p>
          <p className="font-medium">{formData.address.fullAddress}</p>
          <p>{formData.address.city}, {formData.address.state}</p>
          <p>{formData.address.pincode}</p>
        </div>

      </div>

    </div>
  );
};

export default ShopFinal;