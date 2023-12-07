import React, { useState } from "react";
import { cardio } from "ldrs";
import { useNavigate } from "react-router-dom";
import { LuCalendarCheck2 } from "react-icons/lu";
import { LuCalendarX2 } from "react-icons/lu";
import supabase from "../../../config/Supabase";
import { toast } from "react-toastify";

cardio.register();

const AcceptConfirm = ({ setReject, id }) => {
  const nav = useNavigate();
  const [remark, setRemark] = useState();

  async function handleSubmit(e) {
    e.preventDefault();
    setReject(false);
    const { error } = await supabase
      .from("patient_Appointments")
      .update({ status: "rejected", remark })
      .eq("book_id", id);
    if (error) {
      toast.error(error.message, { autoClose: false });
    }
    nav("/Confirm_Appointments");
  }

  return (
    <div className="absolute bg-black bg-opacity-40 backdrop-blur-sm w-full h-screen z-50 flex items-center justify-center">
      <div className="bg-white sticky -mt-[8rem] flex w-[29rem] flex-col items-center abs rounded-lg p-6">
        <>
          <div className="flex">
            <div className="h-full">
              <LuCalendarX2 className="text-4xl mr-3 mt-2 text-red-500" />
            </div>

            <form className="flex flex-col items-start">
              <h1 className="mb-2 font-semibold text-xl flex items-end">
                <span>Accept Appointment</span>
              </h1>
              <p className="mb-2">
                Are you sure you want reject this appointment?
              </p>

              <p className="mt-3">Reason for rejecting:</p>
              <input
                required
                onChange={(e) => setRemark(e.target.value)}
                className="mb-3 w-[80%] border-b-2 outline-0 focus:border-2 focus:border-slate-500 border-slate-400 bg-slate-200 py-1 px-2 rounded-sm"
              />

              <div className="flex items-center justify-end w-full space-x-2 mt-3">
                <button
                  onClick={(e) => setReject(false) || e.preventDefault()}
                  className="px-9 py-1 bg-slate-100 border-2 transition duration-100 hover:bg-slate-300 border-slate-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-9 py-1 bg-red-600 transition duration-100 hover:bg-red-800 text-white rounded-md"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </>
      </div>
    </div>
  );
};

export default AcceptConfirm;
