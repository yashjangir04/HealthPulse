const Patient = require("../models/patient-model"); 
exports.getContacts = async (req, res) => {
    try {
      const patient = await Patient.findById(req.user.id);
  
      if (!patient) {
        return res.status(404).json({ msg: "Patient not found " });
      }
  
      res.json({
        success: true,
        secondaryContacts: patient.secondaryContacts,
      });
      console.log("PATIENT CONTACTS:", patient.secondaryContacts);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  exports.addContact = async (req, res) => {
    try {
      const { name, phoneNumber, relation } = req.body;
  
      if (!name || !phoneNumber) {
        return res.status(400).json({ msg: "Missing fields " });
      }
  
      const patient = await Patient.findById(req.user.id);
  
      if (!patient) {
        return res.status(404).json({ msg: "Patient not found " });
      }
  
      const exists = patient.secondaryContacts.find(
        (c) => c.phoneNumber === phoneNumber
      );
  
      if (exists) {
        return res.status(400).json({ msg: "Contact already exists " });
      }
  
      const newContact = { name, phoneNumber, relation };
  
      patient.secondaryContacts.push(newContact);
      await patient.save();
  
      res.json({
        success: true,
        contact: newContact,
      });
  
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };
  exports.deleteContact = async (req, res) => {
    try {
      const { id } = req.body;
  
      if (!id) {
        return res.status(400).json({ msg: "Contact ID required " });
      }
  
      await Patient.findByIdAndUpdate(
        req.user.id,
        {
          $pull: {
            secondaryContacts: { _id: id }
          }
        }
      );
  
      return res.status(200).json({
        success: true,
        msg: "Contact deleted ",
      });
  
    } catch (error) {
      console.log("DELETE ERROR:", error);
      return res.status(500).json({ msg: error.message });
    }
  };
  exports.getPrimaryContacts = async (req, res) => {
    try {
      const patient = await Patient.findById(req.user.id);
      res.json({
        success: true,
        primaryContacts: patient.primaryContacts,
      });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

exports.updateProfile = async (req, res) => {
  try {
    const { height, weight, aiContext } = req.body;

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.user.id,
      { $set: { height, weight, aiContext } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedPatient) {
      return res.status(404).json({ msg: "Patient not found" });
    }

    res.json(updatedPatient);
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ msg: error.message });
  }
};