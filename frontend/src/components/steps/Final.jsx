import React from "react";

const Final = ({ formData }) => {
  return (
    <div className="space-y-6">


      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-semibold text-gray-800">
              {formData.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold text-gray-800">
              {formData.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Phone Number</p>
            <p className="font-semibold text-gray-800">
              {formData.phoneNumber}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Specialization</p>
            <p className="font-semibold text-gray-800">
              {formData.specialization}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Qualification</p>
            <p className="font-semibold text-gray-800">
              {formData.qualification}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">University</p>
            <p className="font-semibold text-gray-800">
              {formData.university}
            </p>
          </div>

        </div>

        <div className="mt-6 border-t pt-4">
          <p className="text-sm text-gray-500 mb-1">Address</p>
          <p className="font-semibold text-gray-800">
            {formData.address.fullAddress}
          </p>
          <p className="text-gray-700">
            {formData.address.city}, {formData.address.state}
          </p>
          <p className="text-gray-700">
            {formData.address.pincode}
          </p>
        </div>

      </div>

    </div>
  );
};

export default Final;