import React from "react";

const EmergencyContact = ({ formData, setFormData }) => {
  if (!formData.primaryContacts || formData.primaryContacts.length < 2) {
    setFormData((prev) => ({
      ...prev,
      primaryContacts: [
        { name: "", phoneNumber: "", relation: "" },
        { name: "", phoneNumber: "", relation: "" }
      ]
    }));
    return null; // wait for state update
  }
  const handleChange = (index, e) => {
    const { name, value } = e.target;

    const updated = [...formData.primaryContacts];
    updated[index][name] = value;

    setFormData({
      ...formData,
      primaryContacts: updated
    });
  };

  return (
    <div className="flex flex-col gap-6 min-h-[260px]">

      <h3 className="font-semibold">Primary Contacts</h3>

      {/*  Contact 1 */}
      <div className="border p-4 rounded-lg">
        <p className="text-sm font-medium mb-2">Primary Contact 1</p>

        <input
          name="name"
          placeholder="Name"
          value={formData.primaryContacts[0].name}
          onChange={(e) => handleChange(0, e)}
          className="border border-gray-300 p-2 rounded-lg w-full mb-2"
        />

        <input
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.primaryContacts[0].phoneNumber}
          onChange={(e) => handleChange(0, e)}
          className="border border-gray-300 p-2 rounded-lg w-full mb-2"
        />

        <input
          name="relation"
          placeholder="Relation"
          value={formData.primaryContacts[0].relation}
          onChange={(e) => handleChange(0, e)}
          className="border border-gray-300 p-2 rounded-lg w-full"
        />
      </div>

      {/*  Contact 2 */}
      <div className="border p-4 rounded-lg">
        <p className="text-sm font-medium mb-2">Primary Contact 2</p>

        <input
          name="name"
          placeholder="Name"
          value={formData.primaryContacts[1].name}
          onChange={(e) => handleChange(1, e)}
          className="border border-gray-300 p-2 rounded-lg w-full mb-2"
        />

        <input
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.primaryContacts[1].phoneNumber}
          onChange={(e) => handleChange(1, e)}
          className="border border-gray-300 p-2 rounded-lg w-full mb-2"
        />

        <input
          name="relation"
          placeholder="Relation"
          value={formData.primaryContacts[1].relation}
          onChange={(e) => handleChange(1, e)}
          className="border border-gray-300 p-2 rounded-lg w-full"
        />
      </div>

    </div>
  );
};

export default EmergencyContact;