import React from "react";
import { cardio } from "ldrs";
import { LuCalendarCheck2 } from "react-icons/lu";
cardio.register();
const ConfirmSubmit = ({ setConfirm, handleSubmit, doc }) => {
  return (
    <div className="absolute bg-black bg-opacity-40 backdrop-blur-sm w-full h-screen z-50 flex items-center justify-center">
      <div className="bg-white sticky -mt-[8rem] flex w-[33rem] flex-col items-center abs rounded-lg p-6">
        <>
          <div className="flex">
            <div className="h-full">
              <LuCalendarCheck2 className="text-4xl mr-3 mt-2 text-green-500" />
            </div>

            <div className="flex flex-col items-start">
              <h1 className="mb-1 font-semibold text-xl flex items-end">
                <span>Confirm Booking</span>
              </h1>
              <p className="mb-6">
                Are you sure you wish to book an appointment for {" "}
                {doc.type === "ol"
                  ? "Online Consultation"
                  : "Face to Face Consultation"} to {doc.honorific} {doc.name}
                ?
              </p>
              <p>By clicking the confirm button, your book will be submitted.</p>
              <div className="flex items-center justify-end w-full space-x-2 mt-3">
                <button
                  onClick={(e) => setConfirm(false) || e.preventDefault()}
                  className="px-9 py-1 bg-slate-100 border-2 transition duration-100 hover:bg-slate-300 border-slate-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-9 py-1 bg-green-600 transition duration-100 hover:bg-green-800 text-white rounded-md"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default ConfirmSubmit;
