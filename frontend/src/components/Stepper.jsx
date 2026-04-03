import React, { useEffect, useState, useRef } from "react";

const Stepper = ({ steps, currentStep }) => {
  const [newState, setNewStep] = useState([]);
  const stepRef = useRef();

  const updateStep = (stepNumber, steps) => {
    const newSteps = [...steps];

    for (let i = 0; i < newSteps.length; i++) {
      if (i === stepNumber) {
        newSteps[i] = {
          ...newSteps[i],
          highlighted: true,
          selected: true,
          completed: false,
        };
      } else if (i < stepNumber) {
        newSteps[i] = {
          ...newSteps[i],
          highlighted: false,
          selected: true,
          completed: true,
        };
      } else {
        newSteps[i] = {
          ...newSteps[i],
          highlighted: false,
          selected: false,
          completed: false,
        };
      }
    }

    return newSteps;
  };

  useEffect(() => {
    const stepsState = steps.map((step, index) => ({
      description: step,
      completed: false,
      highlighted: index === 0,
      selected: index === 0,
    }));

    stepRef.current = stepsState;
    const current = updateStep(currentStep - 1, stepRef.current);
    setNewStep(current);
  }, [steps, currentStep]);

  return (
    <div className="w-full px-2 sm:px-4 py-6">
      <div className="flex items-start justify-between relative">

        {newState.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center flex-1 min-w-[70px] relative"
          >
            
            
            {index !== newState.length - 1 && (
              <div
                className={`absolute top-5 sm:top-6 md:top-7 left-1/2 w-full border-t-2
                ${
                  step.completed
                    ? "border-[#1B80FD]"
                    : "border-gray-300"
                }`}
              ></div>
            )}

          
            <div
              className={`z-10 flex items-center justify-center rounded-full border-2
              h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 transition-all duration-300
              ${
                step.selected
                  ? "bg-[#1B80FD] text-white border-[#1B80FD]"
                  : "bg-white text-gray-500 border-gray-300"
              }`}
            >
              {step.completed ? "✓" : index + 1}
            </div>

           
            <div
              className={`mt-2 text-center font-medium uppercase tracking-wide
              text-[10px] sm:text-xs leading-tight break-words
              max-w-[70px] sm:max-w-[110px] md:max-w-[140px]
              ${
                step.highlighted ? "text-gray-900" : "text-gray-400"
              }`}
            >
             
              <span className="sm:hidden">
                {step.description.split(" ")[0]}
              </span>

              <span className="hidden sm:block">
                {step.description}
              </span>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default Stepper;