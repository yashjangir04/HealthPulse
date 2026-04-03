import React from 'react'

const Personal = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  return (
    <div className="flex flex-col gap-4  h-[320px] overflow-y-auto">
<input type="date" name="dob"
className="border p-3 rounded-lg"
value={formData.dob}
onChange={handleChange}
 />

<select
  name="gender"
  className="border p-3 rounded-lg"
  value={formData.gender}
  onChange={handleChange}
>
  <option value="">Select Gender</option>
  <option value="Male">Male</option>
  <option value="Female">Female</option>
  <option value="Other">Other</option>
</select>

<input
type="tel"
name="phoneNumber"
placeholder="Phone Number"
 className="border p-3 rounded-lg"
 value={formData.phoneNumber}
 onChange={handleChange}
/>
    
        </div>
  )
}

export default Personal