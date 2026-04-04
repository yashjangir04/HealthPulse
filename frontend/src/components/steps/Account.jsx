import React from "react";

const Account = ({ formData, setFormData }) => {

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="flex flex-col gap-4  h-[320px] overflow-y-auto">

<input
type="text"
name="name"
placeholder="Full Name"
value={formData.name}
onChange={handleChange}
 className="border p-3 rounded-lg"
/>

<input
type="email"
name="email"
placeholder="Email"
value={formData.email}
onChange={handleChange}
 className="border p-3 rounded-lg"
/>

<input
type="password"
name="password"
placeholder="Password"
value={formData.password}
onChange={handleChange}
 className="border p-3 rounded-lg"
/>

    </div>
  );
};

export default Account;