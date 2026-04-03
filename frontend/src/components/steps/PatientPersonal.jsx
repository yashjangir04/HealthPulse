import React from "react";

const PatientFinal = ({ formData }) => {
  return (
    <div className="space-y-6">

   

      <div className="bg-white border rounded-xl p-6 shadow-sm space-y-6">

        {/* Basic Info */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-3">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">

            <div>
              <p className="text-gray-500">Name</p>
              <p className="font-medium">{formData.name}</p>
            </div>

            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{formData.email}</p>
            </div>

            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-medium">{formData.phoneNumber}</p>
            </div>

            <div>
              <p className="text-gray-500">Blood Group</p>
              <p className="font-medium">{formData.bloodGroup}</p>
            </div>

          </div>
        </div>

        <div className="border-t"></div>

        {/* Address */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-3">
            Address
          </h3>

          <p className="font-medium">{formData.address.fullAddress}</p>
          <p className="text-gray-600">
            {formData.address.city}, {formData.address.state}
          </p>
          <p className="text-gray-600">{formData.address.pincode}</p>
        </div>

        <div className="border-t"></div>

        {/* Emergency Contact */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-3">
            Emergency Contact
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">

            <div>
              <p className="text-gray-500">Name</p>
              <p className="font-medium">
                {formData.primaryContacts[0].name}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-medium">
                {formData.primaryContacts[0].phoneNumber}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientFinal;