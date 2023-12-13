import React, { useState } from "react";
import { cardio } from "ldrs";
import { LuCalendarCheck2 } from "react-icons/lu";

cardio.register();

const NextConfirm = ({ setAccept, handleAccept }) => {

  
  return (
    <div className="absolute bg-black bg-opacity-40 backdrop-blur-sm w-full h-full z-50 flex items-center justify-center">
      <div className="bg-white sticky -mt-[8rem] flex w-[29rem] flex-col items-center abs rounded-lg p-6">
        <>
          <div className="flex">
            <div className="h-full">
              <LuCalendarCheck2 className="text-4xl mr-3 mt-2 text-green-500" />
            </div>

            <div className="flex flex-col items-start">
              <h1 className="mb-2 font-semibold text-xl flex items-end">
                <span>Confirm next appointment</span>
              </h1>
              <p className="mb-4">
                Are finished with your current appointment?
              </p>
              <div className="flex items-center justify-end w-full space-x-2 mt-3">
                <button
                  onClick={(e) => setAccept(false) || e.preventDefault()}
                  className="px-9 py-1 bg-slate-100 border-2 transition duration-100 hover:bg-slate-300 border-slate-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAccept}
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

export default NextConfirm;
