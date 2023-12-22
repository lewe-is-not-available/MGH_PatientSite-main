import React from "react";
import { LuCalendarCheck2 } from "react-icons/lu";

const ConfirmLeave = ({setOpenConfirm}) => {
  return (
    <div className="sticky top-20 bg-black bg-opacity-40 backdrop-blur-sm w-full h-[90vh] z-50 flex items-center justify-center">
      <div className="bg-white sticky top-0 -mt-[8rem] flex w-fit flex-col items-center abs rounded-lg p-6">
        <>
          <div className="flex">
            <div className="h-full">
              <LuCalendarCheck2 className="text-4xl mr-3 mt-2 text-green-500" />
            </div>

            <div className="flex flex-col items-start">
              <h1 className="mb-2 font-semibold text-xl flex items-end">
                <span>Confirm Consultation</span>
              </h1>
              <p className="mb-4">
                Are you sure you're finished with the consultation and <br /> leaving the meeting room?
              </p>
              <div className="flex items-center justify-end w-full space-x-2 mt-3">
                <button
                  onClick={(e) => setOpenConfirm(false) || e.preventDefault()}
                  className="px-9 py-1 bg-slate-100 border-2 transition duration-100 hover:bg-slate-300 border-slate-300 rounded-md"
                >
                  no
                </button>
                <button
                  className="px-9 py-1 bg-green-600 transition duration-100 hover:bg-green-800 text-white rounded-md"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default ConfirmLeave;
