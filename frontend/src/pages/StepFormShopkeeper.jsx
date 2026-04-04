import React, { useState } from "react";
import Stepper from "../components/Stepper";
import StepperControl from "../components/StepperControl";
import ShopAccount from "../components/steps/ShopAccount";
import ShopAddress from "../components/steps/ShopAddress";
import ShopDetails from "../components/steps/ShopDetail";
import ShopFinal from "../components/steps/ShopFinal";
import {signupShopkeeper} from "../api/auth";
import AuthLayout from "../layouts/AuthLayout.jsx";
import { useNavigate } from 'react-router-dom';

const StepFormShopkeeper = () => {
  const navigate = useNavigate() ;

  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
     "Account",
     "Shop Details",
     "Address",
     "Review"
  ];
  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
    password: "",
    shopName: "",
    phoneNumber: "",
    address: {
      fullAddress: "",
      city: "",
      state: "",
      pincode: ""
    }
  });
  const displayStep = (step) => {
    switch (step) {
  
      case 1:
        return <ShopAccount formData={formData} setFormData={setFormData} />;
  
      case 2:
        return <ShopDetails formData={formData} setFormData={setFormData} />;
  
      case 3:
        return <ShopAddress formData={formData} setFormData={setFormData} />;
  
      case 4:
        return <ShopFinal formData={formData} setFormData={setFormData} />;
  
   
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
    try {
  
      const response = await signupShopkeeper(formData);
  
      console.log("Shopkeeper registered:", response.data);
  
      navigate("/account/login") ;
  
    } catch (error) {
  
      console.log("Error:", error.response?.data || error.message);
  
      alert("Registration failed");
  
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Complete your profile step by step"
    >
  
      {/* Stepper */}
      <Stepper
        steps={steps}
        currentStep={currentStep}
      />
  
      {/* Form Content */}
      <div className="py-8 min-h-70">
        {displayStep(currentStep)}
      </div>
  
      {/* Controls */}
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

export default StepFormShopkeeper;