import React from 'react'

const Professional = ({ formData, setFormData }) => {
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
name="specialization"
placeholder="Specialization"
 className="border p-3 rounded-lg"
 value={formData.specialization}
 onChange={handleChange}
/>

<input
type="text"
name="hpId"
placeholder="Healthcare Professional ID (HP-ID)"
 className="border p-3 rounded-lg"
 value={formData.hpId}
 onChange={handleChange}
/>

<input
type="text"
name="qualification"
placeholder="Qualification"
 className="border p-3 rounded-lg"
 value={formData.qualification}
 onChange={handleChange} 
/>

<input
type="text"
name="university"
placeholder="University"
 className="border p-3 rounded-lg"
 value={formData.university} 
 onChange={handleChange}
/>
        
            </div>
      )
}

export default Professional