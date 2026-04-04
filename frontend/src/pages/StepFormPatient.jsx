import React, { useState } from "react";
import Stepper from "../components/Stepper";
import StepperControl from "../components/StepperControl";
import PatientAccount from "../components/steps/PatientAccount";
import PatientAddress from "../components/steps/PatientAddress";
import PatientFinal from "../components/steps/PatientFinal";
import PatientPersonal from "../components/steps/PatientPersonal";
import EmergencyContact from "../components/steps/EmergencyContact";
import { signupPatient } from "../api/auth";
import AuthLayout from "../layouts/AuthLayout";
import { useNavigate } from 'react-router-dom';
import { useToast } from "../components/ToastContext";

const StepFormPatient = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    "Account",
    "Personal",
    "Address",
    "Emergency Contact",
    "Complete"
  ];
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
    phoneNumber: "",
    bloodGroup: "",
    address: {
      fullAddress: "",
      city: "",
      state: "",
      pincode: ""
    },
 
    primaryContacts: [
      {
        name: "",
        phoneNumber: "",
        relation: ""
      },
    ],
  });
  const displayStep = (step) => {
    switch (step) {
  
      case 1:
        return <PatientAccount formData={formData} setFormData={setFormData} />;
  
      case 2:
        return <PatientPersonal formData={formData} setFormData={setFormData} />;
  
      case 3:
        return <PatientAddress formData={formData} setFormData={setFormData} />;
  
      case 4:
        return <EmergencyContact formData={formData} setFormData={setFormData} />;
  
      case 5:
        return <PatientFinal formData={formData} />;
  
      default:
        return null;
    }
  };

  const handleClick = (direction) => {
    let newStep = currentStep;

    direction === "next"
      ? newStep++
      : newStep--;

    if (newStep > 0 && newStep <= steps.length) {
      setCurrentStep(newStep);
    }
  };

  
  const handleSubmit = async () => {
   
    const contacts = formData.primaryContacts;
  
    const isValidContacts =
      contacts.length === 2 &&
      contacts.every(
        (c) => c.name.trim() && c.phoneNumber.trim() && c.relation.trim()
      );
  
    if (!isValidContacts) {
      alert("Please fill all emergency contact fields properly");
      return;
    }
  
  
  
    try {
      console.log("Sending:", formData); 
  
      const response = await signupPatient(formData);
  
      console.log("Patient registered:", response.data);
      showToast("Account created successfully", "success");
      navigate("/account/login");
    } catch (error) {
      console.log("Error:", error.response?.data || error.message);
      showToast(error.response?.data?.msg || "Registration failed", "error");
    }
  };

  

    return (
      <AuthLayout
        title="Create Account"
        subtitle="Complete your profile step by step"
      >
  
        <Stepper
          steps={steps}
          currentStep={currentStep}
        />
   
        <div className="py-8 min-h-[280px]">
          {displayStep(currentStep)}
        </div>
    
     
        <div className="border-t border-gray-200 mt-4 pt-6">
          <StepperControl
            handleClick={handleClick}
            currentStep={currentStep}
            steps={steps}
            handleSubmit={handleSubmit}
          />
        </div>
    
      </AuthLayout>
    );
  
};

export default StepFormPatient;