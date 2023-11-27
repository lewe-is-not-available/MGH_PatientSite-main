import React from "react";
import { FiCheckCircle } from "react-icons/fi";

const SuccessAdding = ({setSuccess}) => {
  return (
    <div className="flex flex-col h-full items-center justify-center">
      <div className="flex items-center">
        <h1 className="text-6xl font-semibold">
          Doctor has been added succesfully
        </h1>
        <FiCheckCircle className="text-6xl ml-2" />
      </div>
      <button 
      onClick={() => setSuccess(false)}
      className="mt-10 w-[60%] transition duration-100 rounded-md py-2 text-4xl bg-green-600 hover:bg-green-200 hover:text-green-600 border-4 border-green-600 text-white font-semibold">
        Add another doctor
      </button>
    </div>
  );
};

export default SuccessAdding;
