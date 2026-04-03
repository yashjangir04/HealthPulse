import React from "react";

const StepperControl = ({ handleClick, currentStep, steps, handleSubmit }) => {

  return (
    <div className="container flex justify-between mt-4 mb-8">

      
      <button
        onClick={() => handleClick("back")}
        className={`rounded-lg border border-gray-300 bg-white 
          py-2.5 px-5 text-sm font-medium text-gray-500 
          hover:bg-gray-50 transition-all duration-200
          ${currentStep === 1 ? "opacity-50 cursor-not-allowed" : "hover:shadow-sm"}
          `}
      >
        Back
      </button>

      
      <button
        onClick={() => {
          if (currentStep === steps.length) {
            handleSubmit();
          } else {
            handleClick("next");
          }
        }}
        className="text-white bg-[#1B80FD] focus:ring-4 focus:outline-none
        font-medium rounded-lg text-sm px-5 py-2.5 text-center
        transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md"
      >
        {currentStep === steps.length ? "Submit" : "Next"}
      </button>

    </div>
  );
};

export default StepperControl;