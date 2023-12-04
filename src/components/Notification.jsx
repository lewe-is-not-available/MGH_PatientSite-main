import React, { useEffect, useState } from "react";
import { IoCalendar } from "react-icons/io5";
import { BsBell } from "react-icons/bs";
import supabase from "./config/Supabase";

const Notification = () => {
  const [icon, setIcon] = useState(false);
  const [isolated_data, setIsolate] = useState([]);
  useEffect(() => {
    getAppointments();
  }, [1]);

  const getAppointments = async () => {
    const { data: appoint } = await supabase
      .from("patient_Appointments")
      .select();
    var holder = [];

    for (let i = 0; i < appoint.length; i++) {
      if (
        appoint[i].status === "cancel" ||
        appoint[i].status === "remind" ||
        appoint[i].status === "resched" ||
        appoint[i].status === "booked"
      ) {
        // holder = holder.concat(...isolated_data, appoint[i]);
      }
    }
    setIsolate(holder);
    console.log(isolated_data);
  };

  return (
    <div className="back min-h-screen h-auto w-full flex flex-col items-center ">
      <h1 className="text-5xl font-semibold mt-16 text-green-900">
        Notifications
      </h1>
      <div className="mt-2">
        {isolated_data && (
          <div>
            {isolated_data.map((data, index) => (
              <div
                key={index}
                className="abs bg-white w-[800px] p-2 flex gap-1"
              >
                <div className="flex items-end">
                  {/* Image */}
                  <div className="h-[80px] w-[80px] bg-slate-300 rounded-full " />
                  <IoCalendar className="bg-red-500 px-1 text-[30px] rounded-md -ml-7 text-white" />
                </div>

                <div className="grid">
                  <label className="text-[#41843F] font-bold text-[20px]">
                    {/* Set Name */}
                    {data.fname}
                  </label>
                  <label>
                    {/* Set Date */}
                    11/11/1111 11:11pm
                  </label>
                  <label className="text-blue-500">
                    {/* Set Appointment Resched,Cancel,Booked Remind */}
                    Your appointment has been rescheduled
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="abs bg-white w-[800px] p-2 flex gap-1">
          <div className="flex items-end">
            {/* Image */}
            <div className="h-[80px] w-[80px] bg-slate-300 rounded-full " />
            <IoCalendar className="bg-red-500 px-1 text-[30px] rounded-md -ml-7 text-white" />
          </div>

          <div className="grid">
            <label className="text-[#41843F] font-bold text-[20px]">
              {/* Set Name */}
              FNAME
            </label>
            <label>
              {/* Set Date */}
              11/11/1111 11:11pm
            </label>
            <label className="text-blue-500">
              {/* Set Appointment Resched,Cancel,Booked Remind */}
              Your appointment has been rescheduled
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
