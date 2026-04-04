import React, { useState } from "react";
import StepperControl from "../components/StepperControl";
import Stepper from "../components/Stepper";

import Final from "../components/steps/Final";
import Personal from "../components/steps/Personal";
import Address from "../components/steps/Address";
import Professional from "../components/steps/Professional";
import Account from "../components/steps/Account";
import { signupDoctor } from "../api/auth";
import AuthLayout from "../layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastContext";

const StepForm = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);

  const steps = ["Account", "Personal", "Professional", "Address", "Complete"];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
    phoneNumber: "",
    specialization: "",
    hpId: "",
    qualification: "",
    university: "",
    address: {
      fullAddress: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  const displayStep = (step) => {
    switch (step) {
      case 1:
        return <Account formData={formData} setFormData={setFormData} />;

      case 2:
        return <Personal formData={formData} setFormData={setFormData} />;

      case 3:
        return <Professional formData={formData} setFormData={setFormData} />;

      case 4:
        return <Address formData={formData} setFormData={setFormData} />;

      case 5:
        return <Final formData={formData} />;

      default:
        return null;
    }
  };

  // Step navigation
  const handleClick = (direction) => {
    let newStep = currentStep;

    direction === "next" ? newStep++ : newStep--;

    if (newStep > 0 && newStep <= steps.length) {
      setCurrentStep(newStep);
    }
  };

  // API call on submit
  const handleSubmit = async () => {
    try {
      const response = await signupDoctor(formData);

      console.log("DOCTOR registered:", response.data);
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
      <Stepper steps={steps} currentStep={currentStep} />

      <div className="py-6 min-h-70">{displayStep(currentStep)}</div>

      <StepperControl
        handleClick={handleClick}
        handleSubmit={handleSubmit}
        currentStep={currentStep}
        steps={steps}
      />
    </AuthLayout>
  );
};

export default StepForm;
